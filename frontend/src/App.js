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

import Sidebar from "./components/Sidebar"
import Signup from "./components/Pages/Signup"
import Login from './components/Pages/Login'
import LandingPage from "./components/Pages/LandingPage"
import Navigation from "./components/Navigation"

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
                        <Route path="/" exact component={LandingPage}>
                        </Route>
                        <Route path="/signup" exact component={Signup}>
                        </Route>
                        <Route path="/login" exact component={Login}>
                        </Route>
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