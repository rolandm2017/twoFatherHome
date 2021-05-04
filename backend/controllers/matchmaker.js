const UserModel = require("../models/user.model").UserModel;

module.exports = {
    onGetCandidates: async (req, res) => {
        // go into db, be like "yo gimme people he aint liked yet," and send em
        const currentUser = await user.getUserById(req.params.id);
        const usersToFilterOut = currentUser.likes;
        const recentlySeenUsers = currentUser.recentlySeenUsers; // both these will be filtered out, hierarchically
        const fiveCandidatesToSend = await matchmaker.getCandidates(
            usersToFilterOut,
            recentlySeenUsers
        );

        return res
            .status(200)
            .send({ success: true, candidates: fiveCandidatesToSend });
    },
    onLikeCandidate: async (req, res) => {
        const result = UserModel.updateLikesListForUser(
            req.params.suitorId,
            req.params.candidateId
        ); // todo: do I need to do anything with the result? if this todo is still here past may 30, delete.
        const theUsersMatched = checkIfTheLikeCausedAMatch(
            suitorId, // he who did the liking
            candidateIdToTest // he who is being tested: "does this person already like the liker?"
        );
        if (theUsersMatched) {
            matchUsers(u1, u2);
            res.status(200).send({
                success: true,
                message: "Congrats, you got a match!",
                likedCausedMatch: true, // offer initiation of a chatroom
            });
        } else {
            // tell frontend to make sparkles and move onto the next candidate
            res.status(200).send({
                success: true, // true as in "successful database operation," not "successful match"
                message: "",
                likedCausedMatch: false,
            });
        }
    },
    onPass: async (req, res) => {
        //
        const result = UserModel.addToRecentlySeenList(
            req.params.suitorId,
            req.params.candidateId
        );
        res.status(200).json({
            success: true,
            result: result,
        });
    },
};

function checkIfTheLikeCausedAMatch(suitorId, candidateIdToTest) {
    const testTarget = UserModel.getUserById(candidateIdToTest);
    const candidateAlreadyLikesSuitor = testTarget.likes.includes(suitorId);
    if (candidateAlreadyLikesSuitor) {
        return true;
    } else {
        return false; // no match!
    }
}

function matchUsers(u1, u2) {}
