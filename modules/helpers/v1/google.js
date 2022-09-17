const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
module.exports.gmailLogin = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
    });
    return ticket.getPayload();
  } catch (err) {
    console.log(err);
    return false;
  }
};
//?