import config from '../config';
import { IMessage, IChatroomMessage, IPingPongMessage } from '../interfaces';
const HOST = window.location.host;
const URL = `${config.IS_PROD ? 'wss' : 'ws'}://${
	config.IS_PROD ? HOST : `${HOST.split(':')[0]}:${config.PORT_SERVER}`
}/chat`;

export interface IClientSocket {
	init: (addMessage: (message: IChatroomMessage) => void) => void;
	handleEvent: (eventName: string, callback: any) => void;
	dispatch: (event_name: string, message: any) => void;
	sendMessage: <T>(message: IMessage<T>) => void;
	registerUser: (inputUsername: string, chatroomName: string) => void;
	joinChatroom: (inputUsername: string, chatroomName: string) => void;
	getChatrooms: () => void;
	leaveChatroom: (username: string, chatroomName: string) => void;
	disconnect: (username: string, chatroomName: string) => void;
}

export const clientSocket = (): IClientSocket => {
	let ws: WebSocket | null = null;
	const callbacks: { [key: string]: ((message: any) => void)[] } = {};
	let pingTimeout: NodeJS.Timeout;

	const init = (addMessage: (message: IChatroomMessage) => void) => {
		if (ws) {
			ws.onerror = ws.onopen = ws.onclose = null;
			ws.close();
		}
		ws = new WebSocket(URL);
		ws.onerror = () => {
			addMessage({
				message: 'WebSocket error',
				username: config.SYSTEM_NAME,
			});
			console.log('WebSocket error');
		};
		ws.onopen = () => {
			console.log('WebSocket connection established');
			getChatrooms();
			heartbeat();
		};
		ws.onclose = () => {
			clearTimeout(pingTimeout);
			ws = null;
			console.log('WebSocket connection closed');
		};
		ws.onmessage = evt => {
			// on receiving a message, use dispatch method to handle event
			const { event, data } = JSON.parse(evt.data);
			dispatch(event, data);
		};
		handleEvent('ping', heartbeat);
		handleEvent('ping', pong);
	};

	const heartbeat = () => {
		clearTimeout(pingTimeout);
		pingTimeout = setTimeout(() => {
			ws?.close();
		}, 30000 + 10000);
	};

	const pong = ({ username = '' }: IPingPongMessage): void => {
		sendMessage({
			chatroomName: '',
			event: 'pong',
			data: { username },
		});
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

	const registerUser = (username: string, chatroomName: string): void => {
		sendMessage({
			chatroomName,
			event: 'register',
			data: { username },
		});
	};

	const joinChatroom = (username: string, chatroomName: string): void => {
		sendMessage({
			chatroomName,
			event: 'join',
			data: { username },
		});
	};

	const getChatrooms = (): void => {
		sendMessage({
			chatroomName: '',
			event: 'getChatrooms',
			data: {},
		});
	};

	const leaveChatroom = (username: string, chatroomName: string): void => {
		sendMessage({
			chatroomName: '',
			event: 'leaveChatroom',
			data: { username, chatroomName },
		});
	};

	const disconnect = (username: string, chatroomName: string): void => {
		sendMessage({
			chatroomName: '',
			event: 'disconnect',
			data: { username, chatroomName },
		});
		ws?.close();
	};

	return {
		init,
		handleEvent,
		dispatch,
		sendMessage,
		registerUser,
		joinChatroom,
		getChatrooms,
		leaveChatroom,
		disconnect,
	};
};
