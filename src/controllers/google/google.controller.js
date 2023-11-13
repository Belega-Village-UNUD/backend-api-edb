const { response } = require("../../utils/response.utils");
const { getOAuth2Token } = require("../../configs/google.oauth.config");

const requestRefreshToken = async (req, res) => {
  try {
    const url = await getOAuth2Token(req, res);

    return response(res, 200, true, "Successfully Redirect to Google OAuth2", {
      url,
    });
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = requestRefreshToken;
