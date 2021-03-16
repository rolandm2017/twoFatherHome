const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String, required: false },
    url: { type: String, required: false },
    joinDate: { type: Date, required: true },
    birthday: { type: Date, required: true },
    followers: { type: Number, required: true },
    following: { type: Number, required: true },
    DMsAreOpen: { type: Boolean, required: true },
    // this number goes down if the user deletes a post.
    postCount: { type: Number, required: true },
    // this number stays as is if the user deletes a post; used to number a user's massives, including replies.
    totalPostsEver: { type: Number, required: true },
    suspended: { type: Boolean, required: true }, // "finished signup?"
    accountType: { type: String, required: true }, // user, moderator, admin, verified
});

module.exports = mongoose.model("User", userSchema);
