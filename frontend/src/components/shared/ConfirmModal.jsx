import Modal from './Modal';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Yes, Confirm' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-base-content/70 mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="btn btn-ghost">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className="btn btn-error">
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}