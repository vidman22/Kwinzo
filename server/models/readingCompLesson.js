var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OptionSchema = new Schema({
	option: String,
	correct: Boolean,
});

var QuestionSchema = new Schema({
	question: String,
	options: [OptionSchema],
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