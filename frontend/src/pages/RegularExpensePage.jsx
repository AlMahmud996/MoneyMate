import { useState } from 'react';
import { useAppContext } from '../contexts/appContext';
import Modal from '../components/shared/Modal';
import ExpenseForm from '../components/expense/ExpenseForm';
import ExpenseLog from '../components/expense/ExpenseLog';

export default function RegularExpensePage() {
  const { expenses, categories, accounts, addExpense, updateExpense, deleteExpense } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => { setEditing(null); setIsOpen(true); };
  const openEdit = (exp) => { setEditing(exp); setIsOpen(true); };
  const close = () => setIsOpen(false);

  const handleSubmit = (form) => {
    if (editing) updateExpense({ ...editing, ...form });
    else addExpense(form);
    close();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Regular Expense</h1>
        <button onClick={openAdd} className="btn btn-primary">+ Add Expense</button>
      </div>
      <ExpenseLog
        expenses={expenses}
        categories={categories}
        accounts={accounts}
        onEdit={openEdit}
        onDelete={(id) => deleteExpense({ id })}
      />
      <Modal isOpen={isOpen} onClose={close} title={editing ? 'Edit Expense' : 'Add Expense'}>
        <ExpenseForm key={editing?.id ?? 'new'} categories={categories} accounts={accounts} initialValues={editing} onSubmit={handleSubmit} onCancel={close} />
      </Modal>
    </div>
  );
}