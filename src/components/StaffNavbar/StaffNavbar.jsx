import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import './StaffNavbar.css';

const StaffNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: 'Dashboard', path: '/staff/dashboard' },
    { name: 'Patients', path: '/staff/patients' },
    { name: 'Appointments', path: '/staff/appointments' },
    { name: 'Records', path: '/staff/records' },
    { name: 'Prescriptions', path: '/staff/prescriptions' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('staffName');
    navigate('/');
  };

  return (
    <div className="staff-navbar">
      <div className="navbar-left">
        <div className="nav-links">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={isActive(tab.path) ? 'active' : ''}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        <UserCircle size={32} color="#2e7d32" />
        <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
};

export default StaffNavbar;