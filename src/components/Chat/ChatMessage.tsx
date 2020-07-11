import React, { CSSProperties } from 'react';

interface IChatMessage {
	username: string;
	message: string;
	self: string;
	selfColor: string;
}
const messageStyle: CSSProperties = {
	alignSelf: 'flex-end',
	width: '70%',
	backgroundColor: '#7e57c2',
	border: '1px solid #d8d6d6',
	padding: '4px 8px',
	borderRadius: '5px',
	margin: '5px 0',
	color: '#ffffff',
};
const messageUsernameSelfStyle: CSSProperties = {
	fontWeight: 'bold',
	color: '#7e57c2',
};
const messageTextStyle: CSSProperties = {
	fontSize: '1.2rem',
	whiteSpace: 'pre-line',
	overflowWrap: 'break-word',
};

const ChatMessage = ({ username, message, self, selfColor }: IChatMessage): JSX.Element => {
	const messageSelfStyle: CSSProperties = {
		alignSelf: 'flex-start',
		width: '70%',
		backgroundColor: selfColor,
		border: '1px solid #d8d6d6',
		padding: '4px 8px',
		borderRadius: '5px',
		margin: '5px 0',
		color: '#344244',
	};
	const messageUsernameStyle: CSSProperties = {
		fontWeight: 'bold',
		color: selfColor,
	};
	return (
		<div style={self === username ? messageSelfStyle : messageStyle}>
			<div style={self === username ? messageUsernameSelfStyle : messageUsernameStyle}>{username}</div>
			<div style={messageTextStyle}>{message}</div>
		</div>
	);
};

export default ChatMessage;
