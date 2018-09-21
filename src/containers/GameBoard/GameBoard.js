import React from 'react';
import Player from '../../components/Player/Player';

import './GameBoard.css'



const GameBoard = (props) => {
	

		const players = props.players.map((player, index) => {
			return (
				<Player key={index} name={player.playerName} score={player.score} length={props.length} /> 
				)
		});

		return (
			<div className="player-board">
				{players}
			</div>

			)
};

export default GameBoard;