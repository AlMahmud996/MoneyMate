import { pool } from '../db/pool.js';
import { serializeExpense } from '../utils/serializers.js';

export async function getExpenses(req, res) {
  const result = await pool.query(
    `SELECT id, name, amount, category_id, account_id, TO_CHAR(exp_date, 'YYYY-MM-DD') AS exp_date
     FROM expenses ORDER BY exp_date DESC`
  );
  res.json(result.rows.map(serializeExpense));
}

export async function createExpense(req, res) {
  const { name, amount, categoryId, accountId } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO expenses (name, amount, category_id, account_id, exp_date)
       VALUES ($1, $2, $3, $4, CURRENT_DATE)
       RETURNING id, name, amount, category_id, account_id, TO_CHAR(exp_date, 'YYYY-MM-DD') AS exp_date`,
      [name, amount, categoryId, accountId]
    );
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, accountId]);
    await client.query('COMMIT');
    res.status(201).json(serializeExpense(result.rows[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateExpense(req, res) {
  const { id } = req.params;
  const { name, amount, categoryId, accountId } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const oldResult = await client.query('SELECT * FROM expenses WHERE id=$1', [id]);
    const oldExpense = oldResult.rows[0];
    if (!oldExpense) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Expense not found' });
    }
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [oldExpense.amount, oldExpense.account_id]);
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, accountId]);
    const result = await client.query(
      `UPDATE expenses SET name=$1, amount=$2, category_id=$3, account_id=$4 WHERE id=$5
       RETURNING id, name, amount, category_id, account_id, TO_CHAR(exp_date, 'YYYY-MM-DD') AS exp_date`,
      [name, amount, categoryId, accountId, id]
    );
    await client.query('COMMIT');
    res.json(serializeExpense(result.rows[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteExpense(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const expResult = await client.query('SELECT * FROM expenses WHERE id=$1', [id]);
    const expense = expResult.rows[0];
    if (expense) {
      await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [expense.amount, expense.account_id]);
      await client.query('DELETE FROM expenses WHERE id=$1', [id]);
    }
    await client.query('COMMIT');
    res.status(204).send();
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}