import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ChatterboxContainer } from '../Chatterbox';

const App: React.FunctionComponent = () => {
	return (
		<Switch>
			<Route exact path="/chatterbox" component={ChatterboxContainer} />
			{/* Redirect insures we always have something sensible to render */}
			<Redirect to="/chatterbox" />
		</Switch>
	);
};

export default hot(App);
