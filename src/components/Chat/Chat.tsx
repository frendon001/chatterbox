import React, { Component } from 'react';
import SelectChatroom from './SelectChatroom';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { clientSocket, IClientSocket } from '../../client-socket';

interface IChatState {
	chatroomName: string;
	chatHistory: IChatMessage[];
	username: string;
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

class Chat extends Component<Record<string, unknown>, IChatState> {
	state: IChatState = {
		username: '',
		chatHistory: [],
		chatroomName: '',
	};

	ws: IClientSocket = clientSocket();

	componentDidMount(): void {
		this.ws.init(this.addMessage);
	}

	addMessage = (chatMessage: IChatMessage | IChatMessage[]): void => {
		console.log('addMessage: ', chatMessage);
		if (Array.isArray(chatMessage)) {
			this.setState(state => ({
				chatHistory: [...state.chatHistory, ...chatMessage],
			}));
		} else {
			this.setState(state => ({
				chatHistory: [...state.chatHistory, chatMessage],
			}));
		}
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

	addNewUser = (inputUsername: string, chatroomName: string): void => {
		console.log(`Added user: ${inputUsername}`);
		this.setState({ username: inputUsername, chatroomName });
		console.log(this.state);
		this.ws.sendMessage({
			chatroomName,
			event: 'register',
			data: { username: inputUsername },
		});
		setTimeout(
			() =>
				this.ws.sendMessage({
					chatroomName,
					event: 'join',
					data: { username: inputUsername },
				}),
			1000,
		);
	};

	render(): JSX.Element {
		return (
			<div>
				{this.state.chatHistory.map((message, index) => (
					<ChatMessage
						key={index}
						message={message.message}
						username={message.username}
					/>
				))}
				{this.state.username ? (
					<ChatInput
						onSubmitChatMessage={messageString =>
							this.submitMessage(messageString)
						}
					/>
				) : (
					<SelectChatroom
						onSubmitUsername={(inputUsername, chatroomName) =>
							this.addNewUser(inputUsername, chatroomName)
						}
					/>
				)}
			</div>
		);
	}
}

export default Chat;
