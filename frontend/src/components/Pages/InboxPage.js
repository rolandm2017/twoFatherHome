import React, { Component } from 'react';

import { withAuthentication, AuthUserContext } from "../Session/"
import { withFirebase } from '../Firebase';

class InboxPage extends Component {

    componentDidMount() {
        // ### retrieve user's chatrooms from database and populate the render() method with them
        // connect to the database
        // retrieve messages from database
        // display retrieved messages to user
        let messages;
        this.props.firebase.getUsersChatrooms().then(res => console.log(res))


    }

    render() {
        return (
            <div>
                <h1>Welcome to the Inbox.</h1>
                <p>The Inbox is for authenticated users only.</p>
            </div >
        )
    }
}

export default withAuthentication(withFirebase(InboxPage));