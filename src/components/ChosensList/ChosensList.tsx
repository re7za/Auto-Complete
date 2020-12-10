import "./ChosensList.css";

import React from "react";

// Interfaces
interface Iprops {
  chosens: string[];
  multiple: boolean;
}

function ChosensList({ chosens, multiple }: Iprops) {
  return (
    <div className="chosen-container">
      {multiple ? (
        <>
          <h4>Chosen Items :</h4>
          <ul className="chosen-list">
            {chosens.map((item, i) => (
              <li key={`chosen-${i}`} className="chosen-items">
                {item}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <React.Fragment>
          <h4>Chosen Items :</h4>
          <div className="chosen-item">{chosens[0]}</div>
        </React.Fragment>
      )}
    </div>
  );
}

export default ChosensList;
