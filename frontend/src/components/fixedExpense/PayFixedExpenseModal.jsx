import { useState } from 'react';

export default function PayFixedExpenseModal({ fixedExpense, accounts, onConfirm, onCancel }) {
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '');
  const selectedAccount = accounts.find((a) => a.id === accountId);
  const insufficientBalance = selectedAccount && selectedAccount.balance < fixedExpense.target;

  const handleConfirm = () => {
    if (!accountId || insufficientBalance) return;
    onConfirm(accountId);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-base-content/70">
        Pay <span className="font-semibold">{fixedExpense.name}</span> — ৳{fixedExpense.target}
      </p>
      <label className="form-control">
        <span className="label-text">Pay from</span>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="select select-bordered"
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.type}) — ৳{a.balance}
            </option>
          ))}
        </select>
      </label>

      {insufficientBalance && (
        <p className="text-error text-sm">
          Not Enough balance in the selected account. Please choose another account or add funds.
        </p>
      )}

      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
        <button
          onClick={handleConfirm}
          disabled={!accountId || insufficientBalance}
          className="btn btn-primary"
        >
          Confirm Pay
        </button>
      </div>
    </div>
  );
}