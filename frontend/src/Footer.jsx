import "./CSS/Footer.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [showContact, setShowContact] = useState(false);

  const handleContactClick = () => {
    setShowContact(true);

    setTimeout(() => {
      setShowContact(false);
    }, 3000);
  };

  return (
    <div className="main-footer">

      <div className="footer">

        {/* Footer 1 */}
        <div className="footer1">
          <h3>Globerra</h3>

          <p>
            Discover the world's extraordinary places
            <br />
            across the world
          </p>

          <div className="contact-icons">
            <i
              className="fa-brands fa-instagram"
              style={{ fontSize: "2rem" }}
            ></i>

            <i
              className="fa-brands fa-facebook"
              style={{ fontSize: "2rem" }}
            ></i>
          </div>
        </div>


        {/* Footer 2 */}
        <div className="footer2">
          <h3>Company</h3>

          <ul>
            <li>
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            <li
              onClick={handleContactClick}
              className="contact-link"
            >
              Contact Us
            </li>

            <li>
              <Link className="nav-link" to="/blog">
                Blog
              </Link>
            </li>
          </ul>

          {showContact && (
            <div className="contact-toast">
              <p>
                <strong>Email:</strong>{" "}
                krishmehta382005@gmail.com
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                +91 1763762794
              </p>
            </div>
          )}
        </div>


        {/* Footer 3 */}
        <div className="footer3">
          <h3>Stay Updated</h3>

          <p>
            Subscribe, to get travel inspiration and updates
          </p>

          <div className="subscribe-row">

            <div className="subscribe-input">
              <label
                htmlFor="emailInput"
                className="visually-hidden"
              >
                Email
              </label>

              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="name@example.com"
              />
            </div>

            <button
              type="button"
              className="btn btn-dark subscribe-btn"
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>

          </div>
        </div>

      </div>


      {/* Line */}
      <div className="line"></div>


      {/* Bottom Footer */}
      <div className="footer4">

        <nav className="copy">
          <i className="fa-regular fa-copyright"></i>

          <p>
            2026 Globerra. All rights reserved.
          </p>
        </nav>

        <nav className="copy2">
          <p>Privacy</p>
          <p>Terms</p>
        </nav>

      </div>

    </div>
  );
}