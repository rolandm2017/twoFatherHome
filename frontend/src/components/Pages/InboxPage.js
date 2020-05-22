import React, { Component } from 'react';
import app from "firebase/app"

// import { withAuthentication, AuthUserContext } from "../Session/"
import { withFirebase } from '../Firebase';

class InboxPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
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
                    console.log("4:", authUser.uid)
                } else {
                    console.log("12:", authUser)
                }
                // console.log("5:", this.props.firebase.getUserName())
                authUser
                    // ? (this.setState({ authUser: authUser }), this.getInboxByUID(authUser.uid))
                    ? this.getInboxByUID(authUser.uid)
                    : this.setState({ authUser: null });
            },
            console.log(this.state.authUser)
        );
        // if (this.props.firebase.auth.currentUser !== null) {
        //     console.log("userId:", + this.props.firebase.auth.currentUser.uid)
        // }
        // console.log(this.state.authUser)
        // const currentUser = app.auth().currentUser
        // if (currentUser) {
        //     console.log("test:", app.auth().currentUser.displayName)
        // } else {
        //     console.log("this isn't fun")
        // }
        this.props.firebase.getUsersChatrooms("rolyPoly").then(res => console.log("3:", res))
    }

    componentWillUnmount() {
        this.listener(); // prevents a memory leak or something
    }

    getInboxByUID(userUID) {
        console.log("10:", userUID)
        this.props.firebase.getUsernameByUID(userUID).then(username => {
            this.props.firebase.getUsersChatrooms(username).then(results => {
                this.setState({ rooms: results });
                console.log("11:", results)
            })
        }) // returns a dang promise... maybe async/await?
        // console.log("15:", targetUsername)
        // this.props.firebase.getUsersChatrooms(targetUsername).then(results => {
    }

    render() {
        return (
            <div>

                <h1>Welcome to the Inbox.</h1>
                <p>The Inbox is for authenticated users only.</p>
                <p>Look here are your chatrooms:</p>
                <p>{this.state.rooms}</p>
            </div >
        )
    }
}

export default withFirebase(InboxPage);