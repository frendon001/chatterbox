import React, { Component } from 'react';
import { IChatroomDetails } from '../../interfaces';

interface ISelectChatroomState {
	username: string;
	chatroom: string;
}

interface ISelectChatroomProps {
	onSubmitUsername(username: string, chatroom: string): void;
	chatrooms: IChatroomDetails[];
	username: string;
}

class SelectChatroom extends Component<ISelectChatroomProps, ISelectChatroomState> {
	constructor(props: ISelectChatroomProps) {
		super(props);
	}
	state: Readonly<ISelectChatroomState> = {
		username: this.props.username,
		chatroom: '',
	};

	generateChatroomList = (): JSX.Element[] => {
		return this.props.chatrooms.map(chatroom => (
			<option value={chatroom.name} key={chatroom.name}>
				{chatroom.name}
			</option>
		));
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
				{!this.props.username && (
					<>
						<label htmlFor="enterUserName">Enter a Username:</label>
						<input
							name="enterUserName"
							type="text"
							placeholder={'Username'}
							value={this.state.username}
							onChange={e => this.setState({ username: e.target.value })}
						/>
					</>
				)}
				<label htmlFor="chatroom">Select a chatroom:</label>
				<select
					name="chatroom"
					value={this.state.chatroom}
					onChange={event => this.setState({ chatroom: event.target.value })}
				>
					{this.generateChatroomList()}
				</select>
				<input type="submit" value={'Send'} />
			</form>
		);
	}
}

export default SelectChatroom;
