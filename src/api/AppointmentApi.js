// // --- In src/api/AppointmentApi.js (FINAL, STABLE VERSION) ---

// import axios from "axios";
// const API_BASE_URL = 'https://localhost:7243/api'; 

// // Function to get the stored token from local storage
// const getAuthToken = () => localStorage.getItem('token');

// /**
//  * Fee Calculation Logic
//  * @param {string} specialization - The doctor's specialization.
//  * @returns {number} The calculated fee.
//  */
// const calculateFee = (specialization) => {
//     // Logic: General Doctor fee is 1000, all others are 1500.
//     if (specialization && specialization.toLowerCase().includes('general')) {
//         return 1000;
//     }
//     return 1500;
// };

// const fetchUserDetailsByEmail = async (patientEmail) => {
//     const token = getAuthToken();
//     if (!token) throw new Error('Authentication token missing or expired for User details lookup.');
    
//     try {
//         // CRITICAL FIX: Use the specific query endpoint: /api/Users?email={email}
        
//         const response = await axios.get(`${API_BASE_URL}/Users/email/${patientEmail}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//         });
//         console.log("API response:", response.data);
        
//         const responseData = response.data;

//         // CRITICAL FIX: Extracts the nested PatientDetails object (checks both PascalCase/camelCase)
//         const patientDetails = responseData.PatientDetails || responseData.patientDetails; 
        
//         if (!patientDetails) {
//              console.error("Received payload (patientDetails missing):", responseData);
//              throw new Error(`User details not found or payload structure invalid. Expected nested 'patientDetails'.`);
//         }
        
//         // Map the nested properties, checking for both casings
//         return {
//              firstName: patientDetails.FirstName || patientDetails.firstName,
//              lastName: patientDetails.LastName || patientDetails.lastName,
//              email: patientDetails.Email || patientDetails.email,
//         };
        
//     } catch (error) {
//         const status = error.response?.status;
//         const detail = error.response?.data?.title || error.message;
//         console.error("Error fetching User details by email:", error.response?.data || error);
        
//         throw new Error(`Failed to retrieve User details (Status: ${status || 'N/A'}). Detail: ${detail}`);
//     }
// };


// const fetchPatientIdByEmail = async (patientEmail) => {
//     const token = getAuthToken();
//     if (!token) throw new Error('Authentication token missing or expired for Patient ID lookup.');
    
//     try {
//         // Endpoint: /api/Patients/getByEmail/{email}
//         const url = `${API_BASE_URL}/Patients/getByEmail/${encodeURIComponent(patientEmail)}`;

//         const response = await axios.get(url, {
//              headers: { 'Authorization': `Bearer ${token}` }
//         }); 
        
//         const patientData = response.data;

//         if (!patientData || !patientData.patientId) {
//              throw new Error("Patient ID (patientId) not found in the response for the given email.");
//         }
        
//         return patientData.patientId;
        
//     } catch (error) {
//         const status = error.response?.status;
//         const detail = error.response?.data?.title || error.message;
//         console.error("Error fetching Patient ID by email:", error.response?.data || error);
//         throw new Error(`Failed to retrieve unique Patient ID (Status: ${status || 'N/A'}). Check token. Detail: ${detail}`);
//     }
// };

// export const fetchLoggedInPatientDetails = async (authUserData) => {
//     if (!authUserData || !authUserData.email) {
//         throw new Error("Authentication data is missing the required user email.");
//     }
    
//     const patientEmail = authUserData.email;
    
//     const [userDetails, patientId] = await Promise.all([
//         fetchUserDetailsByEmail(patientEmail), 
//         fetchPatientIdByEmail(patientEmail)
//     ]);
    
//     const combinedPatientData = {
//         ...userDetails, 
//         id: patientId, 
//     };

//     return combinedPatientData;
// };


// // --- Doctor Fetching (FIXED: AXIOS and TOKEN) ---
// export const fetchDoctors = async () => {
//     const token = getAuthToken(); 
//     if (!token) throw new Error('Authentication token missing for Doctor lookup.');

//     try {
//         const url = `${API_BASE_URL}/Doctors`; 

//         const response = await axios.get(url, {
//              headers: { 'Authorization': `Bearer ${token}` }
//         }); 
        
//         return response.data.map(doctor => ({
//             id: doctor.doctorId || doctor.DoctorId, 
//             email: doctor.email,
//             firstName: doctor.firstName, 
//             lastName: doctor.lastName,
//             specialization: doctor.specialization,
            
//             experience: doctor.yearOfRegistration ? 
//                 (new Date().getFullYear() - new Date(doctor.yearOfRegistration).getFullYear()) + ' years' : 
//                 '5+',
//             fee: calculateFee(doctor.specialization), 
//             rating: doctor.rating || 4.8 
//         }));
        
//     } catch (error) {
//         const status = error.response?.status;
//         const detail = error.response?.data?.title || error.message;
//         console.error("Error fetching doctors:", error.response?.data || error);
//         throw new Error(`API Error ${status || 'N/A'}: failed to fetch doctors. Detail: ${detail}`);
//     }
// };


// // --- Slot Fetching (FIXED: AXIOS and TOKEN) ---
// export const fetchAvailableSlots = async (doctorId, date) => {
//     const token = getAuthToken(); 
//     if (!token) throw new Error('Authentication token missing for time slot lookup.');
    
//     try {
//         const ENDPOINT = `/Appointment/available-timeslots`;
        
//         const response = await axios.get(`${API_BASE_URL}${ENDPOINT}`, {
//              params: { doctorId: doctorId, date: date },
//              headers: { 'Authorization': `Bearer ${token}` } // CRITICAL: Sends Token
//         });

//         const data = response.data;
//         console.log("Raw slot data:", response.data);
//         return data.map(slot => ({
//             id: slot.time_Slot_Id,
//             time: slot.start_Time.substring(0, 5) 
//         }));

//     } catch (error) {
//         const status = error.response?.status;
//         const detail = error.response?.data?.title || error.message;
//         console.error('Error fetching available time slots:', error.response?.data || error);
//         throw new Error(`API Error ${status || 'N/A'}: failed to fetch time slots. Detail: ${detail}`);
//     }
// };


// export const bookAppointment = async (payload) => {
//     const token = getAuthToken();
//     if (!token) throw new Error('Authentication token missing for appointment booking.');

//     const response = await axios.post(`${API_BASE_URL}/appointment/create`, payload, {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//     });
//     console.log(response.data);
//     return response.data;
// };
 
// // --- Fetch Patient Appointments (AXIOS and TOKEN) ---
// export const fetchPatientAppointments = async (patientId) => {
//     const token = localStorage.getItem('token'); // ✅ Get token from localStorage

//     if (!patientId || !token) {
//         throw new Error("Missing patient ID or token.");
//     }

//     try {
//         const response = await axios.get(`${API_BASE_URL}/appointment/patient/${patientId}`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching patient appointments:", error);
//         throw error;
//     }
// };

// export const cancelAppointment = async (appointmentId) => {
//     // The endpoint should match your controller route: /api/appointments/{id}
//     const CANCEL_APPOINTMENT_URL = `http://localhost:5000/api/appointments/${appointmentId}`; // Using Appointment ID
    
//     // NOTE: This assumes your Appointments controller is routed at /api/appointments

//     try {
//         const token = localStorage.getItem('token'); 
        
//         const response = await fetch(CANCEL_APPOINTMENT_URL, {
//             method: 'DELETE', // <-- CRITICAL: Must be DELETE to match [HttpDelete("{id}")]
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`, // Include token for authentication
//             },
//         });

//         if (response.status === 404) {
//              throw new Error("Appointment not found. It may be already cancelled or completed.");
//         }

//         if (!response.ok) {
//             try {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `Failed to cancel appointment. Status: ${response.status}`);
//             } catch {
//                 throw new Error(`Failed to cancel appointment. Status: ${response.statusText}`);
//             }
//         }

//         // Backend returns 200 OK on success, so we return true.
//         return true; 
        
//     } catch (error) {
//         console.error("Error during appointment cancellation:", error);
//         // Throw a helpful message, reminding the user to check the server
//         throw new Error(error.message || "Network connection failed. Ensure the API server is running on localhost:5000."); 
//     }
// };
// --- In src/api/AppointmentApi.js (FINAL, STABLE VERSION) ---

import axios from "axios";

// CRITICAL FIX: Base URL set to HTTPS and 7243 based on Swagger/Error feedback
const API_BASE_URL = 'https://localhost:7243/api'; 

// Function to get the stored token from local storage
const getAuthToken = () => localStorage.getItem('token');

/**
 * Fee Calculation Logic (Kept as is, as it's helper logic)
 * @param {string} specialization - The doctor's specialization.
 * @returns {number} The calculated fee.
 */
const calculateFee = (specialization) => {
    // Logic: General Doctor fee is 1000, all others are 1500.
    if (specialization && specialization.toLowerCase().includes('general')) {
        return 1000;
    }
    return 1500;
};

const fetchUserDetailsByEmail = async (patientEmail) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token missing or expired for User details lookup.');
    
    try {
        // Endpoint: /api/Users/email/{email}
        const response = await axios.get(`${API_BASE_URL}/Users/email/${patientEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("API response:", response.data);
        
        const responseData = response.data;

        // Extracts the nested PatientDetails object (checks both PascalCase/camelCase)
        const patientDetails = responseData.PatientDetails || responseData.patientDetails; 
        
        if (!patientDetails) {
             console.error("Received payload (patientDetails missing):", responseData);
             throw new Error(`User details not found or payload structure invalid. Expected nested 'patientDetails'.`);
        }
        
        // Map the nested properties, checking for both casings
        return {
             firstName: patientDetails.FirstName || patientDetails.firstName,
             lastName: patientDetails.LastName || patientDetails.lastName,
             email: patientDetails.Email || patientDetails.email,
        };
        
    } catch (error) {
        const status = error.response?.status;
        const detail = error.response?.data?.title || error.message;
        console.error("Error fetching User details by email:", error.response?.data || error);
        
        throw new Error(`Failed to retrieve User details (Status: ${status || 'N/A'}). Detail: ${detail}`);
    }
};


const fetchPatientIdByEmail = async (patientEmail) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token missing or expired for Patient ID lookup.');
    
    try {
        // Endpoint: /api/Patients/getByEmail/{email}
        const url = `${API_BASE_URL}/Patients/getByEmail/${encodeURIComponent(patientEmail)}`;

        const response = await axios.get(url, {
             headers: { 'Authorization': `Bearer ${token}` }
        }); 
        
        const patientData = response.data;

        if (!patientData || !patientData.patientId) {
             throw new Error("Patient ID (patientId) not found in the response for the given email.");
        }
        
        return patientData.patientId;
        
    } catch (error) {
        const status = error.response?.status;
        const detail = error.response?.data?.title || error.message;
        console.error("Error fetching Patient ID by email:", error.response?.data || error);
        throw new Error(`Failed to retrieve unique Patient ID (Status: ${status || 'N/A'}). Check token. Detail: ${detail}`);
    }
};

export const fetchLoggedInPatientDetails = async (authUserData) => {
    if (!authUserData || !authUserData.email) {
        throw new Error("Authentication data is missing the required user email.");
    }
    
    const patientEmail = authUserData.email;
    
    const [userDetails, patientId] = await Promise.all([
        fetchUserDetailsByEmail(patientEmail), 
        fetchPatientIdByEmail(patientEmail)
    ]);
    
    const combinedPatientData = {
        ...userDetails, 
        id: patientId, 
    };

    return combinedPatientData;
};


// --- Doctor Fetching ---
export const fetchDoctors = async () => {
    const token = getAuthToken(); 
    if (!token) throw new Error('Authentication token missing for Doctor lookup.');

    try {
        const url = `${API_BASE_URL}/Doctors`; 

        const response = await axios.get(url, {
             headers: { 'Authorization': `Bearer ${token}` }
        }); 
        
        return response.data.map(doctor => ({
             id: doctor.doctorId || doctor.DoctorId, 
             email: doctor.email,
             firstName: doctor.firstName, 
             lastName: doctor.lastName,
             specialization: doctor.specialization,
             
             experience: doctor.yearOfRegistration ? 
                 (new Date().getFullYear() - new Date(doctor.yearOfRegistration).getFullYear()) + ' years' : 
                 '5+',
             fee: calculateFee(doctor.specialization), 
             rating: doctor.rating || 4.8 
        }));
        
    } catch (error) {
        const status = error.response?.status;
        const detail = error.response?.data?.title || error.message;
        console.error("Error fetching doctors:", error.response?.data || error);
        throw new Error(`API Error ${status || 'N/A'}: failed to fetch doctors. Detail: ${detail}`);
    }
};


// --- Slot Fetching ---
export const fetchAvailableSlots = async (doctorId, date) => {
    const token = getAuthToken(); 
    if (!token) throw new Error('Authentication token missing for time slot lookup.');
    
    try {
        const ENDPOINT = `/Appointment/available-timeslots`;
        
        const response = await axios.get(`${API_BASE_URL}${ENDPOINT}`, {
             params: { doctorId: doctorId, date: date },
             headers: { 'Authorization': `Bearer ${token}` } // Sends Token
        });

        const data = response.data;
        console.log("Raw slot data:", response.data);
        return data.map(slot => ({
             id: slot.time_Slot_Id,
             time: slot.start_Time.substring(0, 5) 
        }));

    } catch (error) {
        const status = error.response?.status;
        const detail = error.response?.data?.title || error.message;
        console.error('Error fetching available time slots:', error.response?.data || error);
        throw new Error(`API Error ${status || 'N/A'}: failed to fetch time slots. Detail: ${detail}`);
    }
};


export const bookAppointment = async (payload) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token missing for appointment booking.');

    const response = await axios.post(`${API_BASE_URL}/Appointment/create`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    console.log(response.data);
    return response.data;
};
 
// --- Fetch Patient Appointments ---
export const fetchPatientAppointments = async (patientId) => {
    const token = localStorage.getItem('token'); 

    if (!patientId || !token) {
        throw new Error("Missing patient ID or token.");
    }

    try {
        // FIX: Ensure correct path for Appointment controller is used: /api/Appointment/patient/{id}
        const response = await axios.get(`${API_BASE_URL}/Appointment/patient/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching patient appointments:", error);
        throw error;
    }
};

/**
 * FINAL FIX: Cancellation function is converted to use AXIOS and the correct secure URL (7243).
 * It uses the DELETE method, matching the C# controller ([HttpDelete("{id}")]).
 */
export const cancelAppointment = async (appointmentId) => {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token missing for appointment cancellation.');

    // FIX: Use the secure base URL (7243) and the correct controller route
    const CANCEL_APPOINTMENT_URL = `${API_BASE_URL}/Appointment/${appointmentId}`; 
    
    try {
        // Using axios.delete for consistency and simplified error handling
        const response = await axios.delete(CANCEL_APPOINTMENT_URL, {
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
        });

        // Axios throws an error for 4xx/5xx status codes, so we only handle successful 2xx codes here.
        // The backend returns 200 OK on success, which means response.data contains the message.
        return response.data; 
        
    } catch (error) {
        const status = error.response?.status;
        const detail = error.response?.data?.message || error.message;
        
        console.error("Error during appointment cancellation:", error);
        
        // Throw a specific error based on the status if available, otherwise suggest server check
        if (status === 404) {
            throw new Error(`Cancellation failed. Appointment ${appointmentId} not found or already cancelled.`);
        }
        
        throw new Error(`Cancellation failed (Status: ${status || 'N/A'}). Check API server (https://localhost:7243). Detail: ${detail}`); 
    }
};