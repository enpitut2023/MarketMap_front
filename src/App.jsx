import './App.css';
import React from "react";

function App() {
  const [image, setImageUrl] = React.useState();
  const [whiteimage, setWhiteImageUrl] = React.useState();

  const get_pinned_map = async() =>{
    try{
      const response = await fetch("http://127.0.0.1:8000/image/pinned");
      const imageUrl = await response.blob();
      setImageUrl(URL.createObjectURL(imageUrl));
    }catch(error){
      console.error("取得失敗！", error);
    }
  };

  const get_white_map = async() =>{
    try{
      const response = await fetch("http://127.0.0.1:8000/image/white");
      const imageUrl = await response.blob();
      setWhiteImageUrl(URL.createObjectURL(imageUrl));
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
        {image ?
        <div>
          <img src={image} alt="地図画像" width="100%" />
        </div> :
        <button onClick={get_pinned_map}>ピン刺し済み地図を取得</button>
        }

        {whiteimage ?
        <div>
          <img src={whiteimage} alt="地図画像" width="100%" />
        </div> :
        <button onClick={get_white_map}>白地図を取得</button>
        }
        <p>
          This is enPiT2023 project team K
        </p>
      </header>
    </div>
  );
}

export default App;
