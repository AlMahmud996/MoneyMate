export default function AccountList({ accounts, onCardClick, onDelete }) {
  if (!accounts.length) return <p className="text-base-content/60">No accounts yet.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map((acc) => (
        <div
          key={acc.id}
          onClick={() => onCardClick(acc)}
          className="card bg-base-100 shadow-md cursor-pointer hover:shadow-lg transition"
        >
          <div className="card-body">
            <h2 className="card-title capitalize">{acc.name}</h2>
            <span className="badge badge-outline capitalize w-fit">{acc.type}</span>
            <p className="text-2xl font-bold mt-2">৳{acc.balance.toLocaleString()}</p>
            <div className="card-actions justify-end mt-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => onDelete(acc.id)} className="btn btn-sm btn-error btn-outline">Delete</button>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="badge badge-outline capitalize w-fit">{acc.type}</span>
            {acc.isSalaryAccount && <span className="badge badge-success badge-sm">Salary account</span>}
          </div>
        </div>
      ))}
    </div>
  );
}