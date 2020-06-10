import WebSocket from 'ws';

export interface IClientManager {
	addClient: (clientId: string, client: WebSocket) => void;
	registerClient: (
		clientId: string,
		client: WebSocket,
		username: string,
	) => void;
	removeClient: (clientId: string) => void;
	isUserAvailable: (username: string) => boolean;
	getUserByClientId: (clientId: string) => string;
}

const ClientManager = (): IClientManager => {
	const clients: Map<
		string,
		{ client: WebSocket; username?: string }
	> = new Map();

	const addClient = (clientId: string, client: WebSocket) => {
		clients.set(clientId, { client });
		console.log(clients.keys());
	};

	const registerClient = (
		clientId: string,
		client: WebSocket,
		username: string,
	) => {
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

// const userTemplates = require('../config/users')

// module.exports = function () {
//   // mapping of all connected clients
//   const clients = new Map()

//   function addClient(client) {
//     clients.set(client.id, { client })
//   }

//   function registerClient(client, user) {
//     clients.set(client.id, { client, user })
//   }

//   function removeClient(client) {
//     clients.delete(client.id)
//   }

//   function getAvailableUsers() {
//     const usersTaken = new Set(
//       Array.from(clients.values())
//         .filter(c => c.user)
//         .map(c => c.user.name)
//     )
//     return userTemplates
//       .filter(u => !usersTaken.has(u.name))
//   }

//   function isUserAvailable(userName) {
//     return getAvailableUsers().some(u => u.name === userName)
//   }

//   function getUserByName(userName) {
//     return userTemplates.find(u => u.name === userName)
//   }

//   function getUserByClientId(clientId) {
//     return (clients.get(clientId) || {}).user
//   }

//   return {
//     addClient,
//     registerClient,
//     removeClient,
//     getAvailableUsers,
//     isUserAvailable,
//     getUserByName,
//     getUserByClientId
//   }
// }
