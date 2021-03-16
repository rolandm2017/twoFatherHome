const data = require("./data");

function getMessage() {
    return {
        author: data.author(),
        content: data.content(),
        deliveryDate: data.deliveryDate(),
    };
}

module.exports = getMessage;
