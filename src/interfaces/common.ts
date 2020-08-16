export interface IMessage<T> {
	chatroomName: string;
	data: T;
	event: string;
}
export interface IChatroomMessage {
	username: string;
	message: string;
}

export interface ISocketMessage<T> {
	data: T;
	event: string;
}

export interface IChatroomDetails {
	name: string;
	color: string;
	numMembers: number;
}

export interface IChatroomDetails {
	name: string;
	color: string;
	numMembers: number;
}

export interface ILeaveChatMessage {
	username: string;
	chatroomName: string;
}

export interface IBaseChatroomResponse {
	errorMessage: string;
}

export interface IGetChatrooms extends IBaseChatroomResponse {
	chatrooms: IChatroomDetails[];
}

export interface ILeaveJoinChatroom extends IBaseChatroomResponse {
	chatroomName: string;
}

export interface IRegisterChatroom extends IBaseChatroomResponse {
	chatroomName: string;
	username: string;
}

export interface IPingPongMessage {
	username?: string;
}
