export const config = {
	PORT_SERVER: process.env.PORT || 3030,
	PORT_CLIENT:
		process.env.NODE_ENV === 'production'
			? window.location.host
			: 'localhost:3000',
};
