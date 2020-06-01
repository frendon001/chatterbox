export const config = {
	PORT_SERVER: process.env.PORT || 3030,
	WEBSOCKET_HOST:
		process.env.NODE_ENV === 'production'
			? window.location.host
			: 'localhost:3030',
};
