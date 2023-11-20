const nodemailer = require("nodemailer");
const { getAccessToken } = require("./google.oauth.config");

const sendEmail = async (to, subject, html) => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return false;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_EMAIL,
        accessToken: accessToken,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    });

    await transport.sendMail({
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    throw err;
  }
};

module.exports = sendEmail;
