const mongoose = require('../config/mongoose');
const db = mongoose();
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const LessonSet = require('../models/lessonSet');
const User = require('../models/user');
const ReadingCompLesson = require('../models/readingCompLesson');
const ReadingOmissionLesson = require('../models/readingOmissionLesson');

const { getUserId } = require('../oauth/config/utils');
const keys = require('../oauth/config/keys');
const APP_SECRET = keys.app.APP_SECRET;


var root = {
		deleteLesson: async (args, ctx, info ) => {
			const userID = getUserId(ctx.headers.authorization);

			if (!userID) {
				throw new Error('Not authenticated')
			}
			
			return await LessonSet.deleteOne({ userID }, (err) => {
				if (err) {
					throw err 
					return false
				} else return true
			});
		},
		updateLesson: async (args, ctx, info ) => {

		},
	 	lessonSet: async (args, ctx, info ) => {
	 		return await LessonSet.findById(args.id);
	 	},
	 	lessonSets: async (args, ctx, info) => {
	 		return await LessonSet.find();
	 	},
	 	readingOmissionLessons: async ( args, ctx, info) => {
	 		return await ReadingOmissionLesson.find();
	 	},
	 	readingOmissionLesson: async ( args, ctx, info) => {
	 		return await ReadingOmissionLesson.findById(args.id);
	 	},
	 	readingCompLessons: async (args, ctx, info) => {
	 		return await ReadingCompLesson.find();
	 	},
	 	readingCompLesson: async (args, ctx, info) => {
	 		return await ReadingCompLesson.findById(args.id);
	 	},
	 	user: async ({_id}) => {
	 		return await User.findById(_id)
	 	},
	 	userLessons: async ( authorID ) => {
	 		return await LessonSet.find(authorID);
	 	},
	 	createLessonSet: async ( {title, author, authorID, sentences}, ctx, info ) => {
	 		const termNumber = sentences.length;
	 		const lessonSet = new LessonSet({ title, author, authorID, sentences, termNumber, created: Date.now });
	 		return await lessonSet.save(); 
	 		if (!lessonSet) {
      			throw new Error('Error');
   			}	
	 	},
	 	createReadingOmissionLesson: async ( {title, author, authorID, text, omissions}, ctx, info ) => {
			const numberOfOmissions = omissions.length;
			const readingOmissionLesson = new ReadingOmissionLesson({title, author, authorID, text, omissions, created: Date.now});
			return await readingOmissionLesson.save(); 
			if (!readingOmissionLesson) {
				throw new Error('Error');
			}
		},
		createReadingCompLesson: async ( {title, author, authorID, text, questions}, ctx, info ) => {
			const numberOfQuestions = questions.length;
			const readingCompLesson = new ReadingCompLesson({title, author, authorID, text, questions, created: Date.now});
			return await readingCompLesson.save(); 
			if (!readingCompLesson) {
				throw new Error('Error');
			}
		},
	 	signUp: async ({ username, email, password }, ctx, info) => {

	 		const hash = await bcrypt.hash(password, 12 );
	 		const userID = uuidv4();
	 		const user = new User({username, userID, email, picture: false, password: hash, joined: Date.now});
	 		

	 		const existingUser = await User.findOne({ email });

	 		if ( existingUser) {
	 			throw new Error('Email already used');
	 		} else {
	 			await user.save();

	 			const token = jwt.sign({ userID }, APP_SECRET, {expiresIn: '12hr'});
	 			const expiresIn = 7200;

  				return {
   			 		token,
   			 		expiresIn,
    				user
  				}			
	 		}
	 	},
	 	login: async ({email, password}) => {
	 		
	 		const user = await User.findOne({ email });

	 		if (!user) {
	 			throw new Error('Email not found');
	 		}
	 		const validPassword = await bcrypt.compare(password, user.password);
	 		if (!validPassword) {
	 			throw new Error('Password is incorrect');
	 		}
	 		const token = jwt.sign({ userID: user.userID }, APP_SECRET, {expiresIn: '12hr'});
	 		const expiresIn = 7200;

	 		return {
    			token,
    			expiresIn,
    			user
  			}
	 	},
	 	oAuthSignIn: async ({ email, username, picture, userID, token, expiresIn}) => {

	 		let user = await User.findOne({ email });

	 		// token = jwt.sign({ userID }, APP_SECRET, {expiresIn: '12hr'});

	 		if (!user ) {
	 			user = new User({email, username, picture, userID, joined: Date.now });
	 			await user.save(); 
	 		} return {
	 			token,
	 			expiresIn,
	 			user
	 		}
	 	}
};

module.exports = root;