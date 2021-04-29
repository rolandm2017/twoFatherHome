const jwt = require("express-jwt");
const { jwtSecret } = require("../config.json");
const db = require("../_helpers/authenticationDb");

// const usersDb = require("../data/users").users;

module.exports = authorize;

function authorize(roles = []) {
    // Roly's comment: This function appears to test whether the request is from an authorized user,
    // but HOW it tests that is mysterious. I don't understand where "req, res, next" comes from in the async func.

    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === "string") {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({
            secret: jwtSecret,
            algorithms: ["HS256"],
            getToken: function fromHeaderOrQuerystring(req) {
                if (
                    req.headers.authorization &&
                    req.headers.authorization.split(" ")[0] === "Bearer"
                ) {
                    console.log(req.headers.authorization.split(" ")[1]);
                    return req.headers.authorization.split(" ")[1];
                } else if (req.query && req.query.token) {
                    // i copied this code and have no idea when this condition would ever be met
                    return req.query.token;
                }
                console.log("rejected...", req.headers.authorization);

                return null;
            },
        }),

        // authorize based on user role
        async (req, res, next) => {
            console.log("25:", req.body, req.user, req.user.id);
            // const account = mockFindById(req.user.id);
            const account = await db.User.findById(req.user.id);
            const refreshTokens = await db.RefreshToken.find({
                account: account.id,
            });

            const accountDoesNotExistOrUserIsNotAuthorized =
                !account || (roles.length && !roles.includes(account.role));
            if (accountDoesNotExistOrUserIsNotAuthorized) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            // authentication and authorization successful
            req.user.role = account.role;
            req.user.ownsToken = (token) =>
                !!refreshTokens.find((x) => x.token === token);
            // req.user.ownsToken = true; // here in the mock, we are pretending the refresh token is always valid.
            next();
        },
    ];
}

// function mockFindById(userId) {
//     for (let i = 0; i < Object.keys(usersDb).length; i++) {
//         if (usersDb[i].id === userId) {
//             return usersDb[i];
//         }
//     }
// }
