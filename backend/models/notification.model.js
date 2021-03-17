const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const notificationSchema = new Schema({
    user: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    // TODO: develop this more
});

module.exports = mongoose.model("Notification", notificationSchema);
