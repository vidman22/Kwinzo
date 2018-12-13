const bcrypt = require('bcryptjs');
const confirmGoogleToken = require('../oauth/config/googleStrategy');
const jwt = require('jsonwebtoken');
const keys = require('../oauth/config/keys');

const uuidv4 = require('uuid/v4');
const newUniqid = require('uniqid');

const database = require('../config/config');

var root = {

        createQuiz: async ( {title, authorID, sentences}, ctx, info ) => {
            const uniqid = newUniqid();
            console.log('uniqid', uniqid);
            const created_at = new Date();
            const [quiz] = await database("quizzes")
            .returning(["id", "title", "sentences", "created_at", "uniqid", "authorID"])
            .insert({ title, sentences, created_at, authorID, uniqid });
          return quiz;
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
        deleteQuiz: async (args, ctx, info ) => {
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
        quiz: async ({uniqid}, ctx, info ) => {
            console.log("uniqid", uniqid);
            const [quiz] = await database('quizzes').where("uniqid", uniqid);
            console.log("quiz", quiz);
            return quiz;
        },
        quizzes: async (args, ctx, info) => {
            console.log('ls fired');
            const quizzes =  await database.select('*').from('quizzes').leftJoin('users', 'authorID', 'users.id');
            console.log('quizzes', quizzes);
            return quizzes;
        },
        login: async ({email, password}) => {
            const [user] = await database('users').where("email", email );
        
            if (!user) {
                throw new Error('Email not found');
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new Error('Password is incorrect');
            }
        
            const token = jwt.sign({ userID: user.uuid }, keys.app.APP_SECRET, {expiresIn: '12hr'});
            const expiresIn = 7200;
            return {
               token,
               expiresIn,
               user
             }
        },
        oAuthSignIn: async ({ email, username, picture, userID, token, expiresIn}) => {
        
            let [user] = await database('users').where("email", email );
           //  ================================
           // Enable when keys work
           // let checkedToken;
           //  if (type === 'google'){
           // 	checkedToken = await confirmGoogleToken(token);
           //  } else {
           // 	 checkedToken = await confirmFBToken(token);
           //  }
            // console.log('oauth user', user);
            const uuid = uuidv4();
            if (!user ) {
                [user] = await database('users')
                    .returning(['id', 'username', 'email', 'picture', 'uuid'])
                    .insert([{username, email, picture, uuid }]) 
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
            const uuid = uuidv4();
            const [existingUser] = await database('users').where("email", email );
            // console.log('existing user', existingUser);
            if ( existingUser) {
                throw new Error('Email already used');
            } else {
                const [user] = await database('users')
                    .returning(['id', 'username', 'email', 'picture', 'uuid'])
                    .insert([{username, email, password: hash, picture: false, uuid }])
            
                const token = jwt.sign({ uuid }, keys.app.APP_SECRET, {expiresIn: '12hr'});
                const expiresIn = 7200;
                console.log('user', user);
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
        user: async ({uuid}) => {
            console.log("uuid", uuid);
            const [user] = await database('users').where("uuid", uuid);
            console.log("user", user);
            return user;
        },
        userCompLessons: async (authorID) => {
           return await ReadingCompLesson.find(authorID);
        },
        userOmissionLessons: async (authorID) => {
           return await ReadingOmissionLesson.find(authorID);
        },
        userQuizzes: async (uuid ) => {
            console.log('uuid', uuid.authorID);
            // const [user] = await database('users').where("uuid", uuid.authorID);
            // console.log('user', user);
            //const id = user.id;
            const userQuizzes = await database('quizzes').where("authorID", uuid.authorID);
            return userQuizzes;
        }
};

module.exports = root;