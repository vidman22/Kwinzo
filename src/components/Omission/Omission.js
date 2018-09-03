import React from 'react';
import AutosizeInput from 'react-input-autosize';
import './Omission.css';

const Omission = (props) => {

	return (
		<AutosizeInput
			value={props.value}
			onChange={props.handlechange}
			placeholder={props.placeholder}
			placeholderIsMinWidth
			inputStyle={{
				// color: inputColor,
				height: '35px',
				lineHeight: '20px',
				fontSize: '30px', 
				marginLeft: '12px', 
				marginRight:'12px',
				background: 'none', 
				borderTop: 'none', 
				borderLeft: 'none', 	
				borderRight: 'none', 
				borderBottom:'solid 2px #046A91'}}
		/>

		);
}

export default Omission;