import React, { Component } from 'react';

import io from 'socket.io-client';

import GamePlay from '../GamePlay/GamePlay';

import './JoinGame.css';


const socket = io();
//const socket = io('http://localhost:5000/');

let index = 0;
export default class CreateGame extends Component {
	constructor(props) {
		super(props);

		this.state = {
			action:'code',
			activePlayer:'',
			activeSentence:'',
			error: null,
			gameSentences:[],
			correct:'',
			name:'',
			players: [],
			room:'',
			title: '',
			value: '',
			winner:'',
			wrong:'',
		}
	}
	

	componentDidMount() {
		this.initSocket();
	}

	componentWillUnmount() {
		socket.removeAllListeners();
	}

	initSocket = () => {

		socket.on('WINNER', (user) => {
			
			if (user === this.state.name) {
			this.setState({
				winner: 'You won!'
			});
		} else {
			this.setState({
				winner: `${user} won`
			})
		}
		});

		socket.on('START_GAME', ( title, sentences ) => {
			this.setState({
				title,
				action:'game',
				gameSentences: sentences,
				activeSentence: sentences[0]
			});
		});

		socket.on('PLAY_AGAIN', ( sentences) => {
			this.setState({
				gameSentences: sentences,
				activeSentence: sentences[0]
			})
		});

	}

	handleCodeSubmit = (e) => {

		e.preventDefault();
		const room = this.state.room;
		socket.emit('JOIN_ROOM', room, (res) => {
			// if error post error, if success change action to load new input form 
			if ( res ) {
				this.setState({
					error: res
			});
			} else {
				this.setState({
					action: 'name'			
				});
			}
			
		});
	}

	handleCodeChange = (e) => {
		let room = this.state.room;
		room = e.target.value
		this.setState({ room });

		if (this.state.error) {
			this.setState({
				error: '',
			})
		}
	}

	handleSubmit = (e) => {
		// const { socket } = this.state;
		e.preventDefault();
		socket.emit('NEW_PLAYER', this.state.room, this.state.name, (res) => {
			if ( res ) {
				this.setState({
					error: res
				});
			} else {
				this.setState({
					action: 'waiting'
				});
			}
		});		
	}

	handleChange = (e) => {
		let name = this.state.name;
		name = e.target.value
		this.setState({ name });
	}

	// ========================================================

	
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
	
	checkAlts(alts, value) {
		for (let i = 0; i < alts.length; i++) {
			if (value === alts[i]) return true;
			else return false;
		}
	}

	handleGameSubmit = (e) => {
		e.preventDefault();
		let value = this.state.value;
		const alts = this.state.activeSentence.alts;
		const answer = this.state.activeSentence.answer.toLowerCase().trim();
		value = value.toLowerCase().trim();
		const length = this.state.gameSentences.length - 1;
		
		if (value === answer) {

			socket.emit('SUCCESS', this.state.room, this.state.name, length);

			this.setState({
				correct:'Correct!'
			});
			setTimeout(this.correct.bind(this), 333);
			
		} else if (alts.length !== 0 && alts !== undefined) {

			let flag = this.checkAlts(alts, value);
			 if (flag) {
				socket.emit('SUCCESS', this.state.room, this.state.name, length);

				this.setState({
					correct:'Correct!'
				});

				setTimeout(this.correct.bind(this), 333);
			} else {
					socket.emit('FAILURE', this.state.room);
					this.setState({
						wrong:'Wrong Answer!'
					});
					setTimeout(this.wrongAnswer.bind(this), 333);
			 }
		} else {
		
			socket.emit('FAILURE', this.state.room);
			this.setState({
				wrong:'Wrong Answer!'
			});
			setTimeout(this.wrongAnswer.bind(this), 333);	
		}
	}

	correct() {
		if (index < this.state.gameSentences.length - 1) {
			index++;
			const activeSentence = this.state.gameSentences[index];

			this.setState({
				activeSentence,
				value:'',
				correct:''
			});
		} else {
			index = 0;
			this.setState({
				correct: '',
			});
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
			wrong:''
		});
	}

	handleGameChange = (e) => {

		this.setState({ value: e.target.value });
	}
	//================================================================

	addComponent() {
		let result;
		switch(this.state.action) {

			case 'code':
			result = (
				<div className="login">
					<form onSubmit={this.handleCodeSubmit} className="login-form" >

						<h2>Add a Join Code</h2>
						<input
							type="text"
							name="code"
							value={this.state.room}
							onChange={this.handleCodeChange}
							placeholder={''}
						/> 
					    <div className="error">{this.state.error ? this.state.error : null}</div>
						<button className="ExerciseButton" type="submit">Enter</button>
					</form>
    
				</div>

				)
			break;
			case 'name':
			  result = (
			  	<div className="login">
			  	    <form onSubmit={this.handleSubmit} className="login-form" >
						<h2>Add a Name</h2>
					<input
						type="text"
						name="name"
						value={this.state.name}
						onChange={this.handleChange}
						placeholder={'Name'}
					/>
					<div className="error">{this.state.error ? this.state.error : null}</div>
					<button className="ExerciseButton" type="submit">Enter</button>
					</form>
				</div>
					)
			break;
			case 'waiting':
				result = (
				  <div className="title">
					<div className="text text-w">w</div>
					<div className="text text-a">a</div>
					<div className="text text-i">i</div>
					<div className="text text-t">t</div>
					<div className="text text-i2">i</div>
					<div className="text text-n">n</div>
					<div className="text text-g">g</div>
					<div className="text text-1">.</div>
					<div className="text text-2">.</div>
					<div className="text text-3">.</div>
				  </div>
					)
			break;
			case 'game':
				result = (
					<GamePlay 
						activesentence={this.state.activeSentence}
						correct={this.state.correct}
						value={this.state.value}
						handlegamechange={(e) => this.handleGameChange(e)}
						handlegamesubmit={this.handleGameSubmit} 
						sentences={this.state.gameSentences} 
						title={this.state.title}
						winner={this.state.winner}
						wrong={this.state.wrong}/> 
					)
			break;
			default:
			result = <h1>thank you come again</h1>
		}
		return result;
	}

	render() {	
		
		return (
		  <div>
		  	
			{this.addComponent()}
		  </div>
		);
	}
}