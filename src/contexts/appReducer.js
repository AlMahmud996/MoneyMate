import { getCurrentMonth, getLocalDateString } from '../utils/date';

export const initialState = {
    accounts: [],
    categories: [],
    fixedExpenses: [],
    expenses: [],
};

function genId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function appReducer(state, action) {
    switch (action.type) {
        // ----- ACCOUNT -----
        case 'ADD_ACCOUNT': {
            const newAccount = {
                id: genId('acc'),
                ...action.payload,
                balance: action.payload.initialBalance ?? 0,
            };
            return { ...state, accounts: [...state.accounts, newAccount] };
        }
        case 'UPDATE_ACCOUNT':
            return {
                ...state,
                accounts: state.accounts.map((a) =>
                    a.id === action.payload.id ? { ...a, ...action.payload } : a
                ),
            };
        case 'DELETE_ACCOUNT':
            return {
                ...state,
                accounts: state.accounts.filter((a) => a.id !== action.payload.id),
            };

        // ----- CATEGORY -----
        case 'ADD_CATEGORY':
            return {
                ...state,
                categories: [...state.categories, { id: genId('cat'), ...action.payload }],
            };
        case 'UPDATE_CATEGORY':
            return {
                ...state,
                categories: state.categories.map((c) =>
                    c.id === action.payload.id ? { ...c, ...action.payload } : c
                ),
            };
        case 'DELETE_CATEGORY':
            return {
                ...state,
                categories: state.categories.filter((c) => c.id !== action.payload.id),
            };

        // ----- FIXED EXPENSE -----
        case 'ADD_FIXED_EXPENSE':
            return {
                ...state,
                fixedExpenses: [...state.fixedExpenses, { id: genId('fx'), payments: [], ...action.payload }],
            };

        case 'PAY_FIXED_EXPENSE': {
            const { fixedExpenseId, accountId } = action.payload;
            const fx = state.fixedExpenses.find((f) => f.id === fixedExpenseId);
            const account = state.accounts.find((a) => a.id === accountId);
            if (!fx || !account || account.balance < fx.target) return state;

            const month = getCurrentMonth();
            const date = getLocalDateString(); // নতুন লাইন
            const accounts = state.accounts.map((a) =>
                a.id === accountId ? { ...a, balance: a.balance - fx.target } : a
            );
            const fixedExpenses = state.fixedExpenses.map((f) =>
                f.id === fixedExpenseId
                    ? { ...f, payments: [...(f.payments || []), { month, date, accountId, amount: fx.target }] }
                    : f
            );
            return { ...state, accounts, fixedExpenses };
        }
        case 'UPDATE_FIXED_EXPENSE':
            return {
                ...state,
                fixedExpenses: state.fixedExpenses.map((f) =>
                    f.id === action.payload.id ? { ...f, ...action.payload } : f
                ),
            };
        case 'DELETE_FIXED_EXPENSE':
            return {
                ...state,
                fixedExpenses: state.fixedExpenses.filter((f) => f.id !== action.payload.id),
            };

        // ----- EXPENSE (Regular) -----
        case 'ADD_EXPENSE': {
            const expense = { id: genId('ex'), date: getLocalDateString(), ...action.payload };
            // deduct from the linked account's balance
            const accounts = state.accounts.map((a) =>
                a.id === expense.accountId ? { ...a, balance: a.balance - expense.amount } : a
            );
            return { ...state, expenses: [...state.expenses, expense], accounts };
        }
        case 'UPDATE_EXPENSE': {
            // recalculate balance difference if amount or account changed
            const oldExpense = state.expenses.find((e) => e.id === action.payload.id);
            let accounts = state.accounts;
            if (oldExpense) {
                accounts = accounts.map((a) => {
                    if (a.id === oldExpense.accountId) return { ...a, balance: a.balance + oldExpense.amount }; // revert
                    return a;
                });
                accounts = accounts.map((a) => {
                    if (a.id === action.payload.accountId) return { ...a, balance: a.balance - action.payload.amount }; // reapply
                    return a;
                });
            }
            return {
                ...state,
                accounts,
                expenses: state.expenses.map((e) =>
                    e.id === action.payload.id ? { ...e, ...action.payload } : e
                ),
            };
        }
        case 'DELETE_EXPENSE': {
            const expense = state.expenses.find((e) => e.id === action.payload.id);
            const accounts = state.accounts.map((a) =>
                expense && a.id === expense.accountId ? { ...a, balance: a.balance + expense.amount } : a
            );
            return {
                ...state,
                accounts,
                expenses: state.expenses.filter((e) => e.id !== action.payload.id),
            };
        }
        // ----- SETTINGS / RESET -----
        case 'RESET_BALANCES':
            return {
                ...state,
                accounts: state.accounts.map((a) => ({ ...a, balance: a.initialBalance })),
            };

        case 'RESET_ACCOUNTS':
            return { ...state, accounts: [] };

        case 'RESET_CATEGORIES':
            return { ...state, categories: [] };

        case 'RESET_FIXED_EXPENSES':
            return { ...state, fixedExpenses: [] };

        case 'RESET_MONTH_EXPENSES': {
            const currentMonth = getCurrentMonth();
            const toRemove = state.expenses.filter((e) => e.date.startsWith(currentMonth));

            const accounts = state.accounts.map((a) => {
                const refund = toRemove
                    .filter((e) => e.accountId === a.id)
                    .reduce((sum, e) => sum + e.amount, 0);
                return { ...a, balance: a.balance + refund };
            });
            return {
                ...state,
                accounts,
                expenses: state.expenses.filter((e) => !e.date.startsWith(currentMonth)),
            };
        }

        case 'RESET_ALL':
            return { accounts: [], categories: [], fixedExpenses: [], expenses: [], incomes: [] };

        case 'ADD_INCOME': {
            const { accountId, type, amount, note } = action.payload;
            const income = { id: genId('inc'), accountId, type, amount, note, date: getLocalDateString() };
            const accounts = state.accounts.map((a) =>
                a.id === accountId ? { ...a, balance: a.balance + amount } : a
            );
            return { ...state, accounts, incomes: [...(state.incomes || []), income] };
        }


        default:
            return state;
    }
}