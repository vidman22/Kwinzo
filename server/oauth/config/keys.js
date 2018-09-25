// add to .gitignore

module.exports = {
	google: {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET
	},
	facebook: {
		AppID: process.env.FACEBOOK_ID,
		AppSecret: process.env.FACEBOOK_APP_SECRET
	},
	app: {
		APP_SECRET: process.env.APP_SECRET
	}
};