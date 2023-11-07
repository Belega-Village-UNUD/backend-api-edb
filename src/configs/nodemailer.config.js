const nodemailer = require("nodemailer");
const oAuth2Token = require("./google.oauth.config");

const sendEmail = async (to, subject, html) => {
  try {
    const accessToken = await oAuth2Token();
    console.log(accessToken);

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

    const info = await transport.sendMail({
      to,
      subject,
      html,
    });

    console.log(`Message sent: ${info.messageId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = sendEmail;
