const express = require("express");
// controllers
const deleteController = require("../controllers/delete.controller.js");

const router = express.Router();

// THE FILE CALLED "DELETE" IS A ROUTE FOR SOLELY DELETING CHAT MSGS? BUT NOT USER STUFF? UM.
// TODO: Review the meaning of "MVC Model" and mk sure ur doing it right... HIGH HIGH Priority
router
    .delete("/room/:roomId", deleteController.deleteRoomById)
    .delete("/message/:messageId", deleteController.deleteMessageById);

module.exports = router;
