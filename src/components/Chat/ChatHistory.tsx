import React, { CSSProperties } from 'react';
import ChatMessage from './ChatMessage';
import { IChatroomMessage, IChatroomDetails } from '../../interfaces';

interface IChatHistory {
	chatHistory: IChatroomMessage[];
	selectedChatroom: IChatroomDetails;
	self: string;
}

const chatHeaderStyle: CSSProperties = {
	borderRadius: '1rem 1rem 0 0',
	borderBottom: '1px solid #d8d6d6',
	height: '75vh',
	maxHeight: '700px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-end',
};

const chatHistoryContainerStyle: CSSProperties = {
	overflowY: 'auto',
	padding: '.5rem .75rem 0 .75rem',
};

const ChatHistory = ({ chatHistory, self, selectedChatroom }: IChatHistory): JSX.Element => {
	return (
		<div style={chatHeaderStyle}>
			<div style={chatHistoryContainerStyle}>
				{chatHistory.map((chatMessage, index) => (
					<ChatMessage
						key={index}
						message={chatMessage.message}
						username={chatMessage.username}
						self={self}
						selfColor={selectedChatroom.color}
					/>
				))}
			</div>
		</div>
	);
};

export default ChatHistory;
