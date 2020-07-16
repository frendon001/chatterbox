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

// const chatTextAreaStyle: CSSProperties = {
// 	width: '65%',
// 	height: '75px',
// 	maxHeight: '75px',
// 	borderRadius: '5px',
// 	padding: '0.75rem 0.5rem',
// 	resize: 'none',
// 	border: 'none',
// 	color: '#394142',
// };

// const chatButtonStyle: CSSProperties = {
// 	textDecoration: 'none',
// 	color: '#fff',
// 	textAlign: 'center',
// 	letterSpacing: '.5px',
// 	backgroundColor: '#7e57c2',
// 	fontSize: '14px',
// 	outline: '0',
// 	border: 'none',
// 	borderRadius: '2px',
// 	height: '50px',
// 	lineHeight: '25px',
// };

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
						// style={chatTextAreaStyle}
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
