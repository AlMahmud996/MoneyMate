CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('cash', 'debit', 'credit')),
    initial_balance NUMERIC NOT NULL DEFAULT 0,
    balance NUMERIC NOT NULL DEFAULT 0
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    budget_target NUMERIC NOT NULL DEFAULT 0
);

CREATE TABLE fixed_expenses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    target NUMERIC NOT NULL DEFAULT 0
);

CREATE TABLE fixed_expense_payments (
    id SERIAL PRIMARY KEY,
    fixed_expense_id INTEGER REFERENCES fixed_expenses(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES accounts(id),
    month TEXT NOT NULL,
    pay_date DATE NOT NULL,
    amount NUMERIC NOT NULL
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    exp_date DATE NOT NULL
);

CREATE TABLE incomes (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    note TEXT,
    inc_date DATE NOT NULL
);