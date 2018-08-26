import React from 'react';
import './Player.css';



const Player = (props) => {
	return (
			<div className="player">
				<svg height="200" width="200">
	
  					<circle cx="100" cy="100" r="80" stroke="black" strokeWidth="3" fill="#23D5AB" style={{ strokeWidth: "20px", strokeDasharray: '' + props.score*502.65/props.length + ' ' + 502.65 , stroke:"grey" }} />
  					{/*<text dx="25%" dy="54%" fill="white" textLength="50%" lengthAdjust="spacingAndGlyphs" style={{font: "30px Helvetica, sans-serif"}}>{this.props.name}</text>*/}

 					 Sorry, your browser does not support inline SVG.  
				</svg> 
				<div className="player_name_score">
					<div className="name">{props.name}</div>
					<div className="score">{props.score + '/' + props.length }</div>
 				</div>
			</div>
	);
}

export default Player;