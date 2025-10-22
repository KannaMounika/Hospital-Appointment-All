// src/components/Appointments/AppointmentCard.jsx
import React from 'react';
import { useState } from 'react';
import './UpcomingAppointments.css'; // Ensure styling is imported
// const onehandle()=>{

    // }
const AppointmentCard = ({ appointment, onViewDetails }) => {
    // Use it like this:
    <button onClick={() => onViewDetails(appointment)}>View Details</button>
    // Determine status class for styling
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'scheduled':
                return 'status-confirmed';
            case 'pending':
                return 'status-pending';
            case 'cancelled':
                return 'status-cancelled';
            case 'completed':
                return 'status-completed';
            default:
                return 'status-scheduled'; // Default to a neutral/scheduled state
        }
    };
    // const view () =>{
    //     return
    // }

    return (
        <div className="appointment-card">
            <div className="card-content">
                <div className="card-header-main">
                    <div className="doctor-info-header">
                        <h3>{appointment.doctor}</h3>
                        <p className="specialization">{appointment.specialization}</p>
                    </div>
                    <span className={`appointment-status ${getStatusClass(appointment.status)}`}>
                        {appointment.status}
                    </span>
                </div>

                <div className="appointment-details">
                    <span><span className="icon">🗓️</span> {appointment.date}</span>
                    <span><span className="icon">🕒</span> {appointment.time}</span>
                </div>

            </div>

            <div className="card-actions">
                {/* <button className="view-details-btn">View Details</button> */}
                <button className="view-details-btn" onClick={() => onViewDetails(appointment)}>
                            View Details
                </button>
            </div>

        </div>
    );
};

export default AppointmentCard;