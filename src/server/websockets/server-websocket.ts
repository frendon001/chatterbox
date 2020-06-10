import WebSocket from 'ws';
// import uuid from 'uuid';

import ClientManager from './ClientManager';
import ChatroomManager from './chatroomManager';
import makeHandlers from './Handlers';

const clientManager = ClientManager();
const chatroomManager = ChatroomManager();

export const connection = (wss: WebSocket.Server) => {
	return ({
		client,
		clientId,
	}: {
		client: WebSocket;
		clientId: string;
	}): void => {
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

		client.on('chatrooms', handleGetChatrooms);

		client.on('isUserAvailable', isUserAvailable);

		client.on('disconnect', function () {
			console.log('client disconnect...', clientId);
			handleDisconnect();
		});

		client.on('error', function (err) {
			console.log('received error from client:', clientId);
			console.log(err);
		});
		// ws.on('message', function incoming(data) {
		// 	wss.clients.forEach(function each(client) {
		// 		if (client !== ws && client.readyState === WebSocket.OPEN) {
		// 			client.send(data);
		// 		}
		// 	});
		// });
	};
};

// const clientManager = ClientManager()
// const chatroomManager = ChatroomManager()

// io.on('connection', function (client) {
//   const {
//     handleRegister,
//     handleJoin,
//     handleLeave,
//     handleMessage,
//     handleGetChatrooms,
//     handleGetAvailableUsers,
//     handleDisconnect
//   } = makeHandlers(client, clientManager, chatroomManager)

//   console.log('client connected...', client.id)
//   clientManager.addClient(client)

//   client.on('register', handleRegister)

//   client.on('join', handleJoin)

//   client.on('leave', handleLeave)

//   client.on('message', handleMessage)

//   client.on('chatrooms', handleGetChatrooms)

//   client.on('availableUsers', handleGetAvailableUsers)

//   client.on('disconnect', function () {
//     console.log('client disconnect...', client.id)
//     handleDisconnect()
//   })

//   client.on('error', function (err) {
//     console.log('received error from client:', client.id)
//     console.log(err)
//   })
// })
