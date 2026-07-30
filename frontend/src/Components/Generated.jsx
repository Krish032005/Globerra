import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbarone from "./Navbarone";
import API from "../api";
import "../CSS/Generated.css";
import { getDestinationImage, getPlaceImage } from "../Services/unsplash";

export default function Generated() {
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.destination || "";
  const tripId = location.state?.tripId;

  const [hotels, setHotels] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [destinationImage, setDestinationImage] = useState("");
  const [activityImages, setActivityImages] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchActivityImages = async (generatedPlan) => {
    if (!generatedPlan?.days?.length) return;

    const imageMap = {};

    for (const dayObj of generatedPlan.days) {
      for (const place of dayObj.places || []) {
        const key = place.placeName;
        if (!imageMap[key]) {
          const image = await getPlaceImage(`${place.placeName} ${destination}`);
          imageMap[key] = image;
        }
      }
    }

    setActivityImages(imageMap);
  };

  const fetchData = async () => {
    try {
      let fetchedHotels = [];

      if (destination) {
        const [hotelsRes, destImg] = await Promise.all([
          API.get(`/hotels/destination/${destination}`),
          getDestinationImage(destination),
        ]);

        fetchedHotels = hotelsRes.data || [];
        setDestinationImage(destImg);
      }

      // If no destination hotels found, fetch any 5 hotels from database
      if (fetchedHotels.length === 0) {
        const fallbackHotelsRes = await API.get("/hotels?limit=5");
        fetchedHotels = fallbackHotelsRes.data || [];
      }

      setHotels(fetchedHotels);

      if (tripId) {
        const tripRes = await API.get(`/trips/${tripId}`);
        setTrip(tripRes.data);

        if (tripRes.data?.generated_plan) {
          await fetchActivityImages(tripRes.data.generated_plan);
        }
      }
    } catch (error) {
      console.error("Error fetching generated page data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "120px" }}>
        Loading trip...
      </h2>
    );
  }

  return (
    <>
      <Navbarone />

      <div className="generated-trip-page">
        {destination && (
          <section className="destination-banner">
            <div className="destination-banner-image-wrapper">
              <img
                src={
                  destinationImage ||
                  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80"
                }
                alt={destination}
                className="destination-banner-image"
              />
              <div className="destination-banner-overlay">
                <h2>{destination}</h2>
                <p>Your selected destination</p>
              </div>
            </div>
          </section>
        )}

        <section className="hotel-section">
  <h3>Also Check Out Hotel's Affiliated With Globerra </h3>

  <div className="row g-4">
    {hotels.map((hotel) => (
      <div className="col-lg-3 col-md-6" key={hotel.id}>
        <div className="hotel-card h-100">
          <img
            src={
              hotel.image_url ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
            }
            alt={hotel.hotel_name}
            className="hotel-img"
          />
          <div className="hotel-info">
            <h4>{hotel.hotel_name}</h4>
            <p>📍 {hotel.location}</p>
            <p>💰 ₹{hotel.price_per_night}</p>
            <p>⭐ {hotel.rating || "4.5"}</p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => navigate(`/booking/${hotel.id}`)}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
        
        


        <section className="trip-planned-section">
          <h3>Places to Visit</h3>

          {trip?.generated_plan?.days?.length > 0 ? (
            trip.generated_plan.days.map((dayObj, index) => (
              <div className="day-block" key={index}>
                <h4>Day {dayObj.day}</h4>

                <div className="places-grid">
                  {dayObj.places?.map((place, idx) => (
                    <div className="place-card" key={idx}>
                      <img
                        src={
                          activityImages[place.placeName] ||
                          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                        }
                        alt={place.placeName}
                        className="place-img"
                      />

                      <div className="place-card-body">
                        <div className="place-time">{place.time}</div>
                        <h5>{place.placeName}</h5>
                        <p>{place.description}</p>
                        <p>🕒 {place.duration}</p>
                        <p>🎟️ {place.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No trip plan generated</p>
          )}
        </section>
      </div>
    </>
  );
}