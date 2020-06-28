import WebSocket from 'ws';

export interface IClientManager {
	addClient: (clientId: string, client: WebSocket) => void;
	registerClient: (clientId: string, client: WebSocket, username: string) => void;
	removeClient: (clientId: string) => void;
	isUserAvailable: (username: string) => boolean;
	getUserByClientId: (clientId: string) => string;
}

const ClientManager = (): IClientManager => {
	const clients: Map<string, { client: WebSocket; username?: string }> = new Map();

	const addClient = (clientId: string, client: WebSocket) => {
		clients.set(clientId, { client });
		console.log(clients.keys());
	};

	const registerClient = (clientId: string, client: WebSocket, username: string) => {
		console.log(clientId, username);
		clients.set(clientId, { client, username });
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
		console.log(usersTaken, usersTaken.has(username));
		return !usersTaken.has(username);
	};

	const getUserByClientId = (clientId: string) => {
		const username = clients.get(clientId)?.username;
		if (!username) {
			throw new Error('Username not selected');
		}
		return username;
	};

	return {
		addClient,
		registerClient,
		removeClient,
		isUserAvailable,
		getUserByClientId,
	};
};

export default ClientManager;
