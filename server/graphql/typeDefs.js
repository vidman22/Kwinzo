const { buildSchema } = require('graphql');

const schema = buildSchema(`
	type Query {
		lessonSet(id: String): LessonSet
		lessonSets: [LessonSet]
		user(id: String! ): User
		userLessons( authorID: String! ): [LessonSet]
		readingCompLessons: [ReadingCompLesson]
		readingCompLesson(id: String): ReadingCompLesson
		readingOmissionLessons: [ReadingOmissionLesson]
		readingOmissionLesson(id: String): ReadingOmissionLesson
	}

	type LessonSet {
		id: String!
		created: Date
		updated: Date
		title: String!
		author: String!
		authorID: String!
		sentences: [Sentence]
		termNumber: Int
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
		termNumber: Int
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
		termNumber: Int
	}

	type Question {
		question: String!
		correctOption: Int
		checkedOption: Int
		options: [String]
	}


	input QuestionInput {
		question: String!
		correctOption: Int
		checkedOption: Int
		options: [String]
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
		id: String
		joined: Date
		email: String!
		username: String!
		password: String
		userID: String!
		picture: String
	}

	scalar Date


	type Mutation {
		createReadingOmissionLesson(title: String!, author: String!, authorID: String!, text: String!, omissions: [OmissionInput] ): ReadingOmissionLesson
		createReadingCompLesson(title: String!, author: String!, authorID: String!, text: String!, questions: [QuestionInput] ): ReadingCompLesson
		createLessonSet(title: String!, author: String!, authorID: String!, sentences: [SentenceInput] ): LessonSet
		signUp( username: String! , email: String!, password: String! ): AuthPayload
		login( email: String!, password: String! ) : AuthPayload
		deleteLesson( id: String! ) : Boolean
		oAuthSignIn(email: String!, username: String!, picture: String, userID: String!, token: String!, expiresIn: String! ): AuthPayload
	}
`);



module.exports =  schema;