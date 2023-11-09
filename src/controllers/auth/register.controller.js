const { User, Role, Profile } = require("../../models");
const bcrypt = require("bcrypt");
const { response } = require("../../utils/response.utils");
const { nanoid } = require("nanoid");
const { ROLE } = require("../../utils/enum.utils");
//const sendEmail = require("../../config/nodemailer");
//const htmlTemplate = require("../../utils/html-template");

const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword)
      return response(res, 400, false, "Password doesn't match", null);

    const userExist = await User.findOne({ where: { email } });
    if (userExist) return response(res, 400, false, "Email already used", null);

    const encryptedPassword = await bcrypt.hash(password, 10);
    const userRole = await Role.findOne({ where: { name: ROLE.USER } });
    const user = await User.create({
      id: nanoid(10),
      role_id: [userRole.id], // create as an array for seller role
      email,
      password: encryptedPassword,
      is_verified: false,
    });

    // create profile automatically
    const profile_id = nanoid(10);
    await Profile.create({
      id: profile_id,
      user_id: user.id,
      first_name: null,
      last_name: null,
      phone: null,
      address: null,
      avatar_link: null,
    });

    //const html = await htmlTemplate("verify-email.ejs", { otp });
    //await sendEmail(user.email, "Verify Email - Renata", html);

    return response(res, 201, true, "Register success", {
      id: email,
    });
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = register;
