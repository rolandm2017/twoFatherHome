import React, { Component } from 'react';

import { withAuthentication } from "../Session/"

class InboxPage extends Component {

    componentDidMount() {
        // ### retrieve user's messages from database and populate the render() method with them
        // connect to the database
        // retrieve messages from database
        // display retrieved messages to user
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

export default withAuthentication(InboxPage);