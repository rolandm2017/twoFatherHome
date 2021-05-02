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
        );

        const isMatch = checkIfMatch(u1, u2);
        if (isMatch) {
            matchUsers(u1, u2);
            // send congrats to both paties
        } else {
            // tell frontend to make sparkles and move onto the next candidate
        }
    },
    onPass: async (req, res) => {
        //
        const result = UserModel.updateRecentlySeenList(
            req.params.suitorId,
            req.params,
            candidateId
        );
        res.status(200).json({
            success: true,
            result: result,
        });
    },
};
