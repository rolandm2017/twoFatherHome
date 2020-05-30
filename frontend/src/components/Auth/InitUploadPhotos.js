import React, { Component } from 'react';

import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

import * as ROUTES from "../../constants/routes"

// import { compose } from "recompose";

class InitUploadPhotos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
            username: null,
            isPremium: false,
            uploadPercent: null,
            currentURLs: [],
            msg: ""
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

                    // prepare the page to display the user's already-uploaded photos
                    this.getUsersPhotos(authUser.uid)

                    // update isPremium state to true if user has a premium account
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
        // file structure: userUID/filename
        const imageFile = event.target.files[0]
        const scopeHack = this
        // check if file is jpeg, jpg, or png; otherwise, reject upload
        const validFile = this.validateFileType(imageFile.name)

        if (validFile) {
            const userUID = this.state.authUser.uid

            const storageReference = this.props.firebase.storage.ref(`${userUID}/${imageFile.name}`)

            const uploadTask = storageReference.put(imageFile)

            uploadTask.on("state_changed", function progress(snapshot) {
                let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                percentage = percentage.toFixed(2)
                scopeHack.setState({ uploadPercent: percentage })
            }, function error(err) {
                console.log(err)
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (err.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        scopeHack.displayMsg("Error: Unauthorized access (tell a site admin if this persists).")
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        scopeHack.displayMsg("Error: Upload canceled.")
                        break;
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        scopeHack.displayMsg("Error: Unknown error (tell a site admin if this persists). Try uploading again.")
                        break;
                    default:
                        scopeHack.displayMsg("Error: Unknown error (tell a site admin if this persists). Try uploading again.")
                        break;
                }
            }, function complete() {
                // get download URL:
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    // update state
                    console.log('File available at', downloadURL);
                    const currentURLs = scopeHack.state.currentURLs
                    currentURLs.push([downloadURL, imageFile.name])
                    scopeHack.setState({ currentURLs: currentURLs })

                    // update msg to user
                    scopeHack.displayMsg("Upload complete!")
                    return downloadURL
                });
            })
        } else {
            scopeHack.displayMsg("Invalid file type! Only .jpg, .jpeg and .png images are allowed.")
        }
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

    deleteImage = (uid, name) => {
        // remove the image from state...
        const currentImages = this.state.currentURLs
        const updatedImages = []
        for (let i = 0; i < currentImages.length; i++) {
            if (currentImages[i][1] !== name) {
                updatedImages.push(currentImages[i])
            }
        }
        this.setState({ currentURLs: updatedImages })

        // ...and remove the image from the server.
        const deleteRef = this.props.firebase.storage.ref(`${uid}/${name}`)

        const scopeHack = this
        deleteRef.delete().then(function () {
            scopeHack.displayMsg("File deleted!")
        }).catch(error => {
            console.log(error)
        })
    }

    displayMsg = msg => {
        this.setState({ msg: msg })
    }

    validateFileType = file => {
        const nameSplitByPeriod = file.split(".")
        const indexOfLastSlice = nameSplitByPeriod.length - 1
        const fileType = nameSplitByPeriod[indexOfLastSlice].toLowerCase()

        const acceptableFileTypes = ["jpg", "jpeg", "png"]
        if (acceptableFileTypes.includes(fileType)) {
            return true
        } else {
            return false
        }

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
                    {this.state.currentURLs.length > 0 ? this.state.currentURLs.map((url, index) => {
                        return <div key={index}>
                            <img src={url[0]} alt={`Profile Pic ${index}`} width="150" height="200" />
                            <button onClick={() => this.deleteImage(this.state.authUser.uid, url[1])}>Delete</button>
                        </div>
                    }) : "Loading..."}
                </div>
                {/* // FIXME: sometimes photos do not load until page is refreshed. Why? How to fix? */}

                <h3>Upload a new one:</h3>

                {this.state.currentURLs.length < 3 && !this.state.isPremium ?
                    <form>
                        {/* // TODO: Figure out how to make upload commence when a "submit" btn is pressed... */}
                        <label htmlFor="fileSelect">Select a file:</label>
                        <input id="fileSelect" name="fileSelect" type="file" onChange={this.handleImageAsFile}></input>
                        {/* <input type="submit" value="Submit" /> */}
                    </form> :
                    <span>Upgrade to Premium to upload more than 3 photos!</span>}


                {this.state.uploadPercent ? <p>Percent Complete: {this.state.uploadPercent}</p> : null}

                <p>{this.state.msg}</p>

                {/* // test button */}
                <button onClick={this.checkState}>Test Button</button>

            </div>
        )
    }
}

export default withRouter(withFirebase(InitUploadPhotos));