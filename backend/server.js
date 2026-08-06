const express = require("express");   
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const dns = require("dns");
dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
])

dotenv.config();
const app = express();

connectDB();


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use("/invoices", express.static("invoices"));

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
app.use(express.json());
app.use("/api/reviews", blogRoutes);

app.get("/api/test-gemini", async (req, res) => {
  try {
    const axios = require("axios");

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: 'Reply only in JSON: {"message":"hello"}',
              },
            ],
          },
        ],
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    res.json({
      success: true,
      geminiText: text,
      fullResponse: response.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});