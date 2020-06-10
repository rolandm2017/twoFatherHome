import React from 'react';

const ChatroomBox = props => {
    return (
        <div>
            <h3>From: </h3>
            <p>{props.recipient}</p>
            <h3>Most recent msg:</h3>
            <p>{props.message}</p>
            <button onClick={props.openChat}>Open Chat</button>
        </div>
    )
}

export default ChatroomBox;