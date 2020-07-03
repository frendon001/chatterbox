import React from 'react';
import ChatMessage from './ChatMessage';
import { IChatroomMessage } from '../../interfaces';

const ChatHistory = ({ chatHistory }: { chatHistory: IChatroomMessage[] }): JSX.Element => {
	return (
		<>
			{chatHistory.map((chatMessage, index) => (
				<ChatMessage key={index} message={chatMessage.message} username={chatMessage.username} />
			))}
		</>
	);
};

export default ChatHistory;
