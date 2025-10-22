// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, FileText, Plus } from 'lucide-react';
// import PatientNavbar from './PatientNavbar';
// import InternalLayout from '../Layout/InternalLayout';
// import { fetchPatientAppointments } from '../../api/AppointmentApi';
// import './PatientDashboard.css';

// // -----------------------------------------------------------
// // HELPER FUNCTION: Get Time from Slot ID (Required for accurate time check)
// // Assuming this map is correct based on your previous component logic.
// // -----------------------------------------------------------
// const getTimeFromSlotId = (slotId) => {
//     const slotMap = {
//         1: '09:00', 2: '09:30', 3: '10:00', 4: '10:30', 
//         5: '11:00', 6: '11:30', 7: '12:00', 8: '12:30', 
//         9: '13:00', 10: '13:30' // Use 24-hour format
//     };
//     return slotMap[slotId] || '00:00'; 
// };

// // -----------------------------------------------------------
// // HELPER FUNCTION: Check if appointment is Upcoming (Today or Future)
// // -----------------------------------------------------------
// const isUpcoming = (appointmentDateString, timeSlotId) => {
//     if (!appointmentDateString || !timeSlotId) return false;
    
//     const timeString = getTimeFromSlotId(timeSlotId);
//     // Combine date and time to create a precise datetime object
//     const appointmentDateTime = new Date(`${appointmentDateString} ${timeString}`);
//     const now = new Date();
    
//     // Check if appointment is NOW or in the FUTURE (time-based comparison)
//     return appointmentDateTime >= now;
// };


// const patientInfo = {
//     medicalRecords: 3, // You can make this dynamic later
// };

// const PatientDashboard = () => {
//     const navigate = useNavigate();

//     const [appointments, setAppointments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const handleQuickAction = (path) => {
//         navigate(path);
//     };

    
//     useEffect(() => {
//         const loadAppointments = async () => {
//             const patientId = localStorage.getItem('patientId');
//             if (!patientId) {
//                 setError("Patient ID missing.");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const data = await fetchPatientAppointments(patientId);
//                 // The API returns the raw appointment objects.
//                 // Assuming it has properties like appointmentDate (YYYY-MM-DD) and time_Slot_Id.
//                 setAppointments(data || []); // ✅ Store full list
//             } catch (err) {
//                 console.error("Error fetching appointments:", err);
//                 setError("Failed to load appointments.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadAppointments();
//     }, []);

//     // -----------------------------------------------------------
//     // DERIVED STATE: Calculate the Upcoming Appointments count
//     // -----------------------------------------------------------
//     const upcomingCount = appointments.filter(appt => 
//         isUpcoming(appt.appointmentDate, appt.time_Slot_Id)
//     ).length;

    
//     return (
//         <InternalLayout>
//             <PatientNavbar navigate={navigate} />

//             <div className="dashboard">
//                 <div className="dashboard-content">
//                     {loading ? (
//                         <p>Loading dashboard...</p>
//                     ) : error ? (
//                         <p className="error-message">{error}</p>
//                     ) : (
//                         <>
//                             {/* Summary Cards */}
//                             <div className="summary-cards">
//                                 {/* Total Appointments */}
//                                 <div
//                                     className="card clickable-card"
//                                     onClick={() => handleQuickAction('/patient/appointments')}
//                                     style={{ cursor: 'pointer' }}
//                                 >
//                                     <Calendar className="icon text-primary" />
//                                     <div className="appointment-summary-box">
                                        
//                                         <p>Total Appointments</p>
                                        
//                                         {/* Total Count is Correct */}
//                                         <h3>{appointments.length}</h3>
//                                         <small>
//                                             {/* MODIFIED: Use the calculated upcomingCount */}
//                                             {upcomingCount} upcoming
//                                         </small>

//                                     </div>
//                                 </div>

//                                 {/* Medical Records */}
//                                 <div
//                                     className="card clickable-card"
//                                     onClick={() => handleQuickAction('/patient/records')}
//                                     style={{ cursor: 'pointer' }}
//                                 >
//                                     <FileText className="icon text-success" />
//                                     <div>
//                                         <p>Medical Records</p>
//                                         <h3>{patientInfo.medicalRecords}</h3>
//                                         <small>Total records</small>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Quick Actions */}
//                             <div className="quick-actions">
//                                 <h2><Plus className="icon" /> Quick Actions</h2>
//                                 <div className="actions">
//                                     <button
//                                         className="action-btn"
//                                         onClick={() => handleQuickAction('/patient/book-appointment')}
//                                     >
//                                         <Calendar className="icon" />
//                                         <span>Book Appointment</span>
//                                         <small>Schedule with our doctors</small>
//                                     </button>

//                                     <button
//                                         className="action-btn"
//                                         onClick={() => handleQuickAction('/patient/add-record')}
//                                     >
//                                         <FileText className="icon" />
//                                         <span>Add Medical Record</span>
//                                         <small>Update your health information</small>
//                                     </button>
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </InternalLayout>
//     );
// };

// export default PatientDashboard;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Plus } from 'lucide-react';
import PatientNavbar from './PatientNavbar';
import InternalLayout from '../Layout/InternalLayout';
import { fetchPatientAppointments } from '../../api/AppointmentApi';
import './PatientDashboard.css';

// -----------------------------------------------------------
// HELPER FUNCTION: Get Time from Slot ID (Required for accurate time check)
// -----------------------------------------------------------
const getTimeFromSlotId = (slotId) => {
    const slotMap = {
        1: '09:00', 2: '09:30', 3: '10:00', 4: '10:30', 
        5: '11:00', 6: '11:30', 7: '12:00', 8: '12:30', 
        9: '13:00', 10: '13:30' // Use 24-hour format
    };
    return slotMap[slotId] || '00:00'; 
};

// -----------------------------------------------------------
// HELPER FUNCTION: Check if appointment is truly UPCOMING (Confirmed + Future/Ongoing)
// -----------------------------------------------------------
const isUpcoming = (appointmentDateString, timeSlotId, status) => {
    // 1. Exclude if already Cancelled
    if (status === 'Cancelled') return false; 
    
    // 2. Check if the time has passed
    if (!appointmentDateString || !timeSlotId) return false;
    
    const timeString = getTimeFromSlotId(timeSlotId);
    const appointmentDateTime = new Date(`${appointmentDateString} ${timeString}`);
    const now = new Date();
    
    // An appointment is 'Upcoming' if it has not yet completed (i.e., time is now or future)
    // Note: We are assuming your backend data provides a 'status' field (e.g., 'Confirmed', 'Completed', 'Cancelled')
    return appointmentDateTime >= now;
};


const patientInfo = {
    medicalRecords: 3, // Can be made dynamic later
};

const PatientDashboard = () => {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleQuickAction = (path) => {
        navigate(path);
    };

    
    useEffect(() => {
        const loadAppointments = async () => {
            const patientId = localStorage.getItem('patientId');
            if (!patientId) {
                setError("Patient ID missing.");
                setLoading(false);
                return;
            }

            try {
                // Fetch the raw data from the API
                const data = await fetchPatientAppointments(patientId);
                // The API returns the raw appointment objects.
                setAppointments(data || []); 
            } catch (err) {
                console.error("Error fetching appointments:", err);
                // Use a generic error message for presentation
                setError("Failed to load dashboard data. Please ensure the API server is running."); 
            } finally {
                setLoading(false);
            }
        };

        loadAppointments();
    }, []);

    // -----------------------------------------------------------
    // DERIVED STATE: Calculate counts based on fetched appointments
    // -----------------------------------------------------------
    
    const upcomingCount = appointments.filter(appt => 
        // Use the isUpcoming helper, passing the required fields
        isUpcoming(appt.appointmentDate, appt.time_Slot_Id, appt.status || 'Confirmed')
    ).length;

    const cancelledCount = appointments.filter(appt => 
        (appt.status || '').toLowerCase() === 'cancelled'
    ).length;
    
    // -----------------------------------------------------------

    return (
        <InternalLayout>
            <PatientNavbar navigate={navigate} />

            <div className="dashboard">
                <div className="dashboard-content">
                    {loading ? (
                        <p>Loading dashboard...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <div className="summary-cards">
                                {/* Total Appointments */}
                                <div
                                    className="card clickable-card"
                                    onClick={() => handleQuickAction('/patient/appointments')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Calendar className="icon text-primary" />
                                    <div className="appointment-summary-box">
                                        
                                        <p>Total Appointments</p>
                                        
                                        {/* Total Count is Correct */}
                                        <h3>{appointments.length}</h3>
                                        <small>
                                            {/* MODIFIED: Display Upcoming and Cancelled counts */}
                                            {upcomingCount} upcoming | {cancelledCount} cancelled
                                        </small>

                                    </div>
                                </div>

                                {/* Medical Records */}
                                <div
                                    className="card clickable-card"
                                    onClick={() => handleQuickAction('/patient/records')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <FileText className="icon text-success" />
                                    <div>
                                        <p>Medical Records</p>
                                        <h3>{patientInfo.medicalRecords}</h3>
                                        <small>Total records</small>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="quick-actions">
                                <h2><Plus className="icon" /> Quick Actions</h2>
                                <div className="actions">
                                    <button
                                        className="action-btn"
                                        onClick={() => handleQuickAction('/patient/book-appointment')}
                                    >
                                        <Calendar className="icon" />
                                        <span>Book Appointment</span>
                                        <small>Schedule with our doctors</small>
                                    </button>

                                    <button
                                        className="action-btn"
                                        onClick={() => handleQuickAction('/patient/add-record')}
                                    >
                                        <FileText className="icon" />
                                        <span>Add Medical Record</span>
                                        <small>Update your health information</small>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </InternalLayout>
    );
};

export default PatientDashboard;