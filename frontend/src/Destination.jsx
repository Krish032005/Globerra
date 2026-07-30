import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbarone from "./Components/Navbarone";
import "./CSS/Destination.css";
import { getPlaceImage } from "./Services/unsplash";

export default function Destination() {
    const [recommendedTrips, setRecommendedTrips] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const trips = [
            {
                id: 1,
                title: "Swiss Alps Retreat",
                location: "Swiss Alps",
                days: "6 Days / 5 Nights",
                budget: "₹70,000 - ₹1,10,000",
                description: "Snowy mountains, scenic train rides, charming villages, and peaceful nature views."
            },
            {
                id: 2,
                title: "Kyoto Heritage Tour",
                location: "Kyoto",
                days: "5 Days / 4 Nights",
                budget: "₹55,000 - ₹85,000",
                description: "Explore ancient temples, bamboo forests, traditional streets, and beautiful gardens."
            },
            {
                id: 3,
                title: "Maldives Luxury Escape",
                location: "Maldives",
                days: "4 Days / 3 Nights",
                budget: "₹80,000 - ₹1,40,000",
                description: "Crystal-clear water, private villas, relaxing beaches, and unforgettable sunsets."
            },
            {
                id: 4,
                title: "Iceland Northern Lights Trip",
                location: "Iceland",
                days: "7 Days / 6 Nights",
                budget: "₹95,000 - ₹1,50,000",
                description: "Chase the northern lights, waterfalls, glaciers, black sand beaches, and volcano landscapes."
            },
            {
                id: 5,
                title: "Cappadocia Balloon Journey",
                location: "Cappadocia",
                days: "4 Days / 3 Nights",
                budget: "₹45,000 - ₹75,000",
                description: "Hot air balloons, cave hotels, unique rock valleys, and magical sunrise views."
            },
            {
                id: 6,
                title: "Banff Nature Escape",
                location: "Banff",
                days: "5 Days / 4 Nights",
                budget: "₹65,000 - ₹1,00,000",
                description: "Turquoise lakes, mountain trails, wildlife, and one of the most beautiful national parks."
            }
        ];

        const loadTripsWithImages = async () => {
            const updatedTrips = await Promise.all(
                trips.map(async (trip) => {
                    const image = await getPlaceImage(trip.location);
                    return {
                        ...trip,
                        image
                    };
                })
            );

            setRecommendedTrips(updatedTrips);
        };

        loadTripsWithImages();
    }, []);

    const handleViewTrip = (placeName) => {
        navigate("/dashboard", {
            state: { destination: placeName }
        });
    };

    return (
        <>
            <div className="destination-main">
                <Navbarone />

                <div className="destination-tagline">
                    Where Will You Go Next?
                </div>
           
               
                 <div className="destination-container-outer">
                    <div className=" destination-head">Trending Trip Plan You Might Like !!</div>
                <div className="destination-container">
                    {recommendedTrips.map((trip) => (
                        <div className="trip-card" key={trip.id}>
                            <img
                                src={trip.image}
                                alt={trip.title}
                                className="trip-card-img"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
                                }}
                            />

                            <div className="trip-card-body">
                                <h3>{trip.title}</h3>
                                <p className="trip-location">{trip.location}</p>
                                <p>{trip.description}</p>

                                <div className="trip-details">
                                    <span>{trip.days}</span>
                                    <span>{trip.budget}</span>
                                </div>

                                <button
                                    className="trip-btn"
                                    onClick={() => handleViewTrip(trip.location)}
                                >
                                    View Trip
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                


            </div>
                     <Footer/>
            </div>
           
        </>
    );
}