export default {
	PORT_SERVER: process.env.PORT || 3030,
	WEBSOCKET_HOST: process.env.NODE_ENV === 'production' ? window.location.host : 'localhost:3030',
	CHATROOMS: [
		{
			name: 'Aegian',
			color: '#517ca3',
		},
		{
			name: 'Alabaster',
			color: '#fefaf1',
		},
		{
			name: 'Cerulian',
			color: '#0691c2',
		},
		{
			name: 'Cloud',
			color: '#bebec7',
		},
		{
			name: 'Daffodil',
			color: '#fdee87',
		},
		{
			name: 'Flamingo',
			color: '#fda4b8',
		},
		{
			name: 'Periwinkle',
			color: '#9865c5',
		},
		{
			name: 'Pistachio',
			color: '#2d3c2',
		},
		{
			name: 'Ruby',
			color: '#bc5449',
		},
		{
			name: 'Tiger',
			color: '#ffb38b',
		},
	],
};
