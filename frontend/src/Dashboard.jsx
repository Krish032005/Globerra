import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbarone from "./Components/Navbarone";
import "./CSS/Dashboard.css";
import API from "./api";

import img1 from "./assets/BaliBeach.avif";
import img11 from "./assets/Tokyo.avif";
import img12 from "./assets/Barcelona.avif";
import img2 from "./assets/MuntFuji.avif";

export default function Dashboard() {
  const images = [img1, img11, img12, img2];
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const [boarding, setBoarding] = useState("");
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [days, setDays] = useState(1);
  const [travellers, setTravellers] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(slideInterval);
  }, [images.length]);

  const handleGenerateTrip = async () => {
    if (!boarding || !destination || !fromDate || !toDate) {
      return alert("Please fill all fields");
    }

    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User from localStorage:", user);

    if (!user || !user.id) {
      return alert("Please login first");
    }

    try {
      setLoading(true);

      const payload = {
        user_id: user.id,
        boarding,
        destination,
        budget: "Custom",
        days,
        travellers,
        travel_date: fromDate,
        return_date: toDate,
        interests: "General travel",
      };

      console.log("Trip payload:", payload);

      const res = await API.post("/trips/generate", payload);

      console.log("Generate trip response:", res.data);

      navigate("/generated-trip", {
        state: {
          destination,
          tripId: res.data.tripId,
        },
      });
    } catch (err) {
      console.error("Trip generation error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Trip generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbarone />

      <div
        className="dashboard-hero"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      >
        <div className="dashboard-overlay"></div>

        <div className="availability-card">
          <div className="availability-grid">
            <div className="input-box">
              <label>Boarding</label>
              <input
                type="text"
                placeholder="Enter Boarding"
                value={boarding}
                onChange={(e) => setBoarding(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label>Destination</label>
              <input
                type="text"
                placeholder="Enter Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label>From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label>To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="input-box">
              <label>Number of Days</label>
              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </div>

            <div className="input-box">
              <label>Number of Traveller</label>
              <input
                type="number"
                min="1"
                value={travellers}
                onChange={(e) => setTravellers(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="button-center">
            <button
              className="availability-btn"
              onClick={handleGenerateTrip}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Trip"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}