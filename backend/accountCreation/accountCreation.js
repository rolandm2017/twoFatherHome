// This bunch of routes is for account registration.

const express = require("express");
const router = express.Router();

module.exports = router;

// for validating full name, email, date of birth

router.post("/personal", (req, res) => {
    // Step 1: Verify name, email, date of birth
    console.log(req.body);
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const nameIsOk = checkIfAllCharsAreAcceptedInName(req.body.name);
    const emailIsOk = emailPattern.test(req.body.email);
    const ageIsOk = olderThan13(req.body.date);
    if (nameIsOk && emailIsOk && ageIsOk) {
        User.find({ email: req.body.email }, function (err, users) {
            if (err) throw err;
            const theresAlreadyAnAccountSignedUpWithThatEmail =
                users.length > 0;
            if (theresAlreadyAnAccountSignedUpWithThatEmail) {
                res.send("email_is_taken");
                throw "Trying to sign up with an email that's already taken";
            } else {
                res.send("personal_accepted");
            }
        });
    } else if (!nameIsOk) {
        // "not formatted like a real name"
        res.send("bad_name");
    } else if (!emailIsOk) {
        // "that's not an email..."
        res.send("bad_email");
    } else if (!ageIsOk) {
        // "you aren't old enough to use PM"
        res.send("bad_age");
    } else {
        res.send(400);
        throw Error("How did you get here?");
    }
});

function checkIfAllCharsAreAcceptedInName(fullName) {
    const pattern = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;
    if (pattern.test(fullName)) {
        return true;
    } else {
        return false;
    }
}

function olderThan13(date) {
    // same check as frontend code, just harder to hack 'cuz its from the server side, i guess
    const currentDate = new Date();
    const diff = Math.abs(currentDate - new Date(date));
    const differenceInDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const thirteenYearsInDays = 365 * 13;
    return differenceInDays > thirteenYearsInDays;
}

router.post("/usernameAndPassword", (req, res) => {
    // Step 2: Verify username and password as OK.
    // If username & pw are OK, create account in DB, send a verification code to user's email

    // if string contains only alphanumeric and underscore: enter nested if block; else, return "bad username"
    // if length > 16, return false
    // if length === 0, return false
    // if string has >50% numbers, return false
    // if string contains "Admin" or "PostMassiv", return false
    // if string contains the n word return false
    // if string contains more than two underscores, return false
    // if string has only a-z, A-Z, 0-9, or _, return true
    // else: store string in db

    // ...
    const username = req.body.username.trim();
    const pattern2 = /^[a-zA-Z0-9_]*$/;
    const brandName = /([Pp][Oo][Ss][Tt][Mm][Aa][Ss]{2}[Ii][Vv])/;
    const offensiveWord = /([Nn][Ii][Gg]{2}[Ee][Rr])/;
    const offensiveSlang = /([Nn][Ii][Gg]{2}[Aa])/;
    let totalUnderscores = 0;
    if (pattern2.test(username)) {
        for (let i = 0; i < username.length; i++) {
            if (username[i] === "_") {
                totalUnderscores++;
            }
        }
        if (totalUnderscores > 2 || username.includes(" ")) {
            res.send("error");
        } else if (username.length > 16 || username.length === 0) {
            res.send("error");
        } else if (
            brandName.test(username) ||
            username.includes("Admin") ||
            offensiveWord.test(username) ||
            offensiveSlang.test(username)
        ) {
            res.send("banned_word_detected");
        } else {
            // when the username is accepted...
            // check the password and then...
            // Look into the db for any user account using the email the user just signed up with
            // to prevent signing up with the same email twice
            const passwordValidator = /^[A-Za-z0-9!@#$%^&*()_+]{6, 30}$/;
            if (passwordValidator.test(req.body.password)) {
                User.find({ email: req.body.email }, function (err, users) {
                    if (err) throw err;
                    const theresAlreadyAnAccountSignedUpWithThatEmail =
                        users.filter((user) => user.finishedSignUp === true)
                            .length > 0;
                    if (theresAlreadyAnAccountSignedUpWithThatEmail) {
                        // TODO: log this error to the database if it ever happens. record time,
                        // date, data, "doc" and payload
                        throw "Trying to sign up with an email that's already taken";
                    } else {
                        bcrypt.hash(
                            req.body.password,
                            saltRounds,
                            function (err, hash) {
                                if (err) throw err;
                                const verificationCode = generateUserVerificationCode();
                                new User({
                                    fullName: req.body.name,
                                    email: req.body.email,
                                    dateOfBirth: req.body.date,
                                    username: username,
                                    passwordHash: hash, // password is hashed by bcrypt
                                    createdAt: new Date(),
                                    verificationCode: verificationCode,
                                    failedAttempts: 0,
                                    activeAccount: false,
                                    accountType: "user",
                                })
                                    .save()
                                    .then((success) => {
                                        // Step 3: Create account with email, username, pw, send verification code.
                                        // Await step 4 before activating account.
                                        // if account is not verified within 24 hrs, delete it.
                                        console.log(
                                            "Added an account to the database!"
                                        );
                                        // TODO: send email to user's supplied email with the verificationCode
                                        // TEMP:
                                        res.send(verificationCode);
                                        res.send("verification_code_sent");
                                    })
                                    .catch((err) => {
                                        throw err;
                                    });
                            }
                        );
                    }
                });
            } else {
                res.send("invalid_password");
            }
        }
    } else {
        res.send("banned_chars_detected");
    }
});

function generateUserVerificationCode() {
    const possibleChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 7; i++) {
        code += possibleChars[Math.floor(Math.random() * possibleChars.length)];
    }
    return code;
}

router.post("/validateVerificationCodeAndSignUp", (req, res) => {
    // Step 4: Awaiting verification code. After it is accepted, the db goes,
    // "Ok, the username/account associated with this email is good to go. User can log in & use PM now"
    // this route is used when the user finally gets past name,email,dob,username,pw,verification code
    const failedAttempts = getAttemptsByEmail(req.body.email);
    if (failedAttempts >= 3) {
        res.send("too_many_fails");
    } else {
        const receivedCode = req.body.verificationCode;
        const generatedPassword = getUserCode(req.body.email);
        if (receivedCode === generatedPassword) {
            approveAccountCreation(req.body.email);
            res.send("code_accepted");
        } else {
            increaseFailedVerificationAttempts(req.body.email);
            res.send("wrong_code");
        }
    }
});

function getAttemptsByEmail(email) {
    // check how many times this user has tried to send their verification code
    return User.find({ email: email }, "failedAttempts", function (err, user) {
        if (err) throw err;
        return user.failedAttempts;
    });
}

function getUserCode(email) {
    // retrieves verification code created for this email
    return User.find(
        { email: email },
        "verificationCode",
        function (err, user) {
            if (err) throw err;
            console.log(user.verificationCode);
            return user.verificationCode;
        }
    );
}

function approveAccountCreation(email) {
    // approves account creation. basically removes auto-delete timer for this user's user doc
    User.findOne({ email: email }, function (err, user) {
        if (err) throw err;
        user.finishedSignUp = true;
        user.activeAccount = true;

        user.save(function (err) {
            if (err) {
                console.log("ERROR:", err);
            }
        });
    });
}

function increaseFailedVerificationAttempts(email) {
    // increment counter for failed verifications.
    // limit is 3 but that limiting is handled outside of func
    User.findOne({ email: email }, function (err, user) {
        if (err) throw err;
        user.failedAttempts = user.failedAttempts + 1;
        // TODO: test whether this func really increments failedAttempts like it says it does

        user.save(function (err) {
            if (err) {
                console.log("ERROR:", err);
            }
        });
    });
}

// const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// const patternForUsernames = /^[a-zA-Z0-9_]*$/;
// const brandName = /([Pp][Oo][Ss][Tt][Mm][Aa][Ss]{2}[Ii][Vv])/;
// const offensiveWord = /([Nn][Ii][Gg]{2}[Ee][Rr])/;
// const offensiveSlang = /([Nn][Ii][Gg]{2}[Aa])/;
