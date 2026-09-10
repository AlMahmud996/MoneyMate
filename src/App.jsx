import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from '../src/pages/Dashboard';
import AccountPage from './pages/AccountPage';
import CategoryPage from './pages/CategoryPage';
import FixedExpensePage from './pages/FixedExpensePage';
import RegularExpensePage from './pages/RegularExpensePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/fixed" element={<FixedExpensePage />} />
        <Route path="/regular-expense" element={<RegularExpensePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}