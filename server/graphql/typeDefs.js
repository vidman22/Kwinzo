const { buildSchema } = require('graphql');

const schema = buildSchema(`
	type Query {
		quiz(uniqid: String!): Quiz
		quizzes: [Quiz]
		user(id: String! ): User
		userQuizzes( authorID: String! ): [Quiz]
		userCompLessons( authorID: String! ): [ReadingCompLesson]
		userOmissionLessons( authorID: String! ): [ReadingOmissionLesson]
		readingCompLessons: [ReadingCompLesson]
		readingCompLesson(id: String): ReadingCompLesson
		readingOmissionLessons: [ReadingOmissionLesson]
		readingOmissionLesson(id: String): ReadingOmissionLesson
	
	}

	type Quiz {
		id: Int
		created_at: Date
		updated_at: Date
		title: String!
		authorID: Int!
		username: String
		uniqid: String!
		sentences: [Sentence]
	}

	input SentenceInput {
		sentence: String
		answer: String
		hint: String
		alts: [String]
	}

	type Sentence {
		sentence: String!
		answer: String!
		hint: String!
		alts: [String]
	}

	type ReadingOmissionLesson {
		id: String!
		created: Date
		updated: Date
		title: String!
		author: String!
		authorID: String!
		text: String!
		omissions: [Omission]!
		
	}

	type Omission {
		omission: String!
		hint: String!
	}

	input OmissionInput {
		omission: String!
		hint: String!
	}

	type ReadingCompLesson {
		id: String!
		created: Date
		updated: Date
		title: String!
		author: String!
		authorID: String!
		text: String!
		questions: [Question]!
		
	}

	type Question {
		question: String!
		correctOption: Int
		checkedOption: Int
		options: [String]
		highlight: String
	}


	input QuestionInput {
		question: String!
		correctOption: Int
		checkedOption: Int
		options: [String]
		highlight: String
	}

	type Meta {
		votes: Int
		favs: Int
	}

	type AuthPayload {
  		token: String
  		expiresIn: Int
  		user: User
	}

	type User {
		id: Int
		email: String!
		username: String!
		password: String
		uuid: String!
		picture: String
	}

	type Pin { title: String!, link: String!, image: String!, id: Int! }

	scalar Date


	type Mutation {
		
		createReadingOmissionLesson(title: String!, author: String!, authorID: String!, text: String!, omissions: [OmissionInput] ): ReadingOmissionLesson
		createReadingCompLesson(title: String!, author: String!, authorID: String!, text: String!, questions: [QuestionInput] ): ReadingCompLesson
		createQuiz(title: String!, authorID: Int, sentences: [SentenceInput] ): Quiz
		signUp( username: String! , email: String!, password: String! ): AuthPayload
		login( email: String!, password: String! ) : AuthPayload
		deleteCompLesson( id: String! ) : Boolean
		deleteQuiz( id: String! ) : Boolean
		deleteOmissionLesson( id: String! ) : Boolean
		oAuthSignIn(email: String!, username: String!, picture: String, uuid: String!, token: String!, expiresIn: String! ): AuthPayload
		updateLesson(lessonID: String, title: String, author: String, authorID: String, sentences: [SentenceInput]) : Quiz
	}
`);

module.exports =  schema;
