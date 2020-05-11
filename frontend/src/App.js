import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import { withFirebase } from "./components/Firebase"

import * as ROUTES from "./constants/routes"

import Navigation from "./components/Navigation"

import LandingPage from "./components/Pages/LandingPage"
import HomePage from './components/Pages/HomePage';

import SignUpPage from './components/Auth/SignUp';
import SignInPage from './components/Auth/SignIn';
import PasswordForgetPage from './components/Auth/PasswordForget';
import AccountPage from './components/Auth/Account';
import AdminPage from './components/Auth/Admin';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
        };
    }

    componentDidMount() {
        console.log(this.props)
        //     this.props.firebase.auth.onAuthStateChanged(authUser => {
        //         authUser
        //             ? this.setState({ authUser })
        //             : this.setState({ authUser: null });
        //     });
    }

    render() {
        return (
            <div className="App">
                <Router>
                    <Navigation userIsAuthenticated={this.state.userIsAuthenticated} />

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
            </div>
        );
    }
}

export default withFirebase(App);

// todo: install Firebase
// todo: add sign up page logic
// todo: add login page logic
// todo: add the page users see upon logging in or signing up
// todo: add admin page
// todo: allow admin to see list of all signed up users
// todo: allow admin to delete a user(?)
// todo: create inbox page
// todo: create two dummy accounts and send some messages between them to test the inbox page's logic