const jwt = require("jsonwebtoken");
require("dotenv").config();
var excludes = ["login",'signup'];

const currentUserMiddleware = (req, res, next) => {
    const pathArray = req?.path?.split("/") || [];
    if (excludes.includes(pathArray[pathArray.length - 1])) {
      next();
      return;
    }else{
        let token = req.headers.token
        if(!token){
            return res.json({
                status:false,
                message:"Please Provide a valid Token"
            })
        }else{
            jwt.verify(token,  'tastyfood', (err, decoded) => {
                if (err) {
                    return res.json({ message: 'Failed to authenticate token', status:false });
                }
                req.user_details = decoded; 
                next();
            });
        }
    }
   
};

module.exports = currentUserMiddleware