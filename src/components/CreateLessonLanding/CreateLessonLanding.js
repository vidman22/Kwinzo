import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import StyledWord from '../StyledWord/StyledWord';
import './CreateLessonLanding.css';

let showConst = null;

class CreateLessonLanding extends Component {
	constructor(props){
		super(props);
		this.state= {
			showExAnswer: false,
			readingText: 'The quick brown fox jumped over the lazy dog.',
			textArray: [],
			readingSpeedRunning: false,
			readingSpeedValue: 100,
			readingStyles: [{type: 'underline', checked: false}, {type: 'color', checked: true }, {type:'highlight', checked: false}],
			speedReadingIndex: 0,
		}
		this.showExAnswer = this.showExAnswer.bind(this);
		var timerVar;
	}

	componentDidMount(){
		showConst = setInterval(this.showExAnswer, 6000);

		const textArray = this.state.readingText.split(' ').map( word => {
			let obj = {
			  word: word,
			  style: false
			}
			return obj;
		  });
		this.setState({
			textArray
		});

		this.startReading();
	}

	componentWillUnmount() {
		clearInterval(this.timerVar);
		clearInterval(showConst);
	}

	startReading(){
		const textArray = [...this.state.textArray];
		let i = this.state.speedReadingIndex;
	
		  this.timerVar = setInterval(() => {
			if ( i < textArray.length) {
			  textArray[i].style = true;
			  if (i > 0) {
				textArray[i-1].style = false;
			  }
			  this.setState({
				textArray,
				speedReadingIndex: i++
			  });
			} else this.restartReading();
			
		  }, 60000/this.state.readingSpeedValue);
	  
		 
		//   this.setState({
		// 	readingSpeedRunning: true
		//   });
	}
	restartReading(){
	
		const textArray = [...this.state.textArray];
  
	  clearInterval(this.timerVar);
	  this.timerVar = null;
	  textArray[this.state.speedReadingIndex].style = false;
	  this.setState({
		  textArray,
		  speedReadingIndex: 0
		});	   
		
	}

	showExAnswer() {
		this.setState( prevState => {
		  return { showExAnswer: !prevState.showExAnswer }
		})
	}

	render() {
		
		return (
			<div className="CreateFlex">
			<Link to="create-lesson/exercise">
			<div className="CreateLessonExercise"><h1>Input Lesson</h1>
				<div className="ExampleSentenceWrapper">
            		<div className="FirstHalfExample">The quick brown fox</div>
            		<div className="ExampleAnswerWrapper">
              		{this.state.showExAnswer ?  <div className="TypedTextExample">jumps</div> : <div className="ExampleHint">jump</div> }
            		<div className="SecondHalfExample">over the lazy dog.</div>
            		</div>
          		</div>
			</div>
			</Link>
			<Link to="create-lesson/reading">
				<div className="CreateLessonReading">
					<h1>Reading Lesson</h1>
					<div className="ReadingPassage">
						{this.state.textArray.map( (element, index) => {
							  return <StyledWord 
										  key={index} 
										  word={element.word} 
										  shouldStyle={element.style} 
										  styles={this.state.readingStyles} 
									  />
            			})}
					</div>
				</div>
			</Link>
			</div>
		);
	}
}

export default CreateLessonLanding;