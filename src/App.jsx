import './App.css';
import Papa from 'papaparse';
import React, { useState, useEffect } from 'react';

function App() {
  const [image, setImageUrl] = React.useState();
  const [whiteimage, setWhiteImageUrl] = React.useState();
  const [csvData, setCsvData] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/sample.csv');
        const csvText = await response.text();

        Papa.parse(csvText, {
          complete: (result) => {
            // CSVデータの解析が完了したら、データを状態に保存する
            setCsvData(result.data);
          },
          header: false, // CSVデータのheaderがない
        });
      } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
      }
    };

    fetchData();
  }, []);

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
        <button onClick={get_white_map}>白地図を取得</button>
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
        <h2>CSVファイルデータ：</h2>
        <ul>
          {csvData.map((row, index) => (
            <li key={index}>
              {Object.entries(row).map(([key, value]) => (
                <span key={key}>{`${value} `}</span>
              ))}
            </li>
          ))}
        </ul>
        <p>
          This is enPiT2023 project team K
        </p>
      </header>
    </div>
  );
}

export default App;
