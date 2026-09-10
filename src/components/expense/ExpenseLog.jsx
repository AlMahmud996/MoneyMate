export default function ExpenseLog({ expenses, categories, accounts, onEdit, onDelete }) {
  if (!expenses.length) return <p className="text-base-content/60">No expenses yet.</p>;

  const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));
  const grouped = [];
  sorted.forEach((exp) => {
    const group = grouped.find((g) => g.date === exp.date);
    if (group) group.items.push(exp);
    else grouped.push({ date: exp.date, items: [exp] });
  });

  return (
    <div className="flex flex-col gap-6">
      {grouped.map(({ date, items }) => (
        <div key={date}>
          <h3 className="font-semibold mb-2">
            {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </h3>
          <div className="flex flex-col gap-2">
            {items.map((exp) => {
              const category = categories.find((c) => c.id === exp.categoryId);
              const account = accounts.find((a) => a.id === exp.accountId);
              return (
                <div key={exp.id} className="flex justify-between items-center bg-base-100 shadow-sm rounded-lg px-4 py-3">
                  <div>
                    <p className="font-medium">{exp.name}</p>
                    <p className="text-xs text-base-content/60">{category?.name} · {account?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-error">-৳{exp.amount}</span>
                    <button onClick={() => onEdit(exp)} className="btn btn-xs btn-outline">Edit</button>
                    <button onClick={() => onDelete(exp.id)} className="btn btn-xs btn-error btn-outline">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}