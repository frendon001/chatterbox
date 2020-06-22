import http from 'http';
import WebSocket from 'ws';
import url from 'url';
import { handleConnection } from './server-websocket';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

const initWebSocket = (server: http.Server): void => {
	// Create websocket on server
	const wss = new WebSocket.Server({ noServer: true });

	server.on('upgrade', function (request, socket, head) {
		const pathName = url.parse(request.url).pathname;
		console.log('Upgrading request...');
		// Route websocket based on path name
		if (pathName === '/chat') {
			wss.handleUpgrade(request, socket, head, function (client) {
				const clientId = uuid.v4();
				wss.emit('connection', { client, clientId });
			});
		} else {
			socket.destroy();
		}
	});
	// Apply logic on websocket connection

	wss.on('connection', handleConnection);
};

export default initWebSocket;
