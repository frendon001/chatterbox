import React, { Component } from 'react';
import SelectChatroom from './SelectChatroom';
import Chatroom from './Chatroom';
// import ChatInput from './ChatInput';
// import ChatHistory from './ChatHistory';
// import ChatHeader from './ChatHeader';
import { clientSocket, IClientSocket } from '../../client-socket';
import {
	IChatroomDetails,
	IGetChatrooms,
	ILeaveJoinChatroom,
	IRegisterChatroom,
	IChatroomMessage,
} from '../../interfaces';
import { trimChatHistory } from '../../utils';

interface IChatState {
	chatroomName: string;
	chatHistory: IChatroomMessage[];
	username: string;
	chatrooms: IChatroomDetails[];
	selectedChatroom: IChatroomDetails | null;
}

const MAX_CHAT_HISTORY_LEN = 600;

class Chat extends Component<Record<string, unknown>, IChatState> {
	state: IChatState = {
		username: '',
		chatHistory: [],
		chatroomName: '',
		chatrooms: [],
		selectedChatroom: null,
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
		this.ws.disconnect(this.state.username, this.state.chatroomName);
	};

	addMessage = (chatMessage: IChatroomMessage): void => {
		this.setState(state => ({
			chatHistory: trimChatHistory([...state.chatHistory, chatMessage], MAX_CHAT_HISTORY_LEN),
		}));
	};

	addChatHistory = (chatHistory: IChatroomMessage[]): void => {
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
			let selectedChatroom: IChatroomDetails | null = null;
			for (const room of this.state.chatrooms) {
				if (room.name === chatroomName) {
					selectedChatroom = { ...room };
				}
			}
			this.setState({ chatroomName, selectedChatroom });
		}
	};

	handleGetChatrooms = ({ errorMessage, chatrooms }: IGetChatrooms): void => {
		if (errorMessage) {
			console.log(errorMessage);
		} else {
			this.setState({ chatrooms });
		}
	};

	handleLeaveChatroom = ({ errorMessage, chatroomName }: ILeaveJoinChatroom): void => {
		if (errorMessage) {
			console.log(errorMessage);
		} else {
			this.setState({ chatroomName, chatHistory: [], selectedChatroom: null });
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
			return (
				<div className="center margin-top">
					<div className="preloader-wrapper big active">
						<div className="spinner-layer spinner-blue-only">
							<div className="circle-clipper left">
								<div className="circle"></div>
							</div>
							<div className="gap-patch">
								<div className="circle"></div>
							</div>
							<div className="circle-clipper right">
								<div className="circle"></div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	};

	render(): JSX.Element {
		return (
			<div>
				<Chatroom
					username={this.state.username}
					chatroomName={this.state.chatroomName}
					onLeaveChatroom={this.ws.leaveChatroom}
					chatHistory={this.state.chatHistory}
					onSubmitChatMessage={this.submitMessage}
					selectedChatroom={this.state.selectedChatroom}
				/>
				{!this.state.chatroomName && this.showChatroomSelection()}
			</div>
		);
	}
}

export default Chat;
