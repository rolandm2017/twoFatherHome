const express = require("express");
// controllers
const users = require("../controllers/user.js");
// middlewares
const { encode } = require("../middlewares/jwt.js"); // FIXME: how to substitute this guy's jwt thing for my watmore's code?

const router = express.Router();

router.post("/login/:userId", encode, (req, res, next) => {});

module.exports = router;
