import { useEffect, useState } from "react";
import Navbarone from "./Navbarone";
import "../CSS/Hotel.css";
import hotelVideo from "../assets/hotelOne.mp4";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Hotel() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await API.get("/hotels");
        setHotels(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHotels();
  }, []);

  return (
    <>
      <Navbarone />

      <section className="hotel-hero">
        <video className="hotel-video" autoPlay loop muted playsInline>
          <source src={hotelVideo} type="video/mp4" />
        </video>

        <div className="hotel-overlay"></div>

        <div className="hotel-content">
          <p className="hotel-tag">Stay Beyond Ordinary</p>
          <h1>
            Discover Premium Stays
            <br />
            For Every Journey
          </h1>
          <p className="hotel-desc">
            Explore beautiful hotels, elegant rooms, and comfortable stays
            curated for your next Globerra adventure.
          </p>
        </div>
      </section>

      <section className="globerra-hotels">
        <p className="section-tag">Enjoy Your Stay</p>
        <h2>Hotels Affiliated with Globerra</h2>
        <p className="section-desc">
          Discover a curated collection of elegant hotels and rooms designed for
          comfort, luxury, and memorable travel experiences.
        </p>

        <div className="hotel-card-container">
          {hotels.map((hotel) => (
            <div className="hotel-card" key={hotel._id}>
              <div className="hotel-card-image">
                <img src={hotel.image_url} alt={hotel.hotel_name} />
                <span className="hotel-badge">{hotel.tag || "Available"}</span>
              </div>

              <div className="hotel-card-content">
                <h3>{hotel.hotel_name}</h3>
                <p className="hotel-location">{hotel.location}</p>
                <div className="hotel-card-bottom">
                  <span className="hotel-price">₹{hotel.price_per_night} / night</span>
                  <button onClick={() => navigate(`/booking/${hotel._id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}