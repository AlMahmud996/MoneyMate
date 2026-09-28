import { pool } from '../db/pool.js';
import { serializeAccount } from '../utils/serializers.js';

export async function getAccounts(req, res) {
  const result = await pool.query('SELECT * FROM accounts ORDER BY id');
  res.json(result.rows.map(serializeAccount));
}

export async function createAccount(req, res) {
  const { name, type, initialBalance = 0 } = req.body;
  const result = await pool.query(
    `INSERT INTO accounts (name, type, initial_balance, balance)
     VALUES ($1, $2, $3, $3) RETURNING *`,
    [name, type, initialBalance]
  );
  res.status(201).json(serializeAccount(result.rows[0]));
}

export async function deleteAccount(req, res) {
  await pool.query('DELETE FROM accounts WHERE id = $1', [req.params.id]);
  res.status(204).send();
}

export async function addIncome(req, res) {
  const { id } = req.params;
  const { type, amount, note } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (type === 'Salary') {
      const salaryResult = await client.query(
        'SELECT id, name FROM accounts WHERE is_salary_account = TRUE'
      );
      const salaryAccount = salaryResult.rows[0];

      if (salaryAccount && salaryAccount.id !== Number(id)) {
        await client.query('ROLLBACK');
        return res
          .status(400)
          .json({ error: `Salary can only be added to ${salaryAccount.name}` });
      }
      if (!salaryAccount) {
        await client.query('UPDATE accounts SET is_salary_account = TRUE WHERE id = $1', [id]);
      }
    }

    await client.query(
      `INSERT INTO incomes (account_id, type, amount, note, inc_date)
       VALUES ($1, $2, $3, $4, CURRENT_DATE)`,
      [id, type, amount, note]
    );
    const result = await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *',
      [amount, id]
    );

    await client.query('COMMIT');
    res.json(serializeAccount(result.rows[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function transferMoney(req, res) {
  const { fromAccountId, toAccountId, amount } = req.body;

  if (fromAccountId === toAccountId) {
    return res.status(400).json({ error: 'Source and destination account cannot be the same' });
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const fromResult = await client.query('SELECT * FROM accounts WHERE id=$1', [fromAccountId]);
    const fromAccount = fromResult.rows[0];

    if (!fromAccount || parseFloat(fromAccount.balance) < parseFloat(amount)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient balance in source account' });
    }

    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromAccountId]);
    const toResult = await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *',
      [amount, toAccountId]
    );

    if (!toResult.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Destination account not found' });
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}