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
  const [pot, setPot] = useState(0)
  const [finished, setFinished] = useState()

  const func = (board, users, gameState, pot, finished) => {

    setBoard(board)
    setUsers(users)
    setstreet(parseInt(gameState))
    setPot(pot)
    setFinished(finished)

  }
  const startHandler = async () => {
    await axios.post('/api/startGame/').then(res => {
      func(res.data.board, res.data.users, res.data.gamaState, res.data.pot, res.data.finished)
      console.log("*", res.data.finished)
      if (res.data.finished != 0) { console.log("되긴함") }
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






  return (
    <div>
      <div>{JSON.stringify(users)}</div>
      <h1>
        {street === 1 ? board.slice(0, 3) : (
          (street === 2) ? board.slice(0, 4) : (
            (street === 3) ? board.slice(0, 5) : null
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
