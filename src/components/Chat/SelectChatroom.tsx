import React, { Component, CSSProperties } from 'react';
import { IChatroomDetails } from '../../interfaces';
import M from 'materialize-css';

interface ISelectChatroomState {
	username: string;
	chatroom: string;
}

interface ISelectChatroomProps {
	onSubmitUsername(username: string, chatroom: string): void;
	chatrooms: IChatroomDetails[];
	username: string;
}

const formStyle: CSSProperties = {
	marginTop: '50px',
};

class SelectChatroom extends Component<ISelectChatroomProps, ISelectChatroomState> {
	constructor(props: ISelectChatroomProps) {
		super(props);
	}
	state: Readonly<ISelectChatroomState> = {
		username: this.props.username,
		chatroom: '',
	};

	generateChatroomList = (): JSX.Element[] => {
		let chatroomOptions: JSX.Element[] = [];
		chatroomOptions = chatroomOptions.concat(
			this.props.chatrooms.map(chatroom => (
				<option value={chatroom.name} key={chatroom.name}>
					{chatroom.name}
				</option>
			)),
		);

		return chatroomOptions;
	};

	componentDidMount(): void {
		M.updateTextFields();
		M.AutoInit();
	}

	render(): JSX.Element {
		return (
			<div className="row center">
				<form
					action="."
					onSubmit={e => {
						e.preventDefault();
						this.props.onSubmitUsername(this.state.username, this.state.chatroom);
						this.setState({ username: '', chatroom: '' });
					}}
					className="col s10 offset-s1 m6 offset-m3 xl4 offset-xl4"
					style={formStyle}
				>
					{!this.props.username && (
						<div className="row">
							<div className="input-field col s11">
								<input
									name="enterUserName"
									type="text"
									placeholder={'Username'}
									value={this.state.username}
									onChange={e => this.setState({ username: e.target.value })}
								/>
								<label htmlFor="enterUserName">Enter a Username:</label>
							</div>
						</div>
					)}
					<div className="row">
						<div className="input-field col s11">
							<select
								name="chatroom"
								value={this.state.chatroom}
								onChange={event => this.setState({ chatroom: event.target.value })}
							>
								<option value="" disabled>
									Select a chatroom
								</option>
								,{this.generateChatroomList()}
							</select>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s11">
							<button
								className="btn waves-effect waves-light right deep-purple lighten-1"
								type="submit"
								name="action"
							>
								Join Chat
								<i className="material-icons right">send</i>
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default SelectChatroom;
