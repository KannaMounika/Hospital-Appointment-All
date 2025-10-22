// src/components/PatientPortal/PatientNavbar.jsx

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Using Fa icons
import './PatientNavbar.css'; 
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

const PatientNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Access user data and logout function from AuthContext
    const { user, logout } = useAuth();
    
    // Tabs matching the Patient Dashboard design tabs
    const tabs = [
        { name: 'Dashboard', path: '/patient/dashboard' }, 
        { name: 'Medical History', path: '/patient/records' },
        { name: 'Appointments', path: '/patient/appointments' },
        { name: 'Book Appointment', path: '/patient/book-appointment' },
        { name: 'Notifications', path: '/patient/notifications' },
        { name: 'Profile', path: '/patient/profile' }
    ];

    //  Dynamic Name Logic:
    // Safely checks if user exists, then uses the part of the email before the @ symbol.
    const patientName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}` // e.g., Mounika.Kanna
    : user?.email 
        ? user.email.split('@')[0] 
        : 'Patient User';

    const isActive = (path) => location.pathname === path;

    // 🎯 Sign Out Logic: Calls the context's logout function and redirects
    // const handleSignOut = () => {
    //     logout(); // Clears token and user state in AuthContext
    //     navigate('/sign-in'); // Redirects to the sign-in page
    // };
     
    const handleSignOut = () => {
    // Clear patient-related data from localStorage
    localStorage.removeItem('patientId');

    // Optional: Clear other patient-related items if stored
    // localStorage.removeItem('patientName'); // if used

    // Call the context logout function
    logout(); // This should clear user and token from context

    // Redirect to login page
    navigate('/sign-in');
};

    return (
        <div className="patient-navbar"> 
            
            <div className="navbar-left">
                {/* Tab Links */}
                <div className="nav-links">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.name}
                            to={tab.path}
                            className={isActive(tab.path) ? 'patient-active' : 'patient-link'}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="navbar-right">
                <FaUserCircle size={32} color="#00796b" /> {/* Brand green icon */}
                <div className="profile-info">
                    {/* 🎯 Dynamic Name Display */}
                    <span className="fw-bold">{patientName}</span>
                    <small className="text-muted">Patient User</small>
                </div>
                {/* Button calls the proper sign out handler */}
                <button className="patient-signout-btn" onClick={handleSignOut}>
                    <FaSignOutAlt className="me-1" /> Sign Out
                </button>
            </div>
        </div>
    );
};

export default PatientNavbar;