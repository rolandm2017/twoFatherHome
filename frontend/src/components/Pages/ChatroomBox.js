import React from 'react';

const ChatBox = props => {
    return (
        <div>
            <h3>From: </h3>
            <p>{props.recipient}</p>
            <h3>Most recent msg:</h3>
            <p>{props.message}</p>
        </div>
    )
}

export default ChatBox;