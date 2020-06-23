import { IMessage, IChatMessage } from '../../components/Chat';
import WebSocket from 'ws';

export interface IChatroomMessage {
	username: string;
	message: string;
}

export interface IChatroomResult {
	broadcastMessage: (message: IMessage<IChatMessage>) => void;
	addEntry: (entry: IChatroomMessage) => void;
	getChatHistory: () => IChatroomMessage[];
	addUser: (clientId: string, client: WebSocket) => void;
	removeUser: (clientId: string) => void;
	serialize: () => {
		name: string;
		color: string;
		numMembers: number;
	};
}

export interface IChatroomInput {
	name: string;
	color: string;
}

const Chatroom = ({ name, color }: IChatroomInput): IChatroomResult => {
	const members: Map<string, WebSocket> = new Map();
	let chatHistory: IChatroomMessage[] = [];

	function broadcastMessage(message: IMessage<IChatMessage>) {
		members.forEach(m => m.send(JSON.stringify(message)));
	}

	function addEntry(entry: IChatroomMessage) {
		chatHistory = chatHistory.concat(entry);
	}

	function getChatHistory() {
		return chatHistory.slice();
	}

	function addUser(clientId: string, client: WebSocket) {
		members.set(clientId, client);
	}

	function removeUser(clientId: string) {
		members.delete(clientId);
	}

	function serialize() {
		return {
			name,
			color,
			numMembers: members.size,
		};
	}

	return {
		broadcastMessage,
		addEntry,
		getChatHistory,
		addUser,
		removeUser,
		serialize,
	};
};

export default Chatroom;
