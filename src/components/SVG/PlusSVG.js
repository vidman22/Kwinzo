import React from 'react';

const PlusSVG = (props) => {
    return (
        <div>
            <svg className="Element" 
                onClick={props.onclick}
                fill="#ccc" 
                xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 510 510" width="20px" height="20px">
                             
            <path d="M256 0C114.844 0 0 114.844 0 256s114.844 256 256 256 256-114.844 256-256S397.156 
                0 256 0zm149.333 266.667a10.66 10.66 0 0 1-10.667 10.667H277.333v117.333a10.66 10.66 0 0 1-10.667
                0.667h-21.333a10.66 10.66 0 0 1-10.667-10.667V277.333H117.333a10.66 10.66 0 0 1-10.667-10.667v-21.333a10.66 10.66
                0 0 1 10.667-10.667h117.333V117.333a10.66 10.66 0 0 1 10.667-10.667h21.333a10.66 10.66 0 0 1 10.667 10.667v117.333h117.333a10.66
                10.66 0 0 1 10.667 10.667v21.334z"/>
            </svg>
        </div>
    );
}

export default PlusSVG;
