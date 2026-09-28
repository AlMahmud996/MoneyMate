import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from '../src/pages/Dashboard';
import CheckWeather from './pages/CheckWeather';
import AccountPage from './pages/AccountPage';
import CategoryPage from './pages/CategoryPage';
import FixedExpensePage from './pages/FixedExpensePage';
import RegularExpensePage from './pages/RegularExpensePage';
import SettingsPage from './pages/SettingsPage';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function App() {
  
  const darkMode = useSelector((state) => state.theme.darkMode);
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode])

  return (
    <Routes>
      
        <Route path = "/" element = {<LandingPage />  } />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/CheckWeather" element={<CheckWeather/>} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/category/fixed" element={<FixedExpensePage />} />
          <Route path="/regular-expense" element={<RegularExpensePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
  
      
    </Routes>
  );
}