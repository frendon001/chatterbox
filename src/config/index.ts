export default {
	PORT_SERVER: process.env.PORT || 3030,
	WEBSOCKET_HOST: process.env.NODE_ENV === 'production' ? window.location.host : 'localhost:3030',
	CHATROOMS: [
		{
			name: 'Aegian',
			color: '#a3ccf1',
		},
		{
			name: 'Alabaster',
			color: '#fefaf1',
		},
		{
			name: 'Cerulian',
			color: '#5fccf3',
		},
		{
			name: 'Cloud',
			color: '#e6e6e6',
		},
		{
			name: 'Daffodil',
			color: '#fdee87',
		},
		{
			name: 'Flamingo',
			color: '#ffc8d5',
		},
		{
			name: 'Sky',
			color: '#81bdda',
		},
		{
			name: 'Pistachio',
			color: '#b0d896',
		},
		{
			name: 'Ruby',
			color: '#f96b6b',
		},
		{
			name: 'Tiger',
			color: '#ffb37c',
		},
	],
};
