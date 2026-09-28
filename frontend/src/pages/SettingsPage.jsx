import { useAppContext } from '../contexts/appContext';
import ResetOption from '../components/settings/ResetOption';
import ThemeChanger from '../components/settings/ThemeChanger';

export default function SettingsPage() {
    const {
        resetBalances,
        resetAccounts,
        resetCategories,
        resetFixedExpenses,
        resetMonthExpenses,
        resetAll,
    } = useAppContext();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-1">Settings</h1>
            <p className="text-base-content/60 mb-6">Reset your data. These actions cannot be undone.</p>

            <div className="flex flex-col gap-3">
                <ResetOption
                    title="Amount / Balances"
                    description="Set every account's balance back to its initial balance"
                    confirmMessage="All account balances will be reset to their starting amount. Accounts themselves stay."
                    onReset={resetBalances}
                />
                <ResetOption
                    title="Categories"
                    description="Delete all categories"
                    confirmMessage="All categories will be permanently deleted."
                    onReset={resetCategories}
                />
                <ResetOption
                    title="Accounts"
                    description="Delete all accounts"
                    confirmMessage="All accounts and their balances will be permanently deleted."
                    onReset={resetAccounts}
                />
                <ResetOption
                    title="Fixed Expenses"
                    description="Delete all fixed expenses"
                    confirmMessage="All fixed expenses will be permanently deleted."
                    onReset={resetFixedExpenses}
                />
                <ResetOption
                    title="Month"
                    description="Clear this month's regular expenses and refund their amounts to accounts"
                    confirmMessage="This month's regular expenses will be deleted and their amounts refunded to the linked accounts."
                    onReset={resetMonthExpenses}
                />
                <ResetOption
                    title="All Data"
                    description="Wipe everything — accounts, categories, fixed expenses, regular expenses"
                    confirmMessage="Everything will be permanently deleted. This cannot be undone."
                    onReset={resetAll}
                />
                <ThemeChanger
                ></ThemeChanger>
            </div>
            
        </div>
    );
}