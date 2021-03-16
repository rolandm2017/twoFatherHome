const extreme = true;
console.log("Extreme setting:", extreme);

let maxReplies;
let maxAmps;
let maxLikes;
let maxViews;
let maxCap;
let maxFollows;
if (extreme) {
    // tier 3
    maxReplies = 99999;
    maxAmps = 999999;
    maxLikes = 99999999;
    maxViews = 9999999999;
    maxCap = 9999999999;
    maxFollows = 99999;
} else {
    if (false) {
        // tier 2
        maxReplies = 999;
        maxAmps = 9999;
        maxLikes = 99999;
        maxViews = 99999;
        maxCap = 99999;
        maxFollows = 999;
    } else {
        // tier 1
        maxReplies = 99;
        maxAmps = 99;
        maxLikes = 999;
        maxViews = 9999;
        maxCap = 99999;
        maxFollows = 9;
    }
}

const ids = [...Array(999).keys()];
const authors = [
    { displayName: "Crono", username: "LegendaryHero" },
    { displayName: "Lucca", username: "geniusInventor99" },
    { displayName: "Marle", username: "princessAnonymous" },
    { displayName: "Frog", username: "ribbitWarrior" },
    { displayName: "Robo", username: "madeByMan" },
    { displayName: "Ayla", username: "queen" },
    { displayName: "Magus", username: "misfitBoyFromZeal" },
    { displayName: "Scott Adams", username: "ScottAdamsSays" },
    { displayName: "Mike Cernovich", username: "Cernovich" },
    { displayName: "Donald Trump", username: "realDonaldTrump" },
    { displayName: "Calvin Harris", username: "CalvinHarris" },
    {
        displayName: "Dimitri Vegas & Like Mike",
        username: "dimitriVegasLikeMike",
    },
    { displayName: "Swedish House Mafia", username: "SHM" },
    { displayName: "Alison Wonderland", username: "aWonderland" },
    { displayName: "Sir Frans De Waahl", username: "deWaahl" },
    { displayName: "The Mother of Dragons", username: "khaleesiWasTaken" },
];

const text = [
    "Enim ex tempor ad id id in non id incididunt tempor culpa incididunt eu.",
    "Voluptate consequat adipisicing aliqua consectetur.",
    "Eu sit quis reprehenderit.",
    "Eu sit quis.",
    "Eu quis reprehenderit.",
    "Velit ea sit ipsum aliquip elit fugiat tempor. Consequat exercitation minim do exercitation. Lorem incididunt aliquip do pariatur esse aliqua. Adipisicing eu amet non officia id voluptate nostrud cillum incididunt.",
    "Cillum sit nulla consequat quis proident quis.Dolore qui occaecat sunt aliqua culpa.Ex consequat occaecat minim cillum consequat.Aliqua ut tempor consectetur consectetur ea labore anim id labore in.Nisi aliquip mollit culpa do anim elit voluptate sit velit enim irure dolor quis laborum.",
    "Magna Lorem excepteur dolor dolor culpa ut id culpa eu eiusmod ex cillum.Ut quis magna veniam qui occaecat laborum adipisicing Lorem irure.Exercitation occaecat proident minim anim irure eiusmod ut sunt veniam sit.Officia sit enim reprehenderit Lorem laboris occaecat nostrud.",
    "Quis culpa dolor ipsum tempor consequat amet fugiat aliquip consectetur sunt.Commodo consectetur duis duis aliqua esse exercitation occaecat.Minim quis nulla incididunt anim laborum ipsum commodo ex ut dolore esse esse.Culpa velit nulla excepteur culpa.Ut tempor magna exercitation ad voluptate ad magna aute ipsum exercitation proident voluptate Lorem duis.",
    "Labore sint amet veniam aute nulla cupidatat deserunt consectetur ipsum tempor velit id.Mollit proident ut commodo exercitation sunt ut labore est nostrud occaecat sit ullamco id.Ad pariatur amet non elit proident ipsum fugiat ea consequat magna nostrud nisi est aliquip.Cupidatat deserunt labore sint sit.Nisi irure quis commodo culpa incididunt amet esse culpa commodo ea in culpa enim.",
    "Esse voluptate incididunt laborum cillum officia proident.Minim non fugiat consequat do.Ut aliqua pariatur est irure sunt.Ullamco qui irure cupidatat qui.Veniam adipisicing commodo sunt nulla enim nulla consequat tempor ad.",
    "Ut dolor commodo adipisicing veniam.Dolore dolore voluptate excepteur Lorem adipisicing excepteur dolore excepteur est sint pariatur eiusmod.Esse pariatur anim nostrud quis consequat exercitation dolore occaecat ipsum.Minim fugiat incididunt enim duis consectetur aute enim proident ea minim incididunt.Laboris labore enim nulla pariatur est fugiat ex eu aute quis exercitation.Anim culpa quis excepteur consequat voluptate aute cillum labore.",
];

const deliveryDates = [
    "9m",
    "53m",
    "6h",
    "19h",
    "Oct 23",
    "Oct 29",
    "Dec 1",
    "Dec 15",
];

// massiv stuff
const id = () => {
    return ids[Math.floor(Math.random() * ids.length)];
};
const author = () => {
    return authors[Math.floor(Math.random() * authors.length)];
};
const content = () => {
    return text[Math.floor(Math.random() * text.length)];
};
const replies = () => {
    return Math.floor(Math.random() * maxReplies);
};
const amplifies = () => {
    return Math.floor(Math.random() * maxAmps);
};
const likes = () => {
    return Math.floor(Math.random() * maxLikes);
};
const views = () => {
    return Math.floor(Math.random() * maxViews);
};
const cap = () => {
    return Math.floor(Math.random() * maxCap);
};

// notification stuff
const others = () => Math.floor(Math.random() * maxFollows);

// messages unique stuff
const deliveryDate = () =>
    deliveryDates[Math.floor(Math.random() * deliveryDates.length)];

// events
const randInt = () => Math.floor(Math.random() * 20);
const events = {
    trending: [
        { num: randInt(), headline: "Fantasy sports", content: "#AskFFT" },
        {
            num: randInt(),
            headline: "",
            content: "#SundayMorning",
        },
        { num: randInt(), headline: "Politics", content: "Mark Meadows" },
        { num: randInt(), headline: "", content: "Everton" },
        { num: randInt(), headline: "", content: "#PortugueseGP" },
    ],
    news: [
        {
            headline: "BC election",
            when: "Yesterday",
            content: "NDP set to form majority government in British Columbia",
        },
        {
            headline: "Politics",
            when: "Yesterday",
            content: "Will a glitter ban save the oceans?",
        },
        {
            headline: "Bloomberg Opinion",
            when: "October 23, 2020",
            content:
                "France recalls its ambassador in Turkey and condemns comments from Turkey's president",
        },
        {
            headline: "World news",
            when: "18 minutes ago",
            content: "Hospitals see increase in patients with advanced cancers",
        },
        {
            headline: "Toronto Star",
            when: "3 hours ago",
            content:
                "Washington State officials eradicate the first 'murder hornet' nest",
        },
    ],
    influencers: [
        { displayName: "Kelly", reason: "blah blah blah" },
        { displayName: "Kelly", reason: "blah blah blah" },
        { displayName: "Kelly", reason: "blah blah blah" },
        { displayName: "Kelly", reason: "blah blah blah" },
        { displayName: "Kelly", reason: "blah blah blah" },
    ],
    commerce: [
        {
            displayName: "Bronze",
            when: "Yesterday",
            offer: "the latest and greatest in copywriting",
        },
        {
            displayName: "rulesofthetrade",
            when: "3 hours ago",
            offer: "have u heard about my l33t saas bro",
        },
        {
            displayName: "Ollie Catin",
            when: "3 min ago",
            offer: "the latest and greatest in copywriting",
        },
        {
            displayName: "Marle",
            when: "Yesterday",
            offer:
                "get to 1 million followers in a year or less and get paid to do it",
        },
    ],
};

// profile stuff
const tweets = () => {
    return Math.floor(Math.random() * 99999);
};

const bios = [
    "Ad id cillum ex commodo ex enim deserunt cillum dolor in Lorem non.",
    "Excepteur irure mollit esse ad pariatur anim eiusmod proident adipisicing enim ipsum ad laboris.",
    "Incididunt ullamco laborum consectetur nisi eu fugiat amet cillum laboris adipisicing cupidatat ex anim.",
    "Est ad voluptate nostrud consequat.",
    "Amet eu qui ut mollit minim excepteur laboris cupidatat consectetur adipisicing commodo aute.",
    null,
];

const locations = [
    "Vancouver BC",
    "New York City NYC",
    "Miami FL",
    "Dallas TX",
    null,
    null,
];

const websites = [
    "www.postmassiv.com",
    "www.twitter.com",
    "google.ca",
    null,
    null,
];

const birthdays = [
    "March 23",
    "May 3",
    null,
    "December 31",
    "February 9",
    null,
    "January 3",
    "April 31",
];

const joinDates = [
    "March 2008",
    "May 2020",
    "April 2020",
    "December 2020",
    "March 2023",
];

const bio = () => {
    return bios[Math.floor(Math.random() * bios.length)];
};
const location = () => {
    return locations[Math.floor(Math.random() * locations.length)];
};
const website = () => {
    return websites[Math.floor(Math.random() * websites.length)];
};
const birthday = () => {
    return birthdays[Math.floor(Math.random() * birthdays.length)];
};
const joinDate = () => {
    return joinDates[Math.floor(Math.random() * joinDates.length)];
};
const following = () => Math.ceil(Math.random() * 99999);
const followers = () => {
    if (extreme) {
        return Math.ceil(Math.random() * 100000000);
    } else {
        return Math.ceil(Math.random() * 999999);
    }
};

module.exports = {
    id: id,
    author: author,
    content: content,
    replies: replies,
    amplifies: amplifies,
    likes: likes,
    views: views,
    cap: cap,
    others: others,
    deliveryDate: deliveryDate,
    events: events,
    tweets: tweets,
    bio: bio,
    location: location,
    website: website,
    birthday: birthday,
    joinDate: joinDate,
    following: following,
    followers: followers,
};
