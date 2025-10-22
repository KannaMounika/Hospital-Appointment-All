import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {fetchLoggedInPatientDetails } from '../api/AppointmentApi';
//  UPDATE THIS: Ensure this matches the port your C# backend is running on (e.g., 7243)
const API_BASE_URL = 'https://localhost:7243/api'; 
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
// State to hold the JWT token (read from local storage on initial load)
const [token, setToken] = useState(localStorage.getItem('token') || null);

// State to hold basic user info (email, role). 
const [user, setUser] = useState(null); 

// State to display any API error messages
const [error, setError] = useState(null);
// 🚨 FIX: REMOVE THE PROBLEM CODE! The user state should ONLY be set by the login function.
/*  useEffect(() => {
 if (token) {
 // This code block is buggy because email and role are not defined here.
    setUser({email,role}); 
 }
 }, [token]);
 */


// const login = async (email, password, claimedRole) => {
//  setError(null); 
//  try {
//     // 1. LOGIN ATTEMPT
//     const response = await axios.post(`${API_BASE_URL}/Users/login`, {
//         email,
//         password,
//         claimedRole 
//     });
    
//     const { token, role } = response.data;
    
//     // Store the token immediately (important for the next API call)
//     localStorage.setItem('token', token);
//     setToken(token);
    
//     let firstName = null;
//     let lastName = null;

//     // 2. FETCH USER DETAILS (Only if login succeeded and we need the name)
//     if (role === 'Patient') {
//         try {
//             // 🚨 ASSUMPTION: This endpoint returns an array of all users/patients 
//             // from which we need to filter, or a specific endpoint like /api/Patients/details
//             // We'll assume a generic GET to filter the logged-in user by email.
            
//             // NOTE: You may need to add an authorization header to this GET request 
//             // if your backend requires it (which it should).
//             const userDetailsResponse = await axios.get(`${API_BASE_URL}/Users`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}` // Assuming you need a token
//                 }
//             });

//             // Find the logged-in user in the list by email
//             const currentUser = userDetailsResponse.data.find(u => u.email.toLowerCase() === email.toLowerCase());
//             if (currentUser?.id) {
//                 localStorage.setItem('patientId', currentUser.id);
//             }
//             if (currentUser) {
//                 firstName = currentUser.firstName;
//                 lastName = currentUser.lastName;
//             }

//         } catch (detailErr) {
//             console.error("Failed to fetch user details after login:", detailErr);
//             // Non-critical error: Continue with just email and role
//         }
//     }
    
//     // 3. SET FINAL USER OBJECT
//     setUser({ 
//        email, 
//        role,
//        firstName, 
//        lastName 
//     }); 
    
//     return { success: true };
    
//  } catch (err) {
//     // ... (error handling remains the same) ...
//  }
// };
const login = async (email, password, claimedRole) => {
    setError(null);
    try {
        const response = await axios.post(`${API_BASE_URL}/Users/login`, {
            email,
            password,
            claimedRole
        });

        const { token, role } = response.data;
        localStorage.setItem('token', token);
        setToken(token);

        let firstName = null;
        let lastName = null;
        let patientId = null;

        if (role === 'Patient') {
            try {
                const patientData = await fetchLoggedInPatientDetails ({ email });
                firstName = patientData.firstName;
                lastName = patientData.lastName;
                patientId = patientData.id;

                if (patientId) {
                    localStorage.setItem('patientId', patientId); // ✅ Store patientId
                }
            } catch (detailErr) {
                console.error("Failed to fetch patient details:", detailErr);
            }
        }

        setUser({
            email,
            role,
            firstName,
            lastName
        });

        return { success: true };
    } catch (err) {
        console.error("Login failed:", err);
        return { success: false, message: "Login failed. Please check credentials." };
    }
};

// 3. The Logout Function
// const logout = () => {
//  setToken(null);
//  setUser(null);
//  localStorage.removeItem('token');
// };
const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('patientId'); // ✅ Clear patient ID on logout
};
// 4. The Value object provided to consuming components
const value = {
 token,
 user,
 error,
 login,
 logout,
 isAuthenticated: !!token, // Convenience boolean for checking auth status
};
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Custom Hook for easy access in components
export const useAuth = () => {
return useContext(AuthContext);
};