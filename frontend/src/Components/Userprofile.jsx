import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbarone from "./Navbarone";
import API from "../api";
import "../CSS/Userprofile.css";
import { getDestinationImage } from "../Services/unsplash";

export default function Userprofile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [tripImages, setTripImages] = useState({});

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      navigate("/loginone");
      return;
    }

    setUser(savedUser);
    fetchUserTrips(savedUser.id);
    fetchUserBookings(savedUser.id);
  }, [navigate]);

  const fetchTripImages = async (tripList) => {
    try {
      const imageMap = {};

      for (const trip of tripList) {
        if (trip.destination && !imageMap[trip.destination]) {
          const image = await getDestinationImage(trip.destination);
          imageMap[trip.destination] = image;
        }
      }

      setTripImages(imageMap);
    } catch (error) {
      console.error("Error fetching trip images:", error);
    }
  };

  const fetchUserTrips = async (userId) => {
    try {
      const res = await API.get(`/trips/user/${userId}`);
      const tripData = res.data || [];
      setTrips(tripData);
      await fetchTripImages(tripData);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setTrips([]);
    } finally {
      setLoadingTrips(false);
    }
  };

  const fetchUserBookings = async (userId) => {
    try {
      const res = await API.get(`/bookings/user/${userId}`);
      setBookings(res.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/loginone");
    window.location.reload();
  };

  const renderPlanPreview = (generatedPlan) => {
    if (!generatedPlan) return "No plan generated.";

    if (typeof generatedPlan === "string") return generatedPlan;

    if (generatedPlan?.days?.length > 0) {
      const firstDay = generatedPlan.days[0];
      const firstPlace = firstDay?.places?.[0];

      if (firstPlace) {
        return `${firstPlace.placeName} - ${firstPlace.description}`;
      }

      return `Day ${firstDay.day} planned`;
    }

    return "Trip plan available";
  };

  return (
    <>
      <Navbarone />

      <div className="userprofile-page">
        <div className="userprofile-header">
          <div>
            <h2>{user ? `${user.full_name}'s Profile` : "User Profile"}</h2>
            <p>See your generated trips and hotel bookings here.</p>
          </div>

          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <section className="profile-section">
          <h3 className="section-title">Generated Trips</h3>

          {loadingTrips ? (
            <p className="empty-text">Loading trips...</p>
          ) : trips.length === 0 ? (
            <p className="empty-text">No generated trips found.</p>
          ) : (
            <div className="profile-card-grid">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="profile-info-card trip-card trip-card-clickable"
                  onClick={() =>
                    navigate("/generated-trip", {
                      state: {
                        tripId: trip.id,
                        destination: trip.destination,
                      },
                    })
                  }
                >
                  <div className="trip-image-wrapper">
                    <img
                      src={
                        tripImages[trip.destination] ||
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={trip.destination}
                      className="trip-image"
                    />
                    <div className="trip-image-overlay">
                      <h4>{trip.destination}</h4>
                      <span className="badge bg-primary">
                        {trip.days} Days
                      </span>
                    </div>
                  </div>

                  <div className="trip-card-content">
                    <p><strong>Boarding:</strong> {trip.boarding}</p>
                    <p><strong>From:</strong> {trip.travel_date}</p>
                    <p><strong>To:</strong> {trip.return_date}</p>
                    <p><strong>Travellers:</strong> {trip.travellers}</p>
                    <p><strong>Budget:</strong> {trip.budget || "Not specified"}</p>

                    <div className="generated-plan-box">
                      <strong>Trip Preview:</strong>
                      <p>{renderPlanPreview(trip.generated_plan)}</p>
                    </div>

                    <button
                      className="btn btn-primary mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/generated-trip", {
                          state: {
                            tripId: trip.id,
                            destination: trip.destination,
                          },
                        });
                      }}
                    >
                      View Full Trip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="profile-section">
          <h3 className="section-title">Hotel Bookings</h3>

          {loadingBookings ? (
            <p className="empty-text">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="empty-text">No hotel bookings found.</p>
          ) : (
            <div className="profile-card-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="profile-info-card booking-card">
                  <img
                    src={
                      booking.room_image ||
                      booking.image_url ||
                      "https://via.placeholder.com/400x220?text=Hotel+Image"
                    }
                    alt={booking.hotel_name}
                    className="booking-image"
                  />

                  <div className="booking-body">
                    <h4>{booking.hotel_name}</h4>
                    <p><strong>Location:</strong> {booking.location}</p>
                    <p><strong>Check In:</strong> {booking.check_in}</p>
                    <p><strong>Check Out:</strong> {booking.check_out}</p>
                    <p><strong>Adults:</strong> {booking.adults}</p>
                    <p><strong>Children:</strong> {booking.children}</p>
                    <p><strong>Rooms:</strong> {booking.rooms}</p>
                    <p><strong>Amount:</strong> ₹{booking.total_amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}