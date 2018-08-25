import React, {Component} from "react";
import './Carousel.css';

let index = 0;
export default class Carsl extends Component {
	constructor (props) {
		super(props);

		this.state = {
			sentences:[],
			activeSentence: '',
			index : 0,
		}
		this.slide = this.slide.bind(this)
	}
	UNSAFE_componentWillMount() {
		const sentences = this.props.sentences
		const activeSentence = this.props.sentences[0].sentence;
		this.setState({
			sentences,
			activeSentence
		});

	}
	slide(n) {
			index+=n;
			let sentences = this.state.sentences;
		if ( index === sentences.length ) {
			index = 0;
			this.setState({
				activeSentence: sentences[index].sentence,
				index
			});
			
			
		} if (index === -1 ) {
			
			index = sentences.length - 1;
			this.setState({
				activeSentence: sentences[index].sentence,
				index
			});
		} else {
			this.setState({
				activeSentence: sentences[index].sentence,
				index
			});
		}
	}

	

	render() {
		

		return (
			<div className="Carousel">

				<div className="Content">
					
				<div className="CarouselSentence">
					{this.state.activeSentence}
					<p>{index + 1}/{this.state.sentences.length}</p>
				</div>
				<div className="carouselButtons">
						<button onClick={() => this.slide(-1)} className="Previous">◀</button>
						<button onClick={this.slide.bind(this, 1)} className="Next">▶</button>
				</div>
					

				</div>
			</div>
			)
	}
} 
  