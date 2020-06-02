import React, { Component } from 'react';

// import { withAuthentication, AuthUserContext } from "../Session/"
import { withFirebase } from '../Firebase';
import { withRouter } from "react-router-dom";

import * as ROUTES from "../../constants/routes"

import ChatroomBox from './ChatroomBox'

class InboxPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
            rooms: null,
            content: null,
            currentUsername: null
        };
    }

    componentDidMount() {
        // ### retrieve user's chatrooms from database and populate the render() method with them
        // connect to the database
        // retrieve messages from database
        // display retrieved messages to user
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    console.log("4:", authUser.uid);
                    this.setState({ authUser: authUser });
                    // the first step towards filling the Inbox pg with chatroom info
                    this.getInboxByUID(authUser.uid)
                } else {
                    this.setState({ authUser: null })
                    this.props.history.push(ROUTES.SIGN_IN)
                    console.log("12:", authUser)
                }
            }
        );
    }

    componentWillUnmount() {
        this.listener(); // prevents a memory leak or something
    }

    getInboxByUID(userUID) {
        // console.log("10:", userUID)
        const jsxContent = []; // make an array to store retrieved data
        this.props.firebase.getUsernameByUID(userUID).then(username => { // retrieve the username associated with the UID
            this.setState({ currentUsername: username }) // forward the username to state
            this.props.firebase.getUsersChatrooms(username).then(rooms => { //  retrieve chatrooms associated with the username
                // this.setState({ rooms: results });
                console.log("11:", rooms)
                rooms.forEach(room => { // then, for each room get its messages by roomId (room[0])...
                    this.props.firebase.getChatroomMessages(room[0]).then(messages => {
                        messages.forEach(doc => { // ...and for each doc in the messages...
                            jsxContent.push([room[1], doc]) // ...add the room participants ("room[1]") & the doc, incl .content...
                            // console.log("25:", jsxContent) // check how the array is doing
                        })
                    }).then(x => { // ...and finally, store jsxContent in state...
                        console.log("30:", this.state.jsxContent) // check what will be set as state.content
                        this.setState({ content: jsxContent })
                    })
                })
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
                <p>Look here are your chatrooms:</p>
                <ul>
                    <Rooms rooms={this.state.content} currentUser={this.state.currentUsername} />
                </ul>

                <button onClick={this.logState}>Click Me</button>
            </div >
        )
    }
}

function Rooms({ rooms, currentUser }) {
    if (!rooms) {
        return null;
    } else {
        console.log("returning rooms...")
        // TODO: Make sure user= value is always the user who ISN'T authUser
        return (
            <ul>
                {rooms.map((room, index) => { // room[0].split(",")[1] 
                    const users = room[0].split(",")
                    let sender;
                    // "if the user on the righthand side of room[0]'s comma is the current user, 
                    // then the sender is on the lefthand side of room[0]"
                    users[1] === currentUser ? sender = users[0] : sender = users[1]
                    return (<ChatroomBox key={index} user={sender} message={room[1].content} />)
                })}
            </ul>
        )
    }
}

export default withRouter(withFirebase(InboxPage));