import { useState } from 'react';

export default function CategoryForm({ accounts, initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initialValues ?? { name: '', description: '', accountId: accounts[0]?.id ?? '', budgetTarget: 0 }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'budgetTarget' ? Number(value) : value }));
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
        <span className="label-text">Description</span>
        <textarea name="description" value={form.description} onChange={handleChange} className="textarea textarea-bordered" />
      </label>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}