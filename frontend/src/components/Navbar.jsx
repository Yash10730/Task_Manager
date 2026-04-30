import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Folder, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>TeamTasks</h2>
      </div>
      <ul className="navbar-nav">
        <li>
          <Link to="/dashboard"><LayoutDashboard size={18}/> Dashboard</Link>
        </li>
        <li>
          <Link to="/projects"><Folder size={18}/> Projects</Link>
        </li>
      </ul>
      <div className="navbar-user">
        <span className="user-name">{user?.name}</span>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={18}/> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
