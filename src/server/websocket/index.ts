// import http from 'http';
import WebSocket from 'ws';
// import { Express } from 'express';

const initWebSocket = (): void => {
	//
	// Create HTTP server by ourselves.
	//
	//const server = http.createServer(app);
	const wss = new WebSocket.Server({ port: 3000 });

	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(data) {
			wss.clients.forEach(function each(client) {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});
		});
	});
};

export default initWebSocket;
