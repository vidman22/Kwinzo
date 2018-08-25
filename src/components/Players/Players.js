import React, { Component } from 'react';


export default class Players extends Component {
	


	render() {

		let players = (
				<div>
					{this.props.players.map((player, index) => {
					return (
						<div className="Player" key={index}>
							<p>{index + 1}  {player.playerName}</p>
						</div>
					)
					})}
				</div>
		);

		
		return (
			<div className="Waiting">
				<button className="BackButton" onClick={this.props.back}>{"<"} Back</button>
				<h1>{this.props.gamename}</h1>
				<h2>Students go to:</h2>
				<h1><em><strong>kwizno.win</strong></em></h1>
				<h2>Add the code below to play!</h2>
				<h3>{this.props.room}</h3>
				
				
				{ players }
				
				
				{!this.props.disabled ? <button className="CreateButton" onClick={this.props.start.bind(this)}>Start</button> : null}
			</div>
			)
	}

}