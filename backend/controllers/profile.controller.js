const UserModel = require("../models/user.model").UserModel;

module.exports = {
    getProfile: async (req, res) => {
        try {
            const profile = UserModel.getProfileById(req.params.id);
            res.status(200).json({ success: true, profile: profile });
        } catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    },
    submitProfile: async (req, res) => {
        try {
            // have the db update only changed fields. obviously.
            const result = UserModel.createProfileData(
                req.params.newProfileInfo
            );
            res.status(200).json({ success: true, result: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const result = UserModel.updateProfileFields(
                req.params.profileUpdates
            );
            res.status(200).json({ success: true, result: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    },
};
