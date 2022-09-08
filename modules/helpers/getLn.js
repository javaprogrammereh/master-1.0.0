module.exports.getLn = async (req, res, next) => {
  try {
    if (req.headers.ln) {
      if (req.headers.ln == "persian") ln = req.headers.ln;
    }
    next();
  } catch (err) {
    console.log(err);
    next();
  }
};
