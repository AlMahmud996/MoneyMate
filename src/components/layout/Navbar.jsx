import {Lottie} from 'lottie-react';
import moneyMateLogo from '../../assets/images/Circle_M.json';
import profile from '../../assets/images/_.jpeg';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm rounded-2xl px-6 mb-6">
      <div className="flex-1 flex items-center">
        <Lottie style={{ width: '28px', height: '28px' }} src={moneyMateLogo} loop autoplay />
        <span className="text-lg font-semibold tracking-tight">
          <span>oney</span>
          <span className="text-green-500">M</span>
          <span>ate</span>
        </span>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar avatar-placeholder">
            <div className="rounded-full w-10">
              <img src={profile} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
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
  );
}