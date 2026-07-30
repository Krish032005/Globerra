const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (booking, payment, customer) => {
  return new Promise((resolve, reject) => {
    try {
      const invoiceDir = path.join(__dirname, "..", "invoices");
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      const fileName = `invoice-${booking.id}-${Date.now()}.pdf`;
      const filePath = path.join(invoiceDir, fileName);

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc.fontSize(24).text("Globerra Invoice", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Invoice Date: ${new Date().toLocaleString()}`);
      doc.text(`Booking ID: ${booking.id}`);
      doc.text(`Payment ID: ${payment.id}`);
      doc.moveDown();

      doc.fontSize(16).text("Customer Details");
      doc.fontSize(12).text(`Name: ${customer.guest_name || "N/A"}`);
      doc.text(`Email: ${customer.guest_email || "N/A"}`);
      doc.text(`Phone: ${customer.guest_phone || "N/A"}`);
      doc.text(`Address: ${customer.guest_address || "N/A"}`);
      doc.moveDown();

      doc.fontSize(16).text("Hotel Details");
      doc.fontSize(12).text(`Hotel: ${booking.hotel_name}`);
      doc.text(`Location: ${booking.location}`);
      doc.text(`Check In: ${booking.check_in}`);
      doc.text(`Check Out: ${booking.check_out}`);
      doc.text(`Adults: ${booking.adults}`);
      doc.text(`Children: ${booking.children}`);
      doc.text(`Rooms: ${booking.rooms}`);
      doc.text(`Extra Bed: ${booking.extra_bed}`);
      doc.moveDown();

      doc.fontSize(16).text("Payment Details");
      doc.fontSize(12).text(`Payment Method: ${payment.payment_method}`);
      doc.text(`Payment Status: ${payment.payment_status}`);
      doc.text(`Amount Paid: ₹${payment.amount}`);
      doc.moveDown();

      doc.fontSize(18).text(`Total Amount: ₹${payment.amount}`, { align: "right" });

      doc.end();

      stream.on("finish", () => resolve({ filePath, fileName }));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateInvoice;