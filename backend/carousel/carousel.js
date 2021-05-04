// // generates the list of potential matches to display to the browsing user.
// // Because this is new, do it simply: Go into the db, pull out 5 potential matches, and
// // mark the time at which they were loaded. The request can be made for "5 matches that were seen least recently".
// // That way, the db pulls matches in chronological order.

// // Later, we can try to get fancy...
// const express = require("express");
// const router = express.Router();

// const authorize = require("../_middleware/authorize");
// const db = require("../_helpers/db");

// module.exports = router;

// router.get("/potentialMatches", authorize(), (req, res, next) => {
//     const fetchingMatchesForUser = req.query.username;

//     // get list of users the currentUser has already liked.
//     const alreadyLikedUsers = db.User.findOne({ fetchingMatchesForUser }).likes;  // might use this later
//     // get candidates; that is, users who currentUser has not liked nor matched yet.
//     // TODO: integrate searching lastSeenHistory, sort & get the top 5 (as opposed to getting all, which is what we r doing now)
//     const candidates = await db.Match.find({ likedBy: { $nin: alreadyLikedUsers } });
//     const profiles = [];

//     for (let i = 0; i < candidates.length <= 5 ? candidates.length : 5; i++) {
//         const profile = await db.User.findOne({ username: candidates[i].username })
//         profiles.push(getPublicProfileInfo(profile))
//     }
//     // send the 5 profiles we picked
//     res.json(profiles)
// });

// *** *** *** HEY LOOK *** *** ***
// i have no idea what I was doing when I wrote this, like I can guess, but it was made 2 months ago.
// rn my plan is to make a "Match" db and store matches as docs ... or .. ahhh what to do...
// *** *** *** HEY LOOK *** *** ***
