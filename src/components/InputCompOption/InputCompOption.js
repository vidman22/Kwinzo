import React from 'react';

import './InputCompOption.css';


const InputCompOption = (props) => {
	  	 return (
	  	<div className="InputOptionWrapper">
	  	 	<input type="radio" checked={props.checked === (props.index)} className="optionCheck" onChange={props.oncheck} />
	  		<input
	  			className="InputOption"
	  			type="text"
	  			value={props.optionValue}
	  			onChange={props.optionChanged}
	  			placeholder={props.optionPlaceholder}
	  		/>
	  		<svg 
	  			className="RemoveAlt" 
	  			fill="#eee" 
	  			onClick={props.onclick} 
	  			xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" 
	  			viewBox="0 0 510 510" width="18px" height="18px">
                <path d="M255 0C114.75 0 0 114.75 0 255s114.75 255 255 255 255-114.75 255-255S395.25 
                0 255 0zm127.5 280.5h-255v-51h255v51z"/>
            </svg>
	  		<p>{props.optionShouldValidate.msg}</p>
	  	</div>
	  	);
};

export default InputCompOption;