import { pool } from '../db/pool.js';
import { serializeAccount } from '../utils/serializers.js';

export async function resetBalances(req, res) {
  const result = await pool.query('UPDATE accounts SET balance = initial_balance RETURNING *');
  res.json(result.rows.map(serializeAccount));
}

export async function resetAccounts(req, res) {
  await pool.query('DELETE FROM accounts');
  res.status(204).send();
}

export async function resetCategories(req, res) {
  await pool.query('DELETE FROM categories');
  res.status(204).send();
}

export async function resetFixedExpenses(req, res) {
  await pool.query('DELETE FROM fixed_expenses');
  res.status(204).send();
}

export async function resetMonthExpenses(req, res) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const toRemove = await client.query(
      `SELECT * FROM expenses WHERE TO_CHAR(exp_date, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')`
    );
    for (const exp of toRemove.rows) {
      await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [exp.amount, exp.account_id]);
    }
    await client.query(
      `DELETE FROM expenses WHERE TO_CHAR(exp_date, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')`
    );

    await client.query('COMMIT');
    res.status(204).send();
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function resetAll(req, res) {
  await pool.query(
    `TRUNCATE TABLE accounts, categories, fixed_expenses, fixed_expense_payments, expenses, incomes
     RESTART IDENTITY CASCADE`
  );
  res.status(204).send();
}