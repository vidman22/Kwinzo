import React, { Component } from 'react';


export default class Players extends Component {
	


	render() {

		let teams = null;
		if ( this.props.arrayofteams ) {
			teams = (
			 <div>
		  		{this.props.arrayofteams.map((team, index) => {
		  		return (
		  			<div className="Team" key={index} >
						<p>{index + 1}</p>{ team.map((player, indx ) => {
							return (
								<div className = "Player" key={indx}>
									{player.playerName}
								</div>
								);
						})}
					</div>
				)
		  		})}
		  	 </div>	
		    );
		}

		
		
		return (
			<div className="Waiting">
				<button className="BackButton" onClick={this.props.back}>{"<"} Back</button>
				<h1>{this.props.gamename}</h1>
				<h2>Go to <em>www.eggames.com/join-game</em></h2>
				<h2>Add the code below to play!</h2>
				<h3>{this.props.room}</h3>
				
				
				{ teams }
				
				
				<button onClick={this.props.start.bind(this)}>Start</button>
			</div>
			)
	}

}