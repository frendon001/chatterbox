import React, { CSSProperties } from 'react';
import Chat from '../Chat';

const headerStyle: CSSProperties = {
	color: '#e8eaf6',
	margin: '0',
	textShadow: '-1px 0 #22242638, 0 1px #22242638, 1px 0 #22242638, 0 -1px #22242638',
};

const appStyle: CSSProperties = {
	height: '100vh',
};

const ChatterboxContainer: React.FunctionComponent = () => {
	return (
		<div style={appStyle}>
			<nav>
				<div className="nav-wrapper deep-purple darken-2">
					<a className="brand-logo center" style={headerStyle}>
						Chatterbox
						<i className="material-icons right">chat</i>
					</a>
				</div>
			</nav>
			<div className="container">
				<Chat />
			</div>
		</div>
	);
};

export default ChatterboxContainer;
