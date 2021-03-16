const data = require("./data");

function makeProfile() {
    return {
        user: data.author(),
        tweets: data.tweets(),
        bio: data.bio(),
        location: data.location(),
        website: data.website(),
        birthday: data.birthday(),
        joinDate: data.joinDate(),
        following: data.following(),
        followers: data.followers(),
    };
}

module.exports = makeProfile;
