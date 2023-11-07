const { User } = require("../../models");
const { response } = require("../../utils/response.utils");
const { generateResetToken } = require("../../utils/token.utils");
const sendEmail = require("../../configs/nodemailer.config");
const emailTemplate = require("../../utils/email-template.utils");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return response(
        res,
        404,
        false,
        "These credentials do not match with our records",
        null
      );

    const resetToken = generateResetToken(user);
    const resetLink = `${process.env.RESET_PASSWORD_ENDPOINT}${resetToken}`;
    console.log(resetLink);

    const template = await emailTemplate("reset-password.template.ejs", {
      resetLink,
    });

    await sendEmail(user.email, "Account Reset Password", template);

    return response(
      res,
      200,
      true,
      "Please check your email to reset password",
      null
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = forgotPassword;
