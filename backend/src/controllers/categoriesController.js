import { pool } from '../db/pool.js';
import { serializeCategory } from '../utils/serializers.js';

export async function getCategories(req, res) {
  const result = await pool.query('SELECT * FROM categories ORDER BY id');
  res.json(result.rows.map(serializeCategory));
}

export async function createCategory(req, res) {
  const { name, description, accountId, budgetTarget } = req.body;
  const result = await pool.query(
    `INSERT INTO categories (name, description, account_id, budget_target) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, description, accountId, budgetTarget]
  );
  res.status(201).json(serializeCategory(result.rows[0]));
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, description, accountId, budgetTarget } = req.body;
  const result = await pool.query(
    `UPDATE categories SET name=$1, description=$2, account_id=$3, budget_target=$4 WHERE id=$5 RETURNING *`,
    [name, description, accountId, budgetTarget, id]
  );
  res.json(serializeCategory(result.rows[0]));
}

export async function deleteCategory(req, res) {
  await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
  res.status(204).send();
}