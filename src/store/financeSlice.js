import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/client";
import { getCurrentMonth, getLocalDateString } from "../utils/date";

// ACCOUNT THUNKS
export const fetchAccounts = createAsyncThunk("finance/fetchAccounts", () =>
  api.get("/accounts"),
);
export const addAccount = createAsyncThunk("finance/addAccount", (payload) =>
  api.post("/accounts", payload),
);
export const deleteAccount = createAsyncThunk(
  "finance/deleteAccount",
  async ({ id }) => {
    await api.delete(`/accounts/${id}`);
    return { id };
  },
);
export const addIncome = createAsyncThunk(
  "finance/addIncome",
  ({ accountId, ...rest }) => api.post(`/accounts/${accountId}/income`, rest),
);

// CATEGORY THUNKS
export const fetchCategories = createAsyncThunk("finance/fetchCategories", () =>
  api.get("/categories"),
);
export const addCategory = createAsyncThunk("finance/addCategory", (payload) =>
  api.post("/categories", payload),
);
export const updateCategory = createAsyncThunk(
  "finance/updateCategory",
  ({ id, ...rest }) => api.put(`/categories/${id}`, rest),
);
export const deleteCategory = createAsyncThunk(
  "finance/deleteCategory",
  async ({ id }) => {
    await api.delete(`/categories/${id}`);
    return { id };
  },
);

// FIXED EXPENSE THUNKS (ager motoi, update bade)
export const fetchFixedExpenses = createAsyncThunk(
  "finance/fetchFixedExpenses",
  () => api.get("/fixed-expenses"),
);
export const addFixedExpense = createAsyncThunk(
  "finance/addFixedExpense",
  (payload) => api.post("/fixed-expenses", payload),
);
export const deleteFixedExpense = createAsyncThunk(
  "finance/deleteFixedExpense",
  async ({ id }) => {
    await api.delete(`/fixed-expenses/${id}`);
    return { id };
  },
);
export const payFixedExpense = createAsyncThunk(
  "finance/payFixedExpense",
  ({ fixedExpenseId, accountId }) =>
    api.post(`/fixed-expenses/${fixedExpenseId}/pay`, { accountId }),
);

// EXPENSE THUNKS (update bade)
export const fetchExpenses = createAsyncThunk("finance/fetchExpenses", () =>
  api.get("/expenses"),
);
export const addExpense = createAsyncThunk("finance/addExpense", (payload) =>
  api.post("/expenses", payload),
);
export const updateFixedExpense = createAsyncThunk(
  "finance/updateFixedExpense",
  ({ id, ...rest }) => api.put(`/fixed-expenses/${id}`, rest),
);
export const updateExpense = createAsyncThunk(
  "finance/updateExpense",
  ({ id, ...rest }) => api.put(`/expenses/${id}`, rest),
);
export const deleteExpense = createAsyncThunk(
  "finance/deleteExpense",
  async ({ id }) => {
    await api.delete(`/expenses/${id}`);
    return { id };
  },
);
export const resetBalances = createAsyncThunk("finance/resetBalances", () =>
  api.post("/settings/reset-balances"),
);
export const resetAccounts = createAsyncThunk("finance/resetAccounts", () =>
  api.post("/settings/reset-accounts"),
);
export const resetCategories = createAsyncThunk("finance/resetCategories", () =>
  api.post("/settings/reset-categories"),
);
export const resetFixedExpenses = createAsyncThunk(
  "finance/resetFixedExpenses",
  () => api.post("/settings/reset-fixed-expenses"),
);
export const resetMonthExpenses = createAsyncThunk(
  "finance/resetMonthExpenses",
  () => api.post("/settings/reset-month-expenses"),
);
export const resetAll = createAsyncThunk("finance/resetAll", () =>
  api.post("/settings/reset-all"),
);

const financeSlice = createSlice({
  name: "finance",
  initialState: {
    accounts: [],
    categories: [],
    fixedExpenses: [],
    expenses: [],
    incomes: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
  builder
    // Fetch
    .addCase(fetchAccounts.fulfilled, (state, action) => { state.accounts = action.payload; })
    .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })
    .addCase(fetchFixedExpenses.fulfilled, (state, action) => { state.fixedExpenses = action.payload; })
    .addCase(fetchExpenses.fulfilled, (state, action) => { state.expenses = action.payload; })

    // Account
    .addCase(addAccount.fulfilled, (state, action) => { state.accounts.push(action.payload); })
    .addCase(deleteAccount.fulfilled, (state, action) => {
      state.accounts = state.accounts.filter((a) => a.id !== action.payload.id);
    })
    .addCase(addIncome.fulfilled, (state, action) => {
      const updated = action.payload;
      const idx = state.accounts.findIndex((a) => a.id === updated.id);
      if (idx !== -1) state.accounts[idx] = updated;
    })

    // Category
    .addCase(addCategory.fulfilled, (state, action) => { state.categories.push(action.payload); })
    .addCase(updateCategory.fulfilled, (state, action) => {
      const idx = state.categories.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.categories[idx] = action.payload;
    })
    .addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload.id);
    })

    // Fixed Expense
    .addCase(addFixedExpense.fulfilled, (state, action) => { state.fixedExpenses.push(action.payload); })
    .addCase(deleteFixedExpense.fulfilled, (state, action) => {
      state.fixedExpenses = state.fixedExpenses.filter((f) => f.id !== action.payload.id);
    })
    .addCase(payFixedExpense.fulfilled, (state, action) => {})

    // Expense
    .addCase(addExpense.fulfilled, (state, action) => { state.expenses.push(action.payload); })
    .addCase(deleteExpense.fulfilled, (state, action) => {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload.id);
    })

    // Reset / Settings — এই ব্লকটাই নিচ থেকে এখানে সরিয়ে আনা হলো
    .addCase(resetBalances.fulfilled, (state, action) => { state.accounts = action.payload; })
    .addCase(resetAccounts.fulfilled, (state) => { state.accounts = []; })
    .addCase(resetCategories.fulfilled, (state) => { state.categories = []; })
    .addCase(resetFixedExpenses.fulfilled, (state) => { state.fixedExpenses = []; })
    .addCase(resetAll.fulfilled, (state) => {
      state.accounts = [];
      state.categories = [];
      state.fixedExpenses = [];
      state.expenses = [];
      state.incomes = [];
    })

    // Generic loading/error tracking — সবার শেষে, addMatcher সবসময় শেষে থাকবে
    .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.status = 'loading'; })
    .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => { state.status = 'succeeded'; })
    .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
},
});

export default financeSlice.reducer;
