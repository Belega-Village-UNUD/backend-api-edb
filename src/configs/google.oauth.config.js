require("dotenv").config();
const { google } = require("googleapis");

const oAuth2Token = async () => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("token failed, ", err);
        }
        resolve(token);
      });
    });

    return accessToken;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = oAuth2Token;
