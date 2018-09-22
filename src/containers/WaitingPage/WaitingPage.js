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
//const socket = io('http://localhost:5000');

let index = 0;
class WaitingPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			room: '',
			socket: null,
			players: [],
			disconnectedPlayers:[],
			disabled:true,
			arrayOfTeams: null,
			button: 'buttons',
			action: 'players',
			winner: '',
			openModal: false,
			showDisconnectModal: false,
			carouselSentence: '',
			index: 0,
			correct: '',
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
	
			this.setState({
				disconnectedPlayers: disconnectedPlayers
			});
		});

		socket.on('PLAY_AGAIN', (players) => {
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

	start() {
		if(this.state.disconnectedPlayers.length === 0 && this.props.lesson.sentences){
			const { socket } = this.state;
			const gameSentences = this.props.lesson.sentences;
			const title = this.props.lesson.title;
			const room = this.state.room;
			socket.emit('START_GAME', room, title, gameSentences);
			this.setState({
				action:'gameboard',
				sentences: gameSentences,
				carouselSentence: gameSentences[0].sentence,
				correct: gameSentences[0].answer
			});
		} else if (!this.props.lesson) {
		
		}else {
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
		index = 0;
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
					
						{this.state.showDisconnectModal ? <DisconnectModal 
							players={this.state.disconnectedPlayers} 
							removeplayer={this.removePlayer.bind(this)} 
							show={this.state.showDisconnectModal} 
							start={this.start.bind(this)} /> : null}
					 	<Backdrop show={this.state.showDisconnectModal} />
				</div>
				)
			break;
			case 'gameboard':
			result = (
				<div>
					<GameBoard 
						players={this.state.players} 
						arrayofteams={this.state.arrayOfTeams} 
						length={this.props.lesson.sentences.length}/>
					{this.state.openModal ? <Modal 
						show={this.state.openModal} 
						carouselsentence={this.state.carouselSentence}
						correct={this.state.correct}
						index={this.state.index}
						playAgain={this.playAgain.bind(this)} 
						length={this.props.lesson.sentences.length}
						slide={this.slide.bind(this)}
						winner={this.state.winner}  /> : null}
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
	
		return(
			<div className="WaitingWrapper">
					{this.addComponent()}

			</div>
			)
	}
}


export default withRouter(WaitingPage);