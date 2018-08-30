var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OmissionSchema = new Schema({
	omission: String,
	hint: String,
});

var readingOmissionLessonSchema = new Schema({
	title: String,
	author: String,
	authorID: String,
	text: String,
	created: { type: Date, default: Date.now},
	updated: { type: Date, default: Date.now},
    omissions: [OmissionSchema],
    termNumber: Number,
});



var ReadingOmissionLesson = mongoose.model('ReadingOmissionLesson', readingOmissionLessonSchema);
module.exports = ReadingOmissionLesson;