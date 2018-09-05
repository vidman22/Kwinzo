import React from 'react';

import './ReadingCompQuestion.css';


const ReadingCompQuestion = props => {
	return (
		  <div>
		  	<div className="QuestionMessage">{props.msg}</div>
		  <form>
			<div className="ReadingCompQuestion">{(props.index + 1) + '. ' + props.question}</div>
			  {props.options.map((option, index) => {
				return (
						<div key={index} className="ReadingCompOption">
							<label className="QuestionCheckLabel">
                        		<input 
                        			type="radio"
                        		 	className="QuestionCheckBox" 
                        		 	checked={props.checked === index}  
                        		 	onChange={() => props.changed(option, props.index, index)}/></label>
                        	<p>{option}</p>
                        </div>
                       );
			  })}
			</form>
		  </div>
		  );
};

export default ReadingCompQuestion;