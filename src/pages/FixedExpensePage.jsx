import { useState } from 'react';
import { useAppContext } from '../contexts/appContext';
import Modal from '../components/shared/Modal';
import FixedExpenseForm from '../components/fixedExpense/FixedExpenseForm';
import FixedExpenseList from '../components/fixedExpense/FixedExpenseList';
import PayFixedExpenseModal from '../components/fixedExpense/PayFixedExpenseModal';

export default function FixedExpensePage() {
  const {
    fixedExpenses, categories, accounts,
    addFixedExpense, updateFixedExpense, deleteFixedExpense, payFixedExpense,
  } = useAppContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [payTarget, setPayTarget] = useState(null); // যে fixedExpense-টা pay করা হচ্ছে

  const openAdd = () => { setEditing(null); setIsFormOpen(true); };
  const openEdit = (fx) => { setEditing(fx); setIsFormOpen(true); };
  const closeForm = () => setIsFormOpen(false);

  const handleSubmit = (form) => {
    if (editing) updateFixedExpense({ ...editing, ...form });
    else addFixedExpense(form);
    closeForm();
  };

  const handlePayConfirm = (accountId) => {
    payFixedExpense({ fixedExpenseId: payTarget.id, accountId });
    setPayTarget(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fixed Expense</h1>
        <button onClick={openAdd} className="btn btn-primary">+ Add Fixed Expense</button>
      </div>

      <FixedExpenseList
        fixedExpenses={fixedExpenses}
        categories={categories}
        onPay={setPayTarget}
        onEdit={openEdit}
        onDelete={(id) => deleteFixedExpense({ id })}
      />

      <Modal isOpen={isFormOpen} onClose={closeForm} title={editing ? 'Edit Fixed Expense' : 'Add Fixed Expense'}>
        <FixedExpenseForm key={editing?.id ?? 'new'} categories={categories} initialValues={editing} onSubmit={handleSubmit} onCancel={closeForm} />
      </Modal>

      <Modal isOpen={!!payTarget} onClose={() => setPayTarget(null)} title="Confirm Payment">
        {payTarget && (
          <PayFixedExpenseModal
            fixedExpense={payTarget}
            accounts={accounts}
            onConfirm={handlePayConfirm}
            onCancel={() => setPayTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
}