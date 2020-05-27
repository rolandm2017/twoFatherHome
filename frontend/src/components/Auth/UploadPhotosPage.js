import React, { Component } from 'react';

import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

import * as ROUTES from "../../constants/routes"

// import { compose } from "recompose";

class UploadPhotosPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
            username: null,
            highestPhotoValue: 0,
            uploadPercent: null
        }
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    // check if authUser already created a profile
                    // then check if authUser already uploaded a photo?
                    this.props.firebase.fs.collection("users").doc(authUser.uid).get().then((doc) => {
                        // console.log("DOC:", doc)
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
                    this.props.firebase.getHighestPhotoNumByUser(authUser.uid).then(result => {
                        // todo: fill in getHighestPhotoNumbyUser
                        console.log("getHPNBY result: ", result)
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
        // file structure: images/userUID/profilePic-number.jpg
        const imageFile = event.target.files[0]
        const scopeHack = this
        // TODO: check that uploaded file is a .jpeg or some other common image format...
        const userUID = this.state.authUser.uid
        let photoNumber;

        // figure out if its the user's first upload (the 0th pic) or not
        const highestValuedPhotoForUser = this.state.highestPhotoValue
        if (highestValuedPhotoForUser === null) {
            photoNumber = 0
        } else {
            photoNumber = highestValuedPhotoForUser + 1
        }

        // TODO: display a "percent complete" progress bar
        // TODO: display a msg "file upload complete" when file upload is complete
        const storageReference = this.props.firebase.storage.ref(`image/${userUID}/profilePic-${photoNumber}`)

        const uploadTask = storageReference.put(imageFile)

        uploadTask.on("state_changed", function progress(snapshot) {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            scopeHack.setState({ uploadPercent: percentage }) // TODO: Figure out how I'm gonna get this value into UploadPhotosPage.js
            // maybe it will just work? does calling .setState here set the state of the component that calls the function?
        }, function error(err) {
            // TODO: improve this. tell the user about an upload error and prompt them to try again?
            console.log(err)
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (err.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                default:
                    console.log("error type not listed in switch statement: ", err)
                    break;
            }
        }, function complete() {
            // TODO: what to do when the upload is complete? Set userMsg to "finished upload"?
            // TODO: when upload is complete, trigger uploaded photo being added to "user photos" display section on page

            // get download URL:
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                return downloadURL
            });

            // update state with new Highest Value Photo
            scopeHack.props.firebase.getHighestPhotoNumByUser(userUID).then(result => {
                // todo: fill in getHighestPhotoNumbyUser
                console.log("getHPNBY result: ", result)
                scopeHack.setState({ highestPhotoValue: result })
            })
        })
    }

    checkState = () => {
        console.log(this.state)
        this.props.firebase.getHighestPhotoNumByUser(this.state.authUser.uid)
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

export default withRouter(withFirebase(UploadPhotosPage));