import 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/App';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css';
import 'material-design-icons/iconfont/material-icons.css';
import '../public/custom-css.css';

// Hot module replacement logic to accept updates from webpack-dev-server
if (process.env.NODE_ENV === 'development' && module.hot) {
	module.hot.accept();
	// when using redux
	//   module.hot.accept('../reducers', () => {
	//     store.replaceReducer(require('../reducers').default);
	//   });
}

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root'),
);
