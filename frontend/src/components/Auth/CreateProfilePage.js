import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class CreateProfilePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: new Date(),
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
            doesDrugs: false
        };
    }

    // todo: make this page associate the authenticated user with their own profile & info.
    // todo: start a new development branch

    // todo: when "finished", check here:
    // https://stackoverflow.com/questions/28773839/react-form-onchange-setstate-one-step-behind

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    this.setState({ authUser: authUser });
                } else {
                    this.setState({ authUser: null })
                }
            },
        );
    }

    componentWillUnmount() {
        this.listener(); // prevents a memory leak or something
    }

    storeValue = (event) => {
        console.log("editing: ", event.target.name, event.target.value)
        this.setState({ [event.target.name]: event.target.value })
        // console.log(this.state)
    }

    // handleDate = date => {
    //     this.setState({
    //         dateOfBirth: date
    //     });
    // };

    handleCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked })
        console.log("name:", event.target.name)
        console.log("checked: ", event.target.checked)
        console.log(this.state)
    }

    handleInterests = event => {
        this.setState({ interests: event.target.value })
        console.log(this.state)
    }

    validateUsername = () => {
        const username = this.state.username;
        // https://stackoverflow.com/questions/41597685/javascript-test-string-for-only-letters-and-numbers
        if (username) {
            if (/^[A-Za-z0-9]+$/.test(username)) {
                console.log(username, "is a fine name")
                return true;
            } else {
                console.log("something's wrong with the username")
                return false;
            }
        } else {
            console.log("Username wasn't filled in")
            return false
        }
    }

    validateLocation = () => {
        const country = this.state.country;
        const state = this.state.state;
        const city = this.state.city;

        console.log(country, state, city)
        if (country && city && state) {
            if (country === "Select one...") {
                console.log("country was invalid")
                return false
            } else if (state === "Select one...") {
                console.log("state was invalid")
                return false
            } else if (city === "Select one...") {
                console.log("city was invalid")
                return false
            } else {
                return true
            }
        } else {
            console.log("One of country, city & state were missing")
            return false
        }
    }

    validateFamilyValues = () => {
        const values = this.state.familyValues;
        for (const value in values) {
            if (values[value]) { // "if there is at least one true value listed, the family values are valid"
                console.log("values are fine")
                return true
            }
        }
        console.log("family values are invalid")
        return false // "if no family values are listed as true, then the user still needs to pick at least one."
    }

    validateInterests = () => {
        // should only see alphanumeric chars here, and commas
        if (this.state.interests) {
            // this if statement checks: a) length of "interests" is greater than 5, and b) there is at least 2 interests
            if (this.state.interests.length > 5 && this.state.interests.indexOf(",") > -1) {
                if (/^[A-Za-z0-9][,]+$/.test(this.state.interests)) { // note: [,] adds comma to the regex
                    return true;
                } else {
                    console.log("interests contained an unacceptable character")
                    return false;
                }
            } else {
                console.log("Interests was too short, please include at least two interests")
                return false // return false if the "interests" list is less than 5 chars long
            }
        }
        console.log("Interests wasn't filled in")
    }

    submitProfile = () => {
        const usernameIsValid = this.validateUsername();
        const locationIsValid = this.validateLocation();
        const familyValuesAreValid = this.validateFamilyValues();
        const interstsAreValid = this.validateInterests();

        if (usernameIsValid && locationIsValid && familyValuesAreValid && interstsAreValid) {
            const userUID = this.state.authUser.uid;
            const username = this.state.username;
            const city = this.state.city;
            const state = this.state.state;
            const country = this.state.country;
            const age = this.state.age;
            const familyValues = this.getFamilyValues(this.state.familyValues) // turns array into a comma separated value
            const interests = this.state.interests;
            const hasPets = this.state.hasPets;
            const diet = this.state.diet;
            const drinks = this.state.drinks;
            const smokes = this.state.smokes;
            const doesDrugs = this.state.doesDrugs;
            this.props.firebase.createProfile(userUID, username, city, state, country, age, familyValues, interests,
                hasPets, diet, drinks, smokes, doesDrugs)
        } else {
            // do something... display a msg to the user informing him that he needs to improve the form.
        }
    }

    getFamilyValues = input => {
        // receives an array of objects with boolean values, representing the familyValues options
        // converts this array into a csv e.g.:
        // "Hard Work": true, "Volunteering": true, "Fun": false, "Compassion": true --> "Hard Work,Volunteering, Compassion"
    }

    // username, city, state, country, age, familyValues, interests, hasPets, diet, drinks, smokes, doesDrugs
    // todo: validate username, family values, interests (do a basic job)

    render() {
        return (
            <div>
                <h1>Create Your Profile</h1>

                <label htmlFor="username">Choose a username:</label>
                <input onChange={this.storeValue} name="username" id="username"></input>

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

                <AgeSelector passStoreValue={this.storeValue} />

                <div>
                    <label htmlFor="familyValues">Select some family values:</label>
                    <br />
                    <span>Valuing Elders</span><input onChange={this.handleCheckbox} type="checkbox" name="Valuing Elders" />
                    <span>Hard Work</span><input onChange={this.handleCheckbox} type="checkbox" name="Hard Work" />
                    <span>Respect</span><input onChange={this.handleCheckbox} type="checkbox" name="Respect" />
                    <span>Compassion</span><input onChange={this.handleCheckbox} type="checkbox" name="Compassion" />
                    <span>Eating Together</span><input onChange={this.handleCheckbox} type="checkbox" name="Eating Together" />
                    <span>Responsibility</span><input onChange={this.handleCheckbox} type="checkbox" name="Responsibility" />
                    <span>Creativity</span><input onChange={this.handleCheckbox} type="checkbox" name="Creativity" />
                    <span>Kindness</span><input onChange={this.handleCheckbox} type="checkbox" name="Kindness" />
                    <span>Fun</span><input onChange={this.handleCheckbox} type="checkbox" name="Fun" />
                    <span>Volunteering</span><input onChange={this.handleCheckbox} type="checkbox" name="Volunteering" />
                    <span>Mine aren't listed!</span><input onChange={this.handleCheckbox} type="checkbox" name="Mine aren't listed!" />
                </div>

                <div>
                    <label htmlFor="interests">Write your interests. Separate each one by a comma:</label>
                    <input type="text" onChange={this.handleInterests} />
                </div>

                <label htmlFor="hasPets">Do you have pets? Tick the box if so:</label>
                <input onChange={this.handleCheckbox} type="checkbox" name="hasPets" />

                <label htmlFor="diet">Dietary preferences:</label>
                <select onChange={this.storeValue} name="diet" id="diet">
                    <option value="Select one...">Select one...</option>
                    <option value="Omnivore">Omnivore</option>
                    <option value="Carnivore">Carnivore</option>
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

                <button onClick={this.submitProfile}>Submit Profile</button>

                <div>
                    {/* // Display messages to the user here... e.g. if the form is messed up */}
                </div>

            </div>
        )

    }
}

// TODO: Expand choice of states and provinces
// TODO: Add USA (once marketing covers Vancouver and Toronto)

// TODO: Maybe export those long a.f. selector components to another file? for length

// const ifUSA = () => {
//     return (
//         <div>
//         <label htmlFor="state">Pick your state:</label>
//             <select onChange={this.storeValue} name="state" id="state">
//                 <option value=""
//             </select>
//         </div>
//     )
// }

// function ifBritishColumbia() {
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

// function ifOntario() {
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

class AgeSelector extends Component {
    render() {
        return (
            <div >
                <label htmlFor="age">How old are you?</label>
                <select onChange={this.props.passStoreValue} name="age" id="age">
                    <option value="Select one...">Select one...</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                    <option value="60+">60+</option>
                </select>
            </div >
        )
    }
}

export default withFirebase(CreateProfilePage);