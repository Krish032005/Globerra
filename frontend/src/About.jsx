import './CSS/About.css';
import Footer from './Footer';
import about1 from './assets/aboutImg.jpg';
import { useNavigate } from "react-router-dom";
import Navbarone from './Components/Navbarone';
export default function About(){
    const navigate = useNavigate();
    return (
        <>
        <div className="about-main">

           
            <Navbarone/>
            <center>
                <div className="about-body">
                    <h3>About Us</h3>
                    <p className='top-p'>Welcome to Globerra – your smart and personalized trip planning companion.</p>
                    <p>At Globerra, we believe that every journey should be as unique as the traveler. Planning a trip can often feel overwhelming — choosing destinations, organizing itineraries, managing budgets, and coordinating schedules. That’s where we step in.</p>
                    <div className="about-card">
                        <img src={about1} alt="" className='about-img'/>
                        <div className="content one">
                            <h4>Why Choose Globerra?</h4>
                            <ul className='unordered-style'>
                                
                                <li> Personalized trip planning</li>
                                <li> Easy-to-use interface</li>
                                <li> Organized itinerary creation</li>
                                <li> Budget-friendly planning options</li>
                                <li> Suitable for solo travelers, families, and groups</li>
                            </ul>
                            
                        </div>
                        <div className="content two">
                            <h4>Our Mission</h4>
                            <ul className='unordered-style'>

                                <p>We aim to eliminate the stress of organizing trips by providing a platform where users can:</p>
                                <li>Select destinations based on their interests</li>
                                <li>Customize itineraries day-by-day</li>
                                <li>Plan according to budget preferences</li>
                            </ul>
                        </div>
                    </div>
                        
                        <div className="about-card">
                            
                        
                        <div className="content three">
                            <h4>Our Vision</h4>
                            <p>At Globerra, we envision a world where travel planning is exciting, not stressful. A world where every traveler can design their perfect journey without confusion or compromise.</p>
                        </div>
                        



                         
                         
                    </div>
                    
            </div>
            </center>
            




        </div>
        <Footer/>
        </>
    )
}