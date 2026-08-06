const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const axios = require("axios");
const generateInvoice = require("../utils/generateInvoice");
const sendEmail = require("../utils/sendEmail");

exports.createCashfreeOrder = async (req, res) => {
  try {
    const { booking_id } = req.body;

    const booking = await Booking.findById(booking_id).populate("hotel_id");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const orderData = {
      order_id: `globerra_order_${booking._id}_${Date.now()}`,
      order_amount: Number(booking.total_amount),
      order_currency: "INR",

      customer_details: {
        customer_id: `customer_${booking.user_id}`,
        customer_name: booking.guest_name || "Globerra User",
        customer_email: booking.guest_email || "guest@example.com",
        customer_phone: booking.guest_phone || "9999999999",
      },

      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/billing/${booking._id}?order_id={order_id}`,
      },
    };

    const cfRes = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      orderData,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      message: "Cashfree order created",
      order_id: cfRes.data.order_id,
      payment_session_id: cfRes.data.payment_session_id,
    });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to create Cashfree order",
    });

  }
};

exports.verifyPayment = async (req, res) => {

  try {

    const {
      order_id,
      booking_id,
      payment_method,
    } = req.body;

    const verifyRes = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${order_id}/payments`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      }
    );

    const payments = verifyRes.data || [];

    const successPayment = payments.find(
      (item) => item.payment_status === "SUCCESS"
    );

    if (!successPayment) {
      return res.status(400).json({
        message: "Payment not completed yet",
      });
    }

    const booking = await Booking.findById(booking_id).populate("hotel_id");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const payment = await Payment.create({
      booking_id,
      payment_method: payment_method || "Cashfree",
      payment_status: "Paid",
      amount: booking.total_amount,
      cashfree_order_id: order_id,
    });

    const invoiceInfo = await generateInvoice(
      booking,
      payment,
      booking
    );

    if (booking.guest_email) {

      await sendEmail({
        to: booking.guest_email,
        subject: "Globerra Booking Invoice",
        text: "Your invoice is attached.",
        html: "<h3>Your Globerra invoice is attached.</h3>",
        attachments: [
          {
            filename: invoiceInfo.fileName,
            path: invoiceInfo.filePath,
          },
        ],
      });

    }

    res.json({
      message: "Payment verified successfully",
      invoiceUrl: `${process.env.BACKEND_URL}/invoices/${invoiceInfo.fileName}`,
    });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Payment verification failed",
    });

  }

};