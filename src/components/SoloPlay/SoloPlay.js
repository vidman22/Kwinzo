import React, { Component } from 'react';
// import {Transition} from 'react-transition-group';
import Sentence from '../Sentence/Sentence';


import './SoloPlay.css';


export default class SoloPlay extends Component {
	constructor(props){
		super(props);
		this.state = {
			width: 500
		}
		this.myRef = React.createRef();
	}
	componentDidMount() {
		this.setState({
			width: this.myRef.current.clientWidth
		});
	}

	render() {

		const sentence = this.props.activesentence;
		const ratio = 100/this.props.sentencescount;
		const index = this.props.index;
		// const intElemClientWidth = this.myRef.current.clientWidth;
		return (
			<div ref={this.myRef} className="GamePlay">
			
				<h1>{this.props.gamename}</h1>
			
			
			  <svg style={{width: `${index*ratio}%`, height:'40px'}}className="gameSVG largeSVG">
			  <defs>
			  	<linearGradient id="e" x1="0" y1="0" x2={`${this.state.width}`} y2="0" gradientUnits="userSpaceOnUse">
			  		<stop stopColor="#23A6D5" offset="0%" />
			  		<stop stopColor="#FFF800" offset="100%" />
			  	</linearGradient>
			  </defs>
  				<line x1="0" y1="0" x2={`${this.state.width}`} y2="0" strokeWidth="40" stroke="url(#e)" />
			 </svg>
			
			{/*<svg style={{width: `${this.props.index*ratio}%`, height:'40px'}} className="gameSVG smallSVG" height="40" width="100%">
						  <defs>
						  	<linearGradient id="e" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
						  		<stop stopColor="#23A6D5" offset="0" />
						  		<stop stopColor="#FFF800" offset="1" />
						  	</linearGradient>
						  </defs>
			  				<line x1="0" y1="0" x2="300" y2="0" strokeWidth="40" stroke="url(#e)" />
						</svg>
						  	*/}
					{!this.props.completed ? <Sentence
						index={this.props.index} 
						sentence={sentence.sentence}
						correct={sentence.answer}
						placeholder={sentence.hint}
						value={this.props.value}
						message={this.props.message}
						handlesubmit={this.props.handlesubmit}
						handlechange={this.props.handlechange}
					/> : <h2>{this.props.completed}</h2> }
					
					
			</div>
			)
	}

}