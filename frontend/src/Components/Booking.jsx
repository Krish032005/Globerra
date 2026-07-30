import { useEffect, useState } from "react";
import "../CSS/Booking.css";
import Navbarone from "./Navbarone";
import Footer from "../Footer";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

import room1 from "../assets/room1.jpg";
import room2 from "../assets/room2.jpg";
import room3 from "../assets/room3.jpg";
import room4 from "../assets/room4.jpeg";

export default function Booking() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [extraBed, setExtraBed] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const images = [room1, room2, room3, room4];

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await API.get(`/hotels/${hotelId}`);
        setHotel(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHotel();
  }, [hotelId]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const totalAmount = ((hotel?.price_per_night || 129) * rooms) + extraBed * 500;

  const handleBooking = async () => {
    try {
      const res = await API.post("/bookings", {
        hotel_id: Number(hotelId),
        check_in: checkIn,
        check_out: checkOut,
        adults: adult,
        children,
        rooms,
        extra_bed: extraBed,
        total_amount: totalAmount,
      });

      alert("Booking successful");
      navigate(`/billing/${res.data.bookingId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <>
      <Navbarone />

      <div className="booking-page">
        <div className="booking-container">
          <div className="booking-slider">
            <img
              src={images[currentSlide]}
              alt={`Room ${currentSlide + 1}`}
              className="booking-main-image"
            />

            <button className="slider-btn prev-btn btn btn-primary" onClick={prevSlide}>
              &#10094;
            </button>

            <button className="slider-btn next-btn btn btn-primary" onClick={nextSlide}>
              &#10095;
            </button>
          </div>

          <div className="booking-form-box">
            <div className="booking-header">
              <h2>{hotel?.hotel_name || "Reserve"}</h2>
              <p>
                From <span>₹{hotel?.price_per_night || 129}</span> / night
              </p>
            </div>

            <div className="date-section">
              <div className="date-box">
                <label>Check In</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              </div>

              <div className="date-box">
                <label>Check Out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </div>
            </div>

            <div className="counter-grid">
              <div className="counter-item">
                <label>Adult</label>
                <div className="counter-box">
                  <button className="btn btn-primary" onClick={() => setAdult(adult > 1 ? adult - 1 : 1)}>-</button>
                  <span>{adult}</span>
                  <button className="btn btn-primary" onClick={() => setAdult(adult + 1)}>+</button>
                </div>
              </div>

              <div className="counter-item">
                <label>Children</label>
                <div className="counter-box">
                  <button className="btn btn-primary" onClick={() => setChildren(children > 0 ? children - 1 : 0)}>-</button>
                  <span>{children}</span>
                  <button className="btn btn-primary" onClick={() => setChildren(children + 1)}>+</button>
                </div>
              </div>

              <div className="counter-item">
                <label>Rooms</label>
                <div className="counter-box">
                  <button className="btn btn-primary" onClick={() => setRooms(rooms > 1 ? rooms - 1 : 1)}>-</button>
                  <span>{rooms}</span>
                  <button className="btn btn-primary" onClick={() => setRooms(rooms + 1)}>+</button>
                </div>
              </div>

              <div className="counter-item">
                <label>Extra Bed</label>
                <div className="counter-box">
                  <button className="btn btn-primary" onClick={() => setExtraBed(extraBed > 0 ? extraBed - 1 : 0)}>-</button>
                  <span>{extraBed}</span>
                  <button className="btn btn-primary" onClick={() => setExtraBed(extraBed + 1)}>+</button>
                </div>
              </div>
            </div>

            <h5 className="mt-3">Total: ₹{totalAmount}</h5>

            <button className="confirm-booking-btn btn btn-primary" onClick={handleBooking}>
              Book Now
            </button>
          </div>

        </div>

        <div className="room-details-section">
           <p className="room-description">
             Designed for travelers who prioritize essential comfort and value,
             the Standard Room features modern furnishings and warm ambient
             lighting.
           </p>

           <h2 className="amenities-title">Room Amenities</h2>

           <div className="amenities-grid">
             <ul>               <li>Free Wi-Fi</li>
               <li>Smart TV</li>
               <li>Minibar</li>
               <li>Tea & Coffee Maker</li>
               <li>Safe Deposit Box</li>
               <li>Standard Shower</li>
             </ul>

             <ul>
               <li>Queen Bed</li>
               <li>Modern Bathroom</li>
               <li>Essential Toiletries</li>
               <li>Workspace Desk</li>
               <li>Air Conditioning</li>
               <li>In-Room Dining</li>
             </ul>
           </div>
         </div>
      </div>
      
      <Footer />
    </>
  );
}