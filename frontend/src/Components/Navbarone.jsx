import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Navbarone.css";

export default function Navbarone() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/loginone");
    window.location.reload();
  };

  return (
    <nav className="navbarone">
      <div className="navbarone-logo">
        <h1>Globerra</h1>
      </div>

      <ul className={`navbarone-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/destination">Destinations</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/hotels">Hotels</Link></li>
      </ul>

      {user ? (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className="navbarone-btn btn btn-primary"
            onClick={() => navigate("/userprofile")}
          >
            Welcome, {user.full_name}
          </button>

          <button className="btn btn-outline-dark" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <button
          className="navbarone-btn btn btn-primary"
          onClick={() => navigate("/loginone")}
        >
          Login
        </button>
      )}

      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}