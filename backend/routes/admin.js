const express = require("express");
// controllers
const user = require("../controllers/user.js");

const router = express.Router();

router
    .put("/user/:id/addLikeTo/:candidate", user.onAddLikedUserToUser)
    .delete("/user/:id/removeLikeFrom/:candidate", user.onDelLikeFromUser);

module.exports = router;
