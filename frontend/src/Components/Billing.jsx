import { useEffect, useState } from "react";
import "../CSS/Billing.css";
import { useParams } from "react-router-dom";
import Navbarone from "./Navbarone";
import API from "../api";

import room1 from "../assets/room1.jpg";
import room2 from "../assets/room2.jpg";
import room3 from "../assets/room3.jpg";
import room4 from "../assets/room4.jpeg";

export default function Billing() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const [customer, setCustomer] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    guest_address: "",
  });

  const images = [
    booking?.image_url || room1,
    room2,
    room3,
    room4,
  ];

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await API.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    try {
      await API.put(`/bookings/${bookingId}/customer`, customer);

      const orderRes = await API.post("/payments/create-order", {
        booking_id: Number(bookingId),
      });

      const paymentSessionId = orderRes.data.payment_session_id;

      if (!window.Cashfree) {
        alert("Cashfree SDK not loaded");
        return;
      }

      const cashfree = window.Cashfree({ mode: "sandbox" });

      const result = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      });

      if (result) {
        const verifyRes = await API.post("/payments/verify", {
          booking_id: Number(bookingId),
          order_id: orderRes.data.order_id,
          payment_method: "Cashfree",
        });

        alert(verifyRes.data.message);
        setInvoiceUrl(verifyRes.data.invoiceUrl);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <>
      <Navbarone />
      <div className="container py-5">
        <h1 className="mb-4">Billing</h1>

        {booking ? (
          <div className="card p-4 shadow">
            <div className="row">
              <div className="col-md-6 mb-4">
                <div style={{ position: "relative" }}>
                  <img
                    src={images[currentSlide]}
                    alt="Room"
                    className="img-fluid rounded"
                    style={{ width: "100%", height: "350px", objectFit: "cover" }}
                  />
                  <button className="btn btn-primary" style={{ position: "absolute", top: "45%", left: "10px" }} onClick={prevSlide}>
                    &#10094;
                  </button>
                  <button className="btn btn-primary" style={{ position: "absolute", top: "45%", right: "10px" }} onClick={nextSlide}>
                    &#10095;
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <h3>{booking.hotel_name}</h3>
                <p><strong>Location:</strong> {booking.location}</p>
                <p><strong>Check In:</strong> {booking.check_in}</p>
                <p><strong>Check Out:</strong> {booking.check_out}</p>
                <p><strong>Adults:</strong> {booking.adults}</p>
                <p><strong>Children:</strong> {booking.children}</p>
                <p><strong>Rooms:</strong> {booking.rooms}</p>
                <p><strong>Extra Bed:</strong> {booking.extra_bed}</p>
                <p><strong>Total Amount:</strong> ₹{booking.total_amount}</p>

                <input
                  className="form-control mb-2"
                  name="guest_name"
                  placeholder="Full Name"
                  value={customer.guest_name}
                  onChange={handleInputChange}
                />
                <input
                  className="form-control mb-2"
                  name="guest_email"
                  placeholder="Email"
                  value={customer.guest_email}
                  onChange={handleInputChange}
                />
                <input
                  className="form-control mb-2"
                  name="guest_phone"
                  placeholder="Phone"
                  value={customer.guest_phone}
                  onChange={handleInputChange}
                />
                <textarea
                  className="form-control mb-3"
                  name="guest_address"
                  placeholder="Address"
                  value={customer.guest_address}
                  onChange={handleInputChange}
                />

                <button className="btn btn-primary" onClick={handlePayment}>
                  Pay Now
                </button>

                {invoiceUrl && (
                  <div className="mt-3">
                    <a
                      href={invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success"
                    >
                      Download Invoice
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading booking details...</p>
        )}
      </div>
    </>
  );
}