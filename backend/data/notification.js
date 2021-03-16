const data = require("./data");

function getOneToThreePeople() {
    const people = [];
    const amount = Math.ceil(Math.random() * 3);
    for (let i = 0; i < amount; i++) {
        people.push(data.author());
    }
    return people;
}

function getReply() {
    return {
        type: "reply",
        data: {
            id: data.id(),
            replier: data.author(),
            to: getOneToThreePeople(),
            content: data.content(),
        },
    };
}

function getAmplify() {
    return {
        type: "amplify",
        data: {
            id: data.id(),
            amplifier: data.author().display,
            others: data.others(),
            author: data.author(),
            content: data.content(),
        },
    };
}

function getLike() {
    return {
        type: "like",
        data: {
            id: data.id(),
            headliner: data.author().display,
            likes: data.likes(),
            text: data.content(),
        },
    };
}

function getFollow() {
    return {
        type: "follow",
        data: {
            id: data.id(),
            user: data.author().display,
            others: data.others(),
        },
    };
}

function getQuote() {
    return {
        type: "quote",
        data: {
            id: data.id(),
            quoter: data.author(),
            content: data.content(),
            OP: data.author(),
            originalText: data.content(),
        },
    };
}

module.exports = {
    getReply: getReply,
    getAmplify: getAmplify,
    getLike: getLike,
    getFollow: getFollow,
    getQuote: getQuote,
};
