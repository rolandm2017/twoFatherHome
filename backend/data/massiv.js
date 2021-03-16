const data = require("./data");

function generateRandomMassiv() {
    return {
        id: data.id(),
        author: data.author(),
        content: data.content(),
        replies: data.replies(),
        amplifies: data.amplifies(),
        likes: data.likes(),
        views: data.views(),
        cap: data.cap(),
    };
}

module.exports = generateRandomMassiv;
