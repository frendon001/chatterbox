import WebSocket from 'ws';

import ClientManager from './ClientManager';
import ChatroomManager from './chatroomManager';
import makeHandlers from './Handlers';

const clientManager = ClientManager();
const chatroomManager = ChatroomManager();

export const handleConnection = ({ client, clientId }: { client: WebSocket; clientId: string }): void => {
	const {
		handleMessageRouting,
		handleRegister,
		handleJoin,
		handleLeave,
		handleMessage,
		handleGetChatrooms,
		isUserAvailable,
		handleDisconnect,
	} = makeHandlers(clientId, client, clientManager, chatroomManager);

	console.log('client connected...', clientId);
	clientManager.addClient(clientId, client);

	client.on('register', handleRegister);

	client.on('join', handleJoin);

	client.on('leave', handleLeave);

	client.on('message', handleMessageRouting(client));

	client.on('chatMessage', handleMessage);

	client.on('getChatrooms', handleGetChatrooms);

	client.on('isUserAvailable', isUserAvailable);

	client.on('disconnect', function () {
		console.log('client disconnect...', clientId);
		handleDisconnect();
	});

	client.on('error', function (err) {
		console.log('received error from client:', clientId);
		console.log(err);
	});
};
