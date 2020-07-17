import React, { Component, CSSProperties } from 'react';

interface IChatInputState {
	message: string;
}

interface IChatInputProps {
	onSubmitChatMessage(message: string): void;
}

const chatInputFormStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	overflow: 'auto',
	alignItems: 'center',
	justifyContent: 'space-around',
	padding: '0 .75rem',
};

class ChatInput extends Component<IChatInputProps, IChatInputState> {
	constructor(props: IChatInputProps) {
		super(props);
	}
	state: Readonly<IChatInputState> = {
		message: '',
	};

	render(): JSX.Element {
		return (
			<div>
				<form
					action="."
					onSubmit={e => {
						e.preventDefault();
						this.props.onSubmitChatMessage(this.state.message);
						this.setState({ message: '' });
					}}
					style={chatInputFormStyle}
				>
					<label htmlFor="message" style={{ display: 'none' }}>
						Tell us your story:
					</label>
					<textarea
						name="message"
						placeholder={'Enter your message...'}
						value={this.state.message}
						onChange={e => this.setState({ message: e.target.value })}
						className="chat-text-area"
					/>
					<button className="waves-effect chat-input-button" type="submit" name="action">
						SUBMIT
						<i
							className="material-icons right"
							style={{ marginLeft: '5px', fontSize: '20px', lineHeight: '1.3' }}
						>
							send
						</i>
					</button>
				</form>
			</div>
		);
	}
}

export default ChatInput;
