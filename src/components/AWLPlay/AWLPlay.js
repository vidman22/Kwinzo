import React, { Component } from 'react';
import Sentence from '../Sentence/Sentence';

import './AWLPlay.css';


export default class AWLPlay extends Component {
	


	render() {

		const sentence = this.props.activesentence;
		
		
		return (
			<div className="GamePlay">
			  
				<h2>{this.props.gamename}</h2>
				
				{this.props.hint ? <h3>{this.props.hint}</h3> : <button className="HintButton" onClick={this.props.showhint}>Show Hint</button>}
			  <svg height="40" width="1000">
			  <defs>
			  	<linearGradient id="e" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
			  		<stop stopColor="#23A6D5" offset="0" />
			  		<stop stopColor="#FFF800" offset="1" />
			  	</linearGradient>
			  </defs>
  				<line x1="0" y1="0" x2={this.props.index*83.33} y2="0" strokeWidth="40" stroke="url(#e)" />
			</svg>
			  	
					{!this.props.completed ? <Sentence 
						sentence={sentence.sentence}
						correct={sentence.a}
						placeholder={sentence.b}
						value={this.props.answer}
						handlesubmit={this.props.handlesubmit}
						handlechange={this.props.handlechange}
					/> : this.props.completed}
					
					<div className="error">{this.props.error ? this.props.error : null}</div>
					
			</div>
			)
	}

}