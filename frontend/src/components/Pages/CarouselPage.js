import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

import * as ROUTES from "../../constants/routes"

class Carousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
            users: [],
            viewedProfiles: [],
            queue: []
        }
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    this.setState({ authUser: authUser });
                    this.populateCarousel(authUser.uid)
                } else {
                    this.setState({ authUser: null })
                    // redirect to login screen since no user is signed in
                    this.props.history.push(ROUTES.SIGN_IN)
                }
            }
        )
    }

    componentWillUnmount() {
        this.listener(); // prevents a memory leak or something
    }

    // Step 1: get a list of potential profiles. do this only one time.
    // step 2: select 3 from the list of potential profiles.
    // step 3: Pick 1 profile to be the "previous" position, another to be the "selected" position, a third to be "next"
    // step 4: show one profile pic per user in the carousel. pick the first profile pic in their storage.
    // step 5: display the profile info of the user in the "selected" position. allow the viewer to "Like" or "Pass" on the profile.
    // step 6: if the user clicks "Next", "Like" or "Pass", go to the next profile.
    // step 7: if the user clicks "Like", add the viewer to the user's list of Likes in the database.
    // step 8: if the user clicks "pass", simply go to the next profile. the user who was Passed on remains available in the queue.
    // step 9: if the user clicks "next", simply go to the next profile.

    populateCarousel = uid => {
        // retrieve 3 new user profiles to add to the queue for display in the carousel
        const listOfPotentialProfiles = this.props.firebase.retrieveNewProfiles(uid, this.state.viewedProfiles)
        this.queueProfile(listOfPotentialProfiles[0])
        this.queueProfile(listOfPotentialProfiles[1])
        this.queueProfile(listOfPotentialProfiles[2])
    }

    queueProfile = uid => {
        // adds profile to the queue based on profile uid
        const currentQueue = this.state.queue;
        currentQueue.push(uid)
        this.setState({ queue: currentQueue })
    }

    showNextProfile = () => {
        // rotates the profile currently in view when the Next button is clicked.
    }

    getProfilePics = uid => {

    }

    render() {
        return (
            <div>
                <h1>Browse Users</h1>

                <h3>Previous User</h3>

                <h3>Current User</h3>

                <h3>Next User</h3>
            </div>
        )
    }
}

export default withRouter(withFirebase(Carousel));