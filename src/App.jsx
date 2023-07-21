import './App.css';
import React from "react";
import { Button } from "@mui/material";

function App() {
  const [image, setImageUrl] = React.useState();
  const [whiteimage, setWhiteImageUrl] = React.useState();

  const get_white_map = async() =>{
    try{
      const response = await fetch("https://marketmap-back.onrender.com/image/white");
      const imageUrl = await response.blob();
      setWhiteImageUrl(URL.createObjectURL(imageUrl));
    }catch(error){
      console.error("取得失敗！", error);
    } 
  };

  const send_back = async(number) =>{
    try{
      const response = await fetch(`https://marketmap-back.onrender.com/image/pinned?param=${number}`);
      const imageUrl = await response.blob();
      setImageUrl(URL.createObjectURL(imageUrl));
    }catch(error){
      console.error("取得失敗！", error);
    } 
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 classname="title">
          Market Map
        </h1>
        {whiteimage ?
        <div>
          <img src={whiteimage} alt="地図画像" width="100%" />
        </div> :
        <Button variant="contained" onClick={get_white_map}>白地図を取得</Button>
        }
        {image ?
        <div>
          <img src={image} alt="地図画像" width="100%" />
        </div>:
        <div></div>
        }
        <p>
          <button onClick={() => send_back(1)}>醤油</button>
          <button onClick={() => send_back(2)}>マヨネーズ</button>
          <button onClick={() => send_back(3)}>牛肉</button>
        </p>
        <p>
          This is enPiT2023 project team K
        </p>
        
      </header>
    </div>
  );
}

export default App;
