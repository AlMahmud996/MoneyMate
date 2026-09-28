import express from 'express';
import cors from 'cors';
import accountsRouter from './routes/accounts.js';
import categoriesRouter from './routes/categories.js';
import fixedExpensesRouter from './routes/fixedExpenses.js';
import expensesRouter from './routes/expenses.js';
import settingsRouter from './routes/settings.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/accounts', accountsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/fixed-expenses', fixedExpensesRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/settings', settingsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;