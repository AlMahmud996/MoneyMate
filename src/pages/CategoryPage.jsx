import { useState } from 'react';
import { useAppContext } from '../contexts/appContext';
import Modal from '../components/shared/Modal';
import CategoryForm from '../components/category/CategoryForm';
import CategoryList from '../components/category/CategoryList';

export default function CategoryPage() {
  const { categories, accounts, addCategory, updateCategory, deleteCategory } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => { setEditing(null); setIsOpen(true); };
  const openEdit = (cat) => { setEditing(cat); setIsOpen(true); };
  const close = () => setIsOpen(false);

  const handleSubmit = (form) => {
    if (editing) updateCategory({ ...editing, ...form });
    else addCategory(form);
    close();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category</h1>
        <button onClick={openAdd} className="btn btn-primary">+ Add Category</button>
      </div>
      <CategoryList
        categories={categories}
        accounts={accounts}
        onEdit={openEdit}
        onDelete={(id) => deleteCategory({ id })}
      />
      <Modal isOpen={isOpen} onClose={close} title={editing ? 'Edit Category' : 'Add Category'}>
        <CategoryForm key={editing?.id ?? 'new'} accounts={accounts} initialValues={editing} onSubmit={handleSubmit} onCancel={close} />
      </Modal>
    </div>
  );
}