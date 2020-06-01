import http from 'http';
import WebSocket from 'ws';
import url from 'url';
import { connection } from './events';

const initWebSocket = (server: http.Server): void => {
	// Create websocket on server
	const wss = new WebSocket.Server({ noServer: true });

	server.on('upgrade', function (request, socket, head) {
		const pathName = url.parse(request.url).pathname;
		console.log('Upgrading request...');
		// Route websocket based on path name
		if (pathName === '/chat') {
			wss.handleUpgrade(request, socket, head, function (ws) {
				wss.emit('connection', ws);
			});
		} else {
			socket.destroy();
		}
	});
	// Apply logic on websocket connection
	wss.on('connection', connection(wss));
};

export default initWebSocket;
