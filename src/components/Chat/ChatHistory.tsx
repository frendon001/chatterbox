import React from 'react';
import ChatMessage from './ChatMessage';
import { IChatMessage } from './Chat';

const ChatHistory = ({ chatHistory }: { chatHistory: IChatMessage[] }): JSX.Element => {
	return (
		<>
			{chatHistory.map((chatMessage, index) => (
				<ChatMessage key={index} message={chatMessage.message} username={chatMessage.username} />
			))}
		</>
	);
};

export default ChatHistory;
