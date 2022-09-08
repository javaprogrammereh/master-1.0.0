const config = require("../../../../config");
const User = require(`${config.path.model}/user`);
const Token = require(`${config.path.model}/token`);
const { response } = require(`${config.path.helper.v1}/response`);

module.exports = async (req, res, next) => {
  try {
    let result ;
    const token = await Token.findOne({ token: req.headers["x-access-token"] }).exec();
    if(!token){
      // req.user = null;
    //  console.log(null);
      result = false;
      res.locals.result=result;
      // console.log(res.locals.result);
      // if (!token) return response(res, 121);
    }else{
      const user = await User.findOne({ _id: token.userId, type: "user" }).exec();
      if (user){
        result = true;
        res.locals.result=result;
        // console.log(res.locals.result);
        req.user = user;
        console.log(req.user);
        // return response(res, 121);
      } 
    }
   
    next();
  } catch (err) {
    return response(res, 121);
  }
};
//;