import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  fullName: "",
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  // FIXME: username is selected after .doCreateUserWithEmailAndPassword, 100p. migrate username sel to next pg
  // FIXME: how is "Full Name" captured by firebase auth or firestore? We DO need the user's full name, right? like, for emails...

  onSubmit = event => {
    console.log("Submitted new user!")
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.CREATE_PROFILE);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // FIXME: form validation proooooobably needs work, or at least testing...

	containsAny = (str, chars) => {
	  // top answer here: https://stackoverflow.com/questions/15201939/jquery-javascript-check-string-for-multiple-substrings
	  for (const i in chars) {
		  const unacceptableChar = chars[i]
		  if (str.indexOf(unacceptableChar) > -1) {
			  return true;
		  }
	  }
	  return false;
  }

	// namesAreValid = fullname => { // "first name & last name both must be longer than 1 char and contains a whitespace" rule 
	// 	if (fullname.indexOf(" ") > -1) {
	// 		const firstName = fullname.split(" ")[0]
	// 		const lastName = fullname.split(" ")[1]
	// 		if (firstName.length < 2) {
	// 			return false
	// 		} else if (lastName.length < 2) {
	// 			return false
	// 		} else {
	// 			return true;
	// 		}
	// 	} else {
	// 		return false // return false ("invalid") because indexOf(" ") returned -1
	// 	}
  // }
  
  validateUsername = (username) => {
    // modified code from CreateProfilePage.js
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

  checkState = () => {
	  console.log(this.state)
    const { username, fullName, email, passwordOne, passwordTwo, error } = this.state;
    
	  const isInvalid = passwordOne !== passwordTwo ||
		  passwordOne.length < 7 || // length rule
		  email === '' ||
		  username === '' ||
      username.includes(" ") || // no spaces rule
      !this.validateUsername(username) || // general validation check (has to be flipped in bool value)
		  !(email.includes("@")) || // must include "@" symbol rule
		  !(email.includes(".")) || // must include "." (as in ".com" or ".net") rule
		  this.namesAreValid(fullName) || // "first name & last name both must be longer than 1 char and contains a whitespace" rule 
		  this.containsAny(fullName, [",", ".", ";", ":", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "="]);
	  
	  console.log(isInvalid) // FIXME: form validation returns true when it should return false. this is a job for unit tests...
  }

  render() {
    const {
      username,
      fullName,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne.length < 7 || // length rule
      email === '' ||
      username === '' ||
      username.includes(" ") || // no spaces rule
      !(email.includes("@")) || // must include "@" symbol rule
      !(email.includes(".")); // must include "." (as in ".com" or ".net") rule
		// this.namesAreValid(fullName) || // "first name & last name both must be longer than 1 char and contains a whitespace" rule 
	  // full name must not include a special character
		// this.containsAny(fullName, [",", ".", ";", ":", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "="]);
      
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Username"
            />
          {/* <input
            name="fullName"
            value={fullName}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
            /> */}
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            />
          <input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
            />
          <input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
            />
          <button disabled={isInvalid} type="submit">
            Sign Up
          </button>

          {error && <p>{error.message}</p>}
        </form>

        <button onClick={this.checkState}>Test</button>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };