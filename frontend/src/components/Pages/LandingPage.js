import React from 'react';

import {
    Link
} from "react-router-dom";

import * as ROUTES from "../../constants/routes"

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
    }

    render() {
        return (
            <div>
                <h3>Finally, a site that isn't about hookups...</h3>
                <div id="copywriting">
                    <h4>On TwoFatherHome, you're looking for more than just a one night stand.
                    You have dreams of starting a family, raising kids, and even have your own family values.
                    Meet someone who wants to raise a family too, not just another hookup!
                    Because you deserve a quality family life.</h4>
                    <h3>Meet The Man Who Will Help Raise Your Kids Today!</h3>
                </div>
                <div id="disclaimer">
                    <span>By clicking Join, you agree to our <a href="about:blank">Terms</a>. Learn what happens to your data in our
                <a href="about:blank">Privacy Policy</a> and <a href="about:blank">Cookies Policy</a>.</span>
                </div>
                <div id="join">
                    <Link to={ROUTES.SIGN_UP}>Join TwoFatherHome</Link>
                </div>
                <div id="members">
                    <Link to={ROUTES.SIGN_IN}>Already a member? Login here.</Link>
                </div>
                {/* <div className="background"></div> */}
            </div>
        )
    }
}

export default LandingPage;