import React, { Component, CSSProperties } from 'react';

interface IChatInputState {
	message: string;
	isMobile: boolean;
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

const isMobileRegex = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
const ENTER_KEY = 13;
class ChatInput extends Component<IChatInputProps, IChatInputState> {
	constructor(props: IChatInputProps) {
		super(props);
	}
	state: Readonly<IChatInputState> = {
		message: '',
		isMobile: false,
	};

	mobileCheck = (): boolean => {
		console.log('running check for device type...');
		let check = false;
		(function (a) {
			if (isMobileRegex.test(a)) {
				check = true;
			}
		})(navigator.userAgent || navigator.vendor);
		return check;
	};

	componentDidMount(): void {
		this.setState({ isMobile: this.mobileCheck() });
	}

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
						onChange={e => {
							this.setState({ message: e.target.value });
						}}
						onKeyDown={e => {
							if (!this.state.isMobile && e.keyCode === ENTER_KEY && !e.shiftKey) {
								e.preventDefault();
								this.props.onSubmitChatMessage(this.state.message);
								this.setState({ message: '' });
							}
						}}
						className="chat-text-area"
					/>
					<button className="waves-effect chat-input-button" type="submit" name="send">
						SEND
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
