import React, { Component } from 'react';
import PlayersWaiting from '../../components/Players/Players';
import GameBoard from '../GameBoard/GameBoard';
import Modal from '../../components/Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';
import DisconnectModal from '../../components/DisconnectedModal/DisconnectedModal';
import {withRouter} from 'react-router-dom';

import './WaitingPage.css'

import io from 'socket.io-client';	

const socket = io();
// const socket = io('http://localhost:5000');


class WaitingPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			room: '',
			socket: null,
			players: [],
			disconnectedPlayers: [],
			disabled:true,
			arrayOfTeams: null,
			button: 'buttons',
			action: 'players',
			winner: null,
			openModal: false,
			showDisconnectModal: false,
		}


	}


	componentDidMount() {
		this.initSocket();
	}

	componentWillUnmount() {
		socket.removeAllListeners();
	}

	initSocket() {

		const room = this.randomDigits();
		this.setState({
			 room,
			 socket
			 
		});
	
		socket.emit('NEW_ROOM', room );

		

		socket.on('UPDATED_PLAYERS', (users) =>{
			
			let players = [...this.state.players];
			players = users;

			this.setState({
				players
			});
			
			if (players.length >= 2) {
				this.setState({
					disabled: false
				});
			}
		});

		socket.on('WINNER', (user) =>{
			
			this.setState({
				winner: user,
				openModal: true
			})
		});

		socket.on('SCORE', (users) => {

			this.setState({
				players: users
			});
		});

		socket.on('USER_DISCONNECTED', (player) => {
			const disconnectedPlayers = [...this.state.disconnectedPlayers];
			disconnectedPlayers.push(player);
			console.log('player', player);
			this.setState({
				disconnectedPlayers: disconnectedPlayers
			});
		});

		socket.on('PLAY_AGAIN', (users) => {
			let players = [...this.state.players];
			players = users;

			this.setState({
				players
			});
		});
	};

	randomDigits() {
		
		let code = '';
		for ( let i = 0; i < 6; i++ ) {
			let rand_num = Math.floor((Math.random() * 10 ));
			code += rand_num;
		}
		return code;
	}

	start(e) {
		if(this.state.disconnectedPlayers.length === 0){
			const { socket } = this.state;
			e.preventDefault();
			const gameSentences = this.props.lesson.sentences;
			const title = this.props.lesson.title;
			const room = this.state.room;
			socket.emit('START_GAME', room, title, gameSentences);
			this.setState({
				action:'gameboard'
			});
		} else {
			this.setState({
				showDisconnectModal: true,
			})
		}
	};

	button() {
		this.setState({
			button: null
		});
	};

	back() {
		this.props.history.push(`/lessons/${this.props.lesson.id}`);
	}

	playAgain() {
		const { socket } = this.state;
		this.setState({
			openModal: false,
			winner: null,

		});
		socket.emit('PLAY_AGAIN', this.state.room, this.state.gameSentences );
	};

	removePlayer(playerID){
		let updatedPlayers = [...this.state.players];
		let updatedDisconnectedPlayers = [...this.state.disconnectedPlayers];

		updatedPlayers = updatedPlayers.filter((player) => player.id !== playerID);
		updatedDisconnectedPlayers = updatedDisconnectedPlayers.filter((player) => player.id !== playerID);
		console.log('updatedPlayers', updatedPlayers);
		console.log('updatedDisconnect', updatedDisconnectedPlayers);
		console.log('pid', playerID);
		if (updatedDisconnectedPlayers.length === 0) {
			this.setState({
				showDisconnectModal: false,
				players: updatedPlayers,
				disconnectedPlayers: updatedDisconnectedPlayers,
			});
		} else {
			this.setState({
				players: updatedPlayers,
				disconnectedPlayers: updatedDisconnectedPlayers,
			});
		}
		
	}

	addComponent() {
		
		let result;
		switch(this.state.action) {
			case 'players':
			result = (
				<div>
					<PlayersWaiting 
						players={this.state.players} 
						room={this.state.room} 
						gamename={this.props.lesson.title}  
						back={()=>this.back()} 
						start={this.start.bind(this)} 
						disabled={this.state.disabled} 
						buttonstate={this.state.button} 
						button={this.button.bind(this)} 
					/>
					{this.state.showDisconnectModal ?
						<DisconnectModal 
							players={this.state.disconnectedPlayers} 
							removeplayer={this.removePlayer.bind(this)} 
							show={this.state.showDisconnectModal} 
							start={this.start.bind(this)} /> : null}
					{this.state.showDisconnectModal ? <Backdrop show={this.state.showDisconnectModal} /> : null}
				</div>
				)
			break;
			case 'gameboard':
			result = (
				<div>
					<GameBoard players={this.state.players} arrayofteams={this.state.arrayOfTeams} length={this.props.lesson.sentences.length}/>
					<Modal show={this.state.openModal} playAgain={this.playAgain.bind(this)} winner={this.state.winner} sentences={this.props.lesson.sentences} />
					{this.state.openModal ? <Backdrop show={this.state.openModal} /> : null}
				</div>
				)
			break;
			default:
			result = (<div>Uh oh!</div>)
		}
		return result;
	}

	render() {
		console.log('state', this.state);
		return(
			<div className="WaitingWrapper">
					{this.addComponent()}
			</div>
			)
	}
}


export default withRouter(WaitingPage);