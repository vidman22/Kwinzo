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
	  			placeholder="Quiz Sentence"
	  		/>
			  {props.showPrompts ? <div className="ShowSentencePrompt">2. Add a sentence. It should include the correct answer</div>: null}
	  		<p>{props.sentenceShouldValidate.msg}</p>
	  		<div className="InputAnswerWrapper">
	  	     <input
	  	    	 className="InputAnswer"
	  	    	 type="text"
	  	    	 value={props.answerValue}
	  	    	 onChange={props.answerChanged}
	  	    	 placeholder="Answer"
	  	     />
			{props.showPrompts ? <div className="ShowAnswerPrompt">3. Add the answer that will be omitted from the sentence above in the exercise</div>: null}
	  	     <p>{props.answerShouldValidate.msg}</p>
	  	    </div>
	  	    <input 
	  	    	className="InputHint"
	  	    	type="text"
	  	    	value={props.hintValue}
	  	    	onChange={props.hintChanged}
	  	    	placeholder="Hint"
	  	    />
			  {props.showPrompts ? <div className="ShowHintPrompt">4. Add a hint that will take the place of the answer in the exercise</div>: null}
	  	    <p>{props.hintShouldValidate.msg}</p>

	  	</div>

		);
};

export default InputSentence;