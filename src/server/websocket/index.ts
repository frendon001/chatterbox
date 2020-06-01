// import http from 'http';
import WebSocket from 'ws';
import { connection } from './events';
// import { Express } from 'express';

const initWebSocket = (): void => {
	//
	// Create HTTP server by ourselves.
	//
	//const server = http.createServer(app);
	const wss = new WebSocket.Server({ port: 3000 });

	wss.on('connection', connection(wss));
};

export default initWebSocket;
