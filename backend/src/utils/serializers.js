export function serializeAccount(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    initialBalance: parseFloat(row.initial_balance),
    balance: parseFloat(row.balance),
    isSalaryAccount: row.is_salary_account,
  };
}

export function serializeCategory(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    accountId: row.account_id,
    budgetTarget: parseFloat(row.budget_target),
  };
}

export function serializePayment(row) {
  return {
    month: row.month,
    date: row.pay_date,
    accountId: row.account_id,
    amount: parseFloat(row.amount),
  };
}

export function serializeFixedExpense(row, payments = []) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    categoryId: row.category_id,
    target: parseFloat(row.target),
    payments: payments.map(serializePayment),
  };
}

export function serializeExpense(row) {
  return {
    id: row.id,
    name: row.name,
    amount: parseFloat(row.amount),
    categoryId: row.category_id,
    accountId: row.account_id,
    date: row.exp_date,
  };
}

export function serializeIncome(row) {
  return {
    id: row.id,
    accountId: row.account_id,
    type: row.type,
    amount: parseFloat(row.amount),
    note: row.note,
    date: row.inc_date,
  };
}