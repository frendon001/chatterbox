import React, { Component } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { config } from '../../config';

// TODO: create config folder at root
const URL = `ws://${config.WEBSOCKET_HOST}/chat`;
// console.log(`ws://${location.host}`);
interface IChatState {
	name: string;
	messages: IMessage[];
	ws: WebSocket | null;
}

interface IMessage {
	name: string;
	message: string;
}

class Chat extends Component<Record<string, unknown>, IChatState> {
	state: IChatState = {
		name: 'Bob',
		messages: [],
		ws: null,
	};

	ws = new WebSocket(URL);

	componentDidMount(): void {
		console.log(`ws://${location.host}`);
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
	}

	addMessage = (message: IMessage): void =>
		this.setState(state => ({ messages: [message, ...state.messages] }));

	submitMessage = (messageString: string): void => {
		// on submitting the ChatInput form, send the message, add it to the list and reset the input
		const message = { name: this.state.name, message: messageString };
		this.ws.send(JSON.stringify(message));
		this.addMessage(message);
	};

	render(): JSX.Element {
		return (
			<div>
				<label htmlFor="name">
					Name:&nbsp;
					<input
						type="text"
						id={'name'}
						placeholder={'Enter your name...'}
						value={this.state.name}
						onChange={e => this.setState({ name: e.target.value })}
					/>
				</label>
				<ChatInput
					ws={this.ws}
					onSubmitMessage={messageString =>
						this.submitMessage(messageString)
					}
				/>
				{this.state.messages.map((message, index) => (
					<ChatMessage
						key={index}
						message={message.message}
						name={message.name}
					/>
				))}
			</div>
		);
	}
}

export default Chat;
