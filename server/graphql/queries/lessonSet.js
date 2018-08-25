const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema} = graphql;
const LessonSet = require('../../models/lessonSet');
const LessonSetType = require('../types/lessonSet');


const	lessonSet = {
		type: LessonSetType,
		args: { id: { type: GraphQLString } },
		resolve(parent, args){
			return LessonSet.findById(args.id)
		}
	}

module.exports = lessonSet;