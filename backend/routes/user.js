const express = require("express");
// controllers
const user = require("../controllers/user.js");

const router = express.Router();

router // LOOK HOW NEAT THIS IS. Tidy!!!
    .get("/", user.onGetAllUsers)
    .post("/", user.onCreateUser)
    .get("/:id", user.onGetUserById)
    .delete("/:id", user.onDeleteUserById);

module.exports = router;
