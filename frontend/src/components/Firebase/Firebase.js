import app from "firebase/app";
import "firebase/auth";

// import "firebase/database" // can probably deelete this
import "firebase/firestore"

import "firebase/storage"


const prodConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const devConfig = {
    apiKey: process.env.REACT_APP_API_KEY_DEV,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN_DEV,
    databaseURL: process.env.REACT_APP_DATABASE_URL_DEV,
    projectId: process.env.REACT_APP_PROJECT_ID_DEV,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET_DEV,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID_DEV,
}



// console.log(process.env.NODE_ENV)
const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;
// console.log(config)

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        // this.db = app.database();

        this.fs = app.firestore();

        this.timestamp = app.firestore.FieldValue.serverTimestamp();

        this.storage = app.storage()
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    // *** User API ***
    getUserName = () => app.auth().currentUser.displayName// should return something

    // *** Admin Stuff Goes Here ***

    // *** Firestore User API ***

    checkIfUserHasProfile = (uid) => {
        this.fs.collection("users").doc(uid).get().then((doc) => {
            console.log("DOC:", doc)
            if (doc.exists) {
                return true
            } else {
                return false
            }
        }).catch(err => {
            console.log(err)
        })
    }

    getUsernameByUID = (uid) => this.fs.collection("users").doc(uid).get().then(doc => {
        return doc.data().username
    }).catch(err => console.log(err))

    getUserInfo = uid => this.fs.collection("users").doc(uid).get().then(doc => {
        return doc.data()
    }).catch(err => console.log(err))

    // creates a profile with docId "uid"... this has so many args, consider splitting it into two funcs/two pages...
    createProfile = (uid, fullName, username, city, state, country, age, kids, familyValues,
        interests, hasPets, diet, drinks, smokes, doesDrugs) =>
        this.fs.collection("users").doc(uid).set({
            fullName: fullName,
            username: username,
            city: city,
            state: state,
            country: country,
            age: age,
            kids: kids,
            familyValues: familyValues,
            interests: interests,
            hasPets: hasPets,
            diet: diet,
            drinks: drinks,
            smokes: smokes,
            drugs: doesDrugs,
            signedUpAt: this.timestamp,
            hasPremium: false,
            likes: ""
        })

    editProfile = (uid, city, state, country, kids, familyValues, interests, hasPets, diet, drinks, smokes, doesDrugs) => {
        this.fs.collection("users").doc(uid).update({
            city: city,
            state: state,
            country: country,
            kids: kids,
            familyValues: familyValues,
            interests: interests,
            hasPets: hasPets,
            diet: diet,
            drinks: drinks,
            smokes: smokes,
            drugs: doesDrugs
        })
    }

    enablePremium = uid => {
        this.fs.collection("users").doc(uid).update({
            hasPremium: true
        })
    }

    disablePremium = uid => {
        this.fs.collection("users").doc(uid).update({
            hasPremium: false
        })
    }

    retrieveNewProfileUIDs = authUserUID => {
        return new Promise((resolve, reject) => {
            this.fs.collection("users").doc(authUserUID).get().then(doc => {
                const alreadyLikedProfiles = doc.data().likes.split(",") // split the UIDs by the , delimiter
                this.fs.collection("users").get().then(snapshot => {
                    const newProfileIds = []
                    snapshot.forEach(doc => {
                        // if the profile ID is NOT included in the list of users already liked by the user...
                        // AND the profile ID is NOT that of the authenticated user ("authUserUID")
                        const docIsIncluded = alreadyLikedProfiles.includes(doc.id)
                        if (!docIsIncluded && doc.id !== authUserUID) { // TODO: write unit test for this biconditional
                            newProfileIds.push(doc.id)
                        }
                    })
                    resolve(newProfileIds)
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            })
        })
    }

    addLike = (targetUserUID, fromUserUID) => {
        // in this .collection("users") block, we tell the users db that user fromUserUID has liked targetUserUID
        // by adding targetUserUID to fromUserUID's list of likes, which is a field in the doc with fromUserUID's UID.
        this.fs.collection("users").doc(fromUserUID).get().then(doc => {
            const updatedLikes = doc.data().likes
            if (updatedLikes) {
                this.fs.collection("users").doc(fromUserUID).update({
                    likes: updatedLikes + "," + targetUserUID
                })
            } else { // for the base case where doc.data().likes does not exist yet
                this.fs.collection("users").doc(fromUserUID).update({
                    likes: targetUserUID
                })
            }
        }).catch(err => console.log(err))

        // in this block, we tell the "likes" database that user targetUserUID has been liked by fromUserUID
        // by adding fromUserUID to targetUserUID's "likedBy" list.
        this.fs.collection("likes").doc(targetUserUID).get().then(doc => {
            if (doc.exists) {
                const currentLikes = doc.data().likedBy
                const currentUsers = doc.data().likedByUsernames

                // retrieve the username of the liking user so it can be added to the likedByUsernames field
                this.getUsernameByUID(fromUserUID).then(fromUserUsername => {
                    this.fs.collection("likes").doc(targetUserUID).update({
                        likedByUsernames: currentUsers + "," + fromUserUsername,
                        likedByUID: currentLikes + "," + fromUserUID
                    }).catch(err => console.log(err))
                })
            } else {
                // init condition where targetUserUID has no document in the "likes" collection
                console.log("Document does not exist")
                // retrieve the username of the targetUser so it can be added to the username field
                this.getUsernameByUID(targetUserUID).then(targetUserUsername => {
                    // retrieve the username of the liking user so it can be added to the likedByUsernames field
                    this.getUsernameByUID(fromUserUID).then(fromUserUsername => {
                        this.fs.collection("likes").doc(targetUserUID).set({
                            doc_owner_username: targetUserUsername,
                            likedByUsernames: fromUserUsername,
                            likedByUID: fromUserUID
                        }).catch(err => console.log(err))
                    })
                })
            }
        })
    }

    // *** Firestore Messages API ***

    // FOREVERNOTE from Samy Dindane: 

    // re: "I am doing..."
    //     this.fs.collection("chatrooms").get().then(snapshot => {
    //         snapshot.forEach(doc => {
    //             if (http://doc.data().someField === "foo") {
    //             // looking for one doc out of potentially thousands
    //         }
    //     }
    // }
    // 

    // Samy Dindane says: 
    // You "usually" would never want to do that because 
    // 1) you slow down the page when you load/display tons of documents 2) you pay per reads
    // Why don't you write `.where('myfield', '==', 'foo')`?
    //

    // note: messages database has the following format...
    // collection "chatrooms" contains docs with randomly generated IDs.
    // each chatrooms doc is a chatroom.
    // each chatrooms doc contains a createdAt field, a roomNum (unimportant?), and a users field (who can view the chat)
    // the important part is that the doc ID is randomly generated, and contains a users field
    // a chatrooms doc contains a subcollection "messages", which contains docs with randomly generated IDs.
    // each messages doc is a message in a chatroom.
    // each message doc contains fields time, approxMsgNum, recipient, sender, content.

    // TODO: Look for opportunities to refactor using .where()

    // TODO: refactor Messages API to use user1 & user2 field instead of "users" field. Should be easy.

    sendMessageToUser = (senderUID, recipientUID, content) => {
        // figure out which chatroom has users "senderUID" and "recipientUID"
        let activeChatroomId = null;
        const sortedUIDs = [senderUID, recipientUID].sort()
        const UIDsAsString = sortedUIDs[0] + "," + sortedUIDs[1]
        console.log("999:", senderUID, recipientUID, content)

        // should only return 1 doc, ever.
        const scanForChatroom = new Promise((resolve, reject) => {
            this.fs.collection("chatrooms").where("usersUIDs", "==", UIDsAsString).get().then(doc => {
                if (doc.exists) {
                    // sets activeChatroomId to the doc id of the chatroom assigned to the 2 users
                    activeChatroomId = doc.id // if there is a returned doc, change value from "null" to "doc.id" 
                }
                resolve(activeChatroomId)
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })

        // either create a new chatroom & first msg, or add a new msg if there is an activeChatroom
        scanForChatroom.then(activeChatroomId => {
            // if null, we cannot get an approxMsgNum from a previous msg, because the chatroom is new & there are no msgs
            if (activeChatroomId === null) {
                // create a chatrooms doc, use the docId from the docRef object to select the newly created doc, and
                // then create the first messages doc.

                // create the chatrooms doc... get user1username, user2username, then set the doc
                const user1username = this.getUsernameByUID(sortedUIDs[0])
                const user2username = this.getUsernameByUID(sortedUIDs[1])
                Promise.all([user1username, user2username]).then(usernames => {
                    const chatroomCreated = new Promise((resolve, reject) => {
                        this.fs.collection("chatrooms").doc(UIDsAsString).set({
                            user1: usernames[0],
                            user1uid: sortedUIDs[0],
                            user2: usernames[1],
                            user2uid: sortedUIDs[1],
                            users: usernames[0] + "," + usernames[1],
                            usersUIDs: sortedUIDs,
                            createdAt: this.timestamp
                        }).then(processFinished => {
                            resolve(processFinished)
                        }).catch(err => {
                            console.log(err)
                            reject(err)
                        })
                    })
                    chatroomCreated.then(finished => {

                        this.fs.collection("chatrooms").doc(UIDsAsString).collection("messages").add({
                            // create the first msg doc
                            approxMsgNum: 0,
                            content: content,
                            recipientUID: recipientUID,
                            senderUID: senderUID,
                            time: this.timestamp
                        }).catch(err => console.log(err))
                    })
                }).catch(err => console.log(err))
            } else {
                // note: approxMsgNum is necessary because it is used when retrieving the most recent 10 msgs in getChatroomMsgs
                // need to retrieve approxMsgNum and activeChatroomId before proceeding

                const approxMsgNum = new Promise((resolve, reject) => {
                    this.fs.collection("chatrooms").doc(activeChatroomId).collection("messages")
                        .orderBy("approxMsgNum", "desc").limit(1).get().then(doc => {
                            // doc should always exist: we scanned for an active chatroom before, and there was one, so
                            // there should be a message doc in its messages subcollection to retrieve an approxMsgNum from.
                            if (doc.exists) {
                                resolve(doc.data().approxMsgNum) // report the approxMsgNum to the constant
                            } else {
                                // TODO: report error to firestore error logging database.
                                throw new Error("Unexpectedly, there is no doc to retrieve an approxMsgNum from")
                            }
                        }).catch(err => {
                            console.log(err)
                            reject(err)
                        })
                })

                // create the new message with the approxMsgNum incremented by 1
                approxMsgNum.then(approxMsgNum => {
                    this.fs.collection("chatrooms").doc(activeChatroomId).collection("messages").add({
                        approxMsgNum: approxMsgNum + 1,
                        content: content,
                        recipientUID: recipientUID,
                        senderUID: senderUID,
                        time: this.timestamp
                    })
                })
            }
        })
    }

    // TODO: revisit the messages API and see where you can update getUsersChatroomsWithPromise, getUsersChatrooms, getChatroomMessages
    // use .where(). refactor database structure if necessary to use .where().
    // Beware The Refactor Rabbit Hole
    // TODO: refactor Chatrooms and Messages collection to feature user1 & user2, both by uid & username

    // return all chatroom ids where user is present in the list of users... as a promise
    // TODO: convert from .get() to .where()
    getUsersChatroomsWithPromise = userUID => { // functions by uid
        return new Promise(resolve => {
            // FIXME: somehow pass an option to retrieve only the most recent 10 chatrooms.
            const scanFirstUserField = new Promise((resolve, reject) => {
                this.fs.collection("chatrooms").where("user1uid", "==", userUID).get().then(snapshot => {
                    const rooms = [];
                    snapshot.forEach(doc => {
                        rooms.push([{ chatroomId: doc.id }, { user1: doc.data().user1 }, { user2: doc.data().user2 }])
                    })
                    resolve(rooms)
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            })
            const scanSecondUserField = new Promise((resolve, reject) => {
                this.fs.collection("chatrooms").where("user2uid", "==", userUID).get().then(snapshot => {
                    const rooms = [];
                    snapshot.forEach(doc => {
                        rooms.push([{ chatroomId: doc.id }, { user1: doc.data().user1 }, { user2: doc.data().user2 }])
                    })
                    resolve(rooms)
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            })
            Promise.all([scanFirstUserField, scanSecondUserField]).then(scans => {
                const usersChatroomsByUsername = []
                for (const scan in scans) { // there are 2 scans
                    const rooms = scans[scan]
                    for (const room in rooms) {
                        usersChatroomsByUsername.push(rooms[room])
                    }
                }
                resolve(usersChatroomsByUsername)
            })
        }
        )
    }

    // return all chatroom ids where user is present in the list of users
    // TODO: convert from .get() to .where()
    getUsersChatrooms = user => { // functions by username
        // FIXME: somehow pass an option to retrieve only the most recent 10 chatrooms.
        return new Promise(resolve => {
            const scanForFirstUser = new Promise((resolve, reject) => {
                this.fs.collection("chatrooms").where("user1", "==", user).get().then(snapshot => {
                    const rooms = [];
                    snapshot.forEach(doc => {
                        rooms.push([{ chatroomId: doc.id }, { user1: doc.data().user1 }, { user2: doc.data().user2 }])
                    })
                    resolve(rooms)
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            })
            const scanForSecondUser = new Promise((resolve, reject) => {
                this.fs.collection("chatrooms").where("user2", "==", user).get().then(snapshot => {
                    const rooms = [];
                    snapshot.forEach(doc => {
                        rooms.push([{ chatroomId: doc.id }, { user1: doc.data().user1 }, { user2: doc.data().user2 }])
                    })
                    resolve(rooms)
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            })
            Promise.all([scanForFirstUser, scanForSecondUser]).then(scans => {
                const usersChatroomsByUsername = []
                for (const scan in scans) { // there are 2 scans
                    const rooms = scans[scan]
                    for (const room in rooms) {
                        usersChatroomsByUsername.push(rooms[room])
                    }
                }

                // has the form [{chatroomId: chatroomId}, {user1: user1username}, {user2: user2username}]
                resolve(usersChatroomsByUsername)
            })
        })
    }

    // does what it says.
    // TODO: convert from .get() to .where()
    getMostRecentChatroomMessages = (userOneUID, userTwoUID) => {
        // retrieves most recent 10 messages between userOne and userTwo
        const sortedUIDs = [userOneUID, userTwoUID].sort()
        // TODO: figure out if .orderBy("approxMsgNum", "desc") returns e.g. 25, 24, 23, 22... or 1, 2, 3, 4 (want: 25, 24, 23, 22...)
        const get10msgs = this.fs.collection("chatrooms").doc(sortedUIDs).collection("messages").orderBy("approxMsgNum", "desc").limit(10)
        get10msgs.then(snapshot => {
            const msgContent = [];
            snapshot.forEach(doc => {
                msgContent.push(doc.data())
            })
            return msgContent
        })
    }

    // *** Images API ***

    getProfileURLsByUID = uid => {
        const storageRef = this.storage.ref(uid)
        const URLs = [];
        let counter = 0

        // Here Be Dragons
        const sorryAboutPromiseHell = new Promise(resolve => {
            storageRef.listAll().then(function (results) {
                results.items.forEach(function (imageRef) {
                    imageRef.getDownloadURL().then(function (url) {
                        URLs.push(url)
                        counter++
                        // console.log("Counter:", counter, uid)
                        if (counter === results.items.length) {
                            // console.log("URLs:", URLs, uid)
                            resolve(URLs)
                            // return URLs
                        }
                    }).catch(error => {
                        console.log("error from getDownloadURL():", error)
                    })
                })
            }).catch(function (error) {
                console.log("error in listAll():", error)
            })
        })

        return sorryAboutPromiseHell
    }

    // *** test code ***

    testLog = () => console.log("printed!")

}

export default Firebase;

// ask Ben about this... how do I set process.env.NODE_ENV to 'production'?
// ctrl + F; "FIREBASE IN REACT SETUP" https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial
// """
// Optionally, you can create a second Firebase project on the Firebase website to have one project for your development
// environment and one project for your production environment.That way, you never mix data in the Firebase database in 
// development mode with data from your deployed application(production mode).If you decide to create projects for both environments, 
// use the two configuration objects in your Firebase setup and decide which one you take depending on the development / production 
// environment
// """