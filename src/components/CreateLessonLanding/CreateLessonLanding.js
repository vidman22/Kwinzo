import React from 'react';

import { Link } from 'react-router-dom';

import './CreateLessonLanding.css';



const CreateLessonLanding = (props) => {
	return (
		<div className="CreateFlex">
			<Link to="create-lesson/exercise"><div className="CreateLessonExercise"><h1>Input Lesson</h1></div></Link>
			<Link to="create-lesson/reading"><div className="CreateLessonReading"><h1>Reading Lesson</h1></div></Link>
		</div>

		)
}

export default CreateLessonLanding;