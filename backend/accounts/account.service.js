// go to URL and CTRL + F "Account Service"
// https://jasonwatmore.com/post/2020/05/13/node-mongo-api-with-email-sign-up-verification-authentication-forgot-password#authorize-js
const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../_helpers/send-email");
// const db = require("../_helpers/db");
const Role = require("../_helpers/roles");

const db = require("../_helpers/authenticationDb");

module.exports = {
    authenticate,
    refreshToken,
    revokeToken,
    // register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function authenticate({ username, email, password, ipAddress }) {
    console.log("999999999999999999999999999999999");
    console.log(username, email, password);
    console.log(await db.Account.findOne());
    const account = username
        ? await db.Account.findOne({ username })
        : await db.Account.findOne({ email });
    console.log(account.passwordHash);
    if (
        !account ||
        !account.isVerified ||
        !bcrypt.compareSync(password, account.passwordHash)
    ) {
        throw "Username, email or password is incorrect";
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(account);
    const refreshToken = generateRefreshToken(account, ipAddress);

    // save refresh token
    await refreshToken.save();
    console.log(
        "this is nothing && what are those scary noises??",
        refreshToken.token,
        jwtToken
    );

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: refreshToken.token,
    };
}

async function refreshToken({ incomingRefreshToken, ipAddress }) {
    console.log(57, incomingRefreshToken);
    const usersOldRefreshTokenFromDatabase = await getRefreshToken(
        incomingRefreshToken
    );
    // console.log(61, usersOldRefreshTokenFromDatabase);
    const { account } = usersOldRefreshTokenFromDatabase;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    usersOldRefreshTokenFromDatabase.revoked = Date.now();
    usersOldRefreshTokenFromDatabase.revokedByIp = ipAddress;
    usersOldRefreshTokenFromDatabase.replacedByToken = newRefreshToken.token;
    await usersOldRefreshTokenFromDatabase.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(account);
    console.log(83, typeof jwtToken);

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        newRefreshToken: newRefreshToken.token,
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function register(params, origin) {
    // validate
    if (await db.Account.findOne({ email: params.email })) {
        // send already registered error in email to prevent account enumeration
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }

    // create account object
    const account = new db.Account(params);

    // first registered account is an admin
    const isFirstAccount = (await db.Account.countDocuments({})) === 0;
    account.role = isFirstAccount ? Role.Admin : Role.User;
    account.verificationToken = randomTokenString();

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    // send email
    await sendVerificationEmail(account, origin);
}

async function verifyEmail({ token }) {
    const account = await db.Account.findOne({ verificationToken: token });

    if (!account) throw "Verification failed";

    account.verified = Date.now();
    account.verificationToken = undefined;
    await account.save();
}

async function forgotPassword({ email }, origin) {
    const account = await db.Account.findOne({ email });

    // always return ok response to prevent email enumeration
    if (!account) return;

    // create reset token that expires after 24 hours
    account.resetToken = {
        token: randomTokenString(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    await account.save();

    // send email
    await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
    const account = await db.Account.findOne({
        "resetToken.token": token,
        "resetToken.expires": { $gt: Date.now() },
    });

    if (!account) throw "Invalid token";
}

async function resetPassword({ token, password }) {
    const account = await db.Account.findOne({
        "resetToken.token": token,
        "resetToken.expires": { $gt: Date.now() },
    });

    if (!account) throw "Invalid token";

    // update password and remove reset token
    account.passwordHash = hash(password);
    account.passwordReset = Date.now();
    account.resetToken = undefined;
    await account.save();
}

async function getAll() {
    const accounts = await db.Account.find();
    return accounts.map((x) => basicDetails(x));
}

async function getById(id) {
    const account = await getAccount(id);
    return basicDetails(account);
}

async function create(params) {
    // validate
    if (await db.Account.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new db.Account(params);
    account.verified = Date.now();

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    return basicDetails(account);
}

async function update(id, params) {
    const account = await getAccount(id);

    // validate (if email was changed)
    if (
        params.email &&
        account.email !== params.email &&
        (await db.Account.findOne({ email: params.email }))
    ) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = hash(params.password);
    }

    // copy params to account and save
    Object.assign(account, params);
    account.updated = Date.now();
    await account.save();

    return basicDetails(account);
}

async function _delete(id) {
    const account = await getAccount(id);
    await account.remove();
}

// helper functions

async function getAccount(id) {
    if (!db.isValidId(id)) throw "Account not found";
    const account = await db.Account.findById(id);
    if (!account) throw "Account not found";
    return account;
}

async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate(
        "account"
    );
    // console.log("59:", refreshToken._id);
    if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
    return refreshToken;
}

function hash(password) {
    return bcrypt.hashSync(password, 10);
}

function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account.id, id: account.id }, config.jwtSecret, {
        expiresIn: "15m",
    });
    // note this is NOT httpOnly because httpOnly would prevent the client from reading the expiresIn value.
}

function generateRefreshToken(account, ipAddress) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        account: account.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress,
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString("hex");
}

function basicDetails(account) {
    const {
        id,
        title,
        firstName,
        lastName,
        email,
        role,
        created,
        updated,
        isVerified,
        username,
    } = account;
    return {
        id,
        title,
        firstName,
        lastName,
        email,
        role,
        created,
        updated,
        isVerified,
        username,
    };
}

async function sendVerificationEmail(account, origin) {
    let message;
    if (origin) {
        const verifyUrl = `${origin}/account/verify-email?token=${account.verificationToken}`;
        message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to verify your email address with the <code>/account/verify-email</code> api route:</p>
                   <p><code>${account.verificationToken}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: "Sign-up Verification API - Verify Email",
        html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`,
    });
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
        message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
    } else {
        message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: "Sign-up Verification API - Email Already Registered",
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`,
    });
}

async function sendPasswordResetEmail(account, origin) {
    let message;
    if (origin) {
        const resetUrl = `${origin}/account/reset-password?token=${account.resetToken.token}`;
        message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${account.resetToken.token}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: "Sign-up Verification API - Reset Password",
        html: `<h4>Reset Password Email</h4>
               ${message}`,
    });
}
