const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const dns = require("dns");

dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);

dotenv.config();

const app = express();

connectDB();


// =======================
// CORS
// =======================

const allowedOrigins = [
  "http://localhost:5173",
  "https://globerra-two.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);


// =======================
// MIDDLEWARE
// =======================

app.use(express.json());

app.use("/invoices", express.static("invoices"));


// =======================
// ROUTES
// =======================

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const blogRoutes = require("./routes/blogRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/blogs", blogRoutes);