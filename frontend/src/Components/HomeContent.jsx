import { useEffect, useState } from "react";
import "../CSS/HomeContent.css";

import img1 from '../assets/BaliBeach.avif';
import img11 from '../assets/Tokyo.avif';
import img12 from '../assets/Barcelona.avif';
import img2 from '../assets/MuntFuji.avif';
import { useNavigate } from 'react-router-dom';

export default function HomeContent() {
    const navigate = useNavigate();
  const images = [
    
    img1,img11,img12,img2
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <div className="homeContent-container">
        {images.map((img, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        ))}

        <div className="overlay">
            <p className="first-tag">The Ultimate Trip Experience</p>
          <h1>Discover Your Perfect <br /> Gateway Destination</h1>
          <p>Plan your perfect trip with beautiful destinations and smart travel ideas.</p>
          <button className="btn btn-primary" onClick={()=>navigate("/Loginone")}>Get Started</button>
        </div>
       

      </div>
    </>
  );
}