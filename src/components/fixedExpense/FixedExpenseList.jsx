import FixedExpenseCard from './FixedExpenseCard';

export default function FixedExpenseList({ fixedExpenses, categories, onPay, onEdit, onDelete }) {
  if (!fixedExpenses.length) return <p className="text-base-content/60">No fixed expenses yet.</p>;

  const grouped = categories
    .map((cat) => ({ category: cat, items: fixedExpenses.filter((fx) => fx.categoryId === cat.id) }))
    .filter((g) => g.items.length > 0);
  return (
    <div className="flex flex-col gap-6">
      {grouped.map(({ category, items }) => (
        <div key={category.id}>
          <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((fx) => (
              <FixedExpenseCard key={fx.id} fixedExpense={fx} onPay={onPay} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}