const mongoose = require("mongoose");
const massiveSchema = require("./massive.model");
const extendSchema = require("mongoose-extend-schema");

const replySchema = extendSchema(massiveSchema, {
    replyingToMassiveId: { type: Number, required: true },
});

module.exports = mongoose.model("Reply", replySchema);
