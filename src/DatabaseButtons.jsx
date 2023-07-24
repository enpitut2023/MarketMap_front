import React from 'react';

const DatabaseButtons = ({ database, addelem }) => {

  // データからボタンの生成
  const generateButtons = () => {
    return database.map((data) => {
      const buttonIndex = data[0]; 
      const buttonText = data[2]; 
      const iconSrc = "/icon/" + data[5] + ".png";

      return (
        <button key={buttonIndex} onClick={() => addelem(buttonIndex, buttonText)} className="database-button">
          <img className="icon" src={iconSrc} alt="Icon" />
          <span>{buttonText}</span>
        </button>
      );
    });
  };

  return <div className="button-container">{generateButtons()}</div>;

};

export default DatabaseButtons;

