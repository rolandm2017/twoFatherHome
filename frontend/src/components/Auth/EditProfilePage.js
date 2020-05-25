import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

import * as ROUTES from "../../constants/routes"

class EditProfilePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: new Date(),
            fullName: null,
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
            alertMsg: "Fill out the form & hit submit!"
        };
    }


    // todo: start a new development branch

    // todo: when "finished", check here:
    // https://stackoverflow.com/questions/28773839/react-form-onchange-setstate-one-step-behind

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    // get user profile info by UID and load info into profile edit screen
                    this.props.firebase.fs.collection("users").doc(authUser.uid).get().then((doc) => {
                        console.log("DOC:", doc)
                        if (doc.exists) {
                            const userData = doc.data()
                        } else {
                            // what to do if someone goes to the EditProfilePage without having a profile? redirect to... ___?
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                    // console.log(authUser.uid)
                    // const profileAlreadyCreated = this.props.firebase.checkIfUserHasProfile(authUser.uid);
                    // console.log("9000:", profileAlreadyCreated)
                    this.setState({ authUser: authUser });
                } else {
                    this.setState({ authUser: null })
                }
            },
        );
        // TODO: make Create Profile page inaccessible to users who already created a profile.
        // ............--> redirect to "Edit Profile" page!
    }

    componentWillUnmount() {
        this.listener(); // prevents a memory leak or something
    }

    storeValue = (event) => {
        console.log("editing: ", event.target.name, event.target.value)
        this.setState({ [event.target.name]: event.target.value })
        console.log(this.state)
    }

    handleFamilyValuesEvent = event => {
        // edits the array of familyValues objects in this.state.familyValues
        const currentValues = this.state.familyValues;
        const updatedValues = [];
        if (event.target.checked) { // if true, we add the name to the list
            for (const value in currentValues) { // remake the list and...
                updatedValues.push(currentValues[value])
            }
            // ...add the new name to the list
            const valueToAdd = event.target.name;
            updatedValues.push(valueToAdd)
        } else { // otherwise, we remove the name from the list
            const valueToRemove = event.target.name;
            for (const value in currentValues) {
                if (currentValues[value] === valueToRemove) {
                } else {
                    updatedValues.push(currentValues[value])
                }
            }
        }
        console.log("name:", event.target.name)
        console.log("checked: ", event.target.checked)
        console.log("starting values:", currentValues)
        console.log("updated values:", updatedValues)
        this.setState({ familyValues: updatedValues })
    }

    handleInterests = event => {
        this.setState({ interests: event.target.value })
    }

    handlePets = event => {
        this.setState({ hasPets: event.target.checked })
    }

    handleCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked })
    }

    displayMessage = content => {
        this.setState({ alertMsg: content })
    }

    // todo: move "pick a username" action from SignUp page to CreateProfilePage

    testAuth = () => {
        // for debugging
        console.log(this.state.authUser)
        console.log("displayname:", this.state.authUser.displayName)
    }

    // validateFullName = () => { // "first name & last name both must be longer than 1 char and contains a whitespace" rule 
    //     const fullname = this.state.fullName;
    //     if (/^[A-Za-z.-\s]+$/.test(fullname)) {
    //         const firstName = fullname.split(" ")[0]
    //         const lastName = fullname.split(" ")[1]
    //         if (firstName.length < 2) {
    //             this.displayMessage("Name length must be 2 or greater.")
    //             return false
    //         } else if (lastName.length < 2) {
    //             this.displayMessage("Name length must be 2 or greater.")
    //             return false
    //         } else {
    //             return true;
    //         }
    //     } else {
    //         this.displayMessage("Only alphabetical characters, periods, hyphens and spaces are allowed in full names.")
    //         return false // .test() failed.
    //     }
    // }

    // validateUsername = () => {
    //     const username = this.state.username;
    //     // https://stackoverflow.com/questions/41597685/javascript-test-string-for-only-letters-and-numbers
    //     if (username) {
    //         if (/^[A-Za-z0-9]+$/.test(username)) {
    //             console.log(username, "is a fine name")
    //             return true;
    //         } else {
    //             console.log("something's wrong with the username")
    //             this.displayMessage("Usernames can only use letters and numbers. Please edit your username.")
    //             return false;
    //         }
    //     } else {
    //         console.log("Username wasn't filled in")
    //         this.displayMessage("Please fill in a username. Letters and numbers only.")
    //         return false
    //     }
    // }

    validateLocation = () => {
        const country = this.state.country;
        const state = this.state.state;
        const city = this.state.city;

        console.log(country, state, city)
        if (country && city && state) {
            if (country === "Select one...") {
                console.log("country was invalid")
                this.displayMessage("Country selection invalid, please try again.")
                return false
            } else if (state === "Select one...") {
                console.log("state was invalid")
                this.displayMessage("Province or state selection invalid, please try again.")
                return false
            } else if (city === "Select one...") {
                console.log("city was invalid")
                this.displayMessage("City selection invalid, please try again.")
                return false
            } else {
                return true
            }
        } else {
            console.log("One of country, city & state were missing")
            this.displayMessage("Please fix your location. One of country, city and state/province is missing.")
            return false
        }
    }

    // validateAge = () => {
    //     let age = this.state.age;
    //     if (age) {
    //         age = parseInt(age, 10);
    //         if (typeof age === "number") {
    //             return true;
    //         }
    //         this.displayMessage("Please select your age.")
    //         console.log("Age wasn't right")
    //         return false;
    //     } else {
    //         this.displayMessage("Please select your age.")
    //         console.log("Age wasn't selected")
    //         return false
    //     }
    //     console.log(age)
    //     console.log(typeof age)

    // }

    validateFamilyValues = () => {
        const values = this.state.familyValues;
        console.log("values: ", values)
        if (values.length) {
            // "if there is at least one true value listed, the family values are valid"
            return true;
        }
        console.log("family values are invalid")
        this.displayMessage("Please select at least one family value.")
        return false // "if no family values are listed as true, then the user still needs to pick at least one."
    }

    validateInterests = () => {
        // should only see alphanumeric chars here, and commas
        if (this.state.interests) {
            // this if statement checks: a) length of "interests" is greater than 5, and b) there is at least 2 interests
            if (this.state.interests.length > 5 && this.state.interests.indexOf(",") > -1) {
                if (/^[A-Za-z0-9,\s]+$/.test(this.state.interests)) { // note: [,] adds comma to the regex
                    return true;
                } else {
                    console.log("interests contained an unacceptable character")
                    this.displayMessage("Interests may only contain letters, numbers, spaces and commas.")
                    return false;
                }
            } else {
                console.log("Interests was too short, please include at least two interests")
                this.displayMessage("")
                return false // return false if the "interests" list is less than 5 chars long
            }
        }
        this.displayMessage("Please fill in at least two interests.")
        console.log("Interests wasn't filled in")
    }

    validateDiet = () => {
        const diet = this.state.diet;
        if (diet && diet !== "Select one...") {
            return true;
        } else {
            this.displayMessage("Please select your diet.")
            return false;
        }
    }

    editProfile = () => {
        // TODO: edit "submitProfile" into "editProfile"
        console.log(this.state)
        const locationIsValid = this.validateLocation();
        const familyValuesAreValid = this.validateFamilyValues();
        const interestsAreValid = this.validateInterests();
        const dietIsValid = this.validateDiet();
        const userIsSignedIn = this.state.authUser;

        console.log("boolean check: ", locationIsValid, familyValuesAreValid, interestsAreValid, dietIsValid, userIsSignedIn)
        if (locationIsValid && familyValuesAreValid && interestsAreValid && dietIsValid && userIsSignedIn) {
            const userUID = this.state.authUser.uid;
            const city = this.state.city;
            const state = this.state.state;
            const country = this.state.country;
            const familyValues = this.getFamilyValues(this.state.familyValues) // turns array into a comma separated value
            const interests = this.state.interests;
            const hasPets = this.state.hasPets;
            const diet = this.state.diet;
            const drinks = this.state.drinks;
            const smokes = this.state.smokes;
            const doesDrugs = this.state.doesDrugs;
            this.props.firebase.editProfile(userUID, city, state, country, familyValues, interests,
                hasPets, diet, drinks, smokes, doesDrugs)
            this.displayMessage("You edited your profile successfully.")

            console.log("Success")
            // this.props.history.push(ROUTES.HOME)
        } else {
            // do something... display a msg to the user informing him that he needs to improve the form.
            // this.displayMessage("Something isn't filled in properly with your form, or you are not signed in.")
        }
    }

    getFamilyValues = input => {
        // converts the array of family values into a csv string
        let csv = input[0];
        for (let i = 1; i < input.length; i++) { // loop runs 0 times if input.length is 1, adding , 0 times... which is good
            csv = csv + ","
            csv = csv + input[i]
        }
        return csv
    }

    // username, city, state, country, age, familyValues, interests, hasPets, diet, drinks, smokes, doesDrugs

    // FIXME: I guarantee there are bugs waiting to be discovered.
    // TODO: Create unit tests
    // TODO: Refactor so the Warning msgs still display && the Submit btn is disabled until all fields are correct. (low urgency)
    // TODO: give user opportunity to sign up for regular emails (or opt out)

    render() {
        return (
            <div>
                <h1>Edit Your Profile</h1>

                {/* // user cannot change username or full name */}
                {/* <label htmlFor="fullName">Your full name (kept private):</label>
                <input
                    name="fullName"
                    onChange={this.storeValue}
                    type="text"
                    placeholder="Full Name"
                /> */}

                {/* <label htmlFor="username">Choose a username:</label>
                <input onChange={this.storeValue} name="username" id="username"></input> */}

                <label htmlFor="country">Pick your country:</label>
                <select onChange={this.storeValue} name="country" id="country">
                    <option value="Select one...">Select one...</option>
                    <option value="Canada">Canada</option>
                    {/* <option value="USA">USA</option> */}
                </select>

                <label htmlFor="state">Pick your province:</label>
                <select onChange={this.storeValue} name="state" id="state">
                    <option value="Select one...">Select one...</option>
                    <option value="British Columbia">British Columbia</option>
                    <option value="Ontario">Ontario</option>
                    {/* <option value="Quebec">Quebec</option>
                    <option value="Alberta">Alberta</option>
                    <option value="Saskatchewan">Saskatchewan</option>
                    <option value="Manitoba">Manitoba</option>
                    <option value="New Brunswick">New Brunswick</option>
                    <option value="Nova Scotia">Nova Scotia</option>
                    <option value="Newfoundland">Newfoundland</option>
                    <option value="P.E.I.">P.E.I.</option> */}

                    {/* TODO: Expand to other provinces */}
                </select>

                {this.state.state === "British Columbia" ? <IfBritishColumbia passStoreValue={this.storeValue} /> : null}

                {this.state.state === "Ontario" ? <IfOntario passStoreValue={this.storeValue} /> : null}

                {/* Disabled in the Edit Profile page because user cannot change their age! */}
                {/* <AgeSelector passStoreValue={this.storeValue} /> */}

                <div>
                    <label htmlFor="familyValues">Tell us what your family values will be:</label>
                    <br />
                    <span>Valuing Elders</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="Valuing Elders" />
                    <span>Hard Work</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="Hard Work" />
                    <span>Respect</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="Respect" />
                    <span>Compassion</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="Compassion" />
                    <span>Eating Together</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="Eating Together" />
                    <span>Responsibility</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="Responsibility" />
                    <span>Creativity</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="Creativity" />
                    <span>Kindness</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="Kindness" />
                    <span>Fun</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="Fun" />
                    <span>Volunteering</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="Volunteering" />
                    <span>Mine aren't listed!</span><input onChange={this.handleFamilyValuesEvent} type="checkbox" name="unlisted" />
                </div>

                <div>
                    <label htmlFor="interests">What are your interests? Separate each one by a comma:</label>
                    <input type="text" onChange={this.handleInterests} placeholder="interest1, interest2..." />
                </div>

                <label htmlFor="hasPets">Do you have pets? Tick the box if so:</label>
                <input onChange={this.handlePets} type="checkbox" name="hasPets" />

                <label htmlFor="diet">Dietary preferences:</label>
                <select onChange={this.storeValue} name="diet" id="diet">
                    <option value="Select one...">Select one...</option>
                    <option value="Omnivore">Omnivore</option>
                    <option value="Carnivore">Carnivore (lol)</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Pescetarian">Pescetarian</option>
                    <option value="Keto">Keto</option>
                </select>

                <label htmlFor="drinks">Do you drink?</label>
                <input onChange={this.handleCheckbox} type="checkbox" name="drinks" />

                <label htmlFor="smokes">Do you smoke?</label>
                <input onChange={this.handleCheckbox} type="checkbox" name="smokes" />

                <label htmlFor="doesDrugs">Do you do any drugs?</label>
                <input onChange={this.handleCheckbox} type="checkbox" name="drugs" />

                <button onClick={this.editProfile}>Submit Profile</button>

                <div>
                    {/* // Display messages to the user here... e.g. if the form is messed up */}
                    {this.state.alertMsg}
                </div>

                {/* // for debugging */}
                <button onClick={this.testAuth}>Test Auth State</button>

            </div>
        )

    }
}

// TODO: Expand choice of states and provinces
// TODO: Add USA (once marketing covers Vancouver and Toronto)

// TODO: Maybe export those long a.f. selector components to another file? for length

class IfBritishColumbia extends Component {
    render() {
        return (
            <div>
                <label htmlFor="city">Pick the city closest to you:</label>
                <select onChange={this.props.passStoreValue} name="city" id="city">
                    <option value="Select one...">Select one...</option>
                    <option value="Vancouver">Vancouver</option>
                    <option value="Victoria">Victoria</option>
                    <option value="Kelowna">Kelowna</option>
                    <option value="Abbotsford">Abbotsford</option>
                    <option value="White Rock">White Rock</option>
                </select>
            </div >
        )
    }
}

class IfOntario extends Component {
    render() {
        return (
            <div>
                <label htmlFor="city">Pick the city closest to you:</label>
                <select onChange={this.props.passStoreValue} name="city" id="city">
                    <option value="Select one...">Select one...</option>
                    <option value="Toronto">Toronto</option>
                    <option value="Ottawa">Ottawa</option>
                    <option value="Hamilton">Hamilton</option>
                    <option value="Kitchener">Kitchener</option>
                    <option value="London">London</option>
                    <option value="Oshawa">Oshawa</option>
                    <option value="Windsor">Windsor</option>
                    <option value="St. Catharines">St. Catharines</option>
                    <option value="Barrie">Barrie</option>
                </select>
            </div>
        )
    }
}


export default withFirebase(EditProfilePage);