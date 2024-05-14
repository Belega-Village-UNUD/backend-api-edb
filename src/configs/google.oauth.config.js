require("dotenv").config();
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const getOAuth2Token = async (req, res) => {
  try {
    const scopes = ["https://mail.google.com"];

    const authorizationURL = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      include_granted_scopes: true,
    });

    return authorizationURL;
  } catch (err) {
    throw err;
  }
};

const getAccessToken = async () => {
  try {
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
    throw err;
  }
};

module.exports = { getAccessToken, getOAuth2Token };
