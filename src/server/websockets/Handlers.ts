import WebSocket from 'ws';
import { IChatroomManager } from './chatroomManager';
import { IClientManager } from './ClientManager';
import { IChatroomResult, IChatroomMessage } from './Chatroom';
import { IMessage, IChatMessage } from '../../components/Chat';

interface IEnsureValidChatroomAndUserSelected {
	chatroom: IChatroomResult;
	username: string;
}

export interface IMakeHandlers {
	handleMessageRouting: (client: WebSocket) => (dataString: string) => void;
	handleRegister: (username: string) => void;
	handleJoin: (chatroomName: string, username: string) => void;
	handleLeave: (chatroomName: string, username: string) => void;
	handleMessage: (data: string) => void;
	handleGetChatrooms: () => void;
	isUserAvailable: (username: string) => void;
	handleDisconnect: () => void;
}

const handleEventHelper = (
	clientId: string,
	clientManager: IClientManager,
	chatroomManager: IChatroomManager,
) => {
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
		const result = ensureExists<string>(() =>
			clientManager.getUserByClientId(clientId),
		);

		return result;
	};
	const ensureValidChatroom = (chatroomName: string) => {
		return ensureExists<IChatroomResult>(() =>
			chatroomManager.getChatroomByName(chatroomName),
		);
	};
	const ensureValidChatroomAndUserSelected = (
		chatroomName: string,
	): Promise<IEnsureValidChatroomAndUserSelected> => {
		return Promise.all([
			ensureValidChatroom(chatroomName),
			ensureUserSelected(clientId),
		]).then(([chatroom, username]) =>
			Promise.resolve({ chatroom, username }),
		);
	};
	const handleEvent = (
		chatroomName: string,
		createEntry: () => IChatroomMessage,
	) => {
		return ensureValidChatroomAndUserSelected(chatroomName).then(function ({
			chatroom,
			username,
		}: IEnsureValidChatroomAndUserSelected) {
			// append event to chat history
			const entry = createEntry();
			chatroom.addEntry(entry);
			console.log(username);

			// notify other clients in chatroom
			chatroom.broadcastMessage({
				chatroomName,
				data: entry,
				type: 'chatMessage',
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
	const handleEvent = handleEventHelper(
		clientId,
		clientManager,
		chatroomManager,
	);

	const handleRegister = (dataString: string) => {
		const {
			data: { username },
		}: IMessage<IChatMessage> = JSON.parse(dataString);
		if (!clientManager.isUserAvailable(username))
			console.log('user is not available');

		clientManager.registerClient(clientId, client, username);
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

		handleEvent(chatroomName, createEntry)
			.then(function (chatroom) {
				// add member to chatroom
				chatroom.addUser(clientId, client);

				// send chat history to client
				const data = chatroom.getChatHistory();
				console.log('CHATHISTORY', data);
				if (data.length) {
					const chatHistory = {
						chatroomName,
						type: 'chatHistory',
						data,
					};
					client.send(JSON.stringify(chatHistory));
				}
			})
			.catch(err => console.log(err));
	};

	const handleLeave = (chatroomName: string, username: string) => {
		const createEntry = () => ({
			username,
			message: `left ${chatroomName}`,
		});

		handleEvent(chatroomName, createEntry)
			.then(function (chatroom) {
				// remove member from chatroom
				chatroom.removeUser(clientId);
			})
			.catch(err => console.log(err));
	};

	const handleMessage = (dataString: string) => {
		console.log('chatMessage');
		const {
			chatroomName,
			data: messageData,
		}: IMessage<IChatMessage> = JSON.parse(dataString);
		const createEntry = () => ({ ...messageData });
		console.log(`Entry: ${JSON.stringify(createEntry())}`);

		handleEvent(chatroomName, createEntry)
			.then()
			.catch(err => console.log(err));
	};

	const handleGetChatrooms = () => {
		console.log(chatroomManager.serializeChatrooms());
	};

	const isUserAvailable = (username: string) => {
		console.log(clientManager.isUserAvailable(username));
	};

	const handleDisconnect = () => {
		// remove user profile
		clientManager.removeClient(clientId);
		// remove member from all chatrooms
		chatroomManager.removeClient(clientId);
	};

	const handleMessageRouting = (client: WebSocket) => (
		dataString: string,
	) => {
		console.log(dataString);
		const { type }: IMessage<null> = JSON.parse(dataString);
		switch (type) {
			case 'chatMessage':
				console.log('test');
				client.emit('chatMessage', dataString);
				break;
			case 'register':
				client.emit('register', dataString);
				break;
			case 'join':
				client.emit('join', dataString);
				break;
			default:
				console.log(`Unmatched message type: ${type}`);
		}
	};

	return {
		handleMessageRouting,
		handleRegister,
		handleJoin,
		handleLeave,
		handleMessage,
		handleGetChatrooms,
		isUserAvailable,
		handleDisconnect,
	};
};

export default makeHandlers;
