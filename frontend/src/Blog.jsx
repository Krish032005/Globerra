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

    console.log("GET REVIEWS RESPONSE:", res.data);

    if (Array.isArray(res.data)) {
      setReviews(res.data);
    } else if (Array.isArray(res.data.reviews)) {
      setReviews(res.data.reviews);
    } else {
      setReviews([]);
    }

  } catch (err) {
    console.log("FETCH REVIEWS ERROR:", err);
    console.log("FETCH ERROR RESPONSE:", err.response?.data);
  }
};

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async () => {

    if (!message.trim()) {
      alert("Please enter your review");
      return;
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      console.log("USER FROM LOCAL STORAGE:", savedUser);

      const reviewData = {
        user_id: savedUser?.id || null,
        name: savedUser?.full_name || savedUser?.name || "Guest User",
        email: savedUser?.email || "guest@example.com",
        message: message.trim(),
      };

      console.log("REVIEW DATA:", reviewData);

      const res = await API.post("/reviews", reviewData);

      console.log("REVIEW RESPONSE:", res.data);

      alert("Review submitted successfully");

      setMessage("");

      fetchReviews();
    } catch (err) {
      console.log("SUBMIT REVIEW ERROR:", err);
      console.log("BACKEND RESPONSE:", err.response?.data);

      alert(
        err.response?.data?.message || "Failed to submit review"
      );
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
    <div className="home-main blog-nav">
      <Navbarone />

      <div className="blog-body">

        <div className="blog-heading">
          Write a review, make someone's trip
        </div>

        <div className="blog-review-form">

          <textarea
            className="form-control blog-textarea"
            rows="4"
            placeholder="Enter your Trip Experience"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type="button"
            className="btn btn-dark blog-submit"
            onClick={handleSubmitReview}
          >
            Submit
          </button>

        </div>

        <div className="review-container">

          <h2 className="feedback-heading">
            Traveller Feedback
          </h2>

          <div className="review-grid">

            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id || review._id}
                  className="review-card"
                >

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

                    <div className="review-stars">
                      ★★★★★
                    </div>

                    <span>
                      Reviewed on{" "}
                      {review.created_at
                        ? new Date(
                            review.created_at
                          ).toLocaleDateString()
                        : "Recently"}
                    </span>

                  </div>

                </div>
              ))
            ) : (
              <p className="no-review-text">
                No reviews yet.
              </p>
            )}

          </div>
        </div>
      </div>

      <div className="blog-footer">
        <Footer />
      </div>
    </div>
  );
}