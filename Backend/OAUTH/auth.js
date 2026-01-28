const jwt=require('jsonwebtoken')
const authMiddleware=(req,res,next)=>{

     const authHeader=req.headers.authorization;
     //console.log("Auth Header",authHeader)
     if(!authHeader)
     return res.status(401).json({message:"Invalid Header"})
     
     const token=authHeader.split(" ")[1]
     if(!token)
     return res.status(401).json({message:"Invalid Token"})

     try
     {
     const decoded=jwt.verify(token,process.env.Private_key)
     req.user=decoded;
    //  console.log(decoded)
     next();
     }
     catch(err)
     {
         return res.status(401).json({ message: "Token expired or invalid" });
     }
}
module.exports=authMiddleware
// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   console.log("MIDDLEWARE HIT");
//   console.log("HEADERS:", req.headers);

//   const authHeader = req.headers.authorization;
//   console.log("AUTH HEADER:", authHeader);

//   if (!authHeader) {
//     console.log("❌ NO AUTH HEADER");
//     return res.status(401).json({ message: "Invalid Header" });
//   }

//   const parts = authHeader.split(" ");
//   console.log("HEADER PARTS:", parts);

//   if (parts.length !== 2) {
//     console.log("❌ BAD HEADER FORMAT");
//     return res.status(401).json({ message: "Bad auth format" });
//   }

//   const token = parts[1];
//   console.log("TOKEN:", token);

//   try {
//     const decoded = jwt.verify(token, process.env.Private_key);
//     console.log("DECODED TOKEN:", decoded);

//     req.user = decoded;
//     next(); // ✅
//   } catch (err) {
//     console.log("❌ JWT ERROR:", err.message);
//     return res.status(401).json({ message: "Token expired or invalid" });
//   }
// };

// module.exports = authMiddleware;
