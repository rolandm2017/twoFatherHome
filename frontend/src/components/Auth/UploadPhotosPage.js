import React from 'react';

import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

class UploadPhotosPage extends Component {
    constructor(props) {
        super(props);

        state = {
            authUser: null,
            username: null,
            highestPhotoValue: 0
        }
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    // check if authUser already created a profile
                    // then check if authUser already uploaded a photo?
                    this.props.firebase.fs.collection("users").doc(authUser.uid).get().then((doc) => {
                        console.log("DOC:", doc)
                        if (doc.exists) { // if user already has a profile, we're all set, proceed to this step

                            // return true
                        } else { // if user does not already have a profile, redirect to create profile page
                            this.props.history.push(ROUTES.CREATE_PROFILE)
                            // return false
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                    this.setState({ authUser: authUser });
                    // add authUser username to state so it is ready when the user uploads a file
                    this.props.firebase.getUsernameByUID(authUser.uid).then(result => {
                        this.setState({ username: result })
                    })
                    // retrieve highest numbered photo value so the value is ready when user uploads a file
                    this.props.firebase.highestValuedPhotoForUser(this.state.authUser.uid).then(result => {
                        this.setState({ highestPhotoValue: result })
                    })
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

    handleImageAsFile = (event) => {
        const image = event.target.files[0]
        // TODO: check that uploaded file is a .jpeg or some other common image format...
        const username = this.state.username
        const highestValuedPhotoForUser = this.state.highestPhotoValue
        const photoNumber = highestValuedPhotoForUser + 1



    }

    checkState = () => {
        console.log(this.state)
    }

    render() {
        return (
            <div>
                <h1>Upload Photos</h1>

                <h3>Here are your current profile pics:</h3>
                <div>
                    {/* // fill me in! */}
                </div>

                <h3>Upload a new one:</h3>
                <input type="file" onChange={this.handleImageAsFile}></input>

                {/* // test button */}
                <button onClick={this.checkState}>Test Button</button>

            </div>
        )
    }
}

export const withRouter(withFirebase(UploadPhotosPage));