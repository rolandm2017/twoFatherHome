// models
const UserModel = require("../models/user.model.js").UserModel;
const USER_TYPES = require("../models/user.model.js").USER_TYPES;

module.exports = {
    // TODO: integrate this boilerplate code into a more 2fh friendly system.
    // For instance, onCreateUser needs to check MANY more fields than just fn, ln, type.
    // TODO: write a short blurb explaining what make-validation does. It doesn't necessarily need to sit in this file
    // but its gotta go somewhere.
    onGetAllUsers: async (req, res) => {
        console.log("asdfdasfdasfs");
        try {
            console.log("a");
            const users = await UserModel.getUsers();

            const sortedUsers = [];

            users.forEach((user) => {
                sortedUsers.push({
                    // asdf: "asdfdasf",
                    username: user.username,
                    data: { user },
                });
            });
            console.log("dis", sortedUsers);
            console.log("spaghetti of infinite length");
            return res.status(200).json({ success: true, sortedUsers });
        } catch (error) {
            console.log(error);
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
        console.log("lol");
        // try {
        const validation = (() => {
            const validation = {
                username: typeof req.body.username === "string",
                fullName: typeof req.body.fullName === "string",
                bio: typeof req.body.bio === "string",
                location: typeof req.body.location === "string",
                city: typeof req.body.city === "string",
                country: typeof req.body.country === "string",
                state: typeof req.body.state === "string",
                age: Number.isInteger(req.body.age),
                familySize: Number.isInteger(req.body.familySize),
                familyValues: Array.isArray(req.body.familyValues),
                interests: Array.isArray(req.body.interests),
                hasPets: typeof req.body.hasPets === "boolean",
                diet: typeof req.body.diet === "string",
                drinks: typeof req.body.hasPets === "boolean",
                smokes: typeof req.body.hasPets === "boolean",
                drugs: typeof req.body.hasPets === "boolean",
                hasPremium: typeof req.body.hasPets === "boolean",
            };

            if (
                Object.keys(validation).every(function (k) {
                    return validation[k] === true;
                })
            ) {
                validation["success"] = true;
                return validation;
            } else {
                validation["success"] = false;
                return validation;
            }
        })();

        if (!validation.success) {
            console.log("fial", validation);
            return res.status(400).json(validation); // never found out what validation was supposed to return as
        }
        console.log("creating user");
        const user = await UserModel.createUser(
            req.body.username, // FIXME: convert it into objects yo. the Profile object, the Addy object, the Preferences object
            req.body.fullName,
            req.body.bio,
            req.body.location, // addy obj ...
            req.body.city,
            req.body.state,
            req.body.country,
            req.body.age, // this is profile material
            req.body.familySize, // preferences obj ...
            req.body.familyValues,
            req.body.interests,
            req.body.hasPets,
            req.body.diet,
            req.body.drinks,
            req.body.smokes,
            req.body.drugs,
            req.body.hasPremium
        );
        return res.status(200).json({ success: true, user });
        // } catch (error) {
        //     // console.log(error);
        //     console.log("oh noes");
        //     return res.status(500).json({ success: false, error: error });
        // }
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
