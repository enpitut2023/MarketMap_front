import './App.css';
import Papa from 'papaparse';
import React, { useState, useEffect } from 'react';
import { Button } from "@mui/material";
import DatabaseButtons from './DatabaseButtons';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function App() {
  const [image, setImageUrl] = React.useState();
  const [csvData, setCsvData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [numbers, setnumbers] = useState([]);
  const [boughtselected, setBoughtselected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = React.useState(0);
  const [boughtnumbers, setBoughtnumbers] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const send_back = async (array) => {
    try {
      setIsLoading(true); //データを送る前に判定
      const response = await fetch(`https://marketmap-back.onrender.com/image/pinned`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(array),
      });
      const imageUrl = await response.blob();
      setImageUrl(URL.createObjectURL(imageUrl));
      console.log(array);
    } catch (error) {
      console.error("取得失敗！", error);
    } finally {
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

  const addelem = async (num, name) => {
    setSelected([...selected, name]);
    setnumbers([...numbers, num]);
  };

  const elemcomplete = (index) => {
    setBoughtselected([...boughtselected, selected[index]]);
    setSelected([...selected.slice(0, index), ...selected.slice(index + 1)]);
    setBoughtnumbers([...boughtnumbers, numbers[index]]);
    setnumbers([...numbers.slice(0, index), ...numbers.slice(index + 1)]);
    send_back([...numbers.slice(0, index), ...numbers.slice(index + 1)]);
  };

  const elemremove = (index) => {
    setSelected([...selected.slice(0, index), ...selected.slice(index + 1)]);
    setnumbers([...numbers.slice(0, index), ...numbers.slice(index + 1)]);
    send_back([...numbers.slice(0, index), ...numbers.slice(index + 1)]);
  }

  const comfirmremove = (index) => {
    if (window.confirm(`"${selected[index]}"を削除します、よろしいですか？`)) {
      elemremove(index);
    }
  }

  const undocomplete = (index) =>{
    setSelected([...selected, boughtselected[index]]);
    setnumbers([...numbers, boughtnumbers[index]]);
    send_back([...numbers, boughtnumbers[index]]);
    setBoughtselected([...boughtselected.slice(0,index), ...boughtselected.slice(index+1)]);
    setBoughtnumbers([...boughtnumbers.slice(0,index), ...boughtnumbers.slice(index+1)]);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 classname="title">
          Market Map
        </h1>
        <p>＠カスミ　テクノパーク桜店</p>
        <p>以下から商品を選んでね！</p>
      
        <Box sx={{ width: '100%'}}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" textColor="#ffffff">
              <Tab label="肉類" {...a11yProps(0)} />
              <Tab label="卵・乳製品" {...a11yProps(1)} />
              <Tab label="魚介・海藻" {...a11yProps(2)} />
              <Tab label="野菜・フルーツ" {...a11yProps(3)} />
              <Tab label="米類・シリアル" {...a11yProps(4)} />
              <Tab label="パン類" {...a11yProps(5)} />
              <Tab label="麺類" {...a11yProps(6)} />
              <Tab label="ご飯のお供" {...a11yProps(7)} />
              <Tab label="惣菜・冷凍食品" {...a11yProps(8)} />
              <Tab label="調味料" {...a11yProps(9)} />
              <Tab label="菓子類" {...a11yProps(10)} />
              <Tab label="デザート" {...a11yProps(11)} />
              <Tab label="生活用品" {...a11yProps(12)} />
              <Tab label="飲料" {...a11yProps(13)} />
              <Tab label="その他" {...a11yProps(14)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'肉類'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'卵・乳製品'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'魚介・海藻'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'野菜・フルーツ'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'米類・シリアル'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'パン類'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={6}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'麺類'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={7}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'ご飯のお供'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={8}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'惣菜・冷凍食品'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={9}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'調味料'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={10}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'菓子類'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={11}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'デザート'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={12}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'生活用品'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={13}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'飲料'}/>
          </ul>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={14}>
          <ul className='buttons'>
            <DatabaseButtons database={csvData} addelem={addelem} category={'その他'}/>
          </ul>
          </CustomTabPanel>
        </Box>
        
        {/*
        <ul className='buttons'>
          <DatabaseButtons database={csvData} addelem={addelem} />
        </ul>
  */}
        <p>
          <Button variant="contained" onClick={() => send_back(numbers)}>マップを表示</Button>
        </p>

        <p>買い物リスト</p>
        <div className='elements'>
          {selected.map((name, index) => (
            <ul key={index} className='selected'>
              {name}
              <button onClick={() => elemcomplete(index)}>カゴに入れた</button>
              <button onClick={() => comfirmremove(index)}>削除</button>
            </ul>
          ))}
          {boughtselected.map((name, index) => (
            <ul key={index} style={{ textDecoration: "line-through" }} className='bought'>
              {name}
              <button onClick={() => undocomplete(index)}>元に戻す</button>
            </ul>
          ))}
        </div>

        {isLoading ? (
          <div>
            <p>Now Loading...</p>
          </div>
        ) : image ? (
          <div>
            <img src={image} alt="地図画像" width="100%" />
          </div>
        ) : null}
        <p>
          This is enPiT2023 project team K
        </p>
      </header>
    </div>
  );
}

export default App;
