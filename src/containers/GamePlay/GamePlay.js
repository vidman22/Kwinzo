import React, { Component } from 'react';
import Sentence from '../../components/Sentence/Sentence';

import './GamePlay.css';

import io from 'socket.io-client';

const socket = io();
// const socket = io();

let index = 0;
export default class GamePlay extends Component {

	constructor(props) {
		super(props);

		this.state = {
			
			gameSentences:[],
			activeSentence:'',
			value:'',
			error:''
		}
	}

	UNSAFE_componentWillMount() {
		
		let gameSentences = this.props.sentences;
		

		const activeSentence = gameSentences[0];

	
		this.setState({
			gameSentences,
			activeSentence
		});
	};

	componentWillReceiveProps(newProps) {
		if (newProps.sentences !== this.props.sentences) {
			const activeSentence = newProps.sentences[0];
			index = 0;
			this.setState({
				gameSentences: newProps.sentences,
				activeSentence,
				value: ''
			});
		}
	}

	
	// shuffle(array) {
		
	// 	let currentIndex = array.length, temporaryValue, randomIndex;

	// 	while (0 !== currentIndex) {

	// 		randomIndex = Math.floor(Math.random() * currentIndex);
	// 		currentIndex -= 1;

	// 		temporaryValue = array[currentIndex];
	// 		array[currentIndex] = array[randomIndex];
	// 		array[randomIndex] = temporaryValue;
	// 	}

	// 	return array;
	// } 
	


	handleSubmit = (e) => {
		e.preventDefault();
		let value = this.state.value;
		const answer = this.state.activeSentence.answer.toLowerCase().trim();
		value = value.toLowerCase().trim();

		
		if (value === answer) {
			

			socket.emit('SUCCESS', this.props.room, this.props.name, this.state.gameSentences.length);

			this.setState({
				correct:'Correct!'
			});

			setTimeout(this.correct.bind(this), 333);
			
		} else if (this.state.activeSentence.alts !== 0) {
			for (let i = 0; i < this.state.activeSentence.alts.length; i++ ) {
				if (value === this.state.activeSentence.alts[i]) {
					socket.emit('SUCCESS', this.props.room, this.props.name, this.state.gameSentences.length);

					this.setState({
						correct:'Correct!'
					});

					setTimeout(this.correct.bind(this), 333);
				} else {
					socket.emit('FAILURE', this.props.room);
					this.setState({
						error:'wrong answer!'
					});
					setTimeout(this.wrongAnswer.bind(this), 1000);
				}
			}
		} else {
			socket.emit('FAILURE', this.props.room);
			this.setState({
				error:'wrong answer!'
			});
			setTimeout(this.wrongAnswer.bind(this), 1000);	
		}
	}

	correct() {

		if (index < this.state.gameSentences.length - 1 ) {
				index++;
				const activeSentence = this.state.gameSentences[index];

				this.setState({
					activeSentence,
					value:'',
					correct:''
				});
			} else {
				socket.emit('COMPLETED', this.props.room);
				this.setState({
					correct:'',
				
				})
			}
	}

	wrongAnswer() {
		const gameSentences = [...this.state.gameSentences];

		const wrongSentence = gameSentences[index];

		gameSentences.push(wrongSentence);
		this.setState({
			gameSentences
		});

		index++;
		const activeSentence = this.state.gameSentences[index];

		this.setState({
			activeSentence,
			value:'',
			error:''
		});
	}

	handleChange = (e) => {

		this.setState({ value: e.target.value });
	}

	render() {

		const sentence = this.state.activeSentence;
		
		return (
			<div className="GamePlay">
			  <div className="GameHeader">
				<h2>{this.props.title}</h2>
			  </div>
			  	<div className="GamePlayWrapper">
			  		<div className="completed">{this.props.winner ? this.props.winner : null}</div>
					<Sentence 
						sentence={sentence.sentence}
						correct={sentence.answer}
						placeholder={sentence.hint}
						value={this.state.value}
						handlesubmit={this.handleSubmit}
						handlechange={this.handleChange}
					/>
					<div className="error">{this.state.error ? this.state.error : null}</div>
					<div className="correct">{this.state.correct ? this.state.correct: null}</div>
				</div>
			</div>
			)
	}

}