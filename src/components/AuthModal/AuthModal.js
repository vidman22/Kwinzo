import React  from "react";
import Auth from '../../containers/Auth/Auth';

import "./AuthModal.css";


const modal = props => {
  const cssClasses = [
    "AuthModal",
    props.show ? "AuthModalOpen" : "AuthModalClosed"
  ];
  return (
          <div className={cssClasses.join(' ')}>
            <svg className="CloseModal" onClick={props.togglemodal} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="#ccc" 
                viewBox="0 0 510 510" 
                x="0px" 
                y="0px" 
                width="20px" 
                height="20px">
              <path d="M336.559 68.611L231.016 174.165l105.543 105.549c15.699 15.705 15.699 
                41.145 0 56.85-7.844 7.844-18.128 11.769-28.407 11.769-10.296 0-20.581-3.919-28.419-11.769L174.167 
                231.003 68.609 336.563c-7.843 7.844-18.128 11.769-28.416 11.769-10.285 0-20.563-3.919-28.413-11.769-15.699-15.698-15.699-41.139
                 0-56.85l105.54-105.549L11.774 68.611c-15.699-15.699-15.699-41.145 0-56.844 15.696-15.687 41.127-15.687 56.829 0l105.563 105.554L279.721 
                 11.767c15.705-15.687 41.139-15.687 56.832 0 15.705 15.699 15.705 41.145.006 56.844z"/>
            </svg>
            <Auth togglemodal={props.togglemodal}/>
          </div>
  );
};

export default modal;