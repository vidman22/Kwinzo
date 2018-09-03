import React, { Component } from 'react';

import io from 'socket.io-client';

import GamePlay from '../GamePlay/GamePlay';

import './JoinGame.css';


//const socket = io('http://localhost:5000/');
const socket = io();


export default class CreateGame extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name:'',
			room:'',
			error: null,
			socket: null,
			action:'code',
			activePlayer:'',
			players: [],
			gameSentences:[],
			title: '',
			winner:''

		}
	}
	

	componentDidMount() {
		this.initSocket();
	}

	initSocket = () => {
		

		this.setState({socket});


		socket.on('WINNER', (user) => {
			
			if (user === this.state.name) {
			this.setState({
				winner: 'You won!'
			});

		} else {
			this.setState({
				winner: 'You lost'
			})
		}
		});

		socket.on('START_GAME', ( title, sentences ) => {
		;
			this.setState({
				title,
				action:'game',
				gameSentences: sentences
			});
		});

	}

	handleCodeSubmit = (e) => {

		e.preventDefault();
		const { socket } = this.state;
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
		const { socket } = this.state;
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
					<GamePlay room={this.state.room} title={this.state.title} sentences={this.state.gameSentences} name={this.state.name} winner={this.state.winner}/> 
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