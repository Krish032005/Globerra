import "./CSS/Blog.css";
import Footer from "./Footer";
import Navbarone from "./Components/Navbarone";
import { useEffect, useState } from "react";
import API from "./api";

export default function Blog() {
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await API.get("/reviews");
      setReviews(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async () => {
    if (!message.trim()) {
      return alert("Please enter your review");
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      await API.post("/reviews", {
        user_id: savedUser?.id || null,
        name: savedUser?.full_name || "Guest User",
        email: savedUser?.email || "guest@example.com",
        message,
      });

      alert("Review submitted successfully");
      setMessage("");
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  const getInitials = (name) => {
    if (!name) return "G";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="home-main blog-nav">
        <Navbarone />

        <div className="blog-body">
          <div className="blog-heading">Write a review, make someone's trip</div>

          <div className="mb-3 blog-text">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter your Trip Experience"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <button
              type="button"
              className="btn btn-dark blog-submit"
              onClick={handleSubmitReview}
            >
              Submit
            </button>
          </div>

          <div className="container mt-5">
            <h2 className="feedback-heading">Traveller Feedback</h2>

            <div className="review-grid">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-top">
                      <div className="review-avatar">
                        {getInitials(review.name)}
                      </div>

                      <div className="review-user-info">
                        <h5>{review.name}</h5>
                        <p>{review.email}</p>
                      </div>
                    </div>

                    <p className="review-message">
                      {review.message}
                    </p>

                    <div className="review-bottom">
                      <div className="review-stars">★★★★★</div>
                      <span>
                        Reviewed on{" "}
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-review-text">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="blog-footer">
          <Footer />
        </div>
      </div>
    </>
  );
}