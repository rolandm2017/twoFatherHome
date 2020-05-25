import React, { Component } from 'react';

import { withAuthentication } from "../Session/"
import { withFirebase } from '../Firebase';

class InboxPage extends Component {

    componentDidMount() {
        // todo: get data from the supplied chatroom and display it
    }

    render() {
        return (
            <div>
                <h1>Welcome to the Chatroom.</h1>
                <p>Here are your messages: placeholder.</p>
            </div >
        )
    }
}

export default withAuthenticationwithFirebase(withFirebase(InboxPage));