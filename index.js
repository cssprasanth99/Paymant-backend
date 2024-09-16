const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

const keyId = process.env.keyId;
const keySecret = process.env.keySecret;

console.log(keyId, keySecret);

app.get("/payment-links", async (req, res) => {
  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString(
    "base64"
  )}`;

  try {
    const response = await axios.get(
      "https://api.razorpay.com/v1/payment_links/",
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/payment-links/create", async (req, res) => {
  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString(
    "base64"
  )}`;

  const { name, amount } = req.body;

  try {
    const response = await axios.post(
      "https://api.razorpay.com/v1/payment_links/",
      {
        amount: amount,
        currency: "INR",
        description: `Payment for ${name}`,
        customer: {
          name: name,
          email: "default.email@example.com",
          contact: "+911234567890",
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: true,
        notes: {
          purpose: "For XYZ purpose",
        },
        callback_url: "https://example-callback-url.com/",
        callback_method: "get",
      },
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message });
  }
});

app.post("/payment-links/cancel/:id", async (req, res) => {
  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString(
    "base64"
  )}`;

  const paymentLinkId = req.params.id;

  try {
    const response = await axios.post(
      `https://api.razorpay.com/v1/payment_links/${paymentLinkId}/cancel`,
      {},
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
