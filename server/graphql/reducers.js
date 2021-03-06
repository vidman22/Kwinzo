const bcrypt = require('bcryptjs');
const confirmGoogleToken = require('../oauth/config/googleStrategy');
const confirmFBToken = require('../oauth/config/faceBookStrategy');
const { getUserId } = require('../oauth/config/utils');
const jwt = require('jsonwebtoken');
const keys = require('../oauth/config/keys');
const mongoose = require('../config/mongoose');
const db = mongoose();
const uuidv4 = require('uuid/v4');

const LessonSet = require('../models/lessonSet');
const User = require('../models/user');
const ReadingCompLesson = require('../models/readingCompLesson');
const ReadingOmissionLesson = require('../models/readingOmissionLesson');


var root = {
		createLessonSet: async ( {title, author, authorID, sentences}, ctx, info ) => {
	 		
	 		const lessonSet = new LessonSet({ title, author, authorID, sentences, created: Date.now() });
	 		return await lessonSet.save(); 
	 		if (!lessonSet) {
      			throw new Error('Error');
   			}	
	 	},
		createReadingOmissionLesson: async ( {title, author, authorID, text, omissions}, ctx, info ) => {
			
			const readingOmissionLesson = new ReadingOmissionLesson({title, author, authorID, text, omissions, created: Date.now()});
			return await readingOmissionLesson.save(); 
			if (!readingOmissionLesson) {
				throw new Error('Error');
			}
		},
		createReadingCompLesson: async ( {title, author, authorID, text, questions}, ctx, info ) => {
			
			
			const readingCompLesson = new ReadingCompLesson({title, author, authorID, text, questions, created: Date.now()});
			return await readingCompLesson.save(); 
			if (!readingCompLesson) {
				throw new Error('Error');
			}
		},
		deleteOmissionLesson: async (args, ctx, info ) => {
			
			return await ReadingOmissionLesson.findByIdAndDelete( args.id , (err) => {
				if (err) {
					throw err 
					
				} else return true
			});
		},
		deleteCompLesson: async (args, ctx, info ) => {
			
			return await ReadingCompLesson.findByIdAndDelete( args.id , (err) => {
				if (err) {
					throw err 
				
				} else return true
			});
		},
		deleteInputLesson: async (args, ctx, info ) => {
			// const userID = getUserId(ctx.headers.authorization);

			// if (!userID) {
			// 	throw new Error('Not authenticated')
			// }

			return await LessonSet.findByIdAndDelete( args.id , (err) => {
				if (err) {
					throw err 
					
				} else return true
			});
		},
	 	lessonSet: async (args, ctx, info ) => {
	 		return await LessonSet.findById(args.id);
	 	},
	 	lessonSets: async (args, ctx, info) => {
	 		return await LessonSet.find();
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
			
	 		const token = jwt.sign({ userID: user.userID }, keys.app.APP_SECRET, {expiresIn: '12hr'});
	 		const expiresIn = 7200;
	 		return {
    			token,
    			expiresIn,
    			user
  			}
	 	},
	 	oAuthSignIn: async ({ type, email, username, picture, userID, token, expiresIn}) => {
		
			 let user = await User.findOne({ email });
			//  ================================
			// Enable when keys work
			// let checkedToken;
			//  if (type === 'google'){
			// 	checkedToken = await confirmGoogleToken(token);
			//  } else {
			// 	 checkedToken = await confirmFBToken(token);
			//  }
			
	 		if (!user ) {
	 			user = new User({email, username, picture, userID, joined: Date.now() });
	 			await user.save(); 
	 		} return {
	 			token,
	 			expiresIn,
	 			user
	 		}
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
	 	signUp: async ({ username, email, password }, ctx, info) => {

	 		const hash = await bcrypt.hash(password, 12 );
	 		const userID = uuidv4();
	 		const user = new User({username, userID, email, picture: false, password: hash, joined: Date.now()});
	 		
	 		const existingUser = await User.findOne({ email });

	 		if ( existingUser) {
	 			throw new Error('Email already used');
	 		} else {
	 			await user.save();

	 			const token = jwt.sign({ userID }, keys.app.APP_SECRET, {expiresIn: '12hr'});
	 			const expiresIn = 7200;

  				return {
   			 		token,
   			 		expiresIn,
    				user
  				}			
	 		}
		 },
		updateLesson: async (args, ctx, info) => {
			
			return await LessonSet.findByIdAndUpdate(args.lessonID, {$set: { title: args.title, author: args.author, authorID: args.authorID, sentences: args.sentences, updated: Date.now() }}, {new: true}, function (err, lessonset){
				if (err) return err;
			});
			
		},
	 	user: async ({_id}) => {
	 		return await User.findById(_id)
		},
		userCompLessons: async (authorID) => {
			return await ReadingCompLesson.find(authorID);
		},
		userOmissionLessons: async (authorID) => {
			return await ReadingOmissionLesson.find(authorID);
		},
	 	userLessons: async ( authorID ) => {
	 		return await LessonSet.find(authorID);
	 	}
};

module.exports = root;