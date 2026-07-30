import './CSS/Footer.css';
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer(){

    const [showContact, setShowContact] = useState(false);

    const handleContactClick = () => {
        setShowContact(true);

        setTimeout(() => {
         setShowContact(false);
        }, 3000);
    };

    return(
        <>
        <div className="main-footer">
<div className="footer">
    <div className="footer1">
        <h3>Globerra</h3>
        <p style={{color:"white"}}>Discover the world's extraordinary place's<br/>across the world</p>
        <div className="contact-icons">
            <i class="fa-brands fa-instagram" style={{fontSize:"2rem"}}></i>
            <i class="fa-brands fa-facebook" style={{fontSize:"2rem"}}></i>
        </div>
    </div> 

        <div className="footer2">
            <h3>Company</h3>
            <ul>
                <li><Link className="nav-link" to="/about">About</Link></li>
                <li onClick={handleContactClick} className="contact-link">Contact Us </li>
                <li><Link className="nav-link" to="/blog">Blog</Link></li>
            </ul>
            {showContact && (
        <div className="contact-toast">
          <p><strong>Email:</strong> krishmehta382005@gmail.com</p>
          <p><strong>Phone:</strong> +91 1763762794</p>
        </div>
      )}
        </div>
<div className="footer3">
            <h3>Stay Updated</h3>
            <p style={{color:"white"}}>Subscribe, to Get travel inspiration and updates</p>
<div className="row">
    <div class="col-auto">
        <label for="inputPassword2" class="visually-hidden"></label>
        <input type="text" class="form-control" id="inputPassword2" placeholder="name@example.com"/>
    </div>
    <div class="col-auto">
        <button type="submit" class="btn btn-dark mb-3"><i class="fa-solid fa-arrow-right"></i></button>
    </div>
</div>
</div>
        
</div>
<div className="line"></div>

<div className="footer4">
    <nav className="copy">
        <i class="fa-regular fa-copyright"></i>
        <p>2026 Globerra. All rights reserved.</p>
    </nav>
    <nav className="copy2">
        <p>Privacy</p>
        <p>Terms</p>
    </nav>
    

   </div>
</div>
        </>
    );
}