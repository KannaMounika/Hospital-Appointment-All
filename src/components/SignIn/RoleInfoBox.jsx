import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai'; 
import { FaUser, FaUserMd, FaHospital } from 'react-icons/fa';
import { MdOutlineSecurity } from 'react-icons/md';

// Define the content and styling for each role's information box
const ROLE_DETAILS = {
    // ---------------------- PATIENT (Light Blue) ----------------------
    Patient: {
        title: "Patient Portal",
        subtitle: "Book appointments, view medical records, and track your health journey",
        icon: FaUser,
        colorClass: 'info-patient', 
        iconColorClass: 'text-patient-blue',
        benefits: [
            "Book and manage appointments",
            "View medical history and reports",
            "Track real-time appointment status",
            "Access health packages and offers",
        ]
    },
    // ---------------------- DOCTOR (Light Green) ----------------------
    Doctor: {
        title: "Doctor Dashboard",
        subtitle: "Manage your practice, appointments, and provide quality healthcare",
        icon: FaUserMd,
        colorClass: 'info-doctor', 
        iconColorClass: 'text-doctor-green',
        benefits: [
            "Manage appointment schedules",
            "Access patient medical records",
            "Update availability status",
            "Handle emergency consultations",
        ]
    },
    // ---------------------- HOSPITAL STAFF (Light Purple) ----------------------
    'Staff': {
        title: "Staff Management",
        subtitle: "Register patients, manage medical records, and coordinate healthcare services",
        icon: FaHospital,
        colorClass: 'info-staff', 
        iconColorClass: 'text-staff-purple',
        benefits: [
            "Register new patients",
            "Upload and manage medical history",
            "Book appointments for patients",
            "View and manage prescriptions",
        ]
    },
    // ---------------------- ADMIN (Light Orange) ----------------------
    Admin: {
        title: "Admin Dashboard",
        subtitle: "Approve and manage doctor and staff registrations",
        icon: MdOutlineSecurity, 
        colorClass: 'info-admin', 
        iconColorClass: 'text-admin-orange',
        benefits: [
            "Review pending applications",
            "Approve or reject registrations",
            "Verify credentials and licenses",
            "Manage user access control",
        ]
    },
};

const RoleInfoBox = ({ role }) => {
    const details = ROLE_DETAILS[role];

    if (!details) return null; 

    const IconComponent = details.icon;

    return (
        <div className={`portal-info-box p-4 mb-4 ${details.colorClass}`}>
            <div className="d-flex align-items-start mb-3">
                {/* Custom Icon Container (circle background) */}
                <div className={`portal-icon-wrapper me-3 ${details.iconColorClass}`}>
                    <IconComponent className="portal-icon fs-4" /> 
                </div>
                <div>
                    <h4 className="fs-6 fw-bold mb-1 text-main-green">{details.title}</h4>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                        {details.subtitle}
                    </p>
                </div>
            </div>
            
            <ul className="list-unstyled checklist ps-0">
                {details.benefits.map((benefit, index) => (
                    <li key={index} className="d-flex align-items-start mb-2" style={{ fontSize: '0.8rem' }}>
                        <AiOutlineCheckCircle className="check-icon me-2 text-check-green" />
                        {benefit}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoleInfoBox;