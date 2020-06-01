import React, { Component } from 'react';

interface IUsernameInputState {
	username: string;
}

interface IUsernameInputProps {
	onSubmitUsername(username: string): void;
}

class UsernameInput extends Component<
	IUsernameInputProps,
	IUsernameInputState
> {
	constructor(props: IUsernameInputProps) {
		super(props);
	}
	state: Readonly<IUsernameInputState> = {
		username: '',
	};

	render(): JSX.Element {
		return (
			<form
				action="."
				onSubmit={e => {
					e.preventDefault();
					this.props.onSubmitUsername(this.state.username);
					this.setState({ username: '' });
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
				<input type="submit" value={'Send'} />
			</form>
		);
	}
}

export default UsernameInput;
