import React from 'react';

interface IChatHeader {
	chatroomName: string;
	username: string;
	onLeaveChatroom: (username: string, chatroomName: string) => void;
}

const ChatHeader = ({ chatroomName, username, onLeaveChatroom }: IChatHeader): JSX.Element => {
	return (
		<div>
			<div>Chat with {chatroomName}</div>
			<button
				onClick={e => {
					e.preventDefault();
					onLeaveChatroom(username, chatroomName);
				}}
			>
				X
			</button>
		</div>
	);
};

export default ChatHeader;
