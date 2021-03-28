const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// socket configuration
const WebSockets = require("./utils/WebSockets.js");
// routes
const userRouter = require("./routes/user.js");
const chatRoomRouter = require("./routes/chatRoom.js");
const deleteRouter = require("./routes/delete.js");

const port = 8080;

const app = express();

// misc stuff
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

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

app.use(api + "/user", require("./userActions/userActions"));

// *** *** ***
// *** *** ***
// CRUD for DMs

// todo: implement later...

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use("/users", userRouter);
// app.use("/room", decode, chatRoomRouter);
// app.use("/delete", deleteRouter);

// /** catch 404 and forward to error handler */
// app.use("*", (req, res) => {
//     return res.status(404).json({
//         success: false,
//         message: "API endpoint doesnt exist",
//     });
// });

// for chatroom code boilerplate, see: https://www.freecodecamp.org/news/create-a-professional-node-express/

// /** Create HTTP server. */
const server = http.createServer(app);
// /** Create socket connection */
global.io = socketio.listen(server);
global.io.on("connection", WebSockets.connection);
// /** Listen on provided port, on all network interfaces. */
server.listen(port);
// /** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${port}/`);
});

app.listen(port, () => {
    console.log(`Example app listening at http://127.0.0.1:${port}`);
});
