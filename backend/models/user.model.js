const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    username: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String, required: false },
    joinDate: { type: Date, required: true },
    birthday: { type: Date, required: true },
    suspended: { type: Boolean, required: true },
    accountType: { type: String, required: true }, // user, moderator, admin, verified

    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    age: { type: Number, required: true },
    familySize: { type: Number, required: true },
    familyValues: { type: Array, required: true },
    interests: { type: Array, required: true },
    hasPets: { type: Boolean, required: true },
    diet: { type: String, required: true },
    drinks: { type: Boolean, required: true },
    smokes: { type: Boolean, required: true },
    drugs: { type: Boolean, required: true }, // TODO: say something like, "if you do drugs, this isn't the site for you."
    hasPremium: { type: Boolean, required: true },

    likes: { type: Array, required: true },
    blockList: { type: Array, required: true },
});

module.exports = mongoose.model("User", userSchema);
