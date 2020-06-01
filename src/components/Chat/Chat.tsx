import React, { Component } from 'react';
import UsernameInput from './UsernameInput';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { config } from '../../config';

// TODO: create config folder at root
const URL = `ws://${config.WEBSOCKET_HOST}/chat`;
// console.log(`ws://${location.host}`);
interface IChatState {
	username: string;
	messages: IMessage[];
	ws: WebSocket | null;
}

interface IMessage {
	username: string;
	message: string;
}

class Chat extends Component<Record<string, unknown>, IChatState> {
	state: IChatState = {
		username: '',
		messages: [],
		ws: null,
	};

	ws = new WebSocket(URL);

	addMessage = (message: IMessage): void =>
		this.setState(state => ({ messages: [...state.messages, message] }));

	submitMessage = (messageString: string): void => {
		// on submitting the ChatInput form, send the message, add it to the list and reset the input
		const message = {
			username: this.state.username,
			message: messageString,
		};
		this.ws.send(JSON.stringify(message));
		this.addMessage(message);
	};

	addNewUser = (inputUsername: string): void => {
		console.log(`Added user: ${inputUsername}`);
		this.setState({ username: inputUsername });
		console.log(this.state);
		this.ws = new WebSocket(URL);
		this.ws.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log('connected');
		};

		this.ws.onmessage = evt => {
			// on receiving a message, add it to the list of messages
			const message = JSON.parse(evt.data);
			this.addMessage(message);
		};

		this.ws.onclose = () => {
			console.log('disconnected');
			// automatically try to reconnect on connection loss
			// this.setState({
			// 	ws: new WebSocket(URL),
			// });
		};
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
