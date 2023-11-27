require('dotenv').config();

const midtransClient = new google.auth.OAuth2(
  process.env.MIDTRANS_MERCHANT_ID,
  process.env.MIDTRANS_CLIENT_KEY,
  process.env.MIDTRANS_SERVER_KEY,
);