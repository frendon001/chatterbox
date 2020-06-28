import React, { Component } from 'react';
import config from '../../config';

interface ISelectChatroomState {
	username: string;
	chatroom: string;
}

interface ISelectChatroomProps {
	onSubmitUsername(username: string, chatroom: string): void;
}

class SelectChatroom extends Component<ISelectChatroomProps, ISelectChatroomState> {
	constructor(props: ISelectChatroomProps) {
		super(props);
	}
	state: Readonly<ISelectChatroomState> = {
		username: '',
		chatroom: '',
	};

	render(): JSX.Element {
		return (
			<form
				action="."
				onSubmit={e => {
					e.preventDefault();
					this.props.onSubmitUsername(this.state.username, this.state.chatroom);
					this.setState({ username: '', chatroom: '' });
				}}
			>
				<label htmlFor="enterUserName">Enter a Username:</label>
				<input
					name="enterUserName"
					type="text"
					placeholder={'Username'}
					value={this.state.username}
					onChange={e => this.setState({ username: e.target.value })}
				/>
				<label htmlFor="chatroom">Select a chatroom:</label>
				<select
					name="chatroom"
					value={this.state.chatroom}
					onChange={event => this.setState({ chatroom: event.target.value })}
				>
					{config.CHATROOMS.map(chatroom => (
						<option value={chatroom.name} key={chatroom.name}>
							{chatroom.name}
						</option>
					))}
				</select>
				<input type="submit" value={'Send'} />
			</form>
		);
	}
}

export default SelectChatroom;
