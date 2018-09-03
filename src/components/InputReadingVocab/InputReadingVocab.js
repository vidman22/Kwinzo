import React from 'react';

import './InputReadingVocab.css';


const InputReadingVocab = (props) => {
	  return (
	  	<div className="InputWrapper">
	  		<div className="InputAnswerWrapper">
	  	     <input
	  	    	 className="InputAnswer"
	  	    	 type="text"
	  	    	 value={props.omissionValue}
	  	    	 onChange={props.omissionChanged}
	  	    	 placeholder="Answer"
	  	     />
	  	     <p>{props.omissionShouldValidate.msg}</p>
	  	    </div>
	  	    <input 
	  	    	className="InputHint"
	  	    	type="text"
	  	    	value={props.hintValue}
	  	    	onChange={props.hintChanged}
	  	    	placeholder="Hint"
	  	    />
	  	    <p>{props.hintShouldValidate.msg}</p>

	  	</div>

		);
};

export default InputReadingVocab;