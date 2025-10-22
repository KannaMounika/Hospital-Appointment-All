// --- In src/api/AppointmentApi.js (or PatientApi.js) ---

// Assuming this is your base fetch utility
const API_BASE_URL = '/api'; 

// **New function to fetch logged-in patient details**
export const fetchLoggedInPatient = async () => {
    // In a real app, this endpoint would use the session/auth token
    // to identify the logged-in user.
    const response = await fetch(`${API_BASE_URL}/patient/details`); 
    
    if (!response.ok) {
        throw new Error('Failed to fetch logged-in patient details.');
    }
    
    // Assuming the response body is JSON like: { id: 5, name: "Jane Doe", ... }
    const patientData = await response.json(); 
    return patientData;
};
