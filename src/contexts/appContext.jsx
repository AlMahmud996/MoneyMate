import { createContext, useState, useEffect, useContext, useReducer } from 'react';
import { appReducer } from './appReducer';
import { initialAccounts, initialCategories, initialFixedExpenses, initialExpenses, initialIncomes } from './mockData';

const AppContext = createContext(null);

const STORAGE_KEY = 'moneymate-data';
const THEME_KEY = 'moneymate-theme';

const seededState = {
  accounts: initialAccounts,
  categories: initialCategories,
  fixedExpenses: initialFixedExpenses,
  expenses: initialExpenses,
  incomes: initialIncomes,
};

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seededState;
  } catch {
    return seededState;
  }
}

function loadInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light') return false;
  return true; // saved 'dark' athoba kichu save na thakle default dark
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadInitialState);
  const [darkMode, setDarkMode] = useState(loadInitialTheme);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = {
    ...state,
    darkMode,
    toggleTheme,
    addAccount: (payload) => dispatch({ type: 'ADD_ACCOUNT', payload }),
    updateAccount: (payload) => dispatch({ type: 'UPDATE_ACCOUNT', payload }),
    deleteAccount: (payload) => dispatch({ type: 'DELETE_ACCOUNT', payload }),

    addCategory: (payload) => dispatch({ type: 'ADD_CATEGORY', payload }),
    updateCategory: (payload) => dispatch({ type: 'UPDATE_CATEGORY', payload }),
    deleteCategory: (payload) => dispatch({ type: 'DELETE_CATEGORY', payload }),

    addFixedExpense: (payload) => dispatch({ type: 'ADD_FIXED_EXPENSE', payload }),
    updateFixedExpense: (payload) => dispatch({ type: 'UPDATE_FIXED_EXPENSE', payload }),
    deleteFixedExpense: (payload) => dispatch({ type: 'DELETE_FIXED_EXPENSE', payload }),
    payFixedExpense: (payload) => dispatch({ type: 'PAY_FIXED_EXPENSE', payload }),

    addExpense: (payload) => dispatch({ type: 'ADD_EXPENSE', payload }),
    updateExpense: (payload) => dispatch({ type: 'UPDATE_EXPENSE', payload }),
    deleteExpense: (payload) => dispatch({ type: 'DELETE_EXPENSE', payload }),

    addIncome: (payload) => dispatch({ type: 'ADD_INCOME', payload }),

    resetBalances: () => dispatch({ type: 'RESET_BALANCES' }),
    resetAccounts: () => dispatch({ type: 'RESET_ACCOUNTS' }),
    resetCategories: () => dispatch({ type: 'RESET_CATEGORIES' }),
    resetFixedExpenses: () => dispatch({ type: 'RESET_FIXED_EXPENSES' }),
    resetMonthExpenses: () => dispatch({ type: 'RESET_MONTH_EXPENSES' }),
    resetAll: () => dispatch({ type: 'RESET_ALL' }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}