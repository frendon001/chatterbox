import React from 'react';

interface IChatMessage {
	username: string;
	message: string;
}

const ChatMessage = ({ username, message }: IChatMessage): JSX.Element => {
	return (
		<p>
			<strong>{username}</strong> {message}
		</p>
	);
};

export default ChatMessage;
