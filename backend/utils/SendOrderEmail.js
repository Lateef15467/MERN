import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderEmail = async (email, orderId, amount, items) => {
  try {
    const productDetails = items
      .map(
        (item) => `
          ${item.name}
          Quantity: ${item.quantity}
          Price: Rs. ${item.price}
        `,
      )
      .join("\n");

    const orderDate = new Date().toLocaleString();

    const mailOptions = {
      from: `"BaltiMart" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation - BaltiMart #${orderId}`,

      // Plain text version
      text: `
Hello,

Thank you for placing an order with BaltiMart.

Your order has been successfully received.

Order Information
-------------------------
Order ID: ${orderId}
Order Date: ${orderDate}

Ordered Products
-------------------------
${productDetails}

Total Amount: Rs. ${amount}

You can visit our website:
https://baltimart.vercel.app/

Thank you for shopping with BaltiMart.

BaltiMart Team
      `,

      // Simple HTML version
      html: `
        <div style="
          max-width: 560px;
          margin: 20px auto;
          padding: 24px;
          font-family: Arial, sans-serif;
          color: #333;
          background: #ffffff;
          border: 1px solid #eeeeee;
          line-height: 1.6;
        ">

          <h2 style="color: #222;">
            BaltiMart
          </h2>

          <p>Hello,</p>

          <p>
            Thank you for placing an order with BaltiMart.
            Your order has been successfully received.
          </p>

          <h3>Order Information</h3>

          <p>
            <strong>Order ID:</strong> ${orderId}<br>
            <strong>Order Date:</strong> ${orderDate}
          </p>

          <h3>Ordered Products</h3>

          <table width="100%" cellpadding="8"
            style="border-collapse: collapse; text-align: left;">

            <tr style="background: #f5f5f5;">
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>

            ${items
              .map(
                (item) => `
              <tr style="border-bottom: 1px solid #eeeeee;">
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>Rs. ${item.price}</td>
              </tr>
            `,
              )
              .join("")}

          </table>

          <h3 style="margin-top: 20px;">
            Total Amount: Rs. ${amount}
          </h3>

          <p>
            Thank you for choosing BaltiMart.
          </p>

          <p>
            Website:
            <a href="https://baltimart.vercel.app/">
              https://baltimart.vercel.app/
            </a>
          </p>

          <p>
            Regards,<br>
            BaltiMart Team
          </p>

        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Order email sent successfully!");
    console.log("Recipient:", email);
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
  } catch (error) {
    console.error("Order email sending failed:", error.message);
  }
};
