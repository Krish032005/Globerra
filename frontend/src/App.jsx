import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "./About";
import Blog from "./Blog";
import Dashboard from "./Dashboard";
import Destination from "./Destination";
import Homeone from "./Components/Homeone";
import Loginone from "./Components/Loginone";
import Hotel from "./Components/Hotels";
import Booking from "./Components/Booking";
import Billing from "./Components/Billing";
import Generated from "./Components/Generated";
import Userprofile from "./Components/Userprofile";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homeone />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/loginone" element={<Loginone />} />
        <Route path="/userprofile" element={<Userprofile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generated-trip" element={<Generated />} />
        <Route path="/hotels" element={<Hotel />} />
        <Route path="/booking/:hotelId" element={<Booking />} />
        <Route path="/billing/:bookingId" element={<Billing />} />
      </Routes>
    </>
  );
}

export default App;