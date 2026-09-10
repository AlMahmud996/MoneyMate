import { useState } from 'react';

export default function ExpenseForm({ categories, accounts, initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initialValues ?? { name: '', amount: 0, categoryId: categories[0]?.id ?? '', accountId: accounts[0]?.id ?? '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="form-control">
        <span className="label-text">Name</span>
        <input name="name" value={form.name} onChange={handleChange} required className="input input-bordered" />
      </label>
      <label className="form-control">
        <span className="label-text">Amount</span>
        <input type="number" name="amount" value={form.amount} onChange={handleChange} required className="input input-bordered" />
      </label>
      <label className="form-control">
        <span className="label-text">Category</span>
        <select name="categoryId" value={form.categoryId} onChange={handleChange} className="select select-bordered">
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <label className="form-control">
        <span className="label-text">Account</span>
        <select name="accountId" value={form.accountId} onChange={handleChange} className="select select-bordered">
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.type})</option>)}
        </select>
      </label>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}