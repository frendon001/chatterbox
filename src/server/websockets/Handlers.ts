import WebSocket from 'ws';
import { IChatroomManager } from './chatroomManager';
import { IClientManager } from './ClientManager';
import { IChatroom } from './Chatroom';
import {
	ISocketMessage,
	IGetChatrooms,
	ILeaveChatMessage,
	ILeaveJoinChatroom,
	IChatroomMessage,
	IMessage,
	IPingPongMessage,
} from '../../interfaces';
import config from '../../config';

interface IEnsureValidChatroomAndUserSelected {
	chatroom: IChatroom;
	username: string;
}

export interface IMakeHandlers {
	handleMessageRouting: (client: WebSocket) => (dataString: string) => void;
	handleRegister: (data: string) => void;
	handleJoin: (data: string) => void;
	handleLeave: (data: string) => void;
	handleMessage: (data: string) => void;
	handleGetChatrooms: () => void;
	handleDisconnect: (data: string) => void;
	setHeartbeat: (dataString: string) => void;
}

const handleEventHelper = (clientId: string, clientManager: IClientManager, chatroomManager: IChatroomManager) => {
	const ensureExists: <T>(getter: () => T) => Promise<T> = getter => {
		return new Promise(function (resolve, reject) {
			try {
				resolve(getter());
			} catch (err) {
				reject(err.message);
			}
		});
	};
	const ensureUserSelected = (clientId: string) => {
		const result = ensureExists<string>(() => clientManager.getUserByClientId(clientId));

		return result;
	};
	const ensureValidChatroom = (chatroomName: string) => {
		return ensureExists<IChatroom>(() => chatroomManager.getChatroomByName(chatroomName));
	};
	const ensureValidChatroomAndUserSelected = (chatroomName: string): Promise<IEnsureValidChatroomAndUserSelected> => {
		return Promise.all([
			ensureValidChatroom(chatroomName),
			ensureUserSelected(clientId),
		]).then(([chatroom, username]) => Promise.resolve({ chatroom, username }));
	};
	const handleEvent = (chatroomName: string, createEntry: () => IChatroomMessage) => {
		return ensureValidChatroomAndUserSelected(chatroomName).then(function ({
			chatroom,
		}: IEnsureValidChatroomAndUserSelected) {
			// append event to chat history
			const entry = createEntry();
			chatroom.addEntry(entry);

			// notify other clients in chatroom
			chatroom.broadcastMessage({
				chatroomName,
				data: entry,
				event: 'chatMessage',
			});
			return chatroom;
		});
	};
	return handleEvent;
};

const makeHandlers = (
	clientId: string,
	client: WebSocket,
	clientManager: IClientManager,
	chatroomManager: IChatroomManager,
): IMakeHandlers => {
	const handleEvent = handleEventHelper(clientId, clientManager, chatroomManager);

	const handleRegister = (dataString: string) => {
		const {
			chatroomName,
			data: { username },
		}: IMessage<IChatroomMessage> = JSON.parse(dataString);
		const registerResult = {
			chatroomName,
			event: 'registerUser',
			data: { errorMessage: '', username, chatroomName },
		};
		if (!clientManager.isUserAvailable(username)) {
			registerResult.data.errorMessage = `The selected username: ${username} is unavailable. `;
		}

		clientManager.registerClient(clientId, client, username, clientManager.isAlive(clientId));
		client.send(JSON.stringify(registerResult));
	};

	const handleJoin = (dataString: string) => {
		const {
			chatroomName,
			data: { username },
		}: IMessage<IChatroomMessage> = JSON.parse(dataString);
		const createEntry = () => ({
			username: config.SYSTEM_NAME,
			message: `${username} joined ${chatroomName}`,
		});
		const joinedChatroomResult = {
			chatroomName,
			event: 'joinChatroom',
			data: { errorMessage: '', username, chatroomName },
		};
		handleEvent(chatroomName, createEntry)
			.then(function (chatroom) {
				// add member to chatroom
				chatroom.addUser(clientId, client);
				client.send(JSON.stringify(joinedChatroomResult));

				// send chat history to client
				const data = chatroom.getChatHistory();
				if (data.length) {
					const chatHistory = {
						chatroomName,
						event: 'chatHistory',
						data,
					};
					client.send(JSON.stringify(chatHistory));
				}
			})
			.catch(err => {
				joinedChatroomResult.data.errorMessage = `Unable to join chatroom: ${err.message}`;
				client.send(JSON.stringify(joinedChatroomResult));
			});
	};

	const handleLeave = (dataString: string) => {
		const {
			data: { chatroomName, username },
		}: ISocketMessage<ILeaveChatMessage> = JSON.parse(dataString);
		const createEntry = () => ({
			username: config.SYSTEM_NAME,
			message: `${username} left ${chatroomName}`,
		});
		const leaveChatroomResult: ISocketMessage<ILeaveJoinChatroom> = {
			event: 'leaveChatroom',
			data: { errorMessage: '', chatroomName: '' },
		};
		handleEvent(chatroomName, createEntry)
			.then(function (chatroom) {
				// remove member from chatroom
				chatroom.removeUser(clientId);
				client.send(JSON.stringify(leaveChatroomResult));
			})
			.catch(err => {
				leaveChatroomResult.data.chatroomName = chatroomName;
				leaveChatroomResult.data.errorMessage = `Unable to successfully leave chatroom: ${err.message}`;
				client.send(JSON.stringify(leaveChatroomResult));
			});
	};

	const handleMessage = (dataString: string) => {
		const { chatroomName, data: messageData }: IMessage<IChatroomMessage> = JSON.parse(dataString);
		const createEntry = () => ({ ...messageData });

		handleEvent(chatroomName, createEntry)
			.then()
			.catch(err => console.log('handleMessageError:', err.message));
	};

	const handleGetChatrooms = () => {
		const getChatroomResult: ISocketMessage<IGetChatrooms> = {
			event: 'getChatrooms',
			data: { errorMessage: '', chatrooms: [] },
		};
		try {
			getChatroomResult.data.chatrooms = chatroomManager.serializeChatrooms();
		} catch (err) {
			getChatroomResult.data.errorMessage = 'Unable to retrieve available chatrooms.';
		}
		client.send(JSON.stringify(getChatroomResult));
	};

	const handleDisconnect = (dataString: string) => {
		console.log('client disconnect...', clientId);
		const {
			data: { chatroomName, username },
		}: ISocketMessage<ILeaveChatMessage> = JSON.parse(dataString);
		const createEntry = () => ({
			username: config.SYSTEM_NAME,
			message: `${username} left ${chatroomName}`,
		});
		handleEvent(chatroomName, createEntry)
			.then(function (chatroom) {
				// remove member from chatroom
				chatroom.removeUser(clientId);
				// remove member from all chatrooms
				chatroomManager.removeClient(clientId);
				// remove user profile
				clientManager.removeClient(clientId);
				// client.send(JSON.stringify(leaveChatroomResult));
			})
			.catch(() => {
				// if chatroom not selected still need to remove user
				// remove user profile
				clientManager.removeClient(clientId);
			});
	};

	const handleMessageRouting = (client: WebSocket) => (dataString: string) => {
		const { event }: IMessage<null> = JSON.parse(dataString);
		switch (event) {
			case 'chatMessage':
				client.emit('chatMessage', dataString);
				break;
			case 'register':
				client.emit('register', dataString);
				break;
			case 'join':
				client.emit('join', dataString);
				break;
			case 'getChatrooms':
				client.emit('getChatrooms');
				break;
			case 'leaveChatroom':
				client.emit('leave', dataString);
				break;
			case 'disconnect':
				client.emit('disconnect', dataString);
				break;
			case 'pong':
				client.emit('pong', dataString);
				break;
			default:
				console.log(`Unmatched message event: ${event}`);
		}
	};
	const setHeartbeat = (dataString: string) => {
		const {
			data: { username },
		}: IMessage<IPingPongMessage> = JSON.parse(dataString);
		const isAlive = true;
		return clientManager.setHeartbeat(clientId, client, isAlive, username ? username : undefined);
	};

	return {
		handleMessageRouting,
		handleRegister,
		handleJoin,
		handleLeave,
		handleMessage,
		handleGetChatrooms,
		handleDisconnect,
		setHeartbeat,
	};
};

export default makeHandlers;
