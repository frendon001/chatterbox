import config from '../../config';
import Chatroom, { IChatroomResult } from './Chatroom';

export interface IChatroomManager {
	removeClient: (clientId: string) => void;
	getChatroomByName: (chatroomName: string) => IChatroomResult;
	serializeChatrooms: () => {
		name: string;
		color: string;
		numMembers: number;
	}[];
}

const ChatroomManger = (): IChatroomManager => {
	const chatrooms = new Map(config.CHATROOMS.map(c => [c.name, Chatroom(c)]));

	function removeClient(clientId: string) {
		chatrooms.forEach(c => c.removeUser(clientId));
	}

	function getChatroomByName(chatroomName: string) {
		const chatroom = chatrooms.get(chatroomName);
		if (!chatroom) {
			throw new Error(`Chatroom not found: ${chatroomName} `);
		}
		return chatroom;
	}

	function serializeChatrooms() {
		return Array.from(chatrooms.values()).map(c => c.serialize());
	}

	return {
		removeClient,
		getChatroomByName,
		serializeChatrooms,
	};
};

export default ChatroomManger;

// const Chatroom = require('./Chatroom')
// const chatroomTemplates = require('../config/chatrooms')

// module.exports = function () {
//   // mapping of all available chatrooms
//   const chatrooms = new Map(
//     chatroomTemplates.map(c => [
//       c.name,
//       Chatroom(c)
//     ])
//   )

//   function removeClient(client) {
//     chatrooms.forEach(c => c.removeUser(client))
//   }

//   function getChatroomByName(chatroomName) {
//     return chatrooms.get(chatroomName)
//   }

//   function serializeChatrooms() {
//     return Array.from(chatrooms.values()).map(c => c.serialize())
//   }

//   return {
//     removeClient,
//     getChatroomByName,
//     serializeChatrooms
//   }
// }
