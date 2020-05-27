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
    })

    getUserInfo = docId => this.fs.collection("users").doc(docId).get().then(doc => {
        return doc.data()
    }) // TODO: mk all users in the database keyed by their UID value. create unique auth accts for each user so this works

    // creates a profile with docId "uid"... this has so many args, consider splitting it into two funcs/two pages...
    createProfile = (uid, fullName, username, city, state, country, age, familyValues,
        interests, hasPets, diet, drinks, smokes, doesDrugs) =>
        this.fs.collection("users").doc(uid).set({
            fullName: fullName,
            username: username,
            city: city,
            state: state,
            country: country,
            age: age,
            familyValues: familyValues,
            interests: interests,
            hasPets: hasPets,
            diet: diet,
            drinks: drinks,
            smokes: smokes,
            drugs: doesDrugs,
            signedUpAt: this.timestamp
        })

    editProfile = (uid, city, state, country, familyValues, interests, hasPets, diet, drinks, smokes, doesDrugs) => {
        this.fs.collection("users").doc(uid).update({
            city: city,
            state: state,
            country: country,
            familyValues: familyValues,
            interests: interests,
            hasPets: hasPets,
            diet: diet,
            drinks: drinks,
            smokes: smokes,
            drugs: doesDrugs
        })
    }

    // *** Firestore Messages API ***

    // return all chatroom ids where user is present in the list of users... as a promise
    getUsersChatroomsWithPromise = user => {
        return new Promise(resolve => {
            this.fs.collection("chatrooms").get().then(snapshot => {
                const rooms = [];
                snapshot.forEach(doc => {
                    const users = doc.data().users.split(",")
                    if (users[0] === user || users[1] === user) {
                        rooms.push([doc.id, doc.data().users])
                    }
                })
                resolve(rooms)
            })
        }
        )
    }


    // return all chatroom ids where user is present in the list of users
    getUsersChatrooms = user => this.fs.collection("chatrooms").get().then(snapshot => {
        const rooms = [];
        snapshot.forEach(doc => {
            const users = doc.data().users.split(",")
            if (users[0] === user || users[1] === user) {
                rooms.push([doc.id, doc.data().users])
            }
        })
        return rooms
    })

    getChatroomMessages = roomId => this.fs.collection("chatrooms").doc(roomId).collection("messages").get().then(snapshot => {
        const msgContent = [];
        snapshot.forEach(msg => {
            msgContent.push(msg.data())
        })
        return msgContent
    })

    // makeUsersList = () => //

    // *** Images API ***

    uploadFile = (userUID, number, file) => {
        // file structure: images/userUID/profilePic-number.jpg
        // const storageRef = this.storage.ref();
        // create a reference to "profilePic(number).jpg"
        // const profilePicRef = storageRef.child(`profilePic-${number}.jpg`)
        // create a ref to "images/profilePic-userUID-number.jpg"
        // const profilePicImagesRef = storageRef.child(`images/profilePic-${userUID}-${number}.jpg`)

        // https://stackoverflow.com/questions/41304405/firebase-storage-web-how-to-upload-a-file

        const storageReference = this.storage.ref(`image/${userUID}/profilePic-${number}`)

        const uploadTask = storageReference.put(file)

        uploadTask.on("state_changed", function progress(snapshot) {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.setState({ uploadPercent: percentage }) // TODO: Figure out how I'm gonna get this value into UploadPhotosPage.js
            // maybe it will just work? does calling .setState here set the state of the component that calls the function?
        }, function error(err) {
            // TODO: improve this. tell the user about an upload error and prompt them to try again?
            console.log(err)
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (err.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                default:
                    console.log("error type not listed in switch statement: ", err)
                    break;
            }
        }, function complete() {
            // TODO: what to do when the upload is complete? Set userMsg to "finished upload"?
            // TODO: when upload is complete, trigger uploaded photo being added to "user photos" display section on page

            // get download URL:
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                return downloadURL
            });
        })
    }

    getHighestPhotoNumByUser = (userUID) => {
        // function retrieves the highest numbered photo from Storage so newly uploaded photos can have value "highestNum + 1"
        let highestNumber;
        // console.log(userUID)

        const storageRef = this.storage.ref()
        // const imagesRef = storageRef.child(`images/${userUID}`)
        const imagesRef = storageRef.child("images/BSdlxPSriWP56JNGZiwrUivNwdw1/profilePic-0.jpg")

        // const storageRef = this.storage.ref(`images/${userUID}`)
        const anotherAttempt = this.storage.ref(`images/BSdlxPSriWP56JNGZiwrUivNwdw1`)
        // console.log(listRef)

        // TODO: finish me! turn this into "returns highestNumber of photos in user's collection"
        return new Promise(resolve => {
            imagesRef.listAll().then(function (result) {
                console.log("result:", result)
                console.log("result.items.length:", result.items.length)
                if (result.items.length == 0) { // base case where user has yet to upload a photo
                    console.log("returning null!")
                    resolve(null)
                }
                console.log("listRef listAll result: ", result)
                result.prefixes.forEach(function (something) {
                    console.log("something! ", something)
                    resolve("testing")
                })
            }).catch(err => {
                console.log(err)
            })
        })
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