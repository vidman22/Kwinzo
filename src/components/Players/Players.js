import React from 'react';
import './Players.css';


const Players = (props) => {

		let players = (
				<div>
					{props.players.map((player, index) => {
					return (
						<div className="WaitingPlayer" key={index}>
							<p>{index + 1}  {player.playerName}</p>
						</div>
					)
					})}
				</div>
			);
		
		return (
			<div className="Waiting">
				<button className="BackButton" onClick={props.back}>{"<"} Back</button>
				<h1>{props.gamename}</h1>
				<h2>Students go to:</h2>
				<h1><em><strong>kwizno.xyz</strong></em></h1>
				<h2>Add the code below to play!</h2>
				<h3>{props.room}</h3>
				
				
				{ players }
				
				
				{!props.disabled ? <button className="CreateButton" onClick={props.start.bind(this)}>Start</button> : null}
			</div>
			)

}

export default Players;