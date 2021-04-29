const makeValidation = require("@withvoid/make-validation");
// models
const UserModel = require("../models/account.model.js");

module.exports = {
    // TODO: integrate this boilerplate code into a more 2fh friendly system.
    // For instance, onCreateUser needs to check MANY more fields than just fn, ln, type.
    // TODO: write a short blurb explaining what make-validation does. It doesn't necessarily need to sit in this file
    // but its gotta go somewhere.
    onGetAllUsers: async (req, res) => {
        try {
            const users = await UserModel.getUsers();
            return res.status(200).json({ success: true, users });
        } catch (error) {
            return res.status(500).json({ success: false, error: error });
        }
    },
    onGetUserById: async (req, res) => {
        try {
            const user = await UserModel.getUserById(req.params.id);
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ success: false, error: error });
        }
    },
    onCreateUser: async (req, res) => {
        try {
            const validation = makeValidation((types) => ({
                payload: req.body,
                checks: {
                    firstName: { type: types.string },
                    lastName: { type: types.string },
                    type: { type: types.enum, options: { enum: USER_TYPES } },
                },
            }));
            if (!validation.success)
                return res.status(400).json({ ...validation });

            const { firstName, lastName, type } = req.body;
            const user = await UserModel.createUser(firstName, lastName, type);
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ success: false, error: error });
        }
    },
    onDeleteUserById: async (req, res) => {
        try {
            const user = await UserModel.deleteByUserById(req.params.id);
            return res.status(200).json({
                success: true,
                message: `Deleted a count of ${user.deletedCount} user.`,
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error });
        }
    },
};
