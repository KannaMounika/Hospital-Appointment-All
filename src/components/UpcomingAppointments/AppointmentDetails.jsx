// import React from 'react';
// import './UpcomingAppointments.css'; // This is correct for modal styling
// import AppointmentDetailsDisplay from './AppointmentDetailsDisplay'; 

// // You'll need CSS for the 'modal-overlay' and 'modal-content' classes
// // (assuming the AppointmentDetails component is the modal/popup)
// export const AppointmentDetails = ({ appointment, onClose }) => {
//     if (!appointment) return null;

//     // Prepare the data structure to pass to the reusable component
//     const displayData = {
//         // Pass all properties as is
//         ...appointment,
//     };

//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                 <div className="modal-header">
//                     <h2>Appointment Details</h2>
//                     <button className="close-btn" onClick={onClose}>&times;</button>
//                 </div>
                
//                 {/* isBookingConfirmation is set to false here, which tells 
//                   AppointmentDetailsDisplay to HIDE the patient row.
//                 */}
//                 <AppointmentDetailsDisplay
//                     appointmentData={displayData}
//                     isBookingConfirmation={false}
//                 />
//             </div>
//         </div>
//     );
// };
import React, { useState } from 'react'; // <-- Ensure useState is imported
import './UpcomingAppointments.css'; 
import AppointmentDetailsDisplay from './AppointmentDetailsDisplay'; 
import { cancelAppointment } from '../../api/AppointmentApi'; 

// The 'onCancelSuccess' prop is added to communicate status change to the parent.
export const AppointmentDetails = ({ appointment, onClose, onCancelSuccess }) => { 
    // FIX: Move all Hook calls to the very top, before any conditional logic or returns.
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);

    // Conditional return MUST come AFTER all hooks are called
    if (!appointment) return null;

    // Check if the appointment is in a status that allows cancellation
    // We only allow cancellation if status is Confirmed/Scheduled (and not in the past, which is checked by the parent logic)
    const isCancellable = (appointment.status === 'Confirmed' || appointment.status === 'Scheduled');
    
    
    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this appointment? This cannot be undone.")) {
            return;
        }

        setIsCancelling(true);
        setCancelError(null);

        try {
            await cancelAppointment(appointment.id);
            onCancelSuccess(appointment.id); 
            onClose();

        } catch (error) {
            console.error("Cancellation failed:", error);
            setCancelError(error.message || "Cancellation failed due to a network error.");
        } finally {
            setIsCancelling(false);
        }
    };

    const displayData = {
        ...appointment,
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Appointment Details</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                {/* Display Cancellation Error */}
                {cancelError && (
                    <div className="alert-error" style={{padding: '10px', backgroundColor: '#fee', color: '#c00', marginBottom: '15px', borderRadius: '4px', textAlign: 'center'}}>
                        {cancelError}
                    </div>
                )}
                
                <AppointmentDetailsDisplay
                    appointmentData={displayData}
                    isBookingConfirmation={false}
                />
                
                {/* Cancel Button (Conditional Rendering) */}
                {isCancellable && (
                    <button 
                        className="cancel-btn" 
                        onClick={handleCancel} 
                        disabled={isCancelling}
                        style={{
                            marginTop: '30px', 
                            backgroundColor: isCancelling ? '#ccc' : '#dc3545', 
                            color: 'white', 
                            padding: '10px 15px', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: isCancelling ? 'not-allowed' : 'pointer',
                            width: '100%',
                            fontSize: '1rem'
                        }}
                    >
                        {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
                    </button>
                )}
                
                {/* Show messages for non-cancellable states */}
                {appointment.status === 'Cancelled' && (
                    <p style={{marginTop: '20px', color: '#dc3545', fontWeight: 'bold', textAlign: 'center'}}>This appointment has already been cancelled.</p>
                )}
                {appointment.status === 'Completed' && (
                    <p style={{marginTop: '20px', color: '#007bff', fontWeight: 'bold', textAlign: 'center'}}>This appointment has already been completed.</p>
                )}
                
            </div>
        </div>
    );
};