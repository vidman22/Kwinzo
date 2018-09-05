import React from 'react';
import AutosizeInput from 'react-input-autosize';
import './Omission.css';

const Omission = (props) => {

	let inputColor = 'black';
	if ( props.message && props.message === 'correct') {
		inputColor = '#00c4c3'
	}	
	if ( props.message && props.message === 'incorrect') {
		inputColor = '#c92c43'
	} 

	return (
		<form onSubmit={props.handlesubmit}><AutosizeInput
			className="OmissionInput"
			value={props.value}
			onChange={props.handlechange}
			placeholder={props.placeholder}
			placeholderIsMinWidth
			inputStyle={{
				color: inputColor,
				display: 'inline-block',
				height: '20px',
				fontFamily: 'Open Sans, sans-serif',
				lineHeight: '18px',
				fontSize: '16px', 
				marginLeft: '5px', 
				marginRight:'5px',
				background: 'none', 
				borderTop: 'none', 
				borderLeft: 'none', 	
				borderRight: 'none', 
				borderBottom:'solid 1px #046A91'}}
		/></form>

		);
}

export default Omission;