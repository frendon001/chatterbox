import WebSocket from 'ws';
import { ISocketMessage, IPingPongMessage } from '../../interfaces';

export interface IClientManager {
	addClient: (clientId: string, client: WebSocket) => void;
	registerClient: (clientId: string, client: WebSocket, username: string, isAlive: boolean) => void;
	removeClient: (clientId: string) => void;
	isUserAvailable: (username: string) => boolean;
	getUserByClientId: (clientId: string) => string;
	setHeartbeat: (clientId: string, client: WebSocket, isAlive: boolean, username?: string) => void;
	isAlive: (clientId: string) => boolean;
}

const ClientManager = (): IClientManager => {
	const clients: Map<string, { client: WebSocket; username?: string; isAlive: boolean }> = new Map();

	const addClient = (clientId: string, client: WebSocket) => {
		clients.set(clientId, { client, isAlive: true });
		console.log(clients.keys());
	};

	const registerClient = (clientId: string, client: WebSocket, username: string, isAlive: boolean) => {
		clients.set(clientId, { client, username, isAlive });
	};

	const removeClient = (clientId: string) => {
		clients.delete(clientId);
	};

	const isUserAvailable = (username: string) => {
		const usersTaken = new Set(
			Array.from(clients.values())
				.filter(c => c.username)
				.map(c => c.username),
		);
		const isUsernameAllowed = '_system_' !== username;
		return !usersTaken.has(username) && isUsernameAllowed;
	};

	const getUserByClientId = (clientId: string) => {
		const username = clients.get(clientId)?.username;
		if (!username) {
			throw new Error('Username not selected');
		}
		return username;
	};

	const setHeartbeat = (clientId: string, client: WebSocket, isAlive: boolean, username?: string) => {
		clients.set(clientId, { client, username, isAlive });
	};

	const isAlive = (clientId: string): boolean => {
		return clients.get(clientId)?.isAlive ?? false;
	};

	setInterval(function ping() {
		clients.forEach(function each({ client, username, isAlive }, clientId) {
			if (isAlive === false) {
				client.terminate();
				clients.delete(clientId);
			} else {
				clients.set(clientId, { client, username, isAlive: false });
				pingClient(client, username);
			}
		});
	}, 30000);

	const pingClient = (client: WebSocket, username?: string) => {
		const ping: ISocketMessage<IPingPongMessage> = {
			event: 'ping',
			data: { username },
		};
		client.send(JSON.stringify(ping));
	};

	return {
		addClient,
		registerClient,
		removeClient,
		isUserAvailable,
		getUserByClientId,
		setHeartbeat,
		isAlive,
	};
};

export default ClientManager;
