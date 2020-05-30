import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

import * as ROUTES from "../../constants/routes"

class EditProfilePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            city: "Select one...",
            state: "Select one...",
            country: "Select one...",
            kids: "Select one...",
            familyValues: [],
            interests: "",
            hasPets: false,
            diet: "Select one...",
            drinks: "Select one...",
            smokes: "Select one...",
            doesDrugs: "Select one...",
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
                        // console.log("DOC:", doc)
                        if (doc.exists) {
                            const userData = doc.data()
                            // console.log(userData)
                            this.setState({
                                username: userData.username,
                                city: userData.city, state: userData.state, country: userData.country, kids: userData.kids,
                                familyValues: userData.familyValues, interests: userData.interests, hasPets: userData.hasPets,
                                diet: userData.diet, drinks: userData.drinks, smokes: userData.smokes, doesDrugs: userData.drugs
                            })
                            // TODO: populate fields with data from doc.data()
                        } else {
                            // what to do if someone goes to the EditProfilePage without having a profile? redirect to... ___?
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
        // TODO: make Create Profile page inaccessible to users who already created a profile.
        // ............--> redirect to "Edit Profile" page!

    }

    componentWillUnmount() {
        this.listener(); // prevents a memory leak or something
    }

    checkIfFamilyValueExists = selection => {
        // function is unique to EditProfilePage, doesn't exist in CreateProfilePage.
        let loadedValues = this.state.familyValues
        if (loadedValues.length) {
            loadedValues = loadedValues.split(",")
        } else {
            return false // exit early if loadedValues has no length.
        }
        for (let i = 0; i < loadedValues.length; i++) {
            // "if the input value is in the list of loaded values..."
            if (loadedValues[i] === selection) {
                return true;
            }
        }
        return false;
    }

    storeValue = (event) => {
        console.log("editing: ", event.target.name, event.target.value)
        this.setState({ [event.target.name]: event.target.value })
        console.log(this.state)
    }

    editFamilyValuesEvent = event => {
        // edits the *CSV* of familyValues objects in this.state.familyValues
        const currentValues = this.state.familyValues;
        const targetValue = event.target.name;
        let updatedValues;
        if (event.target.checked) { // if ticking a box triggered the event
            updatedValues = currentValues + targetValue;
        } else { // if unticking a box triggered the event, 
            const tempContainer = currentValues.split(",")
            updatedValues = tempContainer[0]
            if (tempContainer.length > 0) {
                for (let i = 1; i < tempContainer.length; i++) {
                    if (tempContainer[i] !== targetValue) { // if the current value is not the value targeted for removal
                        updatedValues = updatedValues + "," + tempContainer[i]
                    }
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


    testAuth = () => {
        // for debugging
        console.log(this.state.authUser)
        console.log("displayname:", this.state.authUser.displayName)
    }

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

    validateKids = () => {
        const kids = this.state.kids;

        if (kids) {
            if (kids !== "Select one...") {
                return true
            } else {
                this.displayMessage("Please tell us how many kids you intend to have.")
                return false
            }
        } else {
            this.displayMessage("Please tell us how many kids you intend to have.")
            return false
        }
    }

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

    validateDrinks = () => {
        const drinks = this.state.drinks;
        if (drinks && drinks !== "Select one...") {
            return true;
        } else {
            this.displayMessage("Please select your drinking habits.")
            return false;
        }
    }

    validateSmokes = () => {
        const smokes = this.state.smokes;
        if (smokes && smokes !== "Select one...") {
            return true;
        } else {
            this.displayMessage("Please select your smoking habits.")
            return false;
        }
    }

    validateDoesDrugs = () => {
        const doesDrugs = this.state.doesDrugs;
        if (doesDrugs && doesDrugs !== "Select one...") {
            return true;
        } else {
            this.displayMessage("Please inform the site if you do any drugs.")
            return false;
        }
    }

    editProfile = () => {
        // TODO: edit "submitProfile" into "editProfile"
        console.log(this.state)
        const locationIsValid = this.validateLocation();
        const kidsAreValid = this.validateKids();
        const familyValuesAreValid = this.validateFamilyValues();
        const interestsAreValid = this.validateInterests();
        const dietIsValid = this.validateDiet();
        const drinksSmokesDrugsAreValid = this.validateDrinks() && this.validateSmokes() && this.validateDoesDrugs();
        const userIsSignedIn = this.state.authUser;

        console.log("boolean check: ", locationIsValid, kidsAreValid, familyValuesAreValid, interestsAreValid, dietIsValid,
            drinksSmokesDrugsAreValid, userIsSignedIn)
        if (locationIsValid && kidsAreValid && familyValuesAreValid && interestsAreValid && dietIsValid && drinksSmokesDrugsAreValid
            && userIsSignedIn) {
            const userUID = this.state.authUser.uid;
            const city = this.state.city;
            const state = this.state.state;
            const country = this.state.country;
            const kids = this.state.kids;
            const familyValues = this.state.familyValues
            const interests = this.state.interests;
            const hasPets = this.state.hasPets;
            const diet = this.state.diet;
            const drinks = this.state.drinks;
            const smokes = this.state.smokes;
            const doesDrugs = this.state.doesDrugs;
            this.props.firebase.editProfile(userUID, city, state, country, kids, familyValues, interests,
                hasPets, diet, drinks, smokes, doesDrugs)
            this.displayMessage("You edited your profile successfully.")

            console.log("Success")
            // this.props.history.push(ROUTES.HOME)
        } else {
            // do something... display a msg to the user informing him that he needs to improve the form.
            // this.displayMessage("Something isn't filled in properly with your form, or you are not signed in.")
        }
    }

    // // I think this is completely useless code here, since fValues are not stored as array on this page
    // getFamilyValues = input => {
    //     // converts the array of family values into a csv string
    //     let csv = input[0];
    //     for (let i = 1; i < input.length; i++) { // loop runs 0 times if input.length is 1, adding , 0 times... which is good
    //         csv = csv + ","
    //         csv = csv + input[i]
    //     }
    //     return csv
    // }

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

                <h3>Username:</h3>
                <span>{this.state.username}</span>

                <br />

                <label htmlFor="country">Pick your country:</label>
                <select onChange={this.storeValue} value={this.state.country} name="country" id="country">
                    <option value="Select one...">Select one...</option>
                    <option value="Canada">Canada</option>
                    {/* <option value="USA">USA</option> */}
                </select>

                <label htmlFor="state">Pick your province:</label>
                <select onChange={this.storeValue} value={this.state.state} name="state" id="state">
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

                {this.state.state === "British Columbia" ? <IfBritishColumbia passStoreValue={this.storeValue}
                    storedCity={this.state.city} /> : null}

                {this.state.state === "Ontario" ? <IfOntario passStoreValue={this.storeValue}
                    storedCity={this.state.city} /> : null}

                {/* Disabled in the Edit Profile page because user cannot change their age! */}
                {/* <AgeSelector passStoreValue={this.storeValue} /> */}

                <label htmlFor="kids">How many kids do you intend to have?</label>
                <select onChange={this.storeValue} name="kids" id="kids" value={this.state.kids}>
                    <option value="Select one...">Select one...</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6+">6+</option>
                </select>

                <div>
                    <label htmlFor="familyValues">Tell us what your family values will be:</label>
                    <br />
                    <span>Valuing Elders</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("Valuing Elders")} name="Valuing Elders" />
                    <span>Hard Work</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("Hard Work")} name="Hard Work" />
                    <span>Respect</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("Respect")} name="Respect" />
                    <span>Compassion</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("Compassion")} name="Compassion" />
                    <span>Eating Together</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("Eating Together")} name="Eating Together" />
                    <span>Responsibility</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("Responsibility")} name="Responsibility" />
                    <span>Creativity</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("Creativity")} name="Creativity" />
                    <span>Kindness</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("Kindness")} name="Kindness" />
                    <span>Fun</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("Fun")} name="Fun" />
                    <span>Volunteering</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("Volunteering")} name="Volunteering" />
                    <span>Mine aren't listed!</span>
                    <input onChange={this.editFamilyValuesEvent} type="checkbox"
                        checked={this.checkIfFamilyValueExists("unlisted")} name="unlisted" />
                </div>

                <div>
                    <label htmlFor="interests">What are your interests? Separate each one by a comma:</label>
                    <input type="text" onChange={this.handleInterests} value={this.state.interests} placeholder="interest1, interest2" />
                </div>

                <label htmlFor="hasPets">Do you have pets? Tick the box if so:</label>
                <input onChange={this.handlePets} checked={this.state.hasPets} type="checkbox" name="hasPets" />

                <label htmlFor="diet">Dietary preferences:</label>
                <select onChange={this.storeValue} value={this.state.diet} name="diet" id="diet">
                    <option value="Select one...">Select one...</option>
                    <option value="Omnivore">Omnivore</option>
                    <option value="Carnivore">Carnivore (lol)</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Pescetarian">Pescetarian</option>
                    <option value="Keto">Keto</option>
                </select>

                <label htmlFor="drinks">Do you drink?</label>
                <select onChange={this.storeValue} value={this.state.drinks} name="drinks" id="drinks">
                    <option value="Select one...">Select one...</option>
                    <option value="Never">Never</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Often">Often</option>
                </select>

                <label htmlFor="smokes">Do you smoke?</label>
                <select onChange={this.storeValue} value={this.state.smokes} name="smokes" id="smokes">
                    <option value="Select one...">Select one...</option>
                    <option value="Never">Never</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Often">Often</option>
                </select>

                <label htmlFor="doesDrugs">Do you do any drugs?</label>
                <select onChange={this.storeValue} value={this.state.doesDrugs} name="doesDrugs" id="doesDrugs">
                    <option value="Select one...">Select one...</option>
                    <option value="Never">Never</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Often">Often</option>
                </select>

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
                <select onChange={this.props.passStoreValue} value={this.props.storedCity} name="city" id="city">
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
                <select onChange={this.props.passStoreValue} value={this.props.storedCity} name="city" id="city">
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


export default withRouter(withFirebase(EditProfilePage));