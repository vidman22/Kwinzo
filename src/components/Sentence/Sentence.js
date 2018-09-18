import React from 'react';
import AutosizeInput from 'react-input-autosize';
import './Sentence.css';


const sentence = ( props ) => {
	const index = props.sentence.indexOf(props.correct); 
	const index2 = index + props.correct.length;

	const s1 = ( index === 0 ? null : props.sentence.slice(0, index) );
	const s2 = props.sentence.slice(index2, props.sentence.length);
	let inputColor = 'black';
	if ( props.message && props.message === 'correct') {
		inputColor = '#00c4c3'
	}	
	if ( props.message && props.message === 'incorrect') {
		inputColor = '#c92c43'
	} 
	
	return (
		<div className="Sentence">
			<div className="FirstPart"><h3>{s1}</h3></div><form onSubmit={props.handlesubmit}>
						<AutosizeInput
							className="GameInput"
							value={props.value}
							onChange={props.handlechange}
							placeholder={props.placeholder}
							placeholderIsMinWidth
							inputStyle={{
								color: inputColor,
								height: '34px',
								lineHeight: '30px',
								fontSize: '30px', 
								marginLeft: '12px', 
								marginRight:'12px',
								outline: 'none',
								background: 'none', 
								borderTop: 'none', 
								borderLeft: 'none', 
								borderRight: 'none', 
								borderBottom:'solid 2px #046A91'}} 
							/></form>
			<div className="SecondPart"><h3>{s2}</h3></div>
			
			{props.exercise ?  null : <button className="ExerciseButton" onClick={props.handlesubmit}>Submit</button>}

		</div>
		)
};

export default sentence;