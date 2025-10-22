import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css'; 
import RoleInfoBox from './RoleInfoBox';
import { MdArrowBack } from 'react-icons/md'; 
import { AiOutlineEye, AiOutlineLock } from 'react-icons/ai'; 
import { FaUser, FaStethoscope, FaHospital } from 'react-icons/fa'; 
import { MdAdminPanelSettings } from 'react-icons/md';
import InternalLayout from '../Layout/InternalLayout';
import { useAuth } from '../../context/AuthContext'; //  Correct import path

const roleDetails = [
    { name: 'Patient', icon: FaUser },
    { name: 'Doctor', icon: FaStethoscope },
    { name: 'Staff', icon: FaHospital },
    { name: 'Admin', icon: MdAdminPanelSettings },
];

const SignIn = () => {
    // 1. Initialize Hooks and Context variables
    const { login, error: authError } = useAuth(); // Access login function and error state from context
    const navigate = useNavigate();
    
    // State Initialization
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('Patient'); 
    const [showPassword, setShowPassword] = useState(false);
    // We will use the 'authError' from the context for API errors, 
    //    and the 'localError' state (renamed from 'error') for client-side validation.
    const [localError, setLocalError] = useState(''); 
    const [loading, setLoading] = useState(false);

    // 2. Role Change Handler
    const handleRoleChange = (roleName) => {
        setSelectedRole(roleName);
        setLocalError(''); // Clear local errors on role switch
    };

    // 3. The Modified Submission Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(''); // Clear previous local error
        setLoading(true);

        if (!email || !password) {
            setLocalError('Please enter both email and password.');
            setLoading(false);
            return;
        }

        //  ACTION: Replace SIMULATED LOGIN with the actual API call from AuthContext
        try {
            const result = await login(email, password, selectedRole);

            if (result.success) {
                // Determine the correct path and remove spaces (e.g., "Hospital Staff" -> "hospitalstaff")
                const rolePath = selectedRole.toLowerCase().replace(/\s/g, '');
                
                // Navigate to the role-specific dashboard (e.g., /patient/dashboard)
                navigate(`/${rolePath}/dashboard`); 
            } else {
                // If login failed (e.g., 401 response), the error is already set in AuthContext
                // We use the message returned from the context's login function for display
                setLocalError(result.message || 'Login failed. Please check your credentials or selected role.');
            }
            
        } catch (err) {
             // This catch block handles unexpected network issues not caught inside AuthContext
             setLocalError('Network error. Check console and ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <InternalLayout>
            <div className="signin-page-wrapper d-flex min-vh-100 bg-light">
                
                {/* LEFT SECTION: Role Selection and Info */}
                <div className="signin-left-panel">
                    
                    {/* Back to Home Link */}
                    <Link to="/" className="back-link align-self-start">
                        <MdArrowBack className="back-icon me-2" /> Back to Home
                    </Link>

                    {/* Brand and Welcome Section (Aligned Left) */}
                    <div className="welcome-section mb-5">
                        <h2 className="welcome-title text-dark-heading fs-3 fw-bold mb-1">Welcome Back</h2>
                        <p className="welcome-subtitle text-muted mb-4">
                            Sign in to your account and continue your healthcare journey
                        </p>
                    </div>

                    {/* Role Selector */}
                    <div className="role-selection-section mb-4">
                        <h3 className="select-role-title fs-6 fw-bold mb-3">Select Your Role</h3>
                        <div className="role-selector d-flex justify-content-start">
                            {roleDetails.map(r => (
                                <button
                                    key={r.name}
                                    onClick={() => handleRoleChange(r.name)}
                                    className={`role-button btn me-3 d-flex flex-column align-items-center p-3 ${selectedRole === r.name ? 'btn-success' : 'btn-outline-secondary text-dark bg-white'}`}
                                >
                                    <r.icon className="fs-5 mb-2" />
                                    {r.name.replace(' Hospital', '')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DYNAMIC ROLE INFO BOX */}
                    <RoleInfoBox role={selectedRole} /> 
                </div>

                {/* RIGHT SECTION: Sign In Form */}
                <div className="signin-right-panel d-flex align-items-center justify-content-center p-4 p-md-5">
                    <div className="card shadow-lg p-5 bg-white form-card">
                        
                        <div className="text-center mb-4">
                            <h2 className="fs-4 fw-bold text-main-green">Sign in as {selectedRole}</h2>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Enter your credentials to access your {selectedRole.toLowerCase()} dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="d-grid gap-3">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <div className="input-group">
                                    <input 
                                        id="email" 
                                        type="email" 
                                        className="form-control custom-input" 
                                        placeholder="your.email@example.com" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-group password-input-group">
                                    <input 
                                        id="password" 
                                        type={showPassword ? 'text' : 'password'} 
                                        className="form-control custom-input" 
                                        placeholder="Enter your password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                    <span className="input-group-text password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        <AiOutlineEye style={{ color: showPassword ? '#00796b' : '#aaa' }}/>
                                    </span>
                                </div>
                            </div>

                          
                            
                            {/*  DISPLAY ERROR: Show validation error OR API error from AuthContext */}
                            {(localError || authError) && (
                                <p className="alert alert-danger p-2 text-center" style={{fontSize: '0.8rem', marginBottom: '0'}}>
                                    {localError || authError}
                                </p>
                            )}

                            <button type="submit" className="btn custom-btn-success w-100 d-flex justify-content-center align-items-center py-2 fw-bold" disabled={loading}>
                                <AiOutlineLock className="me-2" />
                                {loading ? 'Signing In...' : (`Sign in as ${selectedRole}`)}
                            </button>
                        </form>

                        <p className="text-center mt-3 mb-3 text-muted" style={{fontSize: '0.8rem'}}>
                            Don't have an account? <Link to="/register-page" className="text-link-green fw-bold">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </InternalLayout>
    );
};
export default SignIn;
