import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Board from './Board';
import PlayerInfo from './PlayerInfo';


function App() {

  // const [players, setPlayers] = useState();
  // useEffect(() => {
  //   const callPlayers = async () => {
  //     const res = await fetch('/api/players');
  //     const body = await res.json();
  //     return body;
  //   }

  //   const getPlayers = () => {
  //     callPlayers().then(res => {
  //       setPlayers(res)
  //     }).catch(err => console.log(err));
  //   }
  // }, [])

  const [GameStart, setGameStart] = useState(false)

  const startHandler = () => {
    setGameStart(true)
    // 서버로부터 게임에 참여하는 플레이어들의 정보를 불러온후 화면에 출력한다.
  }

  return (
    <div>
      {GameStart ?
        <div>
          <h1>게임을 시작합니다.</h1>
        </div> :
        <div>
          <PlayerInfo sitNum={1} /><br></br>
          <PlayerInfo sitNum={2} /><br></br>
          <PlayerInfo sitNum={3} /><br></br>
          <PlayerInfo sitNum={4} /><br></br>
          <button onClick={startHandler}>GAMESTART</button>
        </div>}




    </div>




  );
}

export default App;
