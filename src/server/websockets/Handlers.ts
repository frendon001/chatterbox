import WebSocket from 'ws';
import { IChatroomManager } from './chatroomManager';
import { IClientManager } from './ClientManager';
import { IChatroom, IChatroomMessage } from './Chatroom';
import { IMessage, IChatMessage } from '../../components/Chat';
import { ISocketMessage, IGetChatrooms, ILeaveChatMessage, ILeaveJoinChatroom } from '../../interfaces';

interface IEnsureValidChatroomAndUserSelected {
	chatroom: IChatroom;
	username: string;
}

export interface IMakeHandlers {
	handleMessageRouting: (client: WebSocket) => (dataString: string) => void;
	handleRegister: (username: string) => void;
	handleJoin: (chatroomName: string, username: string) => void;
	handleLeave: (chatroomName: string, username: string) => void;
	handleMessage: (data: string) => void;
	handleGetChatrooms: () => void;
	handleDisconnect: () => void;
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
		}: IMessage<IChatMessage> = JSON.parse(dataString);
		const registerResult = {
			chatroomName,
			event: 'registerUser',
			data: { errorMessage: '', username, chatroomName },
		};
		if (!clientManager.isUserAvailable(username)) {
			registerResult.data.errorMessage = `The selected username: ${username} is unavailable. `;
		}

		clientManager.registerClient(clientId, client, username);
		client.send(JSON.stringify(registerResult));
	};

	const handleJoin = (dataString: string) => {
		const {
			chatroomName,
			data: { username },
		}: IMessage<IChatMessage> = JSON.parse(dataString);
		const createEntry = () => ({
			username,
			message: `joined ${chatroomName}`,
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
			username,
			message: `left ${chatroomName}`,
		});
		const leaveChatroomResult: ISocketMessage<ILeaveJoinChatroom> = {
			event: 'leaveChatroom',
			data: { errorMessage: '', chatroomName: '' },
		};
		handleEvent(chatroomName, createEntry)
			.then(function (chatroom) {
				// remove member from chatroom
				chatroom.removeUser(clientId);
				console.log(JSON.stringify(leaveChatroomResult));
				client.send(JSON.stringify(leaveChatroomResult));
			})
			.catch(err => {
				leaveChatroomResult.data.chatroomName = chatroomName;
				leaveChatroomResult.data.errorMessage = `Unable to successfully leave chatroom: ${err.message}`;
				client.send(JSON.stringify(leaveChatroomResult));
			});
	};

	const handleMessage = (dataString: string) => {
		const { chatroomName, data: messageData }: IMessage<IChatMessage> = JSON.parse(dataString);
		const createEntry = () => ({ ...messageData });

		handleEvent(chatroomName, createEntry)
			.then()
			.catch(err => console.log(err));
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

	const handleDisconnect = () => {
		// remove member from all chatrooms
		chatroomManager.removeClient(clientId);
		// remove user profile
		clientManager.removeClient(clientId);
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
			default:
				console.log(`Unmatched message event: ${event}`);
		}
	};

	return {
		handleMessageRouting,
		handleRegister,
		handleJoin,
		handleLeave,
		handleMessage,
		handleGetChatrooms,
		handleDisconnect,
	};
};

export default makeHandlers;
