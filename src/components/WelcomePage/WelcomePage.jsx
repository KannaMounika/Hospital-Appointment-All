import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';
import doctorImage from '../../assets/doctorimage.jpg'; // Make sure this path is correct
import InternalLayout from '../Layout/InternalLayout';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <InternalLayout>
      <section className="welcome-page">
      {/* Section 1: Image + Message */}
      <div className="intro-section">
        <div className="intro-image">
          <img src={doctorImage} alt="Doctor with patient" />
        </div>
        <div className="intro-message">
          <h2>Welcome to MediTrack</h2>
          <p>Your trusted healthcare partner for seamless appointment booking and real-time consultation tracking.</p>
          <div className="stats">
            <div className="stat-box">
              <strong>500+</strong>
              <span>Daily Appointments</span>
            </div>
            <div className="stat-box">
              <strong>99.8%</strong>
              <span>Patient Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Get Started */}
      <div className="get-started">
        <h3>Get Started</h3>
        <p>Choose your path to streamlined healthcare management.</p>
        <div className="options">
          <div className="option-card register">
            <h4>New Patient Registration</h4>
            <p>Join our healthcare platform and start booking appointments with our qualified doctors.</p>
            <button className="btn register-btn" onClick={() => navigate('/register-page')}>
              Register Now
            </button>
          </div>
          <div className="option-card signin">
            <h4>Existing User Sign In</h4>
            <p>Access your account to book appointments, view history, and track your consultations.</p>
            <button className="btn signin-btn" onClick={() => navigate('/sign-in')}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </section>
    </InternalLayout>
  );
};

export default WelcomePage;
