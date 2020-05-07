import React from 'react'

import {
    Link
} from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
    }

    render() {
        return (
            <div>
                <h2>The Log In Page</h2>
                <Link to="/">Back to Home</Link>
            </div>
        )
    }
}

export default Login;