import React from 'react';

const ProfileBox = props => {
    return (
        <div style={{ backgroundColor: "#EEE" }}>
            <h3>User: </h3>
            <p>{props.username}</p>
            <h3>User has been messaged:</h3>
            <p>{props.hasBeenMessaged ? "True!" : "False!"}</p>
            {props.hasBeenMessaged ? null : <button onClick={props.openChat}>Open Chat Now!</button>}
            <br />
            <img src={props.displayImg} alt="User profile pic" width="300" height="200" />
        </div >
    )
}

export default ProfileBox;