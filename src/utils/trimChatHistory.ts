export const trimChatHistory = <T>(chatHistory: T[], maxLength: number): T[] => {
	if (chatHistory.length === maxLength) {
		chatHistory = chatHistory.slice(maxLength / 2);
	}
	return chatHistory;
};
