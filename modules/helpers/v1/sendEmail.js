const nodemailer = require("nodemailer");
const host = process.env.EMAil_HOST;
const user = process.env.EMAil_USER;
const pass = process.env.EMAil_PASS;
let transport = nodemailer.createTransport({
  host,
  port: 465,
  auth: {
    user,
    pass,
  },
});
module.exports.sendEmail = async (html, email) => {
  try {
    const message = {
      from: null,
      to: email,
      subject: null,
      html: html,
    };
    const sendEamil = await transport.sendMail(message);
    return sendEamil;
  } catch (err) {
    console.log(err);
    return false;
  }
};
