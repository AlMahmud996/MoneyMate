import { createSlice } from '@reduxjs/toolkit';
import { initialAccounts, initialCategories, initialFixedExpenses, initialExpenses, initialIncomes } from '../contexts/mockData';
import { getCurrentMonth, getLocalDateString } from '../utils/date';

function genId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function loadInitialState() {
  try {
    const saved = localStorage.getItem('moneymate-data');
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore parse errors, fall back to seed
  }
  return {
    accounts: initialAccounts,
    categories: initialCategories,
    fixedExpenses: initialFixedExpenses,
    expenses: initialExpenses,
    incomes: initialIncomes,
  };
}

const financeSlice = createSlice({
  name: 'finance',
  initialState: loadInitialState(),
  reducers: {
    // ----- ACCOUNT -----
    addAccount: (state, action) => {
      state.accounts.push({
        id: genId('acc'),
        ...action.payload,
        balance: action.payload.initialBalance ?? 0,
      });
    },
    updateAccount: (state, action) => {
      const a = state.accounts.find((a) => a.id === action.payload.id);
      if (a) Object.assign(a, action.payload);
    },
    deleteAccount: (state, action) => {
      state.accounts = state.accounts.filter((a) => a.id !== action.payload.id);
    },

    // ----- CATEGORY -----
    addCategory: (state, action) => {
      state.categories.push({ id: genId('cat'), ...action.payload });
    },
    updateCategory: (state, action) => {
      const c = state.categories.find((c) => c.id === action.payload.id);
      if (c) Object.assign(c, action.payload);
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload.id);
    },

    // ----- FIXED EXPENSE -----
    addFixedExpense: (state, action) => {
      state.fixedExpenses.push({ id: genId('fx'), payments: [], ...action.payload });
    },
    updateFixedExpense: (state, action) => {
      const f = state.fixedExpenses.find((f) => f.id === action.payload.id);
      if (f) Object.assign(f, action.payload);
    },
    deleteFixedExpense: (state, action) => {
      state.fixedExpenses = state.fixedExpenses.filter((f) => f.id !== action.payload.id);
    },
    payFixedExpense: (state, action) => {
      const { fixedExpenseId, accountId } = action.payload;
      const fx = state.fixedExpenses.find((f) => f.id === fixedExpenseId);
      const account = state.accounts.find((a) => a.id === accountId);
      if (!fx || !account || account.balance < fx.target) return;

      account.balance -= fx.target;
      fx.payments = fx.payments || [];
      fx.payments.push({
        month: getCurrentMonth(),
        date: getLocalDateString(),
        accountId,
        amount: fx.target,
      });
    },

    // ----- EXPENSE (Regular) -----
    addExpense: (state, action) => {
      const expense = { id: genId('ex'), date: getLocalDateString(), ...action.payload };
      const account = state.accounts.find((a) => a.id === expense.accountId);
      if (account) account.balance -= expense.amount;
      state.expenses.push(expense);
    },
    updateExpense: (state, action) => {
      const oldExpense = state.expenses.find((e) => e.id === action.payload.id);
      if (!oldExpense) return;

      const oldAccount = state.accounts.find((a) => a.id === oldExpense.accountId);
      if (oldAccount) oldAccount.balance += oldExpense.amount; // revert

      const newAccount = state.accounts.find((a) => a.id === action.payload.accountId);
      if (newAccount) newAccount.balance -= action.payload.amount; // reapply

      Object.assign(oldExpense, action.payload);
    },
    deleteExpense: (state, action) => {
      const expense = state.expenses.find((e) => e.id === action.payload.id);
      if (!expense) return;
      const account = state.accounts.find((a) => a.id === expense.accountId);
      if (account) account.balance += expense.amount;
      state.expenses = state.expenses.filter((e) => e.id !== action.payload.id);
    },

    // ----- INCOME -----
    addIncome: (state, action) => {
      const { accountId, type, amount, note } = action.payload;
      state.incomes = state.incomes || [];
      state.incomes.push({ id: genId('inc'), accountId, type, amount, note, date: getLocalDateString() });
      const account = state.accounts.find((a) => a.id === accountId);
      if (account) account.balance += amount;
    },

    // ----- RESET / SETTINGS -----
    resetBalances: (state) => {
      state.accounts.forEach((a) => { a.balance = a.initialBalance; });
    },
    resetAccounts: (state) => { state.accounts = []; },
    resetCategories: (state) => { state.categories = []; },
    resetFixedExpenses: (state) => { state.fixedExpenses = []; },
    resetMonthExpenses: (state) => {
      const currentMonth = getCurrentMonth();
      const toRemove = state.expenses.filter((e) => e.date.startsWith(currentMonth));
      toRemove.forEach((e) => {
        const account = state.accounts.find((a) => a.id === e.accountId);
        if (account) account.balance += e.amount;
      });
      state.expenses = state.expenses.filter((e) => !e.date.startsWith(currentMonth));
    },
    resetAll: (state) => {
      state.accounts = [];
      state.categories = [];
      state.fixedExpenses = [];
      state.expenses = [];
      state.incomes = [];
    },
  },
});

export const {
  addAccount, updateAccount, deleteAccount,
  addCategory, updateCategory, deleteCategory,
  addFixedExpense, updateFixedExpense, deleteFixedExpense, payFixedExpense,
  addExpense, updateExpense, deleteExpense,
  addIncome,
  resetBalances, resetAccounts, resetCategories, resetFixedExpenses, resetMonthExpenses, resetAll,
} = financeSlice.actions;

export default financeSlice.reducer;