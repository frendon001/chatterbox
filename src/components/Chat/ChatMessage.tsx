import React from 'react';

interface IChatMessage {
	name: string;
	message: string;
}

const ChatMessage = ({ name, message }: IChatMessage): JSX.Element => {
	return (
		<p>
			<strong>{name}</strong> <em>{message}</em>
		</p>
	);
};

export default ChatMessage;
