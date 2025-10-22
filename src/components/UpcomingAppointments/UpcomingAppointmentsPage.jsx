// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AppointmentCard from './AppointmentCard';
// import InternalLayout from '../Layout/InternalLayout';
// import PatientNavbar from '../PatientPortal/PatientNavbar';
// import './UpcomingAppointments.css';
// import { fetchPatientAppointments } from '../../api/AppointmentApi';
// import { useAuth } from '../../context/AuthContext';
// import { AppointmentDetails } from './AppointmentDetails';

// const getTimeFromSlotId = (slotId) => {
//     // This map ensures we have a time string for accurate date comparison
//     const slotMap = {
//         1: '09:00', 2: '09:30', 3: '10:00', 4: '10:30', 
//         5: '11:00', 6: '11:30', 7: '12:00', 8: '12:30', 
//         9: '13:00', 10: '13:30' // Use 24-hour format
//     };
//     return slotMap[slotId] || '00:00'; 
// };

// const calculateFee = (specialization) => {
//     if (specialization && (
//         specialization.toLowerCase().includes('general') || 
//         specialization.toLowerCase().includes('medicine')
//     )) {
//         return 1000;
//     }
//     return 1500;
// };

// // Checks if the appointment is NOW or in the FUTURE (used for sorting)
// const isUpcoming = (appointmentDateString, timeSlotId) => {
//     if (!appointmentDateString) return false;
    
//     const timeString = getTimeFromSlotId(timeSlotId);
//     const appointmentDateTime = new Date(`${appointmentDateString} ${timeString}`);
//     const now = new Date();
    
//     // Check if appointment is greater than or equal to current moment
//     return appointmentDateTime >= now;
// };


// const UpcomingAppointmentsPage = () => {
//     const { user, isAuthenticated } = useAuth();
//     const [appointments, setAppointments] = useState([]); // Holds ALL processed and sorted appointments
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedAppointment, setSelectedAppointment] = useState(null); 
//     const navigate = useNavigate();

//     const handleViewDetails = (appointment) => {
//         // This is called by the AppointmentCard component
//         setSelectedAppointment(appointment);
//     };

//     const handleBookNewAppointment = () => {
//         navigate('/patient/book-appointment'); 
//     };

//     // Use useCallback to memoize the loading function
//     const loadAppointments = useCallback(async () => {
//         setLoading(true);
//         setError(null);
        
//         const patientId = localStorage.getItem('patientId');

//         if (!user || !user.email || !isAuthenticated || !patientId) {
//             setError("User not authenticated or patient ID missing.");
//             setLoading(false);
//             return;
//         }

//         try {
//             // 1. Fetch RAW data
//             const data = await fetchPatientAppointments(patientId);

//             if (!Array.isArray(data) || data.length === 0) {
//                 setAppointments([]);
//                 return;
//             }

//             // 2. Map and Process ALL appointments (Status, Fee, Doctor Name, Time)
//             const processedAppointments = data.map(appt => {
//                 const specialization = appt.doctor?.specialization || 'N/A';
//                 const timeString = getTimeFromSlotId(appt.time_Slot_Id);
//                 const appointmentDateTimeString = `${appt.appointmentDate} ${timeString}`;
                
//                 // Determine status: If it's in the past, mark it 'Completed'
//                 let status = appt.status || 'Scheduled';
//                 if (new Date(appointmentDateTimeString) < new Date() && status !== 'Cancelled') {
//                     status = 'Completed';
//                 }

//                 const firstName = appt.doctor?.emailNavigation?.firstName || '';
//                 const lastName = appt.doctor?.emailNavigation?.lastName || '';
                
//                 return {
//                     id: appt.appointmentId,
//                     doctor: (firstName.trim() || lastName.trim()) ? `${firstName} ${lastName}`.trim() : 'N/A Doctor',
//                     specialization: specialization,
//                     date: appt.appointmentDate || 'N/A',
//                     time: timeString,
//                     status: status, // The processed status
//                     fee: calculateFee(specialization),
//                     patientName: user?.name || 'N/A',
//                     patientId: patientId,
//                     time_Slot_Id: appt.time_Slot_Id 
//                 };
//             });

//             // 3. Sort all appointments (Upcoming first, then Completed/Past)
//             processedAppointments.sort((a, b) => {
//                 const dateA = new Date(`${a.date} ${a.time}`);
//                 const dateB = new Date(`${b.date} ${b.time}`);

//                 const isAUpcoming = isUpcoming(a.date, a.time_Slot_Id);
//                 const isBUpcoming = isUpcoming(b.date, b.time_Slot_Id);

//                 if (isAUpcoming && !isBUpcoming) return -1; // A is upcoming, B is past -> A comes first
//                 if (!isAUpcoming && isBUpcoming) return 1;  // B is upcoming, A is past -> B comes first

//                 // Within Upcoming: Sort ascending (oldest future first)
//                 if (isAUpcoming && isBUpcoming) {
//                     return dateA - dateB;
//                 }

//                 // Within Completed (Past): Sort descending (most recent completed first)
//                 return dateB - dateA; 
//             });

//             // 4. Store ALL processed and sorted appointments
//             setAppointments(processedAppointments);
            
//         } catch (err) {
//             console.error("Error fetching appointments:", err);
//             setError("Failed to load appointments. " + err.message);
//             setAppointments([]); 
//         } finally {
//             setLoading(false);
//         }
//     }, [user, isAuthenticated]); // Dependencies for useCallback

//     useEffect(() => {
//         loadAppointments();
//     }, [loadAppointments]);


//     return (
//         <InternalLayout>
//             <PatientNavbar />
//             <div className="appointments-page-container">
//                 {/* Use the original button class and structure */}
//                 <button 
//                     className="book-top-right-btn" 
//                     onClick={handleBookNewAppointment}
//                 >
//                     + Book Appointment
//                 </button>

//                 <div className="upcoming-appointments-section">
//                     {/* Updated the header to reflect that it shows history */}
//                     <h2>Appointment History (Upcoming & Completed)</h2>

//                     {loading ? (
//                         <p>Loading appointments...</p>
//                     ) : error ? (
//                         <p className="error-message">Error: {error}</p>
//                     ) : appointments.length === 0 ? (
//                         <div className="no-appointments-box">
//                             <p>You don't have any recorded appointments.</p>
//                             <button className="book-first-btn" onClick={handleBookNewAppointment}>
//                                 Book Your First Appointment
//                             </button>
//                         </div>
//                     ) : (
//                         <div className="appointments-list">
//                             {/* Render ALL appointments, letting the sorting and status logic manage the order and display */}
//                             {appointments.map(app => (
//                                 <AppointmentCard
//                                     key={app.id} 
//                                     appointment={app}
//                                     onViewDetails={handleViewDetails} // Pass the handler
//                                 />
//                             ))}
//                         </div>
//                     )}

//                     {/* Render detailed view if an appointment is selected (Modal) */}
//                     {selectedAppointment && (
//                         // Assuming AppointmentDetails is the component that handles the modal/detailed view
//                         <AppointmentDetails 
//                             appointment={selectedAppointment}
//                             onClose={() => setSelectedAppointment(null)} // Function to close the modal
//                         />
//                     )}
//                 </div>
//             </div>
//         </InternalLayout>
//     );
// };

// export default UpcomingAppointmentsPage;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentCard from './AppointmentCard';
import InternalLayout from '../Layout/InternalLayout';
import PatientNavbar from '../PatientPortal/PatientNavbar';
import './UpcomingAppointments.css';
import { fetchPatientAppointments } from '../../api/AppointmentApi';
import { useAuth } from '../../context/AuthContext';
import { AppointmentDetails } from './AppointmentDetails';

// -----------------------------------------------------------
// Helper Functions (Modified to support 30-minute duration and Ongoing status)
// -----------------------------------------------------------
const getTimeFromSlotId = (slotId) => {
    // This map ensures we have a time string for accurate date comparison
    const slotMap = {
        1: '09:00', 2: '09:30', 3: '10:00', 4: '10:30', 
        5: '11:00', 6: '11:30', 7: '12:00', 8: '12:30', 
        9: '13:00', 10: '13:30' // Use 24-hour format
    };
    return slotMap[slotId] || '00:00'; 
};

const calculateFee = (specialization) => {
    if (specialization && (
        specialization.toLowerCase().includes('general') || 
        specialization.toLowerCase().includes('medicine')
    )) {
        return 1000;
    }
    return 1500;
};

/**
 * Determines the current status: Upcoming, Ongoing, Completed, or Cancelled.
 * @param {string} appointmentDateString - The date string (e.g., '2025-10-22').
 * @param {number} timeSlotId - The ID of the time slot.
 * @param {string} currentStatus - The existing status from the API.
 * @returns {string} The computed status.
 */
const getAppointmentStatus = (appointmentDateString, timeSlotId, currentStatus) => {
    if (currentStatus === 'Cancelled') {
        return 'Cancelled';
    }
    
    const timeString = getTimeFromSlotId(timeSlotId);
    // Start time of the appointment
    const appointmentStart = new Date(`${appointmentDateString} ${timeString}`);
    // End time is 30 minutes after the start time
    const appointmentEnd = new Date(appointmentStart.getTime() + 30 * 60000); // Add 30 minutes in milliseconds
    
    const now = new Date();
    
    if (now < appointmentStart) {
        // Now is before the start time
        return 'Confirmed'; // Or 'Scheduled', using 'Confirmed' for Upcoming
    } else if (now >= appointmentStart && now < appointmentEnd) {
        // Now is during the 30-minute slot
        return 'Ongoing';
    } else {
        // Now is after the end time
        return 'Completed';
    }
};

// Checks if the appointment is NOW or in the FUTURE (used for sorting)
const isUpcoming = (appointmentDateString, timeSlotId) => {
    if (!appointmentDateString) return false;
    
    const timeString = getTimeFromSlotId(timeSlotId);
    const appointmentDateTime = new Date(`${appointmentDateString} ${timeString}`);
    const now = new Date();
    
    // An appointment is 'upcoming' if the start time is greater than the current time.
    // This is used for sorting: upcoming vs. past/completed.
    return appointmentDateTime > now;
};
// -----------------------------------------------------------


const UpcomingAppointmentsPage = () => {
    const { user, isAuthenticated } = useAuth();
    const [appointments, setAppointments] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null); 
    const navigate = useNavigate();

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
    };

    const handleBookNewAppointment = () => {
        navigate('/patient/book-appointment'); 
    };

    /**
     * FIX 1: Updates the local state to 'Cancelled' immediately after successful API call.
     */
    const handleCancelSuccess = (cancelledAppointmentId) => {
        setAppointments(prevAppointments => 
            prevAppointments.map(app => 
                app.id === cancelledAppointmentId 
                    // CRITICAL FIX: Ensure the local status is set to 'Cancelled' 
                    // and then re-sort the list if needed (though mapping usually keeps order).
                    ? { ...app, status: 'Cancelled' } 
                    : app
            ).sort((a, b) => { // Re-sort to put 'Cancelled' items correctly in the history
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);

                // Use the sorting logic from loadAppointments
                const isAUpcoming = isUpcoming(a.date, a.time_Slot_Id);
                const isBUpcoming = isUpcoming(b.date, b.time_Slot_Id);

                if (isAUpcoming && !isBUpcoming) return -1;
                if (!isAUpcoming && isBUpcoming) return 1; 

                if (isAUpcoming && isBUpcoming) {
                    return dateA - dateB;
                }
                return dateB - dateA; 
            })
        );
        setSelectedAppointment(null); 
    };
    
    const loadAppointments = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        const patientId = localStorage.getItem('patientId');
        // ... (authentication check remains the same)

        try {
            const data = await fetchPatientAppointments(patientId);

            if (!Array.isArray(data) || data.length === 0) {
                setAppointments([]);
                return;
            }

            const processedAppointments = data.map(appt => {
                const specialization = appt.doctor?.specialization || 'N/A';
                const timeString = getTimeFromSlotId(appt.time_Slot_Id);
                const appointmentDateTimeString = `${appt.appointmentDate} ${timeString}`;
                
                // FIX 2: Compute status using the new function which handles Ongoing/Completed/Cancelled
                const status = getAppointmentStatus(
                    appt.appointmentDate, 
                    appt.time_Slot_Id, 
                    appt.status // Pass the backend status (useful for 'Cancelled' state)
                );

                const firstName = appt.doctor?.emailNavigation?.firstName || '';
                const lastName = appt.doctor?.emailNavigation?.lastName || '';
                
                return {
                    id: appt.appointmentId,
                    doctor: (firstName.trim() || lastName.trim()) ? `${firstName} ${lastName}`.trim() : 'N/A Doctor',
                    specialization: specialization,
                    date: appt.appointmentDate || 'N/A',
                    time: timeString,
                    status: status, // The computed status (Confirmed, Ongoing, Completed, Cancelled)
                    fee: calculateFee(specialization),
                    patientName: user?.name || 'N/A',
                    patientId: patientId,
                    time_Slot_Id: appt.time_Slot_Id 
                };
            });

            // 3. Sort all appointments
            processedAppointments.sort((a, b) => {
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);

                const isAUpcoming = isUpcoming(a.date, a.time_Slot_Id);
                const isBUpcoming = isUpcoming(b.date, b.time_Slot_Id);

                // Sorting logic remains the same (Upcoming first, then by date)
                if (isAUpcoming && !isBUpcoming) return -1; 
                if (!isAUpcoming && isBUpcoming) return 1;  

                if (isAUpcoming && isBUpcoming) {
                    return dateA - dateB;
                }

                return dateB - dateA; 
            });

            setAppointments(processedAppointments);
            
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError("Failed to load appointments. " + err.message);
            setAppointments([]); 
        } finally {
            setLoading(false);
        }
    }, [user, isAuthenticated]);


    useEffect(() => {
        loadAppointments();
    }, [loadAppointments]);


    return (
        <InternalLayout>
            <PatientNavbar />
            <div className="appointments-page-container">
                <button 
                    className="book-top-right-btn" 
                    onClick={handleBookNewAppointment}
                >
                    + Book Appointment
                </button>

                <div className="upcoming-appointments-section">
                    <h2>Appointment History (Upcoming & Completed)</h2>

                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : error ? (
                        <p className="error-message">Error: {error}</p>
                    ) : appointments.length === 0 ? (
                        <div className="no-appointments-box">
                            <p>You don't have any recorded appointments.</p>
                            <button className="book-first-btn" onClick={handleBookNewAppointment}>
                                Book Your First Appointment
                            </button>
                        </div>
                    ) : (
                        <div className="appointments-list">
                            {appointments.map(app => (
                                <AppointmentCard
                                    key={app.id} 
                                    appointment={app}
                                    onViewDetails={handleViewDetails} 
                                />
                            ))}
                        </div>
                    )}

                    {selectedAppointment && (
                        <AppointmentDetails 
                            appointment={selectedAppointment}
                            onClose={() => setSelectedAppointment(null)}
                            onCancelSuccess={handleCancelSuccess} // Passing the update handler
                        />
                    )}
                </div>
            </div>
        </InternalLayout>
    );
};

export default UpcomingAppointmentsPage;