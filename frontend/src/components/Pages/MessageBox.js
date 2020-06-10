import React from 'react';

const MessageBox = props => {
    return (
        <div>
            <h3>From: </h3>
            <p>{props.sender}</p>
            <p>{props.message}</p>
        </div>
    )
}

export default MessageBox;