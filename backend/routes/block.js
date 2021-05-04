const express = require("express");
// controllers
const user = require("../controllers/user.controller.js");

const router = express.Router();

router
    .put("/user/:userId/blocking/:blockedId", user.onBlock)
    .delete("/user/:userId/removeBlockFrom/:blockedId", user.onUnblock);

module.exports = router;
