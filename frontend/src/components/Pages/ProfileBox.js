import React from 'react';

const ProfileBox = props => {
    return (
        <div>
            <h3>User: </h3>
            <p>{props.username}</p>
            <h3>User has been messaged:</h3>
            <p>{props.hasBeenMessaged}</p>
        </div>
    )
}

export default ProfileBox;