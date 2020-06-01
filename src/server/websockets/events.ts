import WebSocket from 'ws';

export const connection = (wss: WebSocket.Server) => {
	return (ws: WebSocket): void => {
		ws.on('message', function incoming(data) {
			wss.clients.forEach(function each(client) {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});
		});
	};
};
