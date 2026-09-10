import { useState } from 'react';
import ConfirmModal from '../shared/ConfirmModal';

export default function ResetOption({ title, description, confirmMessage, onReset }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between items-center bg-base-100 shadow-sm rounded-lg px-4 py-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-base-content/60">{description}</p>
      </div>
      <button onClick={() => setIsOpen(true)} className="btn btn-sm btn-outline btn-error">
        Reset
      </button>
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onReset}
        title={`Reset ${title}?`}
        message={confirmMessage}
      />
    </div>
  );
}