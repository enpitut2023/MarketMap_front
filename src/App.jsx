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

  return (
    <div className="App">
      <header className="App-header">
        <h1 classname="title">
          Market Map
        </h1>
        <p>
          <p>以下から商品を選んでね！</p>
        </p>
        <Box sx={{ width: '100%'}}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
              <Tab label="肉類" {...a11yProps(0)} sx={{ color: '#ffffff' }}/>
              <Tab label="魚介・海藻・卵" {...a11yProps(1)} sx={{ color: '#ffffff' }}/>
              <Tab label="野菜・フルーツ" {...a11yProps(2)} sx={{ color: '#ffffff' }}/>
              <Tab label="米類" {...a11yProps(3)} sx={{ color: '#ffffff' }}/>
              <Tab label="パン類" {...a11yProps(4)} sx={{ color: '#ffffff' }}/>
              <Tab label="生麺類" {...a11yProps(5)} sx={{ color: '#ffffff' }}/>
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <DatabaseButtons database={csvData} addelem={addelem} category={'肉類'}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <DatabaseButtons database={csvData} addelem={addelem} category={'魚介・海藻'}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <DatabaseButtons database={csvData} addelem={addelem} category={'野菜・フルーツ'}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <DatabaseButtons database={csvData} addelem={addelem} category={'米類'}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <DatabaseButtons database={csvData} addelem={addelem} category={'パン類'}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <DatabaseButtons database={csvData} addelem={addelem} category={'生麺類'}/>
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
              <input
                type="checkbox"
                checked={false}
                onChange={() => elemcomplete(index)}
              />
              {name}
              <button onClick={() => comfirmremove(index)}>削除</button>
            </ul>
          ))}
          {boughtselected.map((name, index) => (
            <ul key={index} style={{ textDecoration: "line-through" }} className='bought'>
              <input type="checkbox" checked={true} disabled />
              {name}
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
