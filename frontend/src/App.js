import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Sidebar from "./components/Sidebar"
import Signup from "./components/Pages/Signup"
import Login from './components/Pages/Login'
import LandingPage from "./components/Pages/LandingPage"

function App() {
    return (
        <div className="App">
            <Router>
                <div id="header">
                    {/* TODO: make Sidebar and TwoFatherHome sit nicely in the header w/ a sign-in btn like POF's */}
                    <div id="leftDiv">
                        <Sidebar />
                    </div>
                    <div id="rightDiv">
                        <Link to="/login">Log In</Link>
                    </div>
                    <div id="centerDiv">
                        <h1>TwoFatherHome</h1>
                    </div>
                </div>


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

export default App;

// todo: install Firebase
// todo: add sign up page logic
// todo: add login page logic
// todo: add the page users see upon logging in or signing up
// todo: add