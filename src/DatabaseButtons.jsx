import React from 'react';
import { Button } from "@mui/material";

const DatabaseButtons = ({ database, addelem, category}) => {

  // データからボタンの生成
  const generateButtons = () => {
    return database.map((data) => {
      const buttonIndex = data[0]; 
      const buttonText = data[2]; 
      const iconSrc = "/icon/" + data[5] + ".png";
      const buttonCategory = data[1];

      if(buttonCategory === category){
        return (
          <Button key={buttonIndex} variant="contained"  sx={{color: "white", background: "dimgray", fontSize: '10px'}} onClick={() => addelem(buttonIndex, buttonText)} className="database-button">
            <img className="icon" src={iconSrc} alt="Icon" />
            <span>{buttonText}</span>
          </Button>
        );
      }else {
        return null
      }
    });
  };

  return <div className="button-container">{generateButtons()}</div>;

};

export default DatabaseButtons;

