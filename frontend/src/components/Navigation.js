import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from './Session';

import * as ROUTES from '../constants/routes'

import SignOutButton from "./Auth/SignOut"

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {userIsAuthenticated =>
                userIsAuthenticated ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li>
            <Link to={ROUTES.INBOX}>Inbox</Link>
        </li>
        <li>
            <Link to={ROUTES.CAROUSEL}>Find Matches</Link>
        </li>
        <li>
            <Link to={ROUTES.PROFILE}>Profile</Link>
        </li>
        <li>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        <li>
            <SignOutButton />
        </li>
    </ul>
);

const NavigationNonAuth = () => (
    <ul>
        <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_IN}>Log In</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
        </li>
    </ul>
);

export default Navigation;