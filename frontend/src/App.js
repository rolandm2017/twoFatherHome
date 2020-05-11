import React, { Component } from 'react';
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

// HOCs and wrappers
import { withFirebase } from "./components/Firebase"
import { AuthUserContext } from "./components/Session"
import { withAuthentication } from './components/Session';

import * as ROUTES from "./constants/routes"

import Navigation from "./components/Navigation"

import LandingPage from "./components/Pages/LandingPage"
import HomePage from './components/Pages/HomePage';

import SignUpPage from './components/Auth/SignUp';
import SignInPage from './components/Auth/SignIn';
import PasswordForgetPage from './components/Auth/PasswordForget';
import AccountPage from './components/Auth/Account';
import AdminPage from './components/Auth/Admin';

const App = () => (
    <div className="App">
        <AuthUserContext.Provider value={this.state.authUser}>

            <Router>
                <Navigation />

                <Switch>
                    <Route exact path={ROUTES.LANDING} component={LandingPage} />
                    <Route exact path={ROUTES.HOME} component={HomePage} />

                    <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
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
        </AuthUserContext.Provider>
    </div>
);

export default withAuthentication(App);

// todo: install Firebase
// todo: add admin page
// todo: allow admin to see list of all signed up users
// todo: allow admin to delete a user(?)
// todo: create inbox page
// todo: create two dummy accounts and send some messages between them to test the inbox page's logic