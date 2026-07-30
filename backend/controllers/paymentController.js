const db = require("../config/db");
const axios = require("axios");
const path = require("path");
const generateInvoice = require("../utils/generateInvoice");
const sendEmail = require("../utils/sendEmail");

exports.createCashfreeOrder = async (req, res) => {
  try {
    const { booking_id } = req.body;

    const bookingSql = `
      SELECT b.*, h.hotel_name, h.location, h.image_url
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      WHERE b.id = ?
    `;

    db.query(bookingSql, [booking_id], async (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const booking = result[0];

      const orderData = {
        order_id: `globerra_order_${booking.id}_${Date.now()}`,
        order_amount: Number(booking.total_amount),
        order_currency: "INR",
        customer_details: {
          customer_id: `customer_${booking.user_id}`,
          customer_name: booking.guest_name || "Globerra User",
          customer_email: booking.guest_email || "guest@example.com",
          customer_phone: booking.guest_phone || "9999999999",
        },
        order_meta: {
          return_url: `${process.env.FRONTEND_URL}/billing/${booking.id}?order_id={order_id}`,
        },
      };

      try {
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
      } catch (cfErr) {
        console.error(cfErr.response?.data || cfErr.message);
        res.status(500).json({ message: "Failed to create Cashfree order" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Payment init failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, booking_id, payment_method } = req.body;

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
    const successPayment = payments.find((item) => item.payment_status === "SUCCESS");

    if (!successPayment) {
      return res.status(400).json({ message: "Payment not completed yet" });
    }

    const bookingSql = `
      SELECT b.*, h.hotel_name, h.location, h.image_url
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      WHERE b.id = ?
    `;

    db.query(bookingSql, [booking_id], async (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const booking = result[0];

      const insertPaymentSql = `
        INSERT INTO payments (booking_id, payment_method, payment_status, amount, cashfree_order_id)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        insertPaymentSql,
        [
          booking_id,
          payment_method || "Cashfree",
          "Paid",
          booking.total_amount,
          order_id,
        ],
        async (payErr, payResult) => {
          if (payErr) {
            return res.status(500).json({ message: "Failed to save payment" });
          }

          const payment = {
            id: payResult.insertId,
            payment_method: payment_method || "Cashfree",
            payment_status: "Paid",
            amount: booking.total_amount,
          };

          try {
            const invoiceInfo = await generateInvoice(booking, payment, booking);

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
          } catch (invoiceErr) {
            console.error(invoiceErr);
            res.status(500).json({ message: "Payment saved, but invoice creation failed" });
          }
        }
      );
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};