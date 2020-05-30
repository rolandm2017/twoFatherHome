import React from 'react';
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    // Link
} from "react-router-dom";


// HOCs and wrappers
// import { withFirebase } from "./components/Firebase"
// import { AuthUserContext } from "./components/Session"
import { withAuthentication } from './components/Session';

import * as ROUTES from "./constants/routes"

// general component & page imports
import Navigation from "./components/Navigation"

import LandingPage from "./components/Pages/LandingPage"
import HomePage from './components/Pages/HomePage';
import InboxPage from './components/Pages/InboxPage';
import ProfilePage from './components/Pages/ProfilePage';

// more authentication-related stuff is kept here
import SignUpPage from './components/Auth/SignUp';
import SignInPage from './components/Auth/SignIn';
import PasswordForgetPage from './components/Auth/PasswordForget';
import AccountPage from './components/Auth/AccountPage';
import AdminPage from './components/Auth/Admin';
import CreateProfilePage from "./components/Auth/CreateProfilePage";
import InitUploadPhotos from './components/Auth/InitUploadPhotos';

const App = () => (
    <div className="App">

        <Router>
            <Navigation />

            <Switch>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route exact path={ROUTES.HOME} component={HomePage} />
                <Route exact path={ROUTES.INBOX} component={InboxPage} />

                <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route exact path={ROUTES.CREATE_PROFILE} component={CreateProfilePage} />
                <Route exact path={ROUTES.UPLOAD_PHOTOS} component={InitUploadPhotos} />
                <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route
                    exact
                    path={ROUTES.PASSWORD_FORGET}
                    component={PasswordForgetPage}
                />
                <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route exact path={ROUTES.ADMIN} component={AdminPage} />

                <Route exact path={ROUTES.PROFILE} component={ProfilePage} />

            </Switch>
        </Router>
    </div>
);

export default withAuthentication(App);

// *** TODO: Carousel ***
// TODO: add page where user can browse other users's profiles
// TODO: let users browse and Like/pass on users just like OkCupid (display # of wanted kids beside photo!)

// *** TODO: PROFILE STUFF ***
// TODO: Expand "doesDrugs, smokes, drinks" bools into options like "Never, rarely, sometimes, often"
// TODO: Update "Create Profile" & Edit Profile & Database to house "desired # of kids" field
// TODO: Convert "select age" to "select birthdate" and calculate user age based on birthdate (low priority)

// *** TODO: ADMIN PAGE ***
// todo: add admin page **
// todo: allow admin to see list of all signed up users
// todo: allow admin to delete a user(?)

// *** TODO: INBOX & MESSAGES ***
// todo: create inbox page
// todo: create two dummy accounts and send some messages between them to test the inbox page's logic
// TODO: Add notification for new messages somewhere in the UI so users can see it
// TODO: add option to upload & send images in a chat

// *** TODO: Misc ***
// TODO: Make Authentication-Only pages redirect to the login/signup page if nonauthenticated
// TODO: design the "user profile page"
// TODO: Convert to Redux & Global state mgmt
// TODO: For each .catch() error, send a msg to the Firestore database and store the error, the page it came from, and the user info
// TODO: Build a sales page for Premium Account Upgrades (give: 10 photos max, see who liked you, and _______?)

// TODO: Probably at the same time as "convert to redux & global state mgmt", do something like:
// "if authUser & profile info are present in state, use them. If they aren't loaded into state yet, do getAuthUserAndProfileInfo"
// -----> saves load time getting authUser and profileInfo on every page that uses them. The goal of react is a FAST user experience!
