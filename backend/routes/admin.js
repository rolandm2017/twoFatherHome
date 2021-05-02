const express = require("express");
// controllers
const user = require("../controllers/user.js");

const router = express.Router();

router
    .put("/user", (req, res) => {
        res.send(200);
    })
    .put("/user/:suitorId/addLikeTo/:candidateId", user.onAddLikedUserToUser)
    .delete(
        "/user/:suitorId/removeLikeFrom/:candidateId",
        user.onDelLikeFromUser
    );

module.exports = router;
