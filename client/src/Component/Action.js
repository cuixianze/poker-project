import axios from "axios"
import { useState } from "react"

function Action({ userIdx, COC, setUsers, setStreet }) {

    const [isRaise, setIsRaise] = useState(false)
    const [raiseSize, setRaiseSize] = useState(0)


    const raiseSizeHandler = (e) => {
        e.preventDefault();
        setRaiseSize(e.target.value)
    }

    const isRaiseHandler = (e) => {
        e.preventDefault();
        setIsRaise(true)
    }

    const makeCall = () => {
        const data = {
            "who": userIdx,
            "action": "call"
        }
        axios.post('/api/action', data).then(c => {

            console.log(c.data)
            setUsers(c.data.users)
            setStreet(c.data.gameState)
        })
    }
    const makeRaise = () => {
        const data = {
            "who": userIdx,
            "action": raiseSize
        }
        axios.post('/api/action', data).then(c => {
            console.log(c.data)
            setUsers(c.data.users)
            setStreet(c.data.gameState)
        })
    }
    const makeFold = () => {
        const data = {
            "who": userIdx,
            "action": "fold"
        }
        axios.post('/api/action', data).then(c => {
            console.log(c.data)
            setUsers(c.data.users)
            setStreet(c.data.gameState)
        })
    }




    console.log(userIdx)
    return (
        <div>

            {COC === 1 ?
                <div>
                    <button onClick={makeCall}>Call</button>
                    <button onClick={isRaiseHandler}>Raise</button>
                    {isRaise ? <div><input value={raiseSize} onChange={raiseSizeHandler}></input><button onClick={makeRaise}>확인</button></div> : null}
                    <button onClick={makeFold}>Fold</button>

                </div> :
                <div>
                    <button onClick={makeCall}>Check</button>
                    <button onClick={isRaiseHandler}>Raise</button>
                    {isRaise ? <div><input value={raiseSize} onChange={raiseSizeHandler}></input><button onClick={makeRaise}>확인</button></div> : null}
                    <button onClick={makeFold}>Fold</button>
                </div>}
        </div>
    )
}
export default Action