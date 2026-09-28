import { useState } from 'react';
import { getCurrentMonth, formatShortDate } from '../../utils/date';
import ConfirmModal from '../shared/ConfirmModal';

export default function FixedExpenseCard({ fixedExpense, onPay, onEdit, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const payment = (fixedExpense.payments || []).find((p) => p.month === getCurrentMonth());
  const isPaid = !!payment;

  return (
    <>
      <div
        className={`card shadow-md transition ${
          isPaid ? 'bg-base-200 opacity-80' : 'bg-base-100 cursor-pointer hover:shadow-lg'
        }`}
        onClick={() => !isPaid && onPay(fixedExpense)}
      >
        <div className="card-body">
          <div className="flex justify-between items-start">
            <h4 className="card-title text-base">{fixedExpense.name}</h4>
            {isPaid && <span className="badge badge-success">Paid</span>}
          </div>
          <p className="text-sm text-base-content/60">{fixedExpense.description}</p>
          <p className="font-semibold text-md">Target: ৳{fixedExpense.target}</p>
          {isPaid && (
            <p className="text-sm text-base-content mt-1">Paid on {formatShortDate(payment.date)}</p>
          )}
          {!isPaid && (
            <div className="card-actions justify-end mt-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => onEdit(fixedExpense)} className="btn btn-xs btn-outline">Edit</button>
              <button onClick={() => setConfirmOpen(true)} className="btn btn-xs btn-error btn-outline">Delete</button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => onDelete(fixedExpense.id)}
        title="Delete Fixed Expense?"
        message={`"${fixedExpense.name}" will be permanently deleted.`}
        confirmLabel="Yes, Delete"
      />
    </>
  );
}