import React from 'react';
import { Link } from 'react-router-dom';

<<<<<<< HEAD
import SignOutButton from "./Auth/SignOut"
import * as ROUTES from "../constants/routes"
import SignOut from './Auth/SignOut';

import { AuthUserContext } from "./Auth/Session"

const Navigation = () => (
    <div><AuthUserContext.Consumer>
        {authUser =>
            authUser ? <NavigationAuth /> : <NavigationNonAuth />
        }
    </AuthUserContext.Consumer></div>
=======
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
>>>>>>> usingDocs
);

const NavigationAuth = () => (
    <ul>
<<<<<<< HEAD
        <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
=======
        {/* <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li> */}
>>>>>>> usingDocs
        <li>
            <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li>
<<<<<<< HEAD
            <Link to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        <li>
            <Link to={ROUTES.ADMIN}>Admin</Link>
=======
            <Link to={ROUTES.INBOX}>Inbox</Link>
        </li>
        <li>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
>>>>>>> usingDocs
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
<<<<<<< HEAD
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
    </ul>
);
=======
            <Link to={ROUTES.SIGN_IN}>Log In</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
        </li>
    </ul>
);

>>>>>>> usingDocs
export default Navigation;