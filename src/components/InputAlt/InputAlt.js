import React from 'react';

import './InputAlt.css';


const InputAlt = (props) => {
	  return (
	  	<div className="InputAltWrapper">
	  	 <p>{props.index}</p>
	  		<input 
	  			className="InputAlt"
	  			type="text"
	  			value={props.altValue}
	  			onChange={props.altChanged}
	  			placeholder={props.altPlaceholder}
	  		/>
	  		<svg className="RemoveAlt" fill="#eee" onClick={props.onclick} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 510 510" width="18px" height="18px">
                <path d="M255 0C114.75 0 0 114.75 0 255s114.75 255 255 255 255-114.75 255-255S395.25 
                0 255 0zm127.5 280.5h-255v-51h255v51z"/>
            </svg>
	  		<p>{props.altShouldValidate.msg}</p>
	  	</div>
	  	);

};

export default InputAlt;