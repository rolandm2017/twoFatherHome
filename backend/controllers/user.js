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
                    username: { type: types.string },
                    fullName: { type: types.string },
                    bio: { type: types.string },
                    location: { type: types.string },
                    city: { type: types.string },
                    state: { type: types.string },
                    country: { type: types.string },
                    age: { type: types.string },
                    familySize: { type: types.string },
                    familyValues: { type: types.array },
                    interests: { type: types.array },
                    hasPets: { type: types.string },
                    diet: { type: types.string },
                    drinks: { type: types.string },
                    smokes: { type: types.string },
                    drugs: { type: types.string },
                    hasPremium: { type: types.string }, // bool

                    type: { type: types.enum, options: { enum: USER_TYPES } },
                },
            }));
            if (!validation.success)
                return res.status(400).json({ ...validation });

            const user = await UserModel.createUser(
                req.body.username,
                req.body.fullName,
                req.body.bio,
                req.body.location,
                req.body.city,
                req.body.state,
                req.body.country,
                parseInt(req.body.age, 10),
                parseInt(req.body.familySize, 10),
                req.body.familyValues,
                req.body.interests,
                req.body.hasPets,
                req.body.diet,
                req.body.drinks === "True" ? True : False, // hacky code
                req.body.smokes === "True" ? True : False,
                req.body.drugs === "True" ? True : False,
                req.body.hasPremium === "True" ? True : False
            );
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
