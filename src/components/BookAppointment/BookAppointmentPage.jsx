// --- In BookAppointmentPage.jsx ---

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BookAppointmentCard from './BookAppointmentCard';
// **IMPORT THE MODIFIED FUNCTION & useAuth**
import { fetchDoctors, fetchAvailableSlots, bookAppointment, fetchLoggedInPatientDetails } from '../../api/AppointmentApi'; 
import './BookAppointment.css'; 
import InternalLayout from '../Layout/InternalLayout';
import PatientNavbar from '../PatientPortal/PatientNavbar';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import AppointmentDetailsDisplay from '../UpcomingAppointments/AppointmentDetailsDisplay';
// --- MOCK DATA REMAINS ---
const mockAppointmentTypes = [
    'Consultation', 
    'Follow-up', 
    'Emergency Visit'
];

const mockSpecializations = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Ophthalmology', 'General Medicine', 'Dermatology'
];
// --- END MOCK DATA ---


const BookAppointmentPage = () => {
    // **GET AUTH CONTEXT DATA**
    const { user, isAuthenticated } = useAuth(); 

    // --- State Initialization ---
    const [step, setStep] = useState(1); 
    const [loggedInPatient, setLoggedInPatient] = useState(null); 
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    // ... (Filter, Booking, Confirmation states remain the same) ...
    const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); 
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [appointmentType, setAppointmentType] = useState(mockAppointmentTypes[0]);
    const [chiefComplaint, setChiefComplaint] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Fetch Patient Details AND Doctors on Mount
useEffect(() => {
    const loadInitialData = async () => {
        setLoading(true);
        setError(null);

        // 1. CRITICAL AUTH CHECK: If user object is not available from context
        if (!isAuthenticated || !user || !user.email) {
                setError("CRITICAL: Patient identity not established. Please ensure you are logged in.");
                setLoading(false);
                return;
        }

        // 2. Fetch Logged-in Patient Details (Gets PatientId and Name)
        try {
            // Pass the user object (containing email) to fetch the full patient profile
            const patientData = await fetchLoggedInPatientDetails(user); 
            localStorage.setItem('patientId', patientData.id);
            if (!patientData || !patientData.id) {
                    throw new Error("Patient ID is missing after API fetch.");
            }
            // localStorage.setItem('patientId', patientData.id);
            localStorage.setItem('patientId', patientData.id); //  Always update this
            setLoggedInPatient(patientData);
        } catch (err) {
            console.error("Initial data load failure:", err);
            setError("CRITICAL: Failed to load patient details. Error: " + err.message);
            setLoading(false);
            return; 
        }

        // 3. Fetch Doctors (Secondary to patient ID)
        try {
            const doctorData = await fetchDoctors();
            setDoctors(doctorData);
        } catch (err) {
            setError(prevError => (prevError || "") + " Failed to load doctor list: " + err.message);
        }

        setLoading(false);
    };

    // Only run when the context confirms we have a logged-in user with an email
    if (user && isAuthenticated) {
        loadInitialData();
    } else if (loading && !isAuthenticated) {
        // Handle case where context has not loaded, or token is missing
        setError("CRITICAL: User is not authenticated. Redirect to login.");
        setLoading(false);
    }

}, [user, isAuthenticated]); 

    // Filtered Doctor List (unchanged)
const filteredDoctors = useMemo(() => {
        if (selectedSpecialization === 'All Specializations') {
            return doctors;
        }
        return doctors.filter(doctor => 
            doctor.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase())
        );
}, [doctors, selectedSpecialization]);


    // Handle Doctor Selection (Moves to Step 2) - UNCHANGED
const handleBookClick = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
        setSelectedSlot(null);
        setAvailableSlots([]);
};


    // Fetch Slots when Doctor or Date changes (Step 2 logic) - UNCHANGED
useEffect(() => {
    if (selectedDoctor && selectedDate) {
        const loadSlots = async () => {
            setLoadingSlots(true);
            setSelectedSlot(null); 
            try {
                const data = await fetchAvailableSlots(selectedDoctor.id, selectedDate);
                console.log("Fetched slots:", data);
                setAvailableSlots(data);
                setLoadingSlots(false);
            } catch (err) {
                setError("Failed to fetch available time slots: " + err.message);
                setAvailableSlots([]);
                setLoadingSlots(false);
            }
        };
        loadSlots();
    }
}, [selectedDoctor, selectedDate]);


const handleConfirmBooking = async () => {
  if (!loggedInPatient || !loggedInPatient.id) {
    alert("Patient identity not established. Cannot proceed with booking.");
    return;
  }

  if (!selectedDoctor || !selectedSlot || !selectedDate) {
    alert("Please ensure a doctor, slot, and date are provided.");
    return;
  }

  if (!selectedSlot?.id) {
    alert("Selected time slot is missing or invalid.");
    return;
  }

  setIsSubmitting(true);
  setError(null);

  const payload = {
    doctor_id: selectedDoctor.id,
    patient_id: loggedInPatient.id,
    appointment_date: new Date(`${selectedDate}T${selectedSlot.time}:00`).toISOString(),
    time_Slot_id: selectedSlot.id,
  };

  console.log("Booking payload:", payload);

  try {
    const result = await bookAppointment(payload);
    const message = result.message || 'Successfully submitted appointment.';
    toast.success(`Booking Successful! ${message}`, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored"
    });
    resetState();
  } catch (err) {
    setError(err.message);
    toast.error(`Booking Failed: ${err.message}`, {
      position: "top-right",
      autoClose: 4000,
      theme: "colored"
    });
  } finally {
    setIsSubmitting(false);
  }
};


const resetState = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setAvailableSlots([]);
};


    // --- Render Functions for Each Step ---

    const renderStep1DoctorSelection = () => (
        // ... (rest of Step 1 is unchanged)
        <div className="doctor-selection-step">
            <div className="specialization-filter-tabs">
                {['All Specializations', ...mockSpecializations].map(spec => (
                    <button
                        key={spec}
                        className={selectedSpecialization === spec ? 'filter-active' : 'filter-inactive'}
                        onClick={() => setSelectedSpecialization(spec)}
                    >
                        {spec}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading doctors...</p>
            ) : error && error.includes("CRITICAL") ? (
                 <div className="error-critical-box">
                    <p className="error-message">🚨 **CRITICAL ERROR:** {error}</p>
                    <p>Please check your network connection or log in again.</p>
                </div>
            ) : (
                <div className="doctor-list-container">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                            <BookAppointmentCard 
                                key={doctor.id} 
                                doctor={doctor} 
                                onBookClick={handleBookClick} 
                            />
                        ))
                    ) : (
                        <p>No doctors found for the selected specialization.</p>
                    )}
                </div>
            )}
        </div>
    );

    const renderStep2SlotSelection = () => (
        // ... (rest of Step 2 is unchanged)
        <div className="appointment-step-container">
            <button className="back-btn" onClick={() => setStep(1)}>← Back to Doctor Selection</button>
            
            <h2>Select Date and Time Slot</h2>
            
            <p>Doctor: **{selectedDoctor?.firstName} {selectedDoctor?.lastName}** ({selectedDoctor?.specialization})</p>

            <label htmlFor="select-date">Select Date:</label>
            <input
                id="select-date"
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]} 
                onChange={(e) => setSelectedDate(e.target.value)}
            />

            <label>Available Time Slots:</label>
            <div className="slot-selection-area">
                {loadingSlots ? (
                    <p>Loading slots...</p>
                ) : availableSlots.length > 0 ? (
                    availableSlots.map(slot => (
                        <button
                            key={slot.id}
                            className={`slot-btn ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                            onClick={() =>{
                                 console.log("Slot selected:", slot);
                                 setSelectedSlot(slot)}
                            }
                            disabled={isSubmitting}
                        >
                            {slot.time}
                        </button>
                    ))
                ) : (
                    <p>No slots available for **{selectedDate}**.</p>
                )}
            </div>

            <button 
                className="next-btn" 
                onClick={() => setStep(3)}
                disabled={!selectedSlot} 
            >
                Next (Review Booking)
            </button>
        </div>
    );
    const renderStep3Confirmation = () => {
    // 1. GATHER ALL DYNAMIC DATA INTO ONE OBJECT
    // This is the dynamic data coming from the state in BookAppointmentPage.
        const dynamicAppointmentData = {
            patient: loggedInPatient,
            doctor: selectedDoctor, 
            date: selectedDate, 
            slot: selectedSlot, // Includes slot.time and slot.id
        };
        
        return (
            <div className="appointment-step-container">
                <button className="back-btn" onClick={() => setStep(2)}>← Back to Slot Selection</button>

                <h2>Review and Confirm Booking</h2>
                
                {/* 2. PASS THE DYNAMIC DATA TO THE REUSABLE COMPONENT */}
                <AppointmentDetailsDisplay
                    appointmentData={dynamicAppointmentData} // <--- PASSING THE DYNAMIC OBJECT
                    isBookingConfirmation={true} 
                    onConfirm={handleConfirmBooking}
                    isSubmitting={isSubmitting}
                />

                {error && <p className="error-message">{error}</p>}
                
            </div>
        );
    };

    // --- Main Render Logic ---
    let content;

    // Use a single loading/error block for the initial critical phase
    if (loading) {
        content = <p>Loading initial data...</p>;
    } 
    else if (error && error.includes("CRITICAL")) {
        content = (
            <div className="error-critical-box">
                <p className="error-message"> **CRITICAL ERROR:** {error}</p>
                <p>Please check your network connection or log in again.</p>
            </div>
        );
    } 
    else {
        switch (step) {
            case 2:
                content = renderStep2SlotSelection();
                break;
            case 3:
                content = renderStep3Confirmation();
                break;
            case 1:
            default:
                content = renderStep1DoctorSelection();
                break;
        }
    }


    return (
        <InternalLayout>
            <PatientNavbar/>
            <div className="book-appointment-page">
                <h1>Book Appointment</h1>
                {step === 1 && <p>Find and book appointments with our qualified doctors</p>}
                
                {content}
            </div>
        </InternalLayout>
        
    );
};

export default BookAppointmentPage;