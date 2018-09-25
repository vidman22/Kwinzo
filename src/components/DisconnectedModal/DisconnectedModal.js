import React  from "react";

import "./DisconnectedModal.css";

const modal = props => {
  const cssClasses = [
    "DisconnectedModal",
    props.show ? "DisconnectedModalOpen" : "DisconnectedModalClosed"
  ];
  
  return (
          <div className={cssClasses.join(' ')}>
          { props.players.length !==0 ? (
            <div>
              <h1>Disconnected Players</h1>
              <span>Click on a player to remove</span>
                {props.players.map( (player) => {
                  return <div key={player.id} className="DisconnectedPlayer" onClick={() => props.removeplayer(player.id)}>{player.playerName}</div>
                })}
              <button onClick={props.start} className="DisconnectButton">Start</button>
            </div>
          ) : (
            <h1>Try Reloading Game</h1>
          )}
          </div>
  );
};

export default modal;