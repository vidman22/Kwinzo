import React from 'react';

import './InputSentence.css';


const InputSentence = (props) => {
	  return (
	  	<div className="InputWrapper">
	  		<input 
	  			className="InputSentence"
	  			type="text"
	  			value={props.sentenceValue}
	  			onChange={props.sentenceChanged}
	  			placeholder="Sentence"
	  		/>
	  		<p>{props.sentenceShouldValidate.msg}</p>
	  		<div className="InputAnswerWrapper">
	  	     <input
	  	    	 className="InputAnswer"
	  	    	 type="text"
	  	    	 value={props.answerValue}
	  	    	 onChange={props.answerChanged}
	  	    	 placeholder="Answer"
	  	     />
	  	     <p>{props.answerShouldValidate.msg}</p>
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

export default InputSentence;