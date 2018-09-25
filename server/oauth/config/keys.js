// add to .gitignore

module.exports = {
	google: {
		clientID: process.env.GOOGLE_CLIENT_ID || '99023560874-es09obh5s0o70hd5j3lstp9lagsq395d.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'bGaLZKhXjgpMbLiLj9JqH9Mr',
	},
	facebook: {
		AppID: process.env.FACEBOOK_ID || '652524795116405',
		AppSecret: process.env.FACEBOOK_APP_SECRET || '397b7ab8a8ab852662780ba7ee64bb01',
	},
	app: {
		APP_SECRET: process.env.APP_SECRET || 'sooper-dooper-pooper-scooper',
	}
};