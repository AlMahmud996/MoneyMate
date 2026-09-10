import { getCurrentMonth } from '../../utils/date';

export default function UnpaidFixedExpenses({ fixedExpenses, categories }) {
  const currentMonth = getCurrentMonth();
  const unpaid = fixedExpenses.filter(
    (fx) => !(fx.payments || []).some((p) => p.month === currentMonth)
  );

  if (!unpaid.length) return <p className="text-base-content/60">Everything is paid this month 🎉</p>;

  return (
    <div className="flex flex-col gap-2">
      {unpaid.map((fx) => {
        const category = categories.find((c) => c.id === fx.categoryId);
        return (
          <div key={fx.id} className="flex justify-between items-center bg-base-100 shadow-sm rounded-lg px-4 py-3">
            <div>
              <p className="font-medium">{fx.name}</p>
              <p className="text-xs text-base-content/60">{category?.name}</p>
            </div>
            <span className="font-semibold text-warning">৳{fx.target}</span>
          </div>
        );
      })}
    </div>
  );
}