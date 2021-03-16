const mongoose = require("mongoose");
const massiveSchema = require("./massive.model");
const extendSchema = require("mongoose-extend-schema");

const quoteSchema = extendSchema(massiveSchema, {
    quotingMassiveId: { type: Number, required: true },
});

module.exports = mongoose.model("Quote", quoteSchema);
