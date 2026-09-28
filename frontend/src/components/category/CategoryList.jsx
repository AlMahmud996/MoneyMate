export default function CategoryList({ categories, onEdit, onDelete }) {
  if (!categories.length) return <p className="text-base-content/60">No categories yet.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => {
        return (
          <div key={cat.id} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">{cat.name}</h2>
              <p className="text-sm text-base-content/60">{cat.description}</p>
              <div className="card-actions justify-end mt-2">
                <button onClick={() => onEdit(cat)} className="btn btn-sm btn-outline">Edit</button>
                <button onClick={() => onDelete(cat.id)} className="btn btn-sm btn-error btn-outline">Delete</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}