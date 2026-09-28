import { useState } from 'react';
import { useAppContext } from '../contexts/appContext';
import Modal from '../components/shared/Modal';
import AccountForm from '../components/account/AccountForm';
import AccountList from '../components/account/AccountList';
import IncomeForm from '../components/account/IncomeForm';

export default function AccountPage() {
  const { accounts, addAccount, deleteAccount, addIncome } = useAppContext();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [incomeTarget, setIncomeTarget] = useState(null);
  const [incomeError, setIncomeError] = useState(null);

  const closeAdd = () => setIsAddOpen(false);

  const openIncome = (account) => {
    setIncomeError(null);
    setIncomeTarget(account);
  };

  const closeIncome = () => {
    setIncomeError(null);
    setIncomeTarget(null);
  };

  const handleAddAccount = (form) => {
    addAccount(form);
    closeAdd();
  };

  const handleAddIncome = async (form) => {
    try {
      await addIncome({ accountId: incomeTarget.id, ...form }).unwrap();
      closeIncome();
    } catch (err) {
      setIncomeError(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Account</h1>
          <p className="text-base-content/60">Manage your account</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn btn-primary">+ Add Account</button>
      </div>

      <AccountList
        accounts={accounts}
        onCardClick={openIncome}
        onDelete={(id) => deleteAccount({ id })}
      />

      <Modal isOpen={isAddOpen} onClose={closeAdd} title="Add Account">
        <AccountForm onSubmit={handleAddAccount} onCancel={closeAdd} />
      </Modal>

      <Modal isOpen={!!incomeTarget} onClose={closeIncome} title="Add Income">
        {incomeTarget && (
          <>
            <IncomeForm
              account={incomeTarget}
              accounts={accounts}
              onSubmit={handleAddIncome}
              onCancel={closeIncome}
            />
            {incomeError && <p className="text-error text-sm mt-2">{incomeError}</p>}
          </>
        )}
      </Modal>
    </div>
  );
}