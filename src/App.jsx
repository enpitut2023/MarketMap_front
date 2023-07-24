import './App.css';
import Papa from 'papaparse';
import React, { useState, useEffect } from 'react';
import { Button } from "@mui/material";

function App() {
  const [image, setImageUrl] = React.useState();
  const [csvData, setCsvData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [numbers, setnumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const send_back = async(array) =>{
    try{
      setIsLoading(true); //データを送る前に判定
      const response = await fetch(`https://marketmap-back.onrender.com/image/pinned`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(array),
      });
      const imageUrl = await response.blob();
      setImageUrl(URL.createObjectURL(imageUrl));
      console.log(array);
    }catch(error){
      console.error("取得失敗！", error);
    } finally{
      setIsLoading(false); //データを送ったら初期値に戻す
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.csv');
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
    setnumbers([...numbers, num]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 classname="title">
          Market Map
        </h1>
        <p>
          <p>以下から商品を選んでね！</p>
          <Button variant="contained" color="secondary" onClick={() => addelem(0, "醤油")}>
            <img src="img/shoyu.png" alt="Icon" className="icon" />
            <span>醤油</span>
          </Button>
          <Button variant="contained" color="secondary" onClick={() => addelem(1, "マヨネーズ")}>マヨネーズ</Button>
          <Button variant="contained" color="secondary" onClick={() => addelem(2, "牛肉")}>牛肉</Button>
        </p>
        {isLoading?(
          <div>
            <p>Now Loading...</p>
          </div>
        ):image ?(
          <div>
            <img src={image} alt="地図画像" width="100%" />
          </div>
        ):(
          <div>
            <Button variant="contained" onClick={() => send_back(numbers)}>マップを表示</Button>
          </div>
        )}
        {/* {image? */}
        {/* <div> */}
          {/* <img src={image} alt="地図画像" width="100%" /> */}
        {/* </div>: */}
        {/* <div> */}
          {/* <Button variant="contained" onClick={() => send_back(numbers)}>マップを表示</Button> */}
        {/* </div>} */}
        <p>買い物リスト</p>
        <ul>
          {selected.map((name, index) =>(
            <li key={index}>{name}</li>
          ))}
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
