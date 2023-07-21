import './App.css';
import Papa from 'papaparse';
import React, { useState, useEffect } from 'react';

function App() {
  const [image, setImageUrl] = React.useState();
  const [whiteimage, setWhiteImageUrl] = React.useState();
  const [csvData, setCsvData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [numbers, setnumbers] = useState([]);

  const get_white_map = async() =>{
    try{
      const response = await fetch("https://marketmap-back.onrender.com/image/white");
      const imageUrl = await response.blob();
      setWhiteImageUrl(URL.createObjectURL(imageUrl));
    }catch(error){
      console.error("取得失敗！", error);
    } 
  };

  const send_back = async(array) =>{
    try{
      const response = await fetch(`https://marketmap-back.onrender.com/image/pinned`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(array),
      });
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

  const addelem = async(num, name) =>{
    setSelected([...selected, name]);
    setnumbers([...numbers], num);
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
        <button onClick={get_white_map}>白地図を取得</button>
        }
        {image ?
        <div>
          <img src={image} alt="地図画像" width="100%" />
        </div>:
        <div></div>
        }
        <p>
          <button onClick={() => addelem(0, "醤油")}>醤油</button>
          <button onClick={() => addelem(1, "マヨネーズ")}>マヨネーズ</button>
          <button onClick={() => addelem(2, "牛肉")}>牛肉</button>
        </p>
        {image?
        <div>
          <img src={image} alt="地図画像" width="100%" />
        </div>:
        <div>
          <button onClick={() => send_back(numbers)}>マップを表示</button>
        </div>}
        <p>買い物リスト</p>
        <ul>
          {selected.map((name, index) =>{
            <li key={index}>{name}</li>
          })}
        </ul>
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
