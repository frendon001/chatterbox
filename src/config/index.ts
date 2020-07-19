const PORT_SERVER = Number(process.env.PORT) || 3030;
const HOST = process.env.HOST_NAME || '0.0.0.0';
const ENVIRONMENT = process.env.NODE_ENV === 'production' ? true : false;
const CHATROOMS = [
	{
		name: 'Aegean',
		color: '#a3ccf1',
	},
	{
		name: 'Alabaster',
		color: '#fefaf1',
	},
	{
		name: 'Cerulean',
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
];
const SYSTEM_NAME = '_system_';

export default {
	PORT_SERVER,
	HOST,
	ENVIRONMENT,
	CHATROOMS,
	SYSTEM_NAME,
};
