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
            kids: null,
            familyValues: [],
            interests: null,
            hasPets: false,
            diet: null,
            drinks: false,
            smokes: false,
            doesDrugs: false,

            currentURLs: [],
            msg: null
        }
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    this.setState({ authUser: authUser });

                    // get user profile info by UID and load info into profile edit screen
                    this.props.firebase.fs.collection("users").doc(authUser.uid).get().then((doc) => {
                        console.log("DOC:", doc)
                        if (doc.exists) {
                            const userData = doc.data()
                            console.log(userData)
                            this.setState({
                                username: userData.username,
                                city: userData.city, state: userData.state, country: userData.country, age: userData.age,
                                kids: userData.kids,
                                familyValues: userData.familyValues, interests: userData.interests, hasPets: userData.hasPets,
                                diet: userData.diet, drinks: userData.drinks, smokes: userData.smokes, doesDrugs: userData.drugs
                            })
                        } else {
                            // what to do if someone goes to the profile page without having a profile? redirect to... ___?
                        }
                    }).catch(err => {
                        console.log(err)
                    })

                    // prepare the page to display the user's already-uploaded photos
                    this.getUsersPhotos(authUser.uid)
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

    getUsersPhotos = (uid) => {
        const storageRef = this.props.firebase.storage.ref(uid)

        const scopeHack = this

        storageRef.listAll().then(function (results) {
            console.log("getUserPhotos results:", results)
            results.items.forEach(function (imageRef) {
                imageRef.getDownloadURL().then(function (url) {
                    const currentURLs = scopeHack.state.currentURLs
                    console.log("URL:", url)
                    console.log("NAME:", imageRef.name)
                    currentURLs.push([url, imageRef.name])
                    scopeHack.setState({ currentURLs: currentURLs })
                }).catch(error => {
                    console.log("error from getDownloadURL():", error)
                })
            })
        }).catch(function (error) {
            console.log("error in listAll():", error)
            scopeHack.displayMsg("error: your photos could not display. Try refreshing the page.")
        })
    }

    displayMsg = msg => {
        this.setState({ msg: msg })
    }

    checkState = () => {
        console.log(this.state)
    }

    render() {
        return (
            <div>
                <h1>Your Profile</h1>

                <h3>Username:</h3><p>{this.state.username}</p>

                <h3>Here are your current profile pics:</h3>
                <div>
                    {/* // fill me in! */}
                    {this.state.currentURLs.length > 0 ? this.state.currentURLs.map((url, index) => {
                        return <div key={index}>
                            <img src={url[0]} alt={`Profile Pic ${index}`} width="150" height="200" />
                            <button onClick={() => this.deleteImage(this.state.authUser.uid, url[1])}>Delete</button>
                        </div>
                    }) : "Go to the Account page and upload a profile pic!"}
                </div>

                <h3>Location:</h3><p>{this.state.city}, {this.state.state}, {this.state.country}</p>

                <h3>Age:</h3><p>{this.state.age}</p>

                {this.props.values.currentProfile[0].kids == 1 ?
                    <h3>Intending to have {this.props.values.currentProfile[0].kids} kid.</h3> :
                    <h3>Intending to have {this.props.values.currentProfile[0].kids} kids.</h3>
                }

                <h3>Family Values:</h3><p>{this.state.familyValues}</p>

                <h3>Interests:</h3><p>{this.state.interests}</p>

                <h3>Has pets:</h3><p>{this.state.hasPets ? "yes" : "no"}</p>

                <h3>Diet:</h3><p>{this.state.diet}</p>

                <h3>Drinks:</h3><p>{this.state.drinks}</p>

                <h3>Smokes:</h3><p>{this.state.smokes}</p>

                <h3>Does drugs:</h3><p>{this.state.doesDrugs}</p>

                <button onClick={this.checkState}>Test State</button>
            </div>
        )
    }
}

export default withFirebase(ProfilePage);