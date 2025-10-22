import React, { useEffect, useState } from 'react';
import { fetchAvailableSlots } from '../../api/AppointmentApi';

// Utility function to safely get initials
const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
};

const BookAppointmentCard = ({ doctor, onBookClick }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(true);

    const doctorId = doctor?.id;

    useEffect(() => {
        const loadSlots = async () => {
            if (!doctorId) return;

            const today = new Date().toISOString().split('T')[0];
            try {
                const slots = await fetchAvailableSlots(doctorId, today);
                setAvailableSlots(slots);
            } catch (err) {
                console.error("Error fetching slots:", err);
                setAvailableSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };

        loadSlots();
    }, [doctorId]);

    if (!doctor) {
        return (
            <div className="doctor-card">
                <p>No doctor selected.</p>
            </div>
        );
    }

    const {
        firstName,
        lastName,
        specialization,
        experience,
        rating
    } = doctor;

    const initials = getInitials(firstName, lastName);
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : "Unknown Doctor";

    return (
        <div className="doctor-card">
            <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <div className="initials">{initials}</div>
                    <div className="info">
                        <h3>{fullName}</h3>
                        <p>{specialization}</p>
                        <p className="experience">{experience || 'N/A'}</p>
                    </div>
                </div>

                <div className="actions">
                    <div className="rating">🌟{rating || 'N/A'}</div>
                    <button className="book-btn" onClick={() => onBookClick(doctor)}>
                        Book Appointment
                    </button>
                </div>
            </div>

            <div className="card-slots">
                <p>Available Slots Today:</p>
                <div className="slot-list">
                    {loadingSlots ? (
                        <span>Loading...</span>
                    ) : availableSlots.length === 0 ? (
                        <span>No slots available</span>
                    ) : (
                        availableSlots.map((slot) => (
                            <span key={slot.id} className="slot-chip">{slot.time}</span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookAppointmentCard;