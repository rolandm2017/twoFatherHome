import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import * as ROUTES from "../../constants/routes";

import MessageBox from "./MessageBox";

// TODO: Make a chatroom page that works for 
// case a) user accesses it by clicking "start chat" btn in Users You've Liked list
// - page will start w/ props.location.state
// - there will be no initial messages for the chatroom
// case b) user accesses it by clicking the chatroomBox in the Inbox chats list
// - page will start with props.location.state (user1&2)
// - there will be initial messages for the chatroom
// case c) use accesses it by visiting the URL

class InboxPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
            recipient: null,
            sender: null,
            content: []
        };
    }

    // NOTE: CTRL + F "this.props.history.push" on InboxPage.js to see contents of this.props.location.state
    componentDidMount() {
        // todo: get data from the supplied chatroom and display it
        console.log("checking data...", this.props.location.state)
        // case where user gets to ChatroomPage by clicking a ProfileBox or ChatroomBox's "Chat Now" btn
        if (this.props.location.state) {
            this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
                if (authUser) {
                    this.setState({ authUser: authUser })
                    console.log("username for authuser:", authUser.displayName)
                    // display message recipient to authUser
                    this.setState({ recipient: this.props.location.state.recipient.username })
                    this.setState({ sender: this.props.location.state.sender.username })

                    // check for messages if openChatWithUser was informed that 
                    // there ARE messages between authUser and the recipient already
                    if (this.props.location.state.checkForMessages) {
                        console.log("HEY:", this.props.location.state)
                        const uids = this.props.location.state.sender.uid + "," + this.props.location.state.recipient.uid
                        this.props.firebase.getMostRecentChatroomMessages(uids).then(messages => {
                            console.log("messages delivery:", messages)
                            this.loadMessages(messages)
                        })
                        // this.loadMessages(messages)
                    } else {
                        // allow the authUser to send a message to the recipient
                        // something like "A chat is open with recipientUser! Write your first message below..."
                        // + a dialogue box
                    }
                } else {
                    this.setState({ authUser: null })
                    this.props.history.push(ROUTES.SIGN_IN)
                }
            })
        } else {
            // since no sender/recipient have been supplied thru props.location.state, offer authUser option of
            // choosing a user he's already talking to to send a new message to.
            this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
                // allow authUser to send msg to anyone from a list of users he's either:
                // - liked, not been liked back by, AND has not yet messaged, or
                // - liked AND been liked back by
                if (authUser) {
                    // generate a list of candidates for a new message here
                    console.log("option1, 2, 3")
                } else {
                    this.setState({ authUser: null })
                    this.props.history.push(ROUTES.SIGN_IN)
                }
            })
        }
    }

    componentWillUnmount() {
        this.listener(); // prevents a memory leak or something
    }

    loadMessages = content => {
        // this func is a workhorse. it turns an input of messages into a chat that looks like a twitter DM conversation.
        const iterationLength = content.length;
        const memory = [];

        // iterate backwards so the last message is inserted into state first and the first msg is inserted last
        // result is that, when .mapped, the most recent msg will end up at the bottom
        for (let i = iterationLength - 1; i >= 0; i--) {
            memory.push(content[i])
        }

        this.setState({ content: memory })
    }

    checkState() {
        console.log(this.state)
    }

    render() {
        return (
            <div>
                <h1>Welcome to the Chatroom.</h1>
                {this.state.recipient ? <h3>Chatroom with {this.state.recipient}</h3> : null}
                <p>Here are your messages:</p>

                <div>
                    {this.state.authUser ?
                        this.state.content.map((message, index) => {
                            // if the message is SENT BY authUser
                            if (message.senderUsername === this.state.authUser.displayName) {
                                return (
                                    <Message key={index} sender={message.senderUsername} message={message.content} />
                                )

                                // if the message is RECEIVED BY authUser
                            } else if (message.recipientUsername === this.state.authUser.displayName) {
                                return (
                                    <Message key={index} sender={message.srecipientUsernameenderUsername} message={message.content} />
                                )

                                // bug
                            } else {
                                throw new Error("You shouldn't be able to get here you know...")
                            }
                        })
                        :
                        null
                    }

                </div>

                <button onClick={this.checkState.bind(this)}>Test Me</button>
            </div>
        )
    }
}

function Message({ sender, message }) {
    if (!sender || !message) {
        return null;
    } else {
        return (
            <div>
                <MessageBox sender={sender} message={message}></MessageBox>
            </div>
        )
    }
}

export default (withFirebase(InboxPage));