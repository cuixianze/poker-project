import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import PlayerInfo from './Component/PlayerInfo';
import axios from 'axios';
import Hand from './Component/Hand';
import PlayerInfoOfGame from './Component/PlayerInfoOfGame';


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
  const [users, setUsers] = useState("")
  const [board, setBoard] = useState()
  const [street, setstreet] = useState(0)


  const func = (board) => {
    console.log("실행됨")
    setBoard(board)
    console.log(board)
  }
  const startHandler = async () => {
    await axios.post('/api/startGame/').then(res => {
      setUsers(res.data.users)
      setstreet(res.data.gamaState);
      func(res.data.board)
    })
    // await axios.post('/api/board')//보드 5장을 한번에 받아옴
    setGameStart(true)
    // 서버로부터 게임에 참여하는 플레이어들의 정보를 불러온후 화면에 출력한다.
  }




  return (
    <div>
      <div>{JSON.stringify(users)}</div>
      <div>
        {street === 0 ? null : (
          (street === 1) ? "플랍" : (
            (street === 2) ? "턴" : "리버"
          )
        )

        }
      </div>
      {GameStart ?
        <div>
          <PlayerInfoOfGame sitN={1} users={users} setUsers={setUsers} setStreet={setstreet} />
          <PlayerInfoOfGame sitN={2} users={users} setUsers={setUsers} setStreet={setstreet} />
          <PlayerInfoOfGame sitN={3} users={users} setUsers={setUsers} setStreet={setstreet} />
          <PlayerInfoOfGame sitN={4} users={users} setUsers={setUsers} setStreet={setstreet} />

          <div>

          </div>


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
