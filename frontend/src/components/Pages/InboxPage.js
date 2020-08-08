import React, { Component } from 'react';

// import { withAuthentication, AuthUserContext } from "../Session/"
import { withFirebase } from '../Firebase';
import { withRouter } from "react-router-dom";

import * as ROUTES from "../../constants/routes"

import ChatroomBox from './ChatroomBox'
import ProfileBox from "./ProfileBox"

class InboxPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
            rooms: null,
            content: null,
            currentUsername: null,
            likesList: null,
            profileMemory: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] // nums are placeholders
        };
    }

    // TODO: make the inbox page show chatrooms again
    // TODO: allow the authUser to view a chatroom on its own page with data loaded up

    componentDidMount() {
        // ### retrieve user's chatrooms from database and populate the render() method with them
        // connect to the database
        // retrieve messages from database
        // display retrieved messages to user
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    this.setState({ authUser: authUser });
                    // the first step towards filling the Inbox pg with chatroom info
                    this.getInboxByUID(authUser.uid)
                    this.getLikesByUID(authUser.uid)
                } else {
                    this.setState({ authUser: null })
                    this.props.history.push(ROUTES.SIGN_IN)
                }
            }
        );
    }

    componentWillUnmount() {
        this.listener(); // prevents a memory leak or something
    }

    getInboxByUID = userUID => {
        // console.log("10:", userUID)
        const jsxContent = []; // make an array to store retrieved data
        this.props.firebase.getUsernameByUID(userUID).then(username => { // retrieve the username associated with the UID
            this.setState({ currentUsername: username }) // forward the username to state
            this.props.firebase.getUsersChatrooms(username).then(rooms => { //  retrieve chatrooms associated with the username
                // a room has the form [{chatroomId: chatroomId}, {user1: user1username}, {user2: user2username}]
                // console.log("getUsersChatrooms output:", rooms)
                rooms.forEach(room => { // then, for each room get its messages by roomId (which is stored as .chatroomId)...
                    // console.log("ROOM:", room)
                    this.props.firebase.getMostRecentChatroomMessages(room.chatroomId).then(messages => {
                        // console.log("messages:", messages)
                        messages.forEach(msgContent => { // ...and for each doc in the messages...
                            // console.log("DOC:", msgContent)
                            jsxContent.push(msgContent) // ...add the msgContent, which is essentially a firestore doc... 
                        })
                        this.setState({ content: jsxContent })
                        // console.log("JSX:", jsxContent)
                    })
                })
            })
        })
    }

    getLikesByUID = uid => {
        // the "likes" is a list of UIDs for users liked by authUser
        this.props.firebase.getAuthUsersLikesByUID(uid).then(likes => {
            // stash the likes in state for later...
            this.setState({ likesList: likes })
            // for the first 5 likes in the list, build a space in the displayed Likes List

            console.log("LIKES:", likes)
            const splitUpLikes = likes.split(",") // splits the csv of likes into an array of likes
            console.log("split likes: ", splitUpLikes)

            // prepare to iterate over splitUpLikes between 0 and 5 times... a max of 5 times if there is enough liked profiles
            let iterationLength;
            let memoryPosition = 5;
            if (splitUpLikes.length > 4) {
                iterationLength = 5
            } else {
                iterationLength = splitUpLikes.length
            }

            // loads the Likes into the profile display
            for (let i = 0; i < iterationLength; i++) {
                // "splitUpLikes[0], 5", "splitUpLikes[1], 6"...
                this.loadLike(splitUpLikes[i], memoryPosition + i) // FIXME: splitUpLikes[i] is "", should be a uid
            }
        })
    }

    loadLike = (profileUID, position) => {
        // retrieve a profile pic, the username, and ______ ??? to display to authUser
        // also show whether profile hasBeenMessaged already or not
        console.log("test:", profileUID, typeof profileUID)  // FIXME: profileUID is an empty string, should be the profileUID.
        const profileInfo = this.props.firebase.getUserInfo(profileUID) // returns doc.data()
        const urls = this.props.firebase.getProfileURLsByUID(profileUID)

        // handles users who have been contacted by authUser... what about case where authUser has been contacted by someone else?
        const hasBeenMessaged = this.props.firebase.userHasBeenContacted(this.state.authUser.uid, profileUID)
        console.log("input UID:", profileUID)

        const currentMemory = this.state.profileMemory;
        Promise.all([profileInfo, urls, hasBeenMessaged]).then(values => {
            const profileObject = { profileUID: profileUID, profileInfo: values[0], urls: values[1], hasBeenMessaged: values[2] }
            currentMemory[position] = profileObject; // inserts a Profile Object & an index of Profile URLs at index "position"
            console.log("Memory:", currentMemory)
            this.setState({ profileMemory: currentMemory })
        })
    }

    openChatWithUser = (targetUID, checkForMessages) => {
        console.log(1)
        // checkForMessages is bool. informs the new ChatroomPage whether to initiate "checkForMsgs" process
        console.log(targetUID)
        const senderUsername = this.props.firebase.getUsernameByUID(this.state.authUser.uid)
        const recipientUsername = this.props.firebase.getUsernameByUID(targetUID)

        Promise.all([senderUsername, recipientUsername]).then(usernames => {
            this.props.history.push({
                pathname: ROUTES.CHATROOM,
                state: {
                    sender: { username: usernames[0], uid: this.state.authUser.uid },
                    recipient: { username: usernames[1], uid: targetUID },
                    checkForMessages: checkForMessages
                }
            })
        })
    }

    logState = () => {
        console.log(this.state, this.state.authUser.uid)
    }

    // TODO: Color the message gray on light blue if it hasn't been read, gray on black if it has
    // TODO: show only the first 80 char or so of the most recent msg, and cut it off with an ellipses if it goes over. like TWTR

    render() {
        return (
            <div>

                <h1>Welcome to the Inbox.</h1>
                <p>The Inbox is for authenticated users only.</p>
                <h3>Look here are your chatrooms:</h3>
                <div>
                    <Rooms
                        rooms={this.state.content}
                        currentUser={this.state.currentUsername}
                        openChatFunc={this.openChatWithUser} />
                </div>

                <h3>List of Users You've Liked</h3>
                <div>
                    <Profiles
                        profiles={this.state.profileMemory.slice(5, 10)}
                        openChatFunc={this.openChatWithUser} />
                </div>

                {/* // TODO: Allow User to click "load more" btn to load 10 more chatrooms (by most recent) & form a scroll */}

                <button onClick={this.logState}>Click Me</button>
            </div >
        )
    }
}

function Rooms({ rooms, currentUser, openChatFunc }) {
    // console.log("ROOMS:", rooms, currentUser)
    if (!rooms) {
        return null;
    } else {
        // console.log("returning rooms...")
        return (
            <ul>
                {rooms.map((room, index) => {
                    // console.log("ROOM!!!!!!:", room)
                    // let sender = room.senderUsername;
                    // let recipient = room.recipientUsername;
                    return (<ChatroomBox
                        key={index}
                        recipient={room.recipientUsername}
                        message={room.content}
                        openChat={() => openChatFunc(room.recipientUID, true)} />)
                })}
            </ul>
        )
    }
}

// TODO: install a "load more Liked profiles yet-to-be-messaged" btn
// TODO: Convert the inbox's "likes" list to a "this is ppl you've liked && have not yet messaged" list?

// TODO: Convert the boring bool "user has been messaged:" value to like... a green checkmark... or a red X for false

function Profiles({ profiles, openChatFunc }) {
    // console.log("PROFILES:", profiles)
    if (!profiles) {
        return null;
    } else {
        return (
            <div style={{ backgroundColor: "red", border: "3px solid black" }}>
                {profiles.map((profile, index) => {
                    // "if profile is integer, aka an unfilled memory position, do nothing"
                    if (Number.isInteger(profile)) {
                        return null
                        // "if the profile has an array, aka a filled memory position, return a ProfileBox"
                    } else {
                        return (<ProfileBox
                            key={index}
                            username={profile.profileInfo.username}
                            hasBeenMessaged={profile.hasBeenMessaged}
                            displayImg={profile.urls[0]}
                            openChat={() => openChatFunc(profile.profileUID, false)} />)
                    }
                })}
            </div>
        )
    }
}

// todo: get list of profiles liked by authUser. get list of ppl messaged by authUser. grey out Liked profiles if they are Msg'd.

export default withRouter(withFirebase(InboxPage));