const config = require("../config.json");
const mongoose = require("mongoose");

const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};

mongoose.connect(config.connectionString, connectionOptions);
console.log("mongoose is connected to db");

module.exports = {
    User: require("../models/user.model"),
    Message: require("../models/message.model"),
    Notification: require("../models/notification.model"),
    Match: require("../models/match.model"),
    isValidId,
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
