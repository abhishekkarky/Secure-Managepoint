import React from 'react';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <footer>
        <div className="footer-head">
          <div className="footer-first">
            <div className="footer-first-logo">
              <img src="/assets/images/mp-logo.png" alt="" />
            </div>
          </div>
          <br />
          {user ? (
            <>
              {/* Logged-in version */}
              <div className="footer-second">
                <h3>QuickLinks</h3>
                <br />
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/subscriber">Subscribers</Link></li>
                  <li><Link to="/broadcast">Broadcast</Link></li>
                  <li><Link to={`/editProfile/${user._id}`}>Profile</Link></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Logged-out version */}
              <div className="footer-second">
                <h3>Need Help?</h3>
                <br />
                <ul>
                  <li><Link to="/resetpassword">Reset Password</Link></li>
                  <li><Link to="/faqs">FAQs</Link></li>
                </ul>
              </div>
            </>
          )}
          <br />
          <div className="footer-third">
            <h3>Contact Us</h3>
            <br />
            <ul>
              <li><i className="fa-solid fa-location-dot"></i> <p> Butwal, Nepal</p></li>
              <li><i className="fa-solid fa-phone"></i> <p> +977 9846931874</p></li>
              <li><i className="fa-brands fa-whatsapp"></i> <p> +977 9822797614</p></li>
            </ul>
          </div>
          <br />
          <div className="footer-forth">
            <h3>Follow Us</h3>
            <br />
            <ul>
              <li><a className="footer-description-anchor" href="https://www.facebook.com/profile.php?id=100089357031381&mibextid=ZbWKwL"><img className="footer-links" src="/assets/images/facebook 2.png" alt="" /></a></li>
              <li><a className="footer-description-anchor" href="https://www.instagram.com/nishandrinkingwater"><img className="footer-links" src="/assets/images/instagram.png" alt="" /></a></li>
              <li><a className="footer-description-anchor" href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCKCCRsSrLMJZVSjtzdQdHRFDPqdcmWjlFhhsqsCwWcQVRQwTcQcwgtvjnfnTTpJzPWnrwQB"><img className="footer-links" src="/assets/images/gmail.png" alt="" /></a></li>
            </ul>
          </div>
        </div>
        <div className="footer-tail">
          <p><a className="dev-name" href="https://abhishek-karki.com.np">Abhishek Karki</a> <i className="fa-regular fa-copyright"></i> ManagePoint </p>
          <p className="footer-tail-rights-text"> All rights reserved Copyrights 2024</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
