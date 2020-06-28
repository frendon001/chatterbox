import config from '../config';
import { IMessage, IChatMessage } from '../components/Chat';

const URL = `ws://${config.WEBSOCKET_HOST}/chat`;

export interface IClientSocket {
	init: (addMessage: (message: IChatMessage) => void) => void;
	handleEvent: (eventName: string, callback: any) => void;
	dispatch: (event_name: string, message: any) => void;
	// join: (chatroomName: any, cb: any) => void;
	// leave: (chatroomName: any, cb: any) => void;
	sendMessage: <T>(message: IMessage<T>) => void;
	registerUser: (inputUsername: string, chatroomName: string) => void;
	joinChatroom: (inputUsername: string, chatroomName: string) => void;
	// getAvailableUsers: (cb: any) => void;
	// registerHandler: (onMessageReceived: any) => void;
	// unregisterHandler: () => void;
}

export const clientSocket = (): IClientSocket => {
	let ws: WebSocket | null = null;
	const callbacks: { [key: string]: ((message: any) => void)[] } = {};

	const init = (addMessage: (message: IChatMessage) => void) => {
		if (ws) {
			ws.onerror = ws.onopen = ws.onclose = null;
			ws.close();
		}
		ws = new WebSocket(URL);
		ws.onerror = () => {
			addMessage({
				message: 'WebSocket error',
				username: '',
			});
			console.log('WebSocket error');
		};
		ws.onopen = () => {
			addMessage({
				username: '',
				message: 'WebSocket connection established',
			});
			console.log('WebSocket connection established');
		};
		ws.onclose = () => {
			addMessage({
				username: '',
				message: 'WebSocket connection closed',
			});
			console.log('WebSocket connection closed');
			ws = null;
		};
		ws.onmessage = evt => {
			// on receiving a message, add it to the list of messages

			console.log(JSON.parse(evt.data));
			const { event, data } = JSON.parse(evt.data);
			// if (event === 'chatMessage') {
			// 	addMessage(data as IChatMessage);
			// } else if (event === 'chatHistory') {
			// 	addMessage(data as IChatMessage);
			// }
			dispatch(event, data);
		};
	};

	const sendMessage = <T>(message: IMessage<T>) => {
		ws?.send(JSON.stringify(message));
	};

	const handleEvent = (eventName: string, callback: any) => {
		callbacks[eventName] = callbacks[eventName] || [];
		callbacks[eventName].push(callback);
	};

	const dispatch = function (event_name: string, message: any) {
		try {
			const chain = callbacks[event_name];
			if (typeof chain == 'undefined') {
				return;
			}
			for (let i = 0; i < chain.length; i++) {
				chain[i](message);
			}
		} catch (err) {
			// TODO: update error handling
			console.log(err.message);
		}
	};

	const registerUser = (inputUsername: string, chatroomName: string): void => {
		console.log(`Added user: ${inputUsername}`);
		sendMessage({
			chatroomName,
			event: 'register',
			data: { username: inputUsername },
		});
	};

	const joinChatroom = (inputUsername: string, chatroomName: string): void => {
		console.log(`user: ${inputUsername} requesting to join ${chatroomName}`);
		sendMessage({
			chatroomName,
			event: 'join',
			data: { username: inputUsername },
		});
	};

	// const register = (cb: EventListenerOrEventListenerObject) => {
	// 	ws?.addEventListener('register', cb);
	// };

	// function registerHandler(onMessageReceived) {
	// 	// socket.on('message', onMessageReceived);
	// }

	// function unregisterHandler() {
	// 	// socket.off('message');
	// }

	// socket.on('error', function (err) {
	// 	console.log('received socket error:');
	// 	console.log(err);
	// });

	// function register(name, cb) {
	// 	socket.emit('register', name, cb);
	// }

	// function join(chatroomName, cb) {
	// 	socket.emit('join', chatroomName, cb);
	// }

	// function leave(chatroomName, cb) {
	// 	socket.emit('leave', chatroomName, cb);
	// }

	//   function message(chatroomName, msg, cb) {
	//     socket.emit('message', { chatroomName, message: msg }, cb)
	//   }

	// function getChatrooms(cb) {
	// 	socket.emit('chatrooms', null, cb);
	// }

	// function getAvailableUsers(cb) {
	// 	socket.emit('availableUsers', null, cb);
	// }

	return {
		init,
		handleEvent,
		dispatch,
		// leave,
		sendMessage,
		registerUser,
		joinChatroom,
		// registerHandler,
		// unregisterHandler,
	};
};
