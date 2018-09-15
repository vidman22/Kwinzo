var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
	question: String,
	correctOption: Number,
	checkedOption: Number,
	options: [String],
});

var readingCompLessonSchema = new Schema({
	title: String,
	author: String,
	authorID: String,
	text: String,
	created: { type: Date, default: Date.now},
	updated: { type: Date, default: Date.now},
    questions: [QuestionSchema],
    termNumber: Number,
});



var ReadingCompLesson = mongoose.model('ReadingCompLesson', readingCompLessonSchema);
module.exports = ReadingCompLesson;