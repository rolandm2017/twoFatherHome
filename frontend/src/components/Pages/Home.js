import React from 'react';

import { withAuthorization } from '../Auth/Session';

const HomePage = () => (
    <div>
        <h1>Home Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>
    </div>
);

const condition = authUser => !!authUser; // I don't understand this code or withAuthorization(condition)(homepage), fully.
// it reminds me of adding Redux to a page

export default withAuthorization(condition)(HomePage);