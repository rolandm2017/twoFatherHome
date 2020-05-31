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
            potentialProfiles: [],
            potentialProfilesIndex: 0,
            queue: [],
            queueIndex: 0,
            previousProfile: null,
            currentUserProfileURLs: [],
            viewedProfiles: [],
            currentProfile: null,
            nextProfile: [],
            nextNextProfile: [],
            prevProfile: [],
            prevPrevProfile: [],
            username: null,
            city: null,
            state: null,
            country: null,
            age: null,
            kids: null,
            familyValues: null,
            interests: null,
            hasPets: null,
            diet: null,
            drinks: null,
            smokes: null,
            doesDrugs: null
        }
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    this.setState({ authUser: authUser });
                    this.populateCarousel(authUser.uid)
                    // this.selectProfileByQueueIndex(0)
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

    // step 3: Pick 1 profile to be the "previous" position, another to be the "selected" position, a third to be "next"
    // step 4: show one profile pic per user in the carousel. pick the first profile pic in their storage.
    // step 5: display the profile info of the user in the "selected" position. allow the viewer to "Like" or "Pass" on the profile.
    // step 6: if the user clicks "Next", "Like" or "Pass", go to the next profile.
    // step 7: if the user clicks "Like", add the viewer to the user's list of Likes in the database.
    // step 8: if the user clicks "pass", simply go to the next profile. the user who was Passed on remains available in the queue.`
    // step 9: if the user clicks "next", simply go to the next profile.

    // I'm trying to build a page that shows a carousel of profile pics from users signed up for 
    // my dating site.I want the carousel to show a "previous", a "current" and "next" user, with an option to Like or Pass on
    // the current user.The hard part is, I want the page to have the profile pics and info of the current, nextUser, previousUser,
    // and nextNextUser all loaded up and ready to go in memory, so the browsing user never has to watch the site load something
    // in the carousel.Therefore I have to have a list of profiles I could show to the browsing user, and store 5 profiles
    // worth of info in the page's state... 

    // TODO: Exclude profiles already Liked by the authUser from listOfPotentialProfiles

    populateCarousel = authUserUID => {
        // Step 1: get a list of potential profiles. do this only one time.
        // retrieve new user profiles to add to the queue for display in the carousel
        const listOfPotentialProfiles = this.props.firebase.retrieveNewProfiles(authUserUID, this.state.viewedProfiles)

        // add the potential profiles to state
        listOfPotentialProfiles.then(resultingProfiles => {
            // console.log("HEY", resultingProfiles)
            this.setState({ potentialProfiles: resultingProfiles })

            // step 2: select 3 from the list of potential profiles... one for Current, one for Next, one for NextNext
            this.loadProfile(resultingProfiles[0], 0)
            this.loadProfile(resultingProfiles[1], 1)
            this.loadProfile(resultingProfiles[2], 2)

            // queue 3 profiles
            // this.queueProfile(2) // int is 2 for now because there is only 2 profiles that aren't currentUser in the test database
        })
    }

    // NOTE: The idea is to keep all of the profiles in the Queue LOADED so the BrowsingUser's experience is pleasant

    loadProfile = (uid, position) => {
        // FIXME: Code gets to "0" but not further
        // loads profile "uid" into position "position" in the carousel. Positions are -2, -1, 0, 1, 2.
        const userInfo = this.props.firebase.getUserInfo(uid)
        // retrieve the user's associated profile pics
        const profileURLs = this.props.firebase.getProfileURLsByUID(uid)

        console.log("LOADING:", position, userInfo, profileURLs, uid)
        Promise.all([userInfo, profileURLs]).then(infoAndURLs => {
            console.log("V:", position, infoAndURLs, uid)
            // load userInfo and profile pic URLs into corresponding state
            if (position === -2) {
                this.setState({ prevPrevProfile: infoAndURLs })
                console.log("Position -2")
            } else if (position === -1) {
                console.log("Position -1")
                this.setState({ prevProfile: infoAndURLs })
            } else if (position === 0) {
                console.log("Position 0")
                this.setState({ currentProfile: infoAndURLs })
            } else if (position === 1) {
                console.log("Position 1")
                this.setState({ nextProfile: infoAndURLs })
            } else if (position === 2) {
                console.log("Position 2")
                this.setState({ nextNextProfile: infoAndURLs })
            } else {
                throw new Error("You shouldn't be able to get here you know.")
            }
        })


    }

    queueProfile = (amountToQueue) => {
        const currentQueue = this.state.queue;
        // adds profiles to the queue, starting from index "index", ending at index "index + amountToQueue"
        const startIndex = this.state.potentialProfilesIndex;
        let endIndex = this.state.potentialProfilesIndex + amountToQueue

        console.log("10001:", this.state.potentialProfiles)
        // make sure we don't try to retrieve an index that does not exist
        if (this.state.potentialProfiles) { // check if potentialProfiles is empty array
            if (endIndex > this.state.potentialProfiles.length) {
                endIndex = this.state.potentialProfiles.length;
            }
        }

        // update potentialProfilesIndex so it is ready for the next time this func is called
        this.setState({ potentialProfilesIndex: endIndex })

        // assign new values to the queue
        for (let i = startIndex; i < endIndex; i++) {
            currentQueue.push(this.state.potentialProfiles[i])
        }
        this.setState({ queue: currentQueue })
    }

    // goal: turn the uid into a displayed profile under "Current User" && a displayed profile PIC under "Next User"
    // selectProfileByQueueIndex = queueIndex => {
    //     // retrieves the uid at index queueIndex and sets it to the currentProfile
    //     const uidAtQueueIndex = this.state.queue[queueIndex]
    //     console.log("TEST9999:", uidAtQueueIndex)
    //     const userInfo = this.props.firebase.getUserInfo(uidAtQueueIndex)
    //     console.log(userInfo)
    // }

    // showNextProfile = () => {
    //     // rotates the profile currently in view when the Next button is clicked.
    // }

    // getProfilePics = uid => {

    // }

    testState = () => {
        console.log(this.state)
    }

    render() {
        return (
            <div>
                <h1>Browse Users</h1>

                <h3>Previous User</h3>

                <div>
                    {this.state.currentProfile ? <Profile values={this.state} /> : "Loading..."}
                </div>

                <button onClick={this.nextUser}>Next</button>
                <button onClick={this.previousUser}>Previous</button>

                <h3>Next User</h3>

                <button onClick={this.testState}>Test State</button>
            </div>
        )
    }
}

class Profile extends Component {
    render() {
        return (
            <div>
                <h3>Current User</h3>

                <h3>Username:</h3><p>{this.props.values.currentProfile[0].username}</p>

                <h3>Current User Profile Pics:</h3>
                <div>
                    {this.props.values.currentUserProfileURLs.length > 0 ?
                        this.props.values.currentUserProfileURLs.map((url, index) => {
                            return <div key={index}>
                                <img src={url[0]} alt={`Profile Pic ${index}`} width="150" height="200" />
                            </div>
                        }) : "User has no profile pics!"}
                </div>

                <h3>Location:</h3>
                <p>{this.props.values.currentProfile[0].city},
                    {this.props.values.currentProfile[0].state},
                    {this.props.values.currentProfile[0].country}</p>

                <h3>Age:</h3><p>{this.props.values.currentProfile[0].age}</p>

                <h3>Intend to have {this.props.values.currentProfile[0].kids} kids.</h3>

                <h3>Family Values:</h3><p>{this.props.values.currentProfile[0].familyValues}</p>

                <h3>Interests:</h3><p>{this.props.values.currentProfile[0].interests}</p>

                <h3>Has pets:</h3><p>{this.props.values.currentProfile[0].hasPets ? "yes" : "no"}</p>

                <h3>Diet:</h3><p>{this.props.values.currentProfile[0].diet}</p>

                <h3>Drinks:</h3><p>{this.props.values.currentProfile[0].drinks}</p>

                <h3>Smokes:</h3><p>{this.props.values.currentProfile[0].smokes}</p>

                <h3>Does drugs:</h3><p>{this.props.values.currentProfile[0].doesDrugs}</p>

                <button onClick={this.likeUser}>Like</button>
                <button onClick={this.passOnUser}>Pass</button>
            </div>
        )
    }
}

export default withRouter(withFirebase(Carousel));