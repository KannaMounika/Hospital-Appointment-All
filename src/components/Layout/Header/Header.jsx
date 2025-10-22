import React from 'react';
import './Header.css';
// import heartbeatIcon from './heartbeat-icon.png'; // Replace with your actual logo path
 
const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-container">
          {/* <img src={heartbeatIcon} alt="MediTrack Logo" className="logo" /> */}
        </div>
        <div className="title-container">
          <div className="main-title">MediTrack</div>
          <div className="sub-title">Appointment Management</div>
        </div>
      </div>
      <div className="header-emergency">
        📞 Emergency: 102 🔔
      </div>
    </header>
  );
};
 
export default Header;