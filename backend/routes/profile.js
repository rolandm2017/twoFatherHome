const express = require("express");

const profile = require("../controllers/profile.controller.js");

const router = express.Router();

router
    .get("/:id", profile.getProfile)
    .post("/:id", profile.submitProfile)
    .put("/:id", profile.updateProfile);

module.exports = router;
