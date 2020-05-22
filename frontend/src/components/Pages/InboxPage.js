import React, { Component } from 'react';
import app from "firebase/app"

// import { withAuthentication, AuthUserContext } from "../Session/"
import { withFirebase } from '../Firebase';

import ChatroomBox from './ChatroomBox'

class InboxPage extends Component {
    constructor(props) {
        super(props);

        this.generateChatrooms = this.generateChatrooms.bind(this)
        // self = this;

        this.state = {
            authUser: null,
            rooms: null,
            content: null
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
                    this.getInboxByUID(authUser.uid)
                } else {
                    this.setState({ authUser: null })
                    console.log("12:", authUser)
                }
                // console.log("5:", this.props.firebase.getUserName()
                // ? (this.setState({ authUser: authUser }), this.getInboxByUID(authUser.uid))
            },
            console.log("0:", this.state.authUser)
        );
    }

    componentWillUnmount() {
        this.listener(); // prevents a memory leak or something
    }

    getInboxByUID(userUID) {
        console.log("10:", userUID)
        this.props.firebase.getUsernameByUID(userUID).then(username => {
            this.assignUsernameToState(username)
            this.props.firebase.getUsersChatrooms(username).then(results => {
                this.setState({ rooms: results });
                console.log("11:", results)
                this.generateChatrooms()
            })
        }) // returns a dang promise... maybe async/await?
        // console.log("15:", targetUsername)
        // this.props.firebase.getUsersChatrooms(targetUsername).then(results => {
    }

    assignUsernameToState(username) {
        this.setState({ username: username })
    }

    generateChatrooms = () => {
        let jsx;

        const scopeHack = this.props.firebase;

        this.state.rooms.map(function (room) {
            jsx += "From: " + room[1]
            scopeHack.getChatroomMessages(room[0]).then(messages => {
                messages.forEach(content => {
                    jsx += content;
                    console.log("20:", content)
                })
            })
        })
        // for (let i = 0; i < this.state.rooms.length; i++) {
        // }
        this.setState({ content: jsx })
    }
    // TODO: Turn this.state.rooms[0] and [1] into a display on the user's screen with "participant" & "most recent msg" like twitter

    render() {
        return (
            <div>

                <h1>Welcome to the Inbox.</h1>
                <p>The Inbox is for authenticated users only.</p>
                <p>Look here are your chatrooms:</p>
                <ul>
                    <Rooms rooms={this.state.rooms} />
                    {/* {this.state.rooms.map(room => {
                        return (
                            <li key={room[0]}>
                                <ChatroomBox
                                    user={room[1]}
                                    message={this.props.firebase.getChatroomMessages(room[0])}
                                />
                            </li>
                        )
                    })} */}
                </ul>
                <p>this.state.content:</p>
                <p>{this.state.content}</p>
            </div >
        )
    }
}

function Rooms({ room }) {
    if (!room) {
        console.log("Returning null...")
        return null;
    }

    console.log("returning rooms...")
    return (
        <li key={room[0]}>
            <ChatroomBox
                user={room[1]}
                message={this.props.firebase.getChatroomMessages(room[0])}
            />
        </li>
    )
}

export default withFirebase(InboxPage);

// TODO: Display room participant and content like
// FROM: Username
// Content: MostRecentMsg