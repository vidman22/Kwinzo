import React from 'react';
import Sentence from '../../components/Sentence/Sentence';

import './GamePlay.css';

const GamePlay = props => {
		
		const sentence = props.activesentence;

		return (
			<div className="GamePlay">
			  <div className="GameHeader">
				<h2>{props.title}</h2>
			  </div>
			  	<div className="GamePlayWrapper">
			  		{props.completed ? <div className="completed">{props.winner}</div> : (
						
					<Sentence 
						sentence={sentence.sentence}
						correctanswer={sentence.answer}
						placeholder={sentence.hint}
						value={props.value}
						handlesubmit={props.handlegamesubmit}
						handlechange={props.handlegamechange}
						onclick={props.onclick}
						message={props.message}
					/>
					)}
				</div>
			</div>
			)
}
export default GamePlay;