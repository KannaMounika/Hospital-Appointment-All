import './Footer.css';
import phoneIcon from '../../../icons/phone.svg';
import emailIcon from '../../../icons/email.svg';
import locationIcon from '../../../icons/location.svg';
import facebookIcon from '../../../icons/facebook.svg';
import twitterIcon from '../../../icons/twitter.svg';
import instagramIcon from '../../../icons/instagram.svg';
import linkedinIcon from '../../../icons/linkedin.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-contact">
        <div className="footer-item">
          <img src={phoneIcon} alt="Phone" className="footer-icon" />
          <span>Emergency: 102 | Support: +91-1800-XXX-XXXX</span>
        </div>
        <div className="footer-item">
          <img src={emailIcon} alt="Email" className="footer-icon" />
          <span>support@healthbook.in</span>
        </div>
        <div className="footer-item">
          <img src={locationIcon} alt="Location" className="footer-icon" />
          <span>Mumbai, Delhi, Bangalore, Chennai</span>
        </div>
      </div>


      <div className="footer-social">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <img src={facebookIcon} alt="Facebook" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <img src={twitterIcon} alt="Twitter" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <img src={instagramIcon} alt="Instagram" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <img src={linkedinIcon} alt="LinkedIn" />
        </a>
      </div>


      <div className="footer-bottom">
        <p>© 2024 HealthBook. All rights reserved.</p>
        <p>Made with ❤️ in India</p>
      </div>
    </footer>
  );
};

export default Footer;