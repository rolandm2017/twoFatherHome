import React from 'react'

import {
    Link
} from "react-router-dom";

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
    }

    render() {
        return (
            <div>
                <h2>The Signup Page</h2>
                <Link to="/">Back to Home</Link>
            </div>
        )
    }
}

export default Signup;