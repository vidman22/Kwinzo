const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLList} = graphql;
const LessonSet = require('../../models/lessonSet');
const LessonSetType = require('../types/lessonSet');


		const	lessonSets = {
				type: new GraphQLList(LessonSetType),
			resolve(){
				const sets = LessonSet.find();
				if (!sets) {
					throw new Error('Error')
				}
				return sets
			  }
		    }

module.exports = lessonSets;