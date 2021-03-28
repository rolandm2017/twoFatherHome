// const express = require("express");
// // controllers
// const users = require("../controllers/user.js");
// // middlewares
// const { encode } = require("../middlewares/jwt.js"); // FIXME: how to substitute this guy's jwt thing for my watmore's code?

// const router = express.Router();

// router.post("/login/:userId", encode, (req, res, next) => {});
// // encode adds a jwt-signed authTOken to the req.
// // the jwt payload is userId and userType.
// // then the login route returns a 200 with json: "success:true, authorization:req.authToken"
// // so basically, this route is what we have in auth already

// module.exports = router;
