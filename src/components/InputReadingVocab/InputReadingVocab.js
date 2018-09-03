import React from 'react';

import './InputReadingVocab.css';


const InputReadingVocab = (props) => {
	  return (
	  	<div className="InputWrapper">
	  		<div className="InputVocabWrapper">
	  	     <input
	  	    	 className="InputVocab"
	  	    	 type="text"
	  	    	 value={props.omissionValue}
	  	    	 onChange={props.omissionChanged}
	  	    	 placeholder="Omitted Text"
	  	     />
	  	     <p>{props.omissionShouldValidate.msg}</p>
	  	    </div>
	  	    <input 
	  	    	className="InputVocabHint"
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