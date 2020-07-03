import React, { Component } from 'react';
import SelectChatroom from './SelectChatroom';
import ChatInput from './ChatInput';
import ChatHistory from './ChatHistory';
import ChatHeader from './ChatHeader';
import { clientSocket, IClientSocket } from '../../client-socket';
import { IChatroomDetails, IGetChatrooms, ILeaveJoinChatroom, IRegisterChatroom } from '../../interfaces';
import { trimChatHistory } from '../../utils';

interface IChatState {
	chatroomName: string;
	chatHistory: IChatMessage[];
	username: string;
	chatrooms: IChatroomDetails[];
}

export interface IChatMessage {
	username: string;
	message: string;
}

export interface IMessage<T> {
	chatroomName: string;
	data: T;
	event: string;
}

const MAX_CHAT_HISTORY_LEN = 600;

class Chat extends Component<Record<string, unknown>, IChatState> {
	state: IChatState = {
		username: '',
		chatHistory: [],
		chatroomName: '',
		chatrooms: [],
	};

	ws: IClientSocket = clientSocket();

	componentDidMount(): void {
		this.ws.init(this.addMessage);
		this.ws.handleEvent('chatMessage', this.addMessage);
		this.ws.handleEvent('chatHistory', this.addChatHistory);
		this.ws.handleEvent('joinChatroom', this.handleJoinedChatroom);
		this.ws.handleEvent('registerUser', this.handleUserRegistration);
		this.ws.handleEvent('getChatrooms', this.handleGetChatrooms);
		this.ws.handleEvent('leaveChatroom', this.handleLeaveChatroom);
		window.addEventListener('beforeunload', this.componentCleanup);
	}

	componentWillUnmount(): void {
		this.componentCleanup();
		window.removeEventListener('beforeunload', this.componentCleanup);
	}

	componentCleanup = (): void => {
		console.log('unmounting...');
		this.ws.disconnect(this.state.username, this.state.chatroomName);
	};

	addMessage = (chatMessage: IChatMessage): void => {
		console.log('addMessage: ', chatMessage);
		this.setState(state => ({
			chatHistory: trimChatHistory([...state.chatHistory, chatMessage], MAX_CHAT_HISTORY_LEN),
		}));
	};

	addChatHistory = (chatHistory: IChatMessage[]): void => {
		console.log('addChatHistory: ', chatHistory);
		this.setState(state => ({
			chatHistory: [...state.chatHistory, ...chatHistory],
		}));
	};

	submitMessage = (messageString: string): void => {
		// on submitting the ChatInput form, send the message, add it to the list and reset the input
		const data = {
			username: this.state.username,
			message: messageString,
		};
		const message = {
			event: 'chatMessage',
			chatroomName: this.state.chatroomName,
			data,
		};
		this.ws.sendMessage(message);
	};

	handleUserRegistration = ({ errorMessage, username, chatroomName }: IRegisterChatroom): void => {
		if (errorMessage) {
			console.log(errorMessage);
		} else {
			this.setState({ username });
			this.ws.joinChatroom(username, chatroomName);
		}
	};

	handleJoinedChatroom = ({ errorMessage, chatroomName }: ILeaveJoinChatroom): void => {
		if (errorMessage) {
			console.log(errorMessage);
		} else {
			this.setState({ chatroomName });
		}
	};

	handleGetChatrooms = ({ errorMessage, chatrooms }: IGetChatrooms): void => {
		if (errorMessage) {
			console.log(errorMessage);
		} else {
			this.setState({ chatrooms });
			console.log(this.state.chatrooms);
		}
	};

	handleLeaveChatroom = ({ errorMessage, chatroomName }: ILeaveJoinChatroom): void => {
		if (errorMessage) {
			console.log(errorMessage);
		} else {
			this.setState({ chatroomName, chatHistory: [] });
			console.log('handleLeaveChatroomComplete');
		}
	};

	showChatroomSelection = (): JSX.Element => {
		if (this.state.chatrooms.length) {
			return (
				<SelectChatroom
					chatrooms={this.state.chatrooms}
					username={this.state.username}
					onSubmitUsername={(inputUsername, chatroomName) => {
						if (!this.state.username) {
							this.ws.registerUser(inputUsername, chatroomName);
						} else {
							this.ws.joinChatroom(this.state.username, chatroomName);
						}
					}}
				/>
			);
		} else {
			return <p>Loading available chatrooms...</p>;
		}
	};

	render(): JSX.Element {
		return (
			<div>
				{this.state.chatroomName ? (
					<>
						<ChatHeader
							username={this.state.username}
							chatroomName={this.state.chatroomName}
							onLeaveChatroom={this.ws.leaveChatroom}
						/>
						<ChatHistory chatHistory={this.state.chatHistory} />
						<ChatInput onSubmitChatMessage={messageString => this.submitMessage(messageString)} />
					</>
				) : (
					this.showChatroomSelection()
				)}
			</div>
		);
	}
}

export default Chat;
