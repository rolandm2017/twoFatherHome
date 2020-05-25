<<<<<<< HEAD
import React, { Component } from 'react';
=======
import React from 'react';
>>>>>>> usingDocs
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    // Link
} from "react-router-dom";

<<<<<<< HEAD
// static components
import Sidebar from "./components/Sidebar"
import Navigation from "./components/Navigation"

// my stuff (not from the tutorial)
// import Signup from "./components/Pages/Signup"
// import Login from './components/Pages/Login'

// from tutorial
import HomePage from './components/Pages/Home';
import LandingPage from './components/Pages/LandingPage';

import SignUpPage from './components/Auth/SignUp';
import SignInPage from './components/Auth/SignIn';
import PasswordForgetPage from './components/Auth/PasswordForget';
import AccountPage from './components/Auth/Account';
import AdminPage from './components/Auth/Admin';

import * as ROUTES from './constants/routes';
import { withFirebase } from "./components/Firebase"
import { withAuthentication } from "./components/Auth/Session"
=======
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

// more authentication-related stuff is kept here
import SignUpPage from './components/Auth/SignUp';
import SignInPage from './components/Auth/SignIn';
import PasswordForgetPage from './components/Auth/PasswordForget';
import AccountPage from './components/Auth/AccountPage';
import AdminPage from './components/Auth/Admin';
import CreateProfilePage from "./components/Auth/CreateProfilePage";
>>>>>>> usingDocs

const App = () => (
    <div className="App">

        <Router>
<<<<<<< HEAD
            {/* <Navigation authUser={this.state.authUser} /> */}
            <Navigation />
            {/* <div id="header">
                    <div id="leftDiv">
                    <Sidebar />
                    </div>
                    <div id="rightDiv">
                    <Link to="/login">Log In</Link>
                    </div>
                    <div id="centerDiv">
                    <h1>TwoFatherHome</h1>
                    </div>
                </div> */}

            <Switch>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
                <Route path={ROUTES.HOME} component={HomePage} />
                <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route path={ROUTES.ADMIN} component={AdminPage} />
                {/* my stuff: */}
                {/* <Route path="/signup" exact component={Signup}>
                    </Route>
                    <Route path="/login" exact component={Login}>
                </Route> */}
            </Switch>
        </Router>
    </div>
)
=======
            <Navigation />

            <Switch>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route exact path={ROUTES.HOME} component={HomePage} />
                <Route exact path={ROUTES.INBOX} component={InboxPage} />

                <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route exact path={ROUTES.CREATE_PROFILE} component={CreateProfilePage} />
                <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route
                    exact
                    path={ROUTES.PASSWORD_FORGET}
                    component={PasswordForgetPage}
                />
                <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route exact path={ROUTES.ADMIN} component={AdminPage} />
            </Switch>
        </Router>
    </div>
);
>>>>>>> usingDocs

export default withAuthentication(App);

// todo: install Firebase
<<<<<<< HEAD
// todo: add sign up page logic
// todo: add login page logic
// todo: add the page users see upon logging in or signing up
// todo: add
// TODO: make Sidebar and TwoFatherHome sit nicely in the header w / a sign-in btn like POF's

// TODO: Refactor from the Robin Tutorial's global state to Redux for state mgmt.

// todo: protect the account page and make it accessible only for authed users

// TODO: "protected routes in react with authorization"

// TODO: make the Admin page show the list of users
=======
// todo: add admin page **
// todo: allow admin to see list of all signed up users
// todo: allow admin to delete a user(?)
// todo: create inbox page
// todo: create two dummy accounts and send some messages between them to test the inbox page's logic

// TODO: On account signup, redirect to "Create Profile" page & allow user to create profile.
// TODO: Make Authentication-Only pages redirect to the login/signup page

// TODO: On user signup, associate their Auth.uid as their users' collection document ID/key.
// ...so you can do fs.colletion("users").doc(uid).get() and retrieve their username that way

// TODO: Include a "hasPremium" boolean field in user profiles in the db

// TODO: Make ROUTES.CREATE_PROFILE redirect to login page if no user is signed in.

// TODO: Convert to Redux & Global state mgmt
>>>>>>> usingDocs
