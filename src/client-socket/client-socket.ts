import { config } from '../config';
import { IMessage } from '../components/Chat';

const URL = `ws://${config.WEBSOCKET_HOST}/chat`;

export interface IClientSocket {
	init: (addMessage: (message: IMessage) => void) => void;
	// register: (name: any, cb: any) => void;
	// join: (chatroomName: any, cb: any) => void;
	// leave: (chatroomName: any, cb: any) => void;
	sendMessage: (message: IMessage) => void;
	// getChatrooms: (cb: any) => void;
	// getAvailableUsers: (cb: any) => void;
	// registerHandler: (onMessageReceived: any) => void;
	// unregisterHandler: () => void;
}

export const clientSocket = (): IClientSocket => {
	let ws: WebSocket | null = null;

	const init = (addMessage: (message: IMessage) => void) => {
		if (ws) {
			ws.onerror = ws.onopen = ws.onclose = null;
			ws.close();
		}
		ws = new WebSocket(URL);
		ws.onerror = () => {
			addMessage({ username: '', message: 'WebSocket error' });
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
			const message = JSON.parse(evt.data);
			addMessage(message);
		};
		// ws.on('error', function (err) {
		// 	console.log('received socket error:');
		// 	console.log(err);
		// });
	};

	const sendMessage = (message: IMessage) => {
		ws?.send(JSON.stringify(message));
	};

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
		// register,
		// join,
		// leave,
		sendMessage,
		// getChatrooms,
		// getAvailableUsers,
		// registerHandler,
		// unregisterHandler,
	};
};
