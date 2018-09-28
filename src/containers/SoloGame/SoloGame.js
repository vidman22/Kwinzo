import React, { Component } from 'react';

import SoloPlay from '../../components/SoloPlay/SoloPlay';
import Carousel from "../../components/Carousel/Carousel";
import {withRouter} from 'react-router-dom';

import './SoloGame.css'

let index = 0
class SoloGame extends Component {

	constructor(props) {
		super(props);


		this.state = {
			gameName: null,
			gameSentences: null,
			sentenceIndex: 0,
			scoreIndex: 0,
			activeGame: null,
			action: 'start',
			activeSentence: {},
			carousel: true,
			value:'',
			completed: null,
			message:'',
			carouselSentence: '',
			correct: '',
		}

	}

	UNSAFE_componentWillMount() {
	

		let gameSentences = this.props.lesson.sentences;

		const activeSentence = gameSentences[0];

		const gameName = this.props.lesson.title;
		
		this.setState({
			gameSentences,
			gameName,
			activeSentence,
			carouselSentence: activeSentence.sentence,
			correct: activeSentence.answer,
		});


	}

	handleSubmit = (e) => {
		e.preventDefault();
		let value = this.state.value;
		value = value.toLowerCase().trim();

		const answer = this.state.activeSentence.answer.toLowerCase().trim();
		const alts = this.state.activeSentence.alts;
		//correct answer ===========================================
		if (value === answer) {
		
			this.correct();
		} else if (alts.length !== 0 && alts !== undefined ) {
			for ( let i =0; i < alts.length; i++) {
				if (value === alts[i]){
					this.correct();
				} else {
					this.setState({
						message: 'incorrect'
					});
					setTimeout(this.wrongAnswer.bind(this), 750);
				}
			}
		} else {	
			this.setState({
				message: 'incorrect'
			});
			setTimeout(this.wrongAnswer.bind(this), 750);
		}
	}

	completed() {
		let sentenceIndex = this.state.sentenceIndex;
		let scoreIndex = this.state.scoreIndex;
		sentenceIndex = 0;
		scoreIndex = 0;

		this.setState({
			scoreIndex,
			sentenceIndex,
			completed:null,
			action: 'answers'
		});
	}

	correct() {
		let sentenceIndex = this.state.sentenceIndex;
		let scoreIndex = this.state.scoreIndex;
		
		if ( sentenceIndex < this.state.gameSentences.length - 1 ) {
				sentenceIndex++;
				scoreIndex++;
				const activeSentence = this.state.gameSentences[sentenceIndex];

				this.setState({ message: 'correct'});

				setTimeout(() => {
					this.setState({
						activeSentence,
						value:'',
						message:'',
						scoreIndex,
						sentenceIndex
					});
				}, 750);	
			} else {
				scoreIndex++;
				this.setState({
					scoreIndex,
					completed:'Finished!'
				});
			}
	}

	wrongAnswer() {
		let sentenceIndex = this.state.sentenceIndex;
		const gameSentences = [...this.state.gameSentences];

		const wrongSentence = gameSentences[sentenceIndex];

		gameSentences.push(wrongSentence);
		this.setState({
			gameSentences
		});

		sentenceIndex++;
		const activeSentence = this.state.gameSentences[sentenceIndex];

		this.setState({
			activeSentence,
			sentenceIndex,
			value:'',
			message:''
		});
	}

	handleChange = (e) => {

		this.setState({ value : e.target.value });
	}

	back() {
		this.props.history.push(`/lessons/${this.props.lesson.id}`);
	}

	button() {
		
		this.setState({
			action: 'play'
		})
	}

	answers() {
		this.setState({
			action:'answers'
		});
	}

	slide(n) {

		index +=n;
		const sentences = this.props.lesson.sentences;
	if ( index === sentences.length ) {
		index = 0;
		this.setState({
			carouselSentence: sentences[index].sentence,
			correct: sentences[index].answer,
			index
		});

	} else if (index === -1 ) {
		index = sentences.length - 1;
		this.setState({
			carouselSentence: sentences[index].sentence,
			correct: sentences[index].answer,
			index
		});
	} else {
		this.setState({
			carouselSentence: sentences[index].sentence,
			correct: sentences[index].answer,
			index
		});
	}
}

	addComponent() {
		let result;
		switch(this.state.action) {
			case 'start':
				result = (
					<div>
						<h1>{this.state.gameName}</h1>
						<button className="ExerciseButton" onClick={this.button.bind(this)}>Start</button> 
					</div>



				)
			break;
			case 'play':
				result = (
					<SoloPlay 
						activesentence={this.state.activeSentence} 
						gamename={this.state.gameName}
						handlechange={this.handleChange} 
						value={this.state.value} 
						handlesubmit={this.handleSubmit}  
						message={this.state.message}
						index={this.state.scoreIndex}
						sentencescount={this.props.lesson.sentences.length}
						completed={this.state.completed}
					/>
					)
			break;
			case 'answers':
				result = (

					<Carousel 
						carouselsentence={this.state.carouselSentence}
              			correct={this.state.correct} 
              			index={index}
              			length={this.props.lesson.sentences.length} 
              			slide={this.slide.bind(this)} />

					)
			break;
			default:
			result = <h1>somthing went wrong</h1>
		}
		return result;
	}


	render() {

		
		return(
			<div className="SoloWaiting">
				<button className="BackButton" onClick={() => this.back()}>{"<"} Back</button>
				{this.state.action !=='answers' ? <button className="AnswersButton" onClick={this.answers.bind(this)}>Answ {">"}</button> : null}
				<h1>{this.props.gamename}</h1>
				{this.addComponent()}
			</div>
			)
	}
}

export default withRouter(SoloGame);