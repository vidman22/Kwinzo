import React from 'react';

import './InputReadingComp.css';


const InputReadingComp = (props) => {
	console.log(props);
	  return (
	  	<div className="InputWrapper">
	  		<input 
	  			className="InputQuestion"
	  			type="text"
	  			value={props.questionValue}
	  			onChange={props.questionChanged}
	  			placeholder="Question"
	  		/>
	  		<p>{props.questionShouldValidate.msg}</p>
	  	</div>

		);
};

export default InputReadingComp;