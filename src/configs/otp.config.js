const { User, OTP } = require("../models");
const { generateOTPToken } = require("../utils/token.utils");
const { nanoid } = require("nanoid");
const moment = require("moment");
const sendEmail = require("./nodemailer.config");
const bcrypt = require("bcrypt");
const emailTemplate = require("../utils/email-template.utils");

const sendOTP = async (user, subject) => {
  try {
    const { otp, encryptedOTP } = await generateOTPToken(user);
    const otpExist = await OTP.findOne({ where: { user_id: user.id } });
    if (!otpExist)
      await OTP.create({
        id: nanoid(10),
        user_id: user.id,
        code: encryptedOTP,
      });
    else
      await OTP.update({ code: encryptedOTP }, { where: { user_id: user.id } });

    const template = await emailTemplate("otp.template.ejs", {
      otp,
    });

    await sendEmail(user.email, subject, template);
  } catch (err) {
    console.log(err);
  }
};

const verifyOTP = async (user, otp) => {
  const otpDB = await OTP.findOne({ where: { user_id: user.id } });
  if (!otpDB)
    return {
      success: false,
      message: "OTP expired, please request another OTP Code",
    };

  const createdAt = moment(otpDB.createdAt);
  const now = moment();
  const minutesPass = now.diff(createdAt, "m");
  if (minutesPass >= 1) {
    console.log("OTP expired");
    return {
      success: false,
      message: "OTP expired, please request another OTP Code",
    };
  }

  const otpCheck = bcrypt.compareSync(otp, otpDB.code);
  if (!otpCheck)
    return {
      success: false,
      message: "OTP is invalid, please check your OTP Code",
    };

  await OTP.destroy({ where: { user_id: user.id } });
  return {
    success: true,
    message: "You are verified!",
  };
};

module.exports = { sendOTP, verifyOTP };
