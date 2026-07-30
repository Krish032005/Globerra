import React from "react";
import './CSS/Contenthome.css';
import { useNavigate } from "react-router-dom";
import Tourcards from "./Tourcards";
function Contenthome(){
    const navigate = useNavigate();
    return(
        <>
        <div className="tagline">
    <p className="short-tagline">The Ultimate Trip Experience</p>
    <h1>Discover Your Perfect <br /> Gateway Destination</h1>
    <p>Unforgettable destinations, seamless planning, and personalized travel experiences <br />— all in one place. Start crafting your dream adventure today.</p>
       <center><button type="button" class="btn btn-dark signing" onClick={()=>{navigate("/Dashboard")}} >Get Started</button></center>
    
   </div>
        </>
    );
}
export default Contenthome