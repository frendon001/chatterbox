import React, { CSSProperties } from 'react';
import { IChatroomDetails } from '../../interfaces';

interface IChatHeader {
	selectedChatroom: IChatroomDetails;
	username: string;
	onLeaveChatroom: (username: string, chatroomName: string) => void;
}
const chatHeaderTextStyle: CSSProperties = {
	flex: 'auto',
	textAlign: 'center',
	margin: '0',
	lineHeight: '150%',
	fontWeight: 700,
	color: '#512da8',
};

const chatHeaderButtonStyle: CSSProperties = {
	flex: 'initial',
	padding: '0',
	height: '24px',
	borderRadius: '2px',
};

const ChatHeader = ({ selectedChatroom, username, onLeaveChatroom }: IChatHeader): JSX.Element => {
	const chatHeaderStyle: CSSProperties = {
		borderRadius: '1rem 1rem 0 0',
		padding: '.9rem .75rem .75rem .75rem',
		borderBottom: '1px solid #d8d6d6',
		display: 'flex',
		backgroundColor: selectedChatroom.color,
	};
	return (
		<div style={chatHeaderStyle}>
			<h6 style={chatHeaderTextStyle}>{selectedChatroom.name} Chatroom</h6>
			<button
				onClick={e => {
					e.preventDefault();
					onLeaveChatroom(username, selectedChatroom.name);
				}}
				className="button-close"
				style={chatHeaderButtonStyle}
			>
				<i className="material-icons">close</i>
			</button>
		</div>
	);
};

export default ChatHeader;
