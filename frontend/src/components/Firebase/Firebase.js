import app from "firebase/app";
import "firebase/auth";
import "firebase/database" // can probably deelete this
import "firebase/firestore"

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
        this.db = app.database();

        this.fs = app.firestore();
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

    getUserName = () => app.auth().currentUser.displayName// should return something

    // *** User API *** using Realtime Database

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    // *** Admin Stuff Goes Here ***

    // *** Firestore User API ***

    getUsernameByUID = (uid) => this.fs.collection("users").doc(uid).get().then(doc => {
        return doc.data().username
    })

    getUserInfo = docId => this.fs.collection("users").doc(docId).get().then(doc => {
        return doc.data()
    })

    // return all chatroom ids where user is present in the list of users
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

    // makeUsersList = () => //

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