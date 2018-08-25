import React from 'react';
import Player from '../../components/Player/Player';

import './GameBoard.css'



const GameBoard = (props) => {
	

		const players = this.props.players.map((player, index) => {
			return (
				<Player key={index} name={player.playerName} score={player.score} length={this.props.length} /> 

				)
		});
		let teams = null;
		if (this.props.teams) {
			teams = this.props.teams.map((team, index) => {
				return (
					<Player key={index} name={index} score={2} length={this.props.length} />
					)
			});
		}


		return (
			<div className="player-board">
				{teams ? teams : players}
			</div>

			)
};

export default GameBoard;