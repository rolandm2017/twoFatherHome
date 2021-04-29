const mongoose = require("mongoose");

// FIXME: I really don't know... Should I use a "User" model? An "Account" model? Both?
// fixme: I'm saying "const UserModel = require("../models/account.model.js");" in another file :-( 'account' becomes 'user'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const USER_TYPES = {
    // instead of writing "admin", write UserTypes.ADMIN, so there's no typos.
    ADMIN: "admin",
    MODERATOR: "moderator",
    USER: "user",
};

const LEAVE_THIS_FALSE = false;

const userSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, select: LEAVE_THIS_FALSE }, // FALSE so it doesn't get sent to client accidentally
        fullName: { type: String, required: true, select: LEAVE_THIS_FALSE }, // FALSE so it doesn't get sent to client accidentally
        dateOfBirth: { type: Date, required: true, select: LEAVE_THIS_FALSE }, // FALSE so it doesn't get sent to client accidentally
        // note: "select: false" means you have to clarify your query to the db, "get the field even tho i said 'false' for 'select'"

        // account security stuff -- should this be in a separate db from info displayed on their profile?
        passwordHash: {
            type: String,
            required: true,
            select: LEAVE_THIS_FALSE,
        }, // FALSE so it doesn't get sent to client accidentally
        accountCreatedAt: { type: Date, required: true },
        verificationCode: { type: String, required: true },
        joinDate: { type: Date, required: true },
        accountVerifiedAt: { type: Date, required: true },
        failedVerifications: { type: Number, required: true },
        activeAccount: { type: Boolean, required: true }, // "finished signup?"
        accountType: { type: String, required: true }, // user, moderator, admin,
        resetToken: {
            token: String,
            expires: Date,
        },
        passwordResetAt: { type: Date },
        verifiedAt: { type: Date },
        lastUpdatedInfo: { type: Date },
        acceptsTermsAndConditions: { type: Boolean, required: true },

        // account status
        suspended: { type: Boolean, required: true },
        accountType: { type: String, required: true }, // user, moderator, admin, verified

        // personal info to display on the profile
        bio: { type: String, required: true },
        location: { type: String, required: false },
        // birthday: { type: Date, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        age: { type: Number, required: true },
        familySize: { type: Number, required: true },
        familyValues: { type: Array, required: true },
        interests: { type: Array, required: true },
        hasPets: { type: Boolean, required: true },
        diet: { type: String, required: true },
        drinks: { type: Boolean, required: true },
        smokes: { type: Boolean, required: true },
        drugs: { type: Boolean, required: true }, // TODO: say something like, "if you do drugs, this isn't the site for you."
        hasPremium: { type: Boolean, required: true },

        likes: { type: Array, required: true }, // likes = swipes.
        recentlySeen: { type: Array, required: true },
        blockList: { type: Array, required: true },
    },
    {
        timestamps: true,
    }
);

/** only non-self explanatory params are explained
 * @param {String} firstName
 * @param {String} lastName
 * @returns {Object} new user object created
 */
userSchema.statics.createUser = async function (firstName, lastName, type) {
    try {
        const user = await this.create({ firstName, lastName, type });
        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * @param {String} id, user id
 * @return {Object} User profile object
 */
userSchema.statics.getUserById = async function (id) {
    try {
        const user = await this.findOne({ _id: id });
        if (!user) throw { error: "No user with this id found" };
        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * @return {Array} List of all users
 */
userSchema.statics.getUsers = async function () {
    try {
        const users = await this.find();
        return users;
    } catch (error) {
        throw error;
    }
};

/**
 * @param {Array} ids, string of user ids
 * @return {Array of Objects} users list
 */
userSchema.statics.getUserByIds = async function (ids) {
    try {
        const users = await this.find({ _id: { $in: ids } });
        return users;
    } catch (error) {
        throw error;
    }
};

/**
 * @param {String} id - id of user
 * @return {Object} - details of action performed
 */
userSchema.statics.deleteByUserById = async function (id) {
    try {
        const result = await this.remove({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    USER_TYPES: USER_TYPES,
    userModel: mongoose.model("User", userSchema),
    // FIXME: I think this should be the statics from https://github.com/adeelibr/node-playground/blob/master/chapter-1-chat/server/models/User.js
};