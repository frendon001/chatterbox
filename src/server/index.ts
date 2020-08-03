import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import helmet from 'helmet';
import api from './api';
import http from 'http';
import initWebSocket from './websockets';
import config from '../config';

const app = express();
// Set various headers for protection
app.use(helmet());
app.use(bodyParser.json());
// Allow cross-domain requests
app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.use('/api', api);

if (process.env.NODE_ENV === 'production') {
	// Serve production assets
	app.use(express.static(path.resolve(__dirname, '../../dist')));
	app.get('/*', (_req, res) => {
		res.sendFile(path.resolve(__dirname, '../../dist', 'generated.html'));
	});
}
// Create Http Server
const server = http.createServer(app);
initWebSocket(server);
server.listen(config.PORT_SERVER, config.HOST);

module.exports = server;
