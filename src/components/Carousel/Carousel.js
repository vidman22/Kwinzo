import React from "react";
import './Carousel.css';


 const Carousel = (props) => {
	const index = props.carouselsentence.indexOf(props.correct); 
	const index2 = index + props.correct.length;

	const s1 = ( index === 0 ? null : props.carouselsentence.slice(0, index) );
	const s2 = props.carouselsentence.slice(index2, props.carouselsentence.length);
	let inputColor = '#00c4c3';

		return (
			<div className="Carousel">
				<div className="Content">
				<div className="FirstPart"><span>{s1}</span></div>
				<div className="CarouselAnswer" style={{'color': inputColor}}>{props.correct}</div>	
				<div className="SecondPart"><span>{s2}</span></div>
				<p>{props.index + 1}/{props.length}</p>
				<div className="carouselButtons">
					<button onClick={() => props.slide(-1)} className="Previous">◀</button>
					<button onClick={() => props.slide(1)} className="Next">▶</button>
				</div>
				</div>
			</div>
			)
} 
export default Carousel;
  