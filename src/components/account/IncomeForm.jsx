import { useState } from 'react';

const INCOME_TYPES = ['Salary', 'Bonus', 'Gift', 'Freelance', 'Other'];

export default function IncomeForm({ account, onSubmit, onCancel }) {
  const [form, setForm] = useState({ type: INCOME_TYPES[0], amount: 0, note: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.amount <= 0) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-sm text-base-content/60">
        Add income to <span className="font-semibold">{account.name}</span>
      </p>
      <label className="form-control">
        <span className="label-text">Type</span>
        <select name="type" value={form.type} onChange={handleChange} className="select select-bordered">
          {INCOME_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <label className="form-control">
        <span className="label-text">Amount</span>
        <input type="number" name="amount" value={form.amount} onChange={handleChange} required min="1" className="input input-bordered" />
      </label>
      <label className="form-control">
        <span className="label-text">Note (optional)</span>
        <input name="note" value={form.note} onChange={handleChange} className="input input-bordered" />
      </label>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
        <button type="submit" className="btn btn-primary">Add Income</button>
      </div>
    </form>
  );
}