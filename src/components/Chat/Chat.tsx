import React, { Component } from 'react';
import UsernameInput from './UsernameInput';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { clientSocket, IClientSocket } from '../../client-socket';

interface IChatState {
	username: string;
	messages: IMessage[];
}

export interface IMessage {
	username: string;
	message: string;
}

class Chat extends Component<Record<string, unknown>, IChatState> {
	state: IChatState = {
		username: '',
		messages: [],
	};

	ws: IClientSocket = clientSocket();

	addMessage = (message: IMessage): void =>
		this.setState(state => ({ messages: [...state.messages, message] }));

	submitMessage = (messageString: string): void => {
		// on submitting the ChatInput form, send the message, add it to the list and reset the input
		const message = {
			username: this.state.username,
			message: messageString,
		};
		this.ws.sendMessage(message);
		this.addMessage(message);
	};

	addNewUser = (inputUsername: string): void => {
		console.log(`Added user: ${inputUsername}`);
		this.setState({ username: inputUsername });
		console.log(this.state);
		this.ws.init(this.addMessage);
	};

	render(): JSX.Element {
		return (
			<div>
				{this.state.messages.map((message, index) => (
					<ChatMessage
						key={index}
						message={message.message}
						username={message.username}
					/>
				))}
				{this.state.username ? (
					<ChatInput
						onSubmitMessage={messageString =>
							this.submitMessage(messageString)
						}
					/>
				) : (
					<UsernameInput
						onSubmitUsername={inputUsername =>
							this.addNewUser(inputUsername)
						}
					/>
				)}
			</div>
		);
	}
}

export default Chat;
