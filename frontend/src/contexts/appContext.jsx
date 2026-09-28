/*
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../store/financeSlice';
import { toggleTheme as toggleThemeAction } from '../store/themeSlice';

export function useAppContext() {
  const dispatch = useDispatch();
  const finance = useSelector((state) => state.finance);
  const darkMode = useSelector((state) => state.theme.darkMode);

  return {
    ...finance,
    darkMode,
    toggleTheme: () => dispatch(toggleThemeAction()),

    addAccount: (payload) => dispatch(actions.addAccount(payload)),
    updateAccount: (payload) => dispatch(actions.updateAccount(payload)),
    deleteAccount: (payload) => dispatch(actions.deleteAccount(payload)),

    addCategory: (payload) => dispatch(actions.addCategory(payload)),
    updateCategory: (payload) => dispatch(actions.updateCategory(payload)),
    deleteCategory: (payload) => dispatch(actions.deleteCategory(payload)),

    addFixedExpense: (payload) => dispatch(actions.addFixedExpense(payload)),
    updateFixedExpense: (payload) => dispatch(actions.updateFixedExpense(payload)),
    deleteFixedExpense: (payload) => dispatch(actions.deleteFixedExpense(payload)),
    payFixedExpense: (payload) => dispatch(actions.payFixedExpense(payload)),

    addExpense: (payload) => dispatch(actions.addExpense(payload)),
    updateExpense: (payload) => dispatch(actions.updateExpense(payload)),
    deleteExpense: (payload) => dispatch(actions.deleteExpense(payload)),

    addIncome: (payload) => dispatch(actions.addIncome(payload)),

    resetBalances: () => dispatch(actions.resetBalances()),
    resetAccounts: () => dispatch(actions.resetAccounts()),
    resetCategories: () => dispatch(actions.resetCategories()),
    resetFixedExpenses: () => dispatch(actions.resetFixedExpenses()),
    resetMonthExpenses: () => dispatch(actions.resetMonthExpenses()),
    resetAll: () => dispatch(actions.resetAll()),
  };
}

*/

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../store/financeSlice';
import { toggleTheme as toggleThemeAction } from '../store/themeSlice';

export function useAppContext() {
  const dispatch = useDispatch();
  const finance = useSelector((state) => state.finance);
  const darkMode = useSelector((state) => state.theme.darkMode);

  // App mount in firsttime, get data from backend
  useEffect(() => {
    dispatch(actions.fetchAccounts());
    dispatch(actions.fetchCategories());
    dispatch(actions.fetchFixedExpenses());
    dispatch(actions.fetchExpenses());
  }, [dispatch]);

  return {
    ...finance,
    darkMode,
    toggleTheme: () => dispatch(toggleThemeAction()),

    addAccount: (payload) => dispatch(actions.addAccount(payload)),
    deleteAccount: (payload) => dispatch(actions.deleteAccount(payload)),
    addIncome: (payload) => dispatch(actions.addIncome(payload)),

    addCategory: (payload) => dispatch(actions.addCategory(payload)),
    updateCategory: (payload) => dispatch(actions.updateCategory(payload)),
    deleteCategory: (payload) => dispatch(actions.deleteCategory(payload)),


    addFixedExpense: (payload) => dispatch(actions.addFixedExpense(payload)),
    updateFixedExpense: async (payload) => {
      await dispatch(actions.updateFixedExpense(payload));
      dispatch(actions.fetchFixedExpenses());
    },


    deleteFixedExpense: (payload) => dispatch(actions.deleteFixedExpense(payload)),
    payFixedExpense: async (payload) => {
      await dispatch(actions.payFixedExpense(payload));
      dispatch(actions.fetchAccounts());
      dispatch(actions.fetchFixedExpenses());
    },
    updateExpense: async (payload) => {
      await dispatch(actions.updateExpense(payload));
      dispatch(actions.fetchExpenses());
      dispatch(actions.fetchAccounts());
    },

    resetBalances: () => dispatch(actions.resetBalances()),
    resetAccounts: () => dispatch(actions.resetAccounts()),
    resetCategories: () => dispatch(actions.resetCategories()),
    resetFixedExpenses: () => dispatch(actions.resetFixedExpenses()),
    resetMonthExpenses: async () => {
      await dispatch(actions.resetMonthExpenses());
      dispatch(actions.fetchExpenses());
      dispatch(actions.fetchAccounts()); // balance ফেরত এসেছে, sync করতে
    },
    resetAll: () => dispatch(actions.resetAll()),

    addExpense: (payload) => dispatch(actions.addExpense(payload)),
    deleteExpense: (payload) => dispatch(actions.deleteExpense(payload)),
  };
}