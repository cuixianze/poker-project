import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import PlayerInfo from './Component/PlayerInfo';
import axios from 'axios';
import Hand from './Component/Hand';
import PlayerInfoOfGame from './Component/PlayerInfoOfGame';

const img_board = {"Ac":["image/AC.png"], "2c":["image/2C.png"], "3c":["image/3C.png"], "4c":["image/4C.png"], "5c":["image/5C.png"], "6c":["image/6C.png"], "7c":["image/7C.png"], "8c":["image/8C.png"], "9c":["image/9C.png"], "Tc":["image/10C.png"], "Jc":["image/JC.png"], "Qc":["image/QC.png"], "Kc":["image/KC.png"],
                    "Ad":["image/AD.png"], "2d":["image/2D.png"], "3d":["image/3D.png"], "4d":["image/4D.png"], "5d":["image/5D.png"], "6d":["image/6D.png"], "7d":["image/7D.png"], "8d":["image/8D.png"], "9d":["image/9D.png"], "Td":["image/10D.png"], "Jd":["image/JD.png"], "Qd":["image/QD.png"], "Kd":["image/KD.png"],
                    "Ah":["image/AH.png"], "2h":["image/2H.png"], "3h":["image/3H.png"], "4h":["image/4H.png"], "5h":["image/5H.png"], "6h":["image/6H.png"], "7h":["image/7H.png"], "8h":["image/8H.png"], "9h":["image/9H.png"], "Th":["image/10H.png"], "Jh":["image/JH.png"], "Qh":["image/QH.png"], "Kh":["image/KH.png"], 
                    "As":["image/AS.png"], "2s":["image/2S.png"], "3s":["image/3S.png"], "4s":["image/4S.png"], "5s":["image/5S.png"], "6s":["image/6S.png"], "7s":["image/7S.png"], "8s":["image/8S.png"], "9s":["image/9S.png"], "Ts":["image/10S.png"], "Js":["image/JS.png"], "Qs":["image/QS.png"], "Ks":["image/KS.png"]}


function cardToImg(board){
  for (let i=0 ; i<5 ; i++){
    board[i] = img_board[board[i]][0];
  }
  return board;
};

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
  const [pot, setPot] = useState(0)
  const [finished, setFinished] = useState()

  const func = (board, users, gameState, pot, finished) => {

    board = cardToImg(board);
    setBoard(board);
    setUsers(users)
    setstreet(parseInt(gameState))
    setPot(pot)
    setFinished(finished)

  }
  const startHandler = async () => {
    await axios.post('/api/startGame/').then(res => {
      func(res.data.board, res.data.users, res.data.gamaState, res.data.pot, res.data.finished)
      console.log("*", res.data.finished)
      if (res.data.finished !== 0) { console.log("되긴함") }
    })
    // await axios.post('/api/board')//보드 5장을 한번에 받아옴
    setGameStart(true)
    // 서버로부터 게임에 참여하는 플레이어들의 정보를 불러온후 화면에 출력한다.
  }


  useEffect(() => {
    if (finished) {
      setTimeout(() => {
        startHandler()
        console.log("여긴가")
      }, 5000)
    }
  }, [finished])




  
  //보드=[as , tc] 형식이 아닌 링크를 [http...,  http...]리스트화해서 보내줄예정
  return (
    <div>
      <div>{JSON.stringify(users)}</div>
      <h1>
        {street === 1 ?// board.slice(0,3) : (
        <div>
          <img src={ process.env.PUBLIC_URL + board[0]} width={100} height={100}/>
          <img src={ process.env.PUBLIC_URL + board[1]} width={100} height={100}/>
          <img src={ process.env.PUBLIC_URL + board[2]} width={100} height={100}/>
        </div> : ( 
          (street === 2) ? 
          <div>
            <img src={ process.env.PUBLIC_URL + board[0]} width={100} height={100}/>
            <img src={ process.env.PUBLIC_URL + board[1]} width={100} height={100}/>
            <img src={ process.env.PUBLIC_URL + board[2]} width={100} height={100}/>
            <img src={ process.env.PUBLIC_URL + board[3]} width={100} height={100}/>
          </div>
          : (
            (street === 3) ? 
            <div>
              <img src={ process.env.PUBLIC_URL + board[0]} width={100} height={100}/>
              <img src={ process.env.PUBLIC_URL + board[1]} width={100} height={100}/>
              <img src={ process.env.PUBLIC_URL + board[2]} width={100} height={100}/>
              <img src={ process.env.PUBLIC_URL + board[3]} width={100} height={100}/>
              <img src={ process.env.PUBLIC_URL + board[4]} width={100} height={100}/>
            </div>
            : null
          )
        )
        }
      </h1>
      {GameStart ?
        <div>
          {finished ?
            <div>
              <p>위너는 {users[finished].id} 입니다</p>
            </div>
            :
            <div>
              <h2>pot:{pot}</h2>
              <PlayerInfoOfGame sitN={1} users={users} setUsers={setUsers} setStreet={setstreet} setPot={setPot} setFinished={setFinished} />
              <PlayerInfoOfGame sitN={2} users={users} setUsers={setUsers} setStreet={setstreet} setPot={setPot} setFinished={setFinished} />
              <PlayerInfoOfGame sitN={3} users={users} setUsers={setUsers} setStreet={setstreet} setPot={setPot} setFinished={setFinished} />
              <PlayerInfoOfGame sitN={4} users={users} setUsers={setUsers} setStreet={setstreet} setPot={setPot} setFinished={setFinished} />
            </div>
          }


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
