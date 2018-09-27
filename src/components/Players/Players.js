import React from 'react';
import './Players.css';


const Players = (props) => {
		const showbutton = props.players.length > 4;
		let players;
		if (props.teammode){
			players = (
				<div className="WaitingPlayersWrapper">
					<h1>Team Play</h1>
					 {props.arrayofteams.map((team, index) => {
					 return (
						 <div className="Team" key={index} >
						 <p>Team {index + 1}</p>{ team.players.map((player, indx ) => {
							 return (
								 <div className = "WaitingPlayer" key={indx}>
									 {player.playerName}
								 </div>
								 );
						 })}
					 </div>
				 )
					 })}
					</div>	
				 );

		} else  players = (
			<div className="WaitingPlayersWrapper">
				<h1>Individual Play</h1>
				{props.players.map((player, index) => {
					return (
						<div className="WaitingPlayer" key={index}>
							<p>{index + 1}  {player.playerName}</p>
						</div>
					)
				})}
			</div>
			);

		let code = (
			<div className="CodeNumberWrapper" >
			  {props.room.split('').map((number, index) => {
				return (
						<div className="CodeNumber" key={index}>{number}</div>
				)
			  })}
			</div>
		)
		return (
			<div className="Waiting">
				<button className="BackButton" onClick={props.back}>{"<"} Back</button>
			  <div className="WaitingWrapper">
				<h1>{props.gamename}</h1>
				<span>Students go to:</span>
				<span><em><strong>kwizno.com/play</strong></em></span>
				<span>Add the code below to play!</span>
				{code}
				{ players }
			  </div>
				
				
				{!showbutton ? null : (props.teammode) ? (
				<button className="CreateButton" onClick={props.shuffleteams}>Individual</button> 
				) : (
				 <button className="CreateButton" onClick={props.shuffleteams}>Team Play</button>
				 ) } 
				{!props.disabled && props.players.length !== 0 ? <button className="CreateButton" onClick={props.start.bind(this)}>Start</button> : null}
			</div>
			)

}

export default Players;