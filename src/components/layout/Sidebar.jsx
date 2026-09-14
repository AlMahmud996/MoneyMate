import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Lottie } from 'lottie-react';
import moneyMateLogo from '../../assets/images/Circle_M.json';


const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 border border-base-300 rounded-lg text-md ${isActive ? 'bg-primary  text-primary-content' : 'hover:bg-base-200'
    }`;

export default function Sidebar() {
    return (
        <aside className="w-60 min-h-screen bg-base-100 border-r border-base-300 p-4 flex flex-col">
            <Link to = "/" className="flex  items-center hover:scale-105 transition-opacity cursor-pointer">
                <span className="flex items-center text-3xl font-bold">
                    <Lottie
                        style={{ width: "40px", height: "40px" }}
                        src={moneyMateLogo}
                        loop
                        autoplay
                    />
                    <span>oney</span>
                    <span className="text-green-500">M</span>
                    <span>ate</span>
                </span>
            </Link>

            <nav className="flex flex-col  gap-1 py-4 flex-1">
                <NavLink to="/dashboard" className={linkClass}>
                    Dashboard
                </NavLink>

                <NavLink to="/account" className={linkClass}>
                    Account
                </NavLink>

                <NavLink to="/category" className={linkClass}>
                    Category
                </NavLink>

                <NavLink to="/category/fixed" className={linkClass}>
                    Fixed Expense
                </NavLink>

                <NavLink to="/regular-expense" className={linkClass}>
                    Regular Expense
                </NavLink>

                <NavLink to="/settings" className={linkClass}>
                    Settings
                </NavLink>
            </nav>

            <footer className="bg-base-300 text-base-content p-3 text-center text-xs rounded-lg">
                <p>
                    © {new Date().getFullYear()} Penta Global Ltd
                </p>
            </footer>

        </aside>
    );
}