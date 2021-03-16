const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const messageSchema = new Schema({
    recipient: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String, required: false },
    date: { type: Date, required: true },
    // this area is for if its somoene linking a massive or an image
    linksSomeonesMassive: { type: Boolean, required: true },
    linkedMassiveId: { type: String, required: false },
    hasImage: { type: Boolean, required: true },
    imageURL: { type: String, required: false },
});

module.exports = mongoose.model("Message", messageSchema);
