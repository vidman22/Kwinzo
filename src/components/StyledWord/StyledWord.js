import React from 'react';

import './StyledWord.css';

const StyledWord = props => {
	let cssClasses =[];
	if (props.shouldStyle){
		for ( let i = 0; i < props.styles.length; i++) {
			if (props.styles[i].checked){
				cssClasses.push(props.styles[i].type);
			}
		}
	}
	return (
		<span className={cssClasses.join(' ')}>{' ' + props.word}</span>
		);
}

export default StyledWord;