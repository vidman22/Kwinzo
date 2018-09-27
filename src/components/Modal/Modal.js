import React  from "react";
import Carousel from "../Carousel/Carousel";
import CSSTransition from "react-transition-group/CSSTransition";

import "./Modal.css";


const animationTiming = {
    enter: 400,
    exit: 1000
};

const modal = props => {
  return (
    <CSSTransition 
        mountOnEnter 
        unmountOnExit 
        in={props.show} 
        timeout={animationTiming}
        classNames={{
            enter: '',
            enterActive: 'ModalOpen',
            exit: '',
            exitActive: 'ModalClosed'
        }}>
          <div className="Modal">
           <button className="ModalBackButton" onClick={props.back}>Back</button>
            <h1>{props.winner} won!!!</h1>
            <Carousel
              carouselsentence={props.carouselsentence}
              correct={props.correct} 
              index={props.index}  
              length={props.length} 
              slide={props.slide}/>
            <button onClick={props.back}>
              Play Again
            </button>
          </div>
    </CSSTransition>
  );
};

export default modal;