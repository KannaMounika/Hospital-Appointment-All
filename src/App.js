// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; 
import {useAuth} from './context/AuthContext.jsx';
// --- Component Imports ---
import WelcomePage from './components/WelcomePage/WelcomePage.jsx'
import Register from './components/Register/Register.jsx';
import SignIn from './components/SignIn/SignIn';
import PatientDashboard from './components/PatientPortal/PatientDashboard.jsx'; 
// REMOVED: import Appontments from './components/PatientPortal/Appointment.jsx'; 
import BookAppointmentPage from './components/BookAppointment/BookAppointmentPage.jsx';
// --- NEW IMPORT ---
import UpcomingAppointmentsPage from './components/UpcomingAppointments/UpcomingAppointmentsPage.jsx';
// --- Placeholder Components ---
const AddRecordPage = () => <h1>Patient Portal: Add New Medical Record</h1>; 
const DoctorDashboard = () => <h1>Doctor Portal: To be built</h1>;




// 🚨 SIMPLIFIED Protected Route Wrapper: Only checks for isLoggedIn
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }
    // If logged in, render the child component (the dashboard/page)
    return children;
};


const App = () => {
    const { isLoggedIn } = useAuth();
    
    return (
        <Router>
            <Routes>
                
                {/* --- PUBLIC ROUTES --- */}
                <Route path="/" element={<WelcomePage/>} /> 
                <Route path="/register-page" element={<Register />} />
                <Route path="/sign-in" element={<SignIn />} /> 
                
                {/* SIMPLIFIED: MAIN DASHBOARD ROUTE */}
                <Route 
                    path="/dashboard" 
                    element={
                        isLoggedIn ? (
                            <Navigate to="/patient/dashboard" replace />
                        ) : (
                            <Navigate to="/sign-in" replace />
                        )
                    }
                />
                
                {/* 1. PATIENT DASHBOARD ROUTE */}
                <Route 
                    path="/patient/dashboard" 
                    element={
                        <ProtectedRoute>
                            <PatientDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* --- APPOINTMENT ROUTES --- */}

                {/* BOOK APPOINTMENT PAGE (Navigation target) */}
                <Route 
                    path="/patient/book-appointment" 
                    element={
                        <ProtectedRoute>
                            <BookAppointmentPage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* UPCOMING APPOINTMENTS PAGE (Replaced the placeholder Appontments) */}
                <Route 
                    path="/patient/appointments" 
                    element={
                        <ProtectedRoute>
                            {/* Replaced <Appontments/> with the new page: */}
                            <UpcomingAppointmentsPage/> 
                        </ProtectedRoute>
                    } 
                />

                {/* 2. STAFF DASHBOARD ROUTE */}
                {/* <Route 
                    path="/staff/dashboard" 
                    element={
                        <ProtectedRoute>
                            <StaffDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/staff/patients" 
                    element={
                        <ProtectedRoute>
                            <SPatientDashboard />
                        </ProtectedRoute>
                    } 
                /> */}
                
                {/* --- OTHER PROTECTED SUB-ROUTES --- */}
                {/* <Route 
                    path="/patient/records" 
                    element={
                        <ProtectedRoute>
                            <MedicalRecords /> 
                        </ProtectedRoute>
                    } 
                /> */}
                
                {/* <Route 
                    path="/staff/records" 
                    element={
                        <ProtectedRoute>
                            <MedicalRecords /> 
                        </ProtectedRoute>
                    } 
                /> */}
                
                <Route 
                    path="/patient/add-record" 
                    element={
                        <ProtectedRoute>
                            <AddRecordPage />
                        </ProtectedRoute>
                    } 
                />

                {/* --- CATCH-ALL ROUTE --- */}
                <Route path="*" element={<h1>404: Page Not Found</h1>} />
                
            </Routes>
        </Router>
    );
}

export default App;