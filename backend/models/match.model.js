// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

// const matchSchema = new Schema({
//     user: { type: String, required: true },
//     lastSeenHistory: { type: Array, required: true },
//     likedBy: { type: Array, required: true },
//     // "history" will be an array of objects.
//     // {user: Crono, userLastSawThisProfile: Date()}
//     // so queries for potential matches will go:
//     // find users that haven't been liked yet. Then order them by most recently seen. Get the least recent 5"
// });

// module.exports = mongoose.model("Match", matchSchema);

// ZOMBIFIED: May 3, because Matches now get stored in the UserModel.matches field.
