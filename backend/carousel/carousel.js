// generates the list of potential matches to display to the browsing user.
// Because this is new, do it simply: Go into the db, pull out 5 potential matches, and
// mark the time at which they were loaded. The request can be made for "5 matches that were seen least recently".
// That way, the db pulls matches in chronological order.

// Later, we can try to get fancy...
const express = require("express");
const router = express.Router();

const authorize = require("../_middleware/authorize");
const db = require("../_helpers/db");

module.exports = router;

router.get("/potentialMatches", authorize(), (req, res, next) => {
    const fetchingMatchesForUser = req.query.username;

    // get list of users the currentUser has already liked.
    const alreadyLikedUsers = db.User.findOne({ fetchingMatchesForUser }).likes;  // might use this later
    // get candidates; that is, users who currentUser has not liked nor matched yet.
    const candidates = await db.Match.find({ likedBy: { $nin: alreadyLikedUsers } }).sortBy({});
});
