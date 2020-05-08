import React, { Component } from 'react';
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

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

const App = () => (
    <div className="App">

        <Router>
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

export default withAuthentication(App);

// todo: install Firebase
// todo: add sign up page logic
// todo: add login page logic
// todo: add the page users see upon logging in or signing up
// todo: add
// TODO: make Sidebar and TwoFatherHome sit nicely in the header w / a sign-in btn like POF's

// TODO: Refactor from the Robin Tutorial's global state to Redux for state mgmt.

// todo: protect the account page and make it accessible only for authed users