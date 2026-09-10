import { useState } from 'react';

export default function AccountForm({ initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initialValues ?? { name: '', type: 'cash', initialBalance: 0 }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'initialBalance' ? Number(value) : value }));
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
        <span className="label-text">Type</span>
        <select name="type" value={form.type} onChange={handleChange} className="select select-bordered">
          <option value="cash">Cash</option>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
          <option value="online">Online Banking</option>
        </select>
      </label>
      <label className="form-control">
        <span className="label-text">Initial Balance</span>
        <input type="number" name="initialBalance" value={form.initialBalance} onChange={handleChange} className="input input-bordered" />
      </label>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}