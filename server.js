require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

app.post("/checkout", async (req, res) => {
  const items = req.body.items;
  let lineItems = [];
  for (const item of items) {
    lineItems.push({
      price: item.stripe_id,
      quantity: item.qty,
    });
  }

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: process.env.CLIENT_SUCCESS_URL,
    cancel_url: process.env.CLIENT_CANCEL_URL,
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening to Port 3000");
});
