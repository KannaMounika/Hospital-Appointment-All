import React from 'react';
import '../BookAppointment/BookAppointment.css';

const AppointmentDetailsDisplay = ({ appointmentData, isBookingConfirmation = false, onConfirm = null, isSubmitting = false }) => {    
    let patientDetails = 'N/A';
    let patientId = 'N/A';
    let doctorName = 'N/A Doctor';
    let specialization = 'N/A';
    let fee = appointmentData.fee || 'N/A';
    
    if (isBookingConfirmation) {
        patientDetails = appointmentData.patientName 
                         || `${appointmentData.patient?.firstName || ''} ${appointmentData.patient?.lastName || ''}`;
        patientId = appointmentData.patient?.id || 'N/A';
        if (appointmentData.doctor) {
             doctorName = `${appointmentData.doctor.firstName || ''} ${appointmentData.doctor.lastName || ''}`;
             specialization = appointmentData.doctor.specialization || 'N/A';
             fee = appointmentData.doctor.fee || 'N/A';
        }
    } else {
        patientDetails = appointmentData.patientName || 'N/A'; 
        patientId = appointmentData.patientId || 'N/A';
        
        doctorName = appointmentData.doctor || 'N/A Doctor';
        specialization = appointmentData.specialization || 'N/A';
    }
    const date = appointmentData.date || 'N/A';
    const time = appointmentData.time || appointmentData.slot?.time || 'N/A';
    const feeDisplay = (typeof fee === 'number' || !isNaN(Number(fee))) ? `₹${fee}` : fee; 
    return (
        <div className="summary-details">
            {isBookingConfirmation && (
                <p><strong>Patient:</strong> {patientDetails.trim()} (ID: {patientId})</p>
            )}
            
            <p><strong>Doctor:</strong> {doctorName.trim()} ({specialization})</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Time:</strong> {time}</p>
            <p><strong>Fee:</strong> {feeDisplay}</p> 
            {!isBookingConfirmation && appointmentData.status && (
                <p>
                    <strong>Status:</strong> 
                    <span className={`appointment-status status-${appointmentData.status.toLowerCase()}`}>
                        {appointmentData.status}
                    </span>
                </p>
            )}
            {isBookingConfirmation && onConfirm && (
                <button 
                    className="confirm-btn" 
                    onClick={onConfirm}
                    disabled={isSubmitting || patientId === 'N/A'} 
                >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
            )}
        </div>
    );
};

export default AppointmentDetailsDisplay;