const config = require("../config.json");
const mongoose = require("mongoose");
const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};
mongoose.connect(config.connectionString, connectionOptions);

module.exports = {
    Account: require("../accounts/account.model"),
    RefreshToken: require("../accounts/refresh-token.model"),
    isValidId,
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
