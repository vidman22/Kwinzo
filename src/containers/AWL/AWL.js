import React, { Component } from 'react';
import Tile from '../../components/Tile/Tile';
import AWLGame from '../AWLGame/AWLGame';

import AWList from '../../awl.json';

const List = AWList.AWL;


export default class AWL extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			games: [ {
				name: "Sublist 1",
				id:'sublist-1'
			},{
				name: "Sublist 2",
				id:'sublist-2'
			},{
				name: "Sublist 3",
				id:'sublist-3'
			},{
				name: "Sublist 4",
				id:'sublist-4'
			},{
				name: "Sublist 5",
				id:'sublist-5'
			},{
				name: "Sublist 6",
				id:'sublist-6'
			},{
				name: "Sublist 7",
				id:'sublist-7'
			},{
				name: "Sublist 8",
				id:'sublist-8'
			},{
				name: "Sublist 9",
				id:'sublist-9'
			},{
				name: "Sublist 10",
				id:'sublist-10'
			}],
			action: 'options',
			activeGame: '',
			gameSentences: [],
			gameName: ''
		}

		this.start = this.start.bind(this);
		this.back = this.back.bind(this);
	}


	

	start(id, name, e) {
		e.preventDefault();
		
		let gameSentences = List[id];
		let gameName = name;
		
		this.setState({
			action: null,
			activeGame: id,
			gameSentences,
			gameName
			
		});
	}

	back() {
		this.setState({
			action: 'options'
		});
	}

	render() {	
	
		const games = this.state.games.map((game, index) => {
			return (
				 

				 	<Tile 
						onclick={(e) => this.start(game.id, game.name, e)}
						name = {game.name}
						key = {game.id}
						
					/>
				 
			
	    	);

		});
		
		return (
			<div className="create">
				{this.state.action === 'options' ? <div className="page_title"><h1>Academic Word List</h1></div> :null}
				{this.state.action === 'options' ? games : <AWLGame back={this.back} gamename={this.state.gameName} game={this.state.activeGame} sentences={this.state.gameSentences} />}
				
			</div>
		);
	}
}