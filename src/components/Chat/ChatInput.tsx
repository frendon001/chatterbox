import React, { Component } from 'react';

interface IChatInputState {
	message: string;
}

interface IChatInputProps {
	onSubmitChatMessage(message: string): void;
}

class ChatInput extends Component<IChatInputProps, IChatInputState> {
	constructor(props: IChatInputProps) {
		super(props);
	}
	state: Readonly<IChatInputState> = {
		message: '',
	};

	render(): JSX.Element {
		return (
			<form
				action="."
				onSubmit={e => {
					e.preventDefault();
					this.props.onSubmitChatMessage(this.state.message);
					this.setState({ message: '' });
				}}
			>
				<input
					type="text"
					placeholder={'Enter message...'}
					value={this.state.message}
					onChange={e => this.setState({ message: e.target.value })}
				/>
				<input type="submit" value={'Send'} />
			</form>
		);
	}
}

export default ChatInput;
