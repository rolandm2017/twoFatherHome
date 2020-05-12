import React from 'react';

import { withAuthentication } from "../Session/"

const HomePage = () => {
    return (
        <div>
            {/* {this.state.authUser} */}
            <h1>Welcome to the Home Page.</h1>
            <p>The Home Page is for authenticated users only.</p>
        </div>
    )
}

export default withAuthentication(HomePage);