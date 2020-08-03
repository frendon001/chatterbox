import React, { CSSProperties } from 'react';
import ChatInput from './ChatInput';
import ChatHistory from './ChatHistory';
import ChatHeader from './ChatHeader';
import { IChatroomMessage, IChatroomDetails } from '../../interfaces';

interface IChatroom {
	chatroomName: string;
	username: string;
	chatHistory: IChatroomMessage[];
	selectedChatroom: IChatroomDetails | null;
	onLeaveChatroom: (username: string, chatroomName: string) => void;
	onSubmitChatMessage: (message: string) => void;
}

const chatroomStyle: CSSProperties = {
	borderRadius: '1rem 1rem 1rem 1rem',
	marginBottom: '2rem',
};

const Chatroom = ({
	username,
	chatHistory,
	selectedChatroom,
	onLeaveChatroom,
	onSubmitChatMessage,
}: IChatroom): JSX.Element | null => {
	if (!selectedChatroom?.name || !username) {
		return null;
	}
	return (
		<div className="row margin-top-50">
			<div className="col s12 m8 xl6 offset-m2 offset-xl3">
				<div className=" z-depth-2" style={chatroomStyle}>
					<ChatHeader
						username={username}
						selectedChatroom={selectedChatroom}
						onLeaveChatroom={onLeaveChatroom}
					/>
					<ChatHistory chatHistory={chatHistory} selectedChatroom={selectedChatroom} self={username} />
					<ChatInput onSubmitChatMessage={onSubmitChatMessage} />
				</div>
			</div>
		</div>
	);
};

export default Chatroom;
