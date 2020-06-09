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
import CarouselPage from "./components/Pages/CarouselPage"

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
                <Route exact path={ROUTES.CAROUSEL} component={CarouselPage} />

            </Switch>
        </Router>
    </div>
);

export default withAuthentication(App);

// *** TODO: Big time stuff ***
// TODO: Refactor to use classes for msgs, profiles, chatrooms...

// *** TODO: Carousel ***

// *** TODO: API ***
// TODO: Go back thru the Messaging and Profile API and search for opportunities to turn "get all docs" into
// "get doc where..." to save on reads... 8.5k total reads for the last 30 days, let's try to get that down a bit
// ********************************* HIGH PRIORITY ************************
// am at 2.2k reads for the past 7 days... 314 a day... I know I didn't view 314 profiles, messages, chatrooms per day...


// *** TODO: PROFILE STUFF ***
// TODO: Convert "select age" to "select birthdate" and calculate user age based on birthdate (low priority)
// TESTME: Cannot read property 'length' of undefined at createProfilePage line 132, "else if lastName.length < 2"
// ---------> caused by lack of a last name present in the CreateProfilePage form.
// FIXME: user somehow created a profile without a "kids" field ... try to recreate bug. might just be old profiles.

// *** TODO: ADMIN PAGE ***
// todo: add admin page **
// todo: allow admin to see list of all signed up users
// todo: allow admin to delete a user(?)
// todo: figure out how to turn a user into an admin.

// TODO: Check if Likes database successfully adds second & third usernames&uids to likedBy fields.

// *** TODO: INBOX & MESSAGES ***
// TODO: What is the solution to determining if a Liked User has been messaged by authUser?
// TODO: Debug Messages API. Three fuctions untested
// TODO: show list of users Liked by AuthUser on inboxPg so authUser can send 1 msg to them
// todo: show list of yet-to-be-liked users who liked authUser, but greyed out UNLESS authUser is premium.
// TODO: show list of Mutual Likes
// todo: allow user to send 1 msg to any user... and unlimited msgs to a user who has Liked him
// todo: create two dummy accounts and send some messages between them to test the inbox page's logic
// TODO: Add notification for new messages somewhere in the UI so users can see it, irrespective of page.
// TODO: add option to upload & send images in a chat
// TODO: add a limit to the length of chat messages. make it fairly long

// *** TODO: REPORTING ***
// TODO: allow authUser to report user for having inappropriate photos
// TODO: allow authuser to report user for sending an inappropriate or rude msg
// TODO: allow authUser to report user for having an inappropriate username
// TODO: create a page that says, "don't upload nude photos, don't send rude or inappropriate messages."
// TODO (low priority): add a banlist based on email
// TODO: create a database of banned strings for username...

// *** TODO: FORUMS ***
// TODO: Add a forum for users to post about family related topics & whatever else they're interested in.
// -------> use out-of-the-box code... so you don't have to write it all yourself.

// *** TODO: Misc ***
// TODO: Make Authentication-Only pages redirect to the login/signup page if browser is nonauthenticated
// TODO: Convert to Redux & Global state mgmt
// TODO: For each .catch() error, send a msg to the Firestore database and store the error, the page it came from, and the user info
// TODO: Build a sales page for Premium Account Upgrades (give: 10 photos max, see who liked you, and _______?)
// TODO: Create unit tests ***
// TODO: somehow shrink pictures so they're smaller on the server... don't wanna load 10x3 MB photos in the carousel...
// TODO: Figure out how to send a weekly email telling readers about the new users who have signed up to the site this week.

// TODO: Probably at the same time as "convert to redux & global state mgmt", do something like:
// "if authUser & profile info are present in state, use them. If they aren't loaded into state yet, do getAuthUserAndProfileInfo"
// -----> saves load time getting authUser and profileInfo on every page that uses them. The goal of react is a FAST user experience!
