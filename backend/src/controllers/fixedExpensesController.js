import { pool } from '../db/pool.js';
import { serializeFixedExpense } from '../utils/serializers.js';

export async function getFixedExpenses(req, res) {
  const fx = await pool.query('SELECT * FROM fixed_expenses ORDER BY id');
  const payments = await pool.query(
    `SELECT fixed_expense_id, account_id, month, TO_CHAR(pay_date, 'YYYY-MM-DD') AS pay_date, amount
     FROM fixed_expense_payments`
  );
  const result = fx.rows.map((row) =>
    serializeFixedExpense(row, payments.rows.filter((p) => p.fixed_expense_id === row.id))
  );
  res.json(result);
}

export async function createFixedExpense(req, res) {
  const { name, description, categoryId, target } = req.body;
  const result = await pool.query(
    `INSERT INTO fixed_expenses (name, description, category_id, target) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, description, categoryId, target]
  );
  res.status(201).json(serializeFixedExpense(result.rows[0]));
}

export async function updateFixedExpense(req, res) {
  const { id } = req.params;
  const { name, description, categoryId, target } = req.body;
  const result = await pool.query(
    `UPDATE fixed_expenses SET name=$1, description=$2, category_id=$3, target=$4 WHERE id=$5 RETURNING *`,
    [name, description, categoryId, target, id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: 'Fixed expense not found' });
  res.json(serializeFixedExpense(result.rows[0]));
}

export async function deleteFixedExpense(req, res) {
  await pool.query('DELETE FROM fixed_expenses WHERE id = $1', [req.params.id]);
  res.status(204).send();
}

export async function payFixedExpense(req, res) {
  const { id } = req.params;
  const { accountId } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const fxResult = await client.query('SELECT * FROM fixed_expenses WHERE id=$1', [id]);
    const accResult = await client.query('SELECT * FROM accounts WHERE id=$1', [accountId]);
    const fx = fxResult.rows[0];
    const account = accResult.rows[0];

    if (!fx || !account || parseFloat(account.balance) < parseFloat(fx.target)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient balance or invalid ids' });
    }

    await client.query(
      `INSERT INTO fixed_expense_payments (fixed_expense_id, account_id, month, pay_date, amount)
       VALUES ($1, $2, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), CURRENT_DATE, $3)`,
      [id, accountId, fx.target]
    );
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [fx.target, accountId]);
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}