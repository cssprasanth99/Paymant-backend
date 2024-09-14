const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 5000;

// Enable CORS for all origins
app.use(cors());

const keyId = process.env.keyId;
const keySecret = process.env.keySecret;

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
