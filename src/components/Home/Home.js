import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import smartPhone from '../../assets/svg/smartphone-iphone.svg';
import './Home.css';
export default class Home extends Component {
	
	
	render() {	
		
		return (
			<div className="Home">
				<div className="HomeCreate">
					<div id="create"><h1>Create</h1></div>
				</div>
				<div className="HomeStudy">
					<div id="study"><h1>Study</h1></div>
				</div>
				<div className="HomeQuiz">
					<div id="quiz"><h1>Quiz</h1></div>
				</div>
				<div className="HomeRepeat">
					<div id="repeat"><h1>Repeat</h1></div>
				</div>	
			</div>

		);
	}
}