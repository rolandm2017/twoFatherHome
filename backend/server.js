const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const io = new Server();

// socket configuration
const WebSockets = require("./utils/WebSockets.js");

const port = 8080;

const app = express();

// misc stuff
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

let saltRounds;
if (process.env.NODE_ENV === "development") {
    saltRounds = 10;
} else {
    saltRounds = 17;
}

const api = "/api";

// *** *** ***
// *** *** ***
// Auth stuff

app.use(api + "/auth", require("./accountCreation/accountCreation"));
app.use(api + "/auth", require("./authentication/authentication"));

// *** *** ***
// *** *** ***
// Sign Up Validation

app.use(api + "/signup/validate", require("./accountCreation/accountCreation"));
// fixme: line 43 and line 36 req the same routes, is this intended?

// *** *** ***
// *** *** ***
// CRUD for User account info, including their bio & user settings

// app.use(api + "/user", require("./userActions/userActions")); // TODO: implement profile editing & settings editing

// *** *** ***
// *** *** ***
// CRUD for DMs

const DMs = "/dm";

// TODO !important: add authorization to DM routes. Currently they are unprotected.

app.use(api + DMs + "/users", require("./routes/user.js"));
// current TODO: find out how the /routes/users.js is used in the boilerplate code.
// Do I need to replace it with my own? Can I simply delete it?
// The question to ask specifically would be: Does the /room and /delete route use any of the user methods?
app.use(api + DMs + "/room", require("./routes/chatRoom.js"));
app.use(api + DMs + "/delete", require("./routes/delete.js"));

// /** catch 404 and forward to error handler */
app.use("*", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "API endpoint doesnt exist",
    });
});

// for chatroom code boilerplate, see: https://www.freecodecamp.org/news/create-a-professional-node-express/

// /** Create HTTP server. */
const server = http.createServer(app); // makes a http server using express, I think.
// /** Create socket connection */
global.io = io.listen(server); // Attaches the Server to an engine.io instance on new http.Server and assigns to global.io
global.io.on("connection", WebSockets.connection); // feeds a websockets connection upon connection...?
// /** Listen on provided port, on all network interfaces. */
server.listen(port);
// /** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${port}/`);
});

// app.listen(port, () => {
//     console.log(`Example app listening at http://127.0.0.1:${port}`);
// });

// TODO: test server's lines 79 to 87.
// does the chatroom work ?
// does the rest of the server work despite switching from "app.listen()" to "server.on()"?
