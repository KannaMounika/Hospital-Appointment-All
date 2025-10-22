import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { MdArrowBack, MdLock } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai';
import { GiPadlockOpen } from 'react-icons/gi';
import InternalLayout from '../Layout/InternalLayout';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

// Password validation: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);

const Register = () => {
    // Use the AuthContext hook
    const { registerUser, error: authError } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate

    // --- State Initialization ---
    const [formData, setFormData] = useState({
        // Core fields
        firstName: '', lastName: '', email: '', password: '',
        phone: '', gender: '', role: '',
        // Conditional fields
        dob: '', address: '',
        specialization: '', regYear: '',
        staffRole: '',
    });
    // Renamed 'error' to 'localError' to distinguish from context error
    const [localError, setLocalError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Clear success/error message on input change
        setSuccess('');
        setLocalError('');
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGoHome = () => {
        navigate('/'); // Navigate to the root path
    };

    // --- handleSubmit ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(''); setSuccess('');
        
        // --- Core Validation ---
        const coreFields = ['firstName', 'lastName', 'email', 'password', 'phone', 'gender', 'role'];
        if (coreFields.some(field => !formData[field]) || !validatePassword(formData.password)) {
            setLocalError('Please complete all required fields and check the password criteria.');
            return;
        }

        // --- Conditional Validation & Payload Construction ---
        let conditionalPayload = {};

        if (formData.role === 'Patient') {
            if (!formData.dob || !formData.address) {
                setLocalError('Patient role requires Date of Birth and Address.'); return;
            }
            // Note: API keys MUST match C# DTO (PascalCase assumed)
            conditionalPayload = { DateOfBirth: formData.dob, Address: formData.address };
        } else if (formData.role === 'Doctor') {
            if (!formData.specialization || !formData.regYear) {
                setLocalError('Doctor role requires Specialization and Registration Year.'); return;
            }
            conditionalPayload = { Specialization: formData.specialization, RegistrationYear: formData.regYear };
        } else if (formData.role === 'Staff') {
            if (!formData.staffRole) {
                setLocalError('Staff role requires the specific Staff Role to be selected.'); return;
            }
            conditionalPayload = { StaffRole: formData.staffRole };
        }

        // 1. Assemble the FINAL API Payload with PascalCase keys
        const apiPayload = {
            FirstName: formData.firstName, 
            LastName: formData.lastName, 
            Email: formData.email,
            Password: formData.password, 
            // CORRECTED: Based on your last successful error parsing: Phone is the backend key
            Phone: formData.phone, 
            Gender: formData.gender,
            Role: formData.role, // Though redundant, keeping for clarity
            ...conditionalPayload,
        };

        setLoading(true);

        try {
            // 2. Call the central registration function
            const result = await registerUser(apiPayload, formData.role);
            
            if (result.success) {
                setSuccess(result.message);
                // CRITICAL FIX: Ensure the redirect path matches your App.js route
                setTimeout(() => { navigate('/sign-in'); }, 2000); 
            } else {
                // The error is either the local validation error or the API error from AuthContext
                setLocalError(result.message || authError || 'Registration failed. Try again.');
            }

        } catch (err) {
            // This catch should generally not be hit if AuthContext handles errors, but it's safe
            setLocalError('An unexpected error occurred during network submission.');
        } finally {
            setLoading(false);
        }
    };

    // --- Conditional Field Renderer (UNCHANGED) ---
    const renderConditionalFields = () => {
        switch (formData.role) {
            case 'Patient':
                return (
                    // DOB and Address
                    <div className="row g-3">
                        <div className="col-md-6 mb-2">
                            <label htmlFor="dob" className="form-label">Date of Birth *</label>
                            <input id="dob" type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-2">
                            <label htmlFor="address" className="form-label">Address *</label>
                            <input id="address" type="text" name="address" className="form-control" placeholder="Enter your full address" value={formData.address} onChange={handleChange} required />
                        </div>
                    </div>
                );
            case 'Doctor':
                return (
                    // Specialization and Registration Year
                    <div className="row g-3">
                        <div className="col-md-6 mb-2">
                            <label htmlFor="specialization" className="form-label">Specialization *</label>
                            <input id="specialization" type="text" name="specialization" className="form-control" placeholder="e.g. Cardiology" value={formData.specialization} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-2">
                            <label htmlFor="regYear" className="form-label">Registration Year *</label>
                            <input id="regYear" type="number" name="regYear" className="form-control" placeholder="e.g. 2010" value={formData.regYear} onChange={handleChange} required />
                        </div>
                    </div>
                );
            case 'Staff':
                return (
                    // Staff Role (Nurse, Receptionist, etc.)
                    <div className="mb-2">
                        <label htmlFor="staffRole" className="form-label">Staff Role *</label>
                        <select id="staffRole" name="staffRole" className="form-select" value={formData.staffRole} onChange={handleChange} required>
                            <option value="" disabled>Select staff role</option>
                            <option value="Nurse">Nurse</option>
                            <option value="Receptionist">Receptionist</option>
                            <option value="Technician">Technician</option>
                        </select>
                    </div>
                );
            default:
                return null;
        }
    };

    // --- JSX Return (UNCHANGED except for error message display) ---
    return (
        <InternalLayout>
            <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light py-4">

            {/* Back to Home Button positioning */}
                <div className="nav-header mb-3" style={{ maxWidth: '500px', width: '100%' }}>
                    <button onClick={handleGoHome} className="back-button">
                        <MdArrowBack className="back-icon" /><span>Back to Home</span>
                    </button>
                </div>

                {/* Main Card */}
                <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: '500px', width: '100%', borderRadius: '12px' }}>

                    {/* Header Section */}
                    <div className="register-header text-center mb-4">
                        <h2 className="create-account-title text-success fs-6 fw-bold mt-3 mb-2">
                            Create Your Account
                        </h2>
                        <p className="subtitle text-muted mb-0" style={{fontSize: '0.8rem'}}>
                            Join our healthcare platform and get access to trusted medical services
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="d-grid gap-2 text-start">

                        {/* First Name & Last Name */}
                        <div className="row g-3">
                            <div className="col-md-6 mb-2">
                                <label htmlFor="firstName" className="form-label">First Name *</label>
                                <input id="firstName" type="text" name="firstName" className="form-control" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-2">
                                <label htmlFor="lastName" className="form-label">Last Name *</label>
                                <input id="lastName" type="text" name="lastName" className="form-control" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="mb-2">
                            <label htmlFor="email" className="form-label">Email Address *</label>
                            <input id="email" type="email" name="email" className="form-control" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} required />
                        </div>

                        {/* Password */}
                        <div className="mb-2">
                            <label htmlFor="password" className="form-label">Password *</label>
                            <div className="input-group">
                                <input id="password" type={showPassword ? 'text' : 'password'} name="password" className="form-control" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
                                <span className="input-group-text p-2" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', backgroundColor: 'white' }}>
                                    <AiOutlineEye style={{ color: showPassword ? '#00796b' : '#aaa' }}/>
                                </span>
                            </div>
                            <p className="password-hint text-muted mt-1 mb-0" style={{fontSize: '0.7rem'}}>Must contain at least 8 characters with uppercase, lowercase, and numbers</p>
                        </div>

                        {/* Phone Number & Gender */}
                        <div className="row g-3 mb-2">
                            <div className="col-md-6">
                                <label htmlFor="phone" className="form-label">Phone Number *</label>
                                <input id="phone" type="tel" name="phone" className="form-control" placeholder="9876543210" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="gender" className="form-label">Gender *</label>
                                <select id="gender" name="gender" className="form-select" value={formData.gender} onChange={handleChange} required>
                                    <option value="" disabled>Select gender</option>
                                    <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="mb-2">
                            <label htmlFor="role" className="form-label">Role *</label>
                            <select id="role" name="role" className="form-select" value={formData.role} onChange={handleChange} required>
                                <option value="" disabled>Select your role</option>
                                <option value="Patient">Patient</option><option value="Doctor">Doctor</option><option value="Staff">Staff</option>
                            </select>
                        </div>

                        {/* CONDITIONAL FIELDS */}
                        {renderConditionalFields()}

                        {/* Security Info */}
                        <div className="alert alert-success d-flex align-items-center p-3 mt-2" role="alert" style={{backgroundColor: '#e8f5e9', borderColor: '#c8e6c9', color: '#388e3c'}}>
                            <GiPadlockOpen className="security-icon flex-shrink-0 me-2" style={{fontSize: '1.2rem'}} />
                            <div style={{fontSize: '0.75rem'}}>
                                Your information is encrypted and secure. We comply with healthcare privacy standards.
                            </div>
                        </div>

                        {/* Feedback Messages */}
                        {/* Updated to display localError first, then fall back to context-level authError */}
                        {(localError || authError) && <p className="alert alert-danger p-2 text-center" style={{fontSize: '0.8rem', marginBottom: '0'}}>{localError || authError}</p>}
                        {success && <p className="alert alert-success p-2 text-center" style={{fontSize: '0.8rem', marginBottom: '0'}}>{success}</p>}

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-success w-100 d-flex justify-content-center align-items-center py-2 fw-bold" disabled={loading}>
                            {loading ? 'Processing...' : (<><MdLock className="button-icon me-2" />Create Account</>)}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <p className="footer text-center mt-3 mb-0 text-muted" style={{fontSize: '0.8rem'}}>
                        Already have an account? <a href="/sign-in" className="text-success fw-bold">Sign In</a>
                    </p>
                </div>
            </div>
        </InternalLayout>
    );
};

export default Register;