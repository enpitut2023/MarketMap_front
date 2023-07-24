import './App.css';
import Papa from 'papaparse';
import React, { useState, useEffect } from 'react';
import { Button } from "@mui/material";
import DatabaseButtons from './DatabaseButtons';

function App() {
  const [image, setImageUrl] = React.useState();
  const [csvData, setCsvData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [numbers, setnumbers] = useState([]);
  const [boughtselected, setBoughtselected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const send_back = async(array) =>{
    try{
      setIsLoading(true); //データを送る前に判定
      const response = await fetch(`http://127.0.0.1:8000/image/pinned`,{
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

  const elemcomplete = (index) =>{
    setBoughtselected([...boughtselected, selected[index]]);
    setSelected([...selected.slice(0,index), ...selected.slice(index+1)]);
    setnumbers([...numbers.slice(0,index), ...numbers.slice(index+1)]);
  };

  const elemremove = (index) =>{
    setSelected([...selected.slice(0,index), ...selected.slice(index+1)]);
    setnumbers([...numbers.slice(0,index), ...numbers.slice(index+1)]);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 classname="title">
          Market Map
        </h1>
        <p>
          <p>以下から商品を選んでね！</p>
        </p>
        <ul>
        <DatabaseButtons database={csvData} addelem={addelem} />
        </ul>
        <p>
            <Button variant="contained" onClick={() => send_back(numbers)}>マップを表示</Button>
        </p>
        
        <p>買い物リスト</p>
        <ul>
        {selected.map((name, index) => (
        <li key={index}>
          <input
            type="checkbox"
            checked={false}
            onChange={() => elemcomplete(index)}
          />
          {name}
          <button onClick={() => elemremove(index)}>削除</button>
        </li>
      ))}
      {boughtselected.map((name, index) => (
        <li key={index} style={{ textDecoration: "line-through" }}>
          <input type="checkbox" checked={true} disabled />
          {name}
        </li>
      ))}
        </ul>

        {isLoading?(
          <div>
            <p>Now Loading...</p>
          </div>
        ):image ?(
          <div>
            <img src={image} alt="地図画像" width="100%" />
          </div>
        ):null}
        <p>
          This is enPiT2023 project team K
        </p>
      </header>
    </div>
  );
}

export default App;
