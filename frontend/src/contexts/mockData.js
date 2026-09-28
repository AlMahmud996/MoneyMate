export const initialAccounts = [
  { id: 'acc-1', name: 'Cash Wallet', type: 'cash', initialBalance: 500, balance: 500 },
  { id: 'acc-2', name: 'BRAC Bank', type: 'debit', initialBalance: 15000, balance: 15000 },
];

export const initialCategories = [
  { id: 'cat-1', name: 'Home', description: 'Household bills', accountId: 'acc-2', budgetTarget: 8000 },
  { id: 'cat-2', name: 'Food', description: 'Daily food expenses', accountId: 'acc-1', budgetTarget: 3000 },
];

export const initialFixedExpenses = [
  { id: 'fx-1', name: 'House Rent', description: 'Monthly rent', categoryId: 'cat-1', target: 6000 },
  { id: 'fx-2', name: 'Internet Bill', description: 'Monthly internet', categoryId: 'cat-1', target: 1200 },
];

export const initialExpenses = [
  { id: 'ex-1', name: 'Fish', amount: 100, categoryId: 'cat-2', accountId: 'acc-1', date: '2026-09-07' },
  { id: 'ex-2', name: 'Rickshaw', amount: 40, categoryId: 'cat-2', accountId: 'acc-1', date: '2026-09-06' },
];

export const initialIncomes = [];