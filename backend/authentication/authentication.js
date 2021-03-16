// ctrl + f "Express.js Accounts Controller"
// https://jasonwatmore.com/post/2020/05/13/node-mongo-api-with-email-sign-up-verification-authentication-forgot-password#authorize-js

const express = require("express");
const router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const authorize = require("../_middleware/authorize");
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const Role = require("../_helpers/roles");
const accountService = require("../accounts/account.service");
const { jwtSecret } = require("../config.json");

// TODO: Split auth server into a microservice (even just for dev). !important !backend

const mockCode = "qwerty"; // this should technically be in its own file

module.exports = router;

router.post("/signIn", (req, res, next) => {
    console.log(
        "received:",
        req.query.username,
        req.query.email,
        req.query.password
    );
    const username = req.query.username;
    const email = req.query.email;
    const password = req.query.password;
    const ipAddress = req.ip;
    // const patternForUsernames = /^[a-zA-Z0-9_]*$/;
    // const passwordValidator = /^[A-Za-z0-9!@#$%^&*()_+]{6, 30}$/;
    // const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //  match submitted combo against fake db
    // const { user, jwt } = req.query.username
    accountService
        .authenticate({ username, email, password, ipAddress })
        .then(({ refreshToken, ...account }) => {
            console.log(
                "attempting to set cookie and send user info",
                refreshToken,
                account.username,
                account.jwtToken
            );
            res.cookie("jwt", account.jwtToken, {
                expires: new Date(Date.now() + 15 * 60 * 1000),
            });
            setRefreshTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
});

router.post(
    "/signOut",
    authorize(),
    revokeRefreshTokenSchema,
    (req, res, next) => {
        // Used to log the user out
        // FIXME: name these more specifically... is it
        // revokign the jwt or the refresh token???
        // accept token from request body or cookie
        const token = req.body.token || req.cookies.refreshToken;
        const ipAddress = req.ip;

        if (!token)
            return res.status(400).json({ message: "Token is required" });

        // users can revoke their own tokens and admins can revoke any tokens
        if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        accountService
            .revokeToken({ token, ipAddress })
            .then(() => res.json({ message: "Token revoked", loggedOut: true }))
            .catch(next);
    }
);

router.get("/sendPasswordResetEmail", (req, res) => {
    if (req.query.email === mockEmail) {
        console.log("Sending a password reset email supposedly");
        res.status(200).json({ emailSent: true });
    } else {
        res.status(400).send();
    }
});

router.get("/confirmReset", (req, res) => {
    if (req.query.code === mockCode && req.query.password === mockPassword) {
        console.log("Chrono Trigger is the best game ever");
        res.status(200).json({ confirmed: true });
    } else {
        res.status(400).send();
    }
});

// THE MAGIC BABY:

router.post("/refreshToken", (req, res, next) => {
    console.log("incoming cookies:", req.cookies);
    // to generate a new refresh token, you need the previous refresh token, which contains ip and a unique string.
    // so if the attacker takes your refresh token, the ip he sends it from will be different.
    // if the attacker takes your jwt, he can't get a new refresh token because the *refresh token* is needed for refreshing
    // the refresh token.
    const incomingRefreshToken = req.cookies.refreshToken;
    const ipAddress = req.ip;
    accountService
        .refreshToken({ incomingRefreshToken, ipAddress })
        .then(({ newRefreshToken, ...account }) => {
            setRefreshTokenCookie(res, newRefreshToken);
            console.log(account);
            res.cookie("jwt", account.jwtToken, {
                expires: new Date(Date.now() + 15 * 60 * 1000),
            });
            res.json(account);
        })
        .catch(next);
});

function revokeRefreshTokenSchema(req, res, next) {
    // FIXME: name these more specifically... is it
    // revokign the jwt or the refresh token???
    const schema = Joi.object({
        token: Joi.string().empty(""),
    });
    validateRequest(req, next, schema);
}

// helper functions

function setRefreshTokenCookie(res, newlyMintedRefreshToken) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + oneWeek),
    };
    console.log(
        "202 this is being set as refreshToken,",
        newlyMintedRefreshToken
    );
    res.cookie("refreshToken", newlyMintedRefreshToken, cookieOptions);
}
