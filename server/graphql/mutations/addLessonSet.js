
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLString = require('graphql').GraphQLString;
// var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
// var LessonSetType = require('../types/lessonSet');
var LessonSet = require('../../models/lessonSet');

exports.addLessonSet = {
  type: LessonSetType,
  args: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    author: {
      type: new GraphQLNonNull(GraphQLString),
    },
    sentences: {
      type: new GraphQLList(GraphQLString),
    }
  },
  resolve(root, args) {
    const sModel = new LessonSet(args);
    const newSet = sModel.save();
    if (!newSet) {
      throw new Error('Error');
    }
    return newSet
  }
}