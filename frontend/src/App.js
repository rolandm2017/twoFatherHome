import React from 'react';
import logo from './logo.svg';
import './App.css';

// import { slide as Menu } from 'react-burger-menu'
// import Menu from "./components/Menu"
import Sidebar from "./components/Sidebar"

function App() {
    return (
        <div className="App">
            <div id="header">
                <Sidebar />
                <h1>TwoFatherHome</h1>
            </div>
            <h3>Finally, a site that isn't about hookups...</h3>
            <div id="copywriting">
                <h4>On TwoFatherHome, you're looking for more than just a one night stand.
                You have dreams of starting a family, raising kids, and even have your own family values.
                Meet someone who wants to raise a family too, not just another hookup!
                    Because you deserve a quality family life.</h4>
            </div>
            <div id="disclaimer">
                <span>By clicking Join, you agree to our <a href="about:blank">Terms</a>. Learn what happens to your data in our
                <a href="about:blank">Privacy Policy</a> and <a href="about:blank">Cookies Policy</a>.</span>
            </div>
            <div id="join">
                <button>Join TwoFatherHome</button>
            </div>
            <div className="background"></div>
        </div>
    );
}

export default App;
