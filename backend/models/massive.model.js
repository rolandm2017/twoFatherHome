const mongoose = require("mongoose");

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const massiveSchema = new Schema({
    postedByUser: { type: String, required: true }, // store their user doc's id.
    text: { type: String, required: true },
    date: { type: String, required: true },
    viewCount: { type: Number, required: true },
    viewQuota: { type: Number, required: true },
    // used to organize the poster's timeline. Comes from the User's totalPostsEver field.
    postNumber: { type: Number, required: true },
    // engagement
    replies: { type: Number, required: true },
    repliesList: { type: [String], required: true }, // is this needed?
    amps: { type: Number, required: true },
    ampsList: { type: [String], required: true },
    quoteAmps: { type: Number, required: true },
    quotesList: { type: [String], required: true },
    likes: { type: Number, required: true },
    likesList: { type: [String], required: true },
    // modifiers
    hasImage: { type: Boolean, required: true },
    imageURL: { type: String, required: false },
    // indicates whether the massive is a quote tweet.
    quotesSomeone: { type: Boolean, required: true },
    quotedMassiveId: { type: String, required: false },
    deletedByUser: { type: Boolean, required: false },
});

module.exports = mongoose.model("Massive", massiveSchema);
