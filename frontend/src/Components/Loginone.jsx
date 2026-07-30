import { useState } from "react";
import "../CSS/Loginone.css";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Loginone() {
  const [isSignup, setIsSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return alert("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await API.post("/auth/register", {
        full_name: fullName,
        email,
        phone,
        password,
      });

      alert(res.data.message);
      setIsSignup(false);
      setFullName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Please enter email and password");
    }

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful");
      navigate("/dashboard");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleSendOtp = async () => {
    if (!email) return alert("Enter email");

    try {
      const res = await API.post("/auth/send-otp", { email });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      alert(res.data.message);
      setIsOtpVerified(true);
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResetPassword = async () => {
    if (!isOtpVerified) {
      return alert("Please verify OTP first");
    }

    try {
      const res = await API.post("/auth/reset-password", {
        email,
        newPassword,
      });

      alert(res.data.message);
      setShowForgot(false);
      setOtp("");
      setNewPassword("");
      setIsOtpVerified(false);
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="loginone-page">
      <div className="loginone-overlay"></div>

      <div className="loginone-box">
        <button className="close-btn" onClick={() => navigate("/")}>
          &times;
        </button>

        <h2>
          {showForgot
            ? "Reset Password"
            : isSignup
            ? "Create your Globerra account"
            : "Sign in to Globerra"}
        </h2>

        {!showForgot ? (
          <form className="loginone-form" onSubmit={isSignup ? handleRegister : handleLogin}>
            {isSignup && (
              <>
                <div className="input-group">
                  <label>Full name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Phone number</label>
                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isSignup && (
              <div className="input-group">
                <label>Confirm password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {!isSignup && (
              <div className="extra-options">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  style={{ background: "none", border: "none", color: "#0d6efd" }}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" className="continue-btn">
              {isSignup ? "Sign Up" : "Continue"}
            </button>
          </form>
        ) : (
          <div className="loginone-form">
            <div className="input-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="button" className="continue-btn" onClick={handleSendOtp}>
              Send OTP
            </button>

            <div className="input-group">
              <label>OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button type="button" className="continue-btn" onClick={handleVerifyOtp}>
              Verify OTP
            </button>

            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button type="button" className="continue-btn" onClick={handleResetPassword}>
              Reset Password
            </button>

            <div className="bottom-text">
              <span onClick={() => setShowForgot(false)}>Back to Sign in</span>
            </div>
          </div>
        )}

        {!showForgot && (
          <div className="bottom-text">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsSignup(false)}>Sign in</span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span onClick={() => setIsSignup(true)}>Sign up</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}