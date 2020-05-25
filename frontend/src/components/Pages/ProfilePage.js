import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import * as ROUTES from "../../constants/routes"

class ProfilePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            city: null,
            state: null,
            country: null,
            age: null,
            familyValues: [],
            interests: null,
            hasPets: false,
            diet: null,
            drinks: false,
            smokes: false,
            doesDrugs: false,
        }
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    // get user profile info by UID and load info into profile edit screen
                    this.props.firebase.fs.collection("users").doc(authUser.uid).get().then((doc) => {
                        console.log("DOC:", doc)
                        if (doc.exists) {
                            const userData = doc.data()
                            console.log(userData)
                            this.setState({
                                username: userData.username,
                                city: userData.city, state: userData.state, country: userData.country, age: userData.age,
                                familyValues: userData.familyValues, interests: userData.interests, hasPets: userData.hasPets,
                                diet: userData.diet, drinks: userData.drinks, smokes: userData.smokes, doesDrugs: userData.drugs
                            })
                        } else {
                            // what to do if someone goes to the profile page without having a profile? redirect to... ___?
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                    this.setState({ authUser: authUser });
                } else {
                    this.setState({ authUser: null })
                    // redirect to login screen since no user is signed in
                    this.props.history.push(ROUTES.SIGN_IN)
                }
            },
        );
    }

    componentWillUnmount() {
        this.listener(); // prevents a memory leak or something
    }


    render() {
        return (
            <div>
                <h1>Your Profile</h1>

                <h3>Username:</h3><p>{this.state.username}</p>

                <h3>Location:</h3><p>{this.state.city}, {this.state.state}, {this.state.country}</p>

                <h3>Age:</h3><p>{this.state.age}</p>

                <h3>Family Values:</h3><p>{this.state.familyValues}</p>

                <h3>Interests:</h3><p>{this.state.interests}</p>

                <h3>Has pets:</h3><p>{this.state.hasPets}</p>

                <h3>Diet:</h3><p>{this.state.diet}</p>

                <h3>Drinks:</h3><p>{this.state.drinks ? "yes" : "no"}</p>

                <h3>Smokes:</h3><p>{this.state.smokes ? "yes" : "no"}</p>

                <h3>Does drugs:</h3><p>{this.state.doesDrugs ? "yes" : "no"}</p>
            </div>
        )
    }
}

export default withFirebase(ProfilePage);