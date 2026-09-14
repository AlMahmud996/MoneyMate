import { useAppContext } from '../contexts/appContext';
import profile from '../assets/images/_.jpeg';
import { motion } from 'motion/react';
import UnpaidFixedExpenses from '../components/dashboard/UnpaidFixedExpenses';
import CategorySpendChart from '../components/dashboard/CategorySpendChart';
import AccountBalanceChart from '../components/dashboard/AccountBalanceChart';
import backgroundDash from '../assets/images/background.jpg'

export default function Dashboard() {
    const { accounts, categories, expenses, fixedExpenses } = useAppContext();

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const totalFixedTarget = fixedExpenses.reduce((s, f) => s + f.target, 0);

    const totalTarget = 0
    console.log('totalTarget:', totalTarget);

    const categorySpend = categories.map((cat) => {
        const regularSpent = expenses
            .filter((e) => e.categoryId === cat.id)
            .reduce((s, e) => s + e.amount, 0);

        const fixedSpent = fixedExpenses
            .filter((fx) => fx.categoryId === cat.id)
            .reduce((sum, fx) => sum + (fx.payments || []).reduce((s, p) => s + p.amount, 0), 0);

        return { ...cat, spent: regularSpent + fixedSpent };
    });


    const grouped = categories
        .map((cat) => ({ category: cat, items: fixedExpenses.filter((fx) => fx.categoryId === cat.id) }))
        .filter((g) => g.items.length > 0);
    console.log('grouped:', grouped);

    return (
        <div className="relative min-h-screen overflow-hidden">
            <img
                src={backgroundDash}
                alt=""
                className="absolute inset-0 w-full h-full object-cover -z-10"
            />
            <div className="navbar rounded-2xl bg-neutral border-green-300 border-b px-6 ">
                <div className="flex justify-between items-center w-full">
                    <motion.h1 animate={{ y: [-20, 20, -20] }}
                        transition={{ duration: 6, repeat: Infinity }} className="text-3xl font-bold text-neutral-content m-6">Dash<span className="text-green-500">B</span>oard</motion.h1>
                    <div className="flex-none flex items-center gap-3">
                        <button className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none">
                            Check Weather
                        </button>
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar avatar-placeholder"
                            >
                                <div className="rounded-full w-10">
                                    <img
                                        src={profile}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-44 p-2 shadow"
                            >
                                <li><a>Profile</a></li>
                                <li><a>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-8">
                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-title">Total Balance</div>
                    <div className="stat-value">৳{totalBalance.toLocaleString()}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-title">Accounts</div>
                    <div className="stat-value">{accounts.length}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-title">Fixed Target Total</div>
                    <div className="stat-value">৳{totalFixedTarget.toLocaleString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 m-8 mt-0">
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title text-base">Category-wise Spending</h2>
                        <CategorySpendChart categorySpend={categorySpend} />
                    </div>
                </div>
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title text-base">Account Balance Breakdown</h2>
                        <AccountBalanceChart accounts={accounts} />
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-semibold mb-3">Spending vs Budget</h2>
            <div className="flex flex-col gap-3">
                {categorySpend.map((cat) => {

                    // console.log('cat:', cat);
                    console.log('totalTarget:', grouped.reduce((sum, g) => g.category.id === cat.id ? g.items.reduce((s, fx) => s + fx.target, 0) : sum, 0));
                    const pct = cat.budgetTarget ? Math.min(100, Math.round((cat.spent / totalTarget) * 100)) : 0;
                    return (
                        <div key={cat.id}>
                            <div className="flex justify-between text-sm mb-1">
                                <span>{cat.name}</span>
                                <span>৳{cat.spent} / ৳{totalTarget}</span>
                            </div>
                            <progress
                                className={`progress ${pct >= 100 ? 'progress-error' : 'progress-primary'} w-full`}
                                value={pct}
                                max="100"
                            ></progress>
                        </div>
                    );
                })}
            </div>

            <h2 className="text-lg font-semibold mb-3 mt-8">Unpaid Fixed Expenses (This Month)</h2>
            <UnpaidFixedExpenses fixedExpenses={fixedExpenses} categories={categories} />
        </div>
    );
}