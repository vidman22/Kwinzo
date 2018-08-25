import React from 'react';
import { withRouter } from 'react-router-dom';
import './Tile.css';


const tile = ( props ) => {
	return (
		<div className="Tile" onClick={props.onclick} >
			<h2>{props.name}</h2>


		</div>
		)
};

export default withRouter(tile);