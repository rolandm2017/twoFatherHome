const UserModel = require("../models/user.model").UserModel;
const 

module.exports = {
    onGetCandidates: async (req, res) => {
        // go into db, be like "yo gimme people he aint liked yet," and send em
        const currentUser = await UserModel.getUserById(req.params.id);
        const usersToFilterOut = currentUser.likes;
        const recentlySeenUsers = currentUser.recentlySeenUsers; // both these will be filtered out, hierarchically
        const fiveCandidatesToSend = await UserModel.getCandidates(
            usersToFilterOut,
            recentlySeenUsers
        );

        return res
            .status(200)
            .json({ success: true, candidates: fiveCandidatesToSend });
    },
    onLikeCandidate: async (req, res) => {
        const result = await UserModel.updateLikesListForUser(
            req.params.suitorId,
            req.params.candidateId
        ); // todo: do I need to do anything with the result? if this todo is still here past may 30, delete.
        // could check if its an error from the UserModel method...
        const theUsersMatched = await checkIfTheLikeCausedAMatch(
            suitorId, // he who did the liking
            candidateIdToTest // he who is being tested: "does this person already like the liker?"
        );
        if (theUsersMatched) {
            try {
                const result = await UserModel.createMatch(
                    req.params.suitorId,
                    req.params.candidateId
                ); // is there any point to storing the result in the result var?
                res.status(200).send({
                    success: true,
                    message: "Congrats, you got a match!",
                    likedCausedMatch: true, // offer initiation of a chatroom
                });
            } catch (error) {
                res.status(500).json({ success: false, error: error });
            }
        } else {
            // tell frontend to make sparkles and move onto the next candidate
            res.status(200).send({
                success: true, // true as in "successful database operation," not "successful match"
                message: "",
                likedCausedMatch: false, // go to next candidate in carousel
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

async function checkIfTheLikeCausedAMatch(suitorId, candidateIdToTest) {
    const testTarget = await UserModel.getUserById(candidateIdToTest);
    const candidateAlreadyLikesSuitor = testTarget.likes.includes(suitorId);
    if (candidateAlreadyLikesSuitor) {
        return true;
    } else {
        return false; // no match!
    }
}
