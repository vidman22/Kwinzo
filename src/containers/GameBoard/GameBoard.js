import React from 'react';
import Player from '../../components/Player/Player';

import './GameBoard.css'



const GameBoard = (props) => {
	
		let players;
		if (props.teammode){
			console.log('team mode');
			players = props.arrayofteams.map((team, index)=> {
				return (
					<div key={index} className="TeamWrapper">
					<div className="TeamName">{team.name}</div>
					{team.players.map((player, index) => {
						return <Player key={index} name={player.playerName} score={player.score} length={props.length} />
					})}
					</div>
				)
				
			})
		} else {
			players = props.players.map((player, index) => {
				return (
					<Player key={index} name={player.playerName} score={player.score} length={props.length} /> 
					)
			});
		}
		

		return (
			<div className="PlayerBoard">
			  <button className="GameBackButton" onClick={this.back}>Back</button>
			  {/*<div className="GameName"> {props.title}</div>*/}
				<div className="GameRoomCode"> Code {props.room}</div>
				{players}
			</div>

			)
};

export default GameBoard;