const express = require("express");
// controllers
const matchmaker = require("../controllers/matchmaker.controller.js");

const router = express.Router();

router
    .get("/user/:id", matchmaker.onGetCandidates)
    .post("/user/:id/addLikeTo/:candidate", matchmaker.onLikeCandidate)
    .post("/user/:id/pass/:candidate", matchmaker.onPass);

module.exports = router;
