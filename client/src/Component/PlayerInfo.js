import { useState } from "react"
import axios from "axios";

function PlayerInfo({ sitNum }) {
    const [id, setId] = useState("");
    const [stack, setStack] = useState("");
    const [isSit, setIsSit] = useState(false);

    const idHandler = (e) => {
        // e.preventDefault();
        setId(e.target.value)
    }
    const stackHandler = (e) => {
        e.preventDefault();
        setStack(e.target.value)
    }

    const submitHandler = (e) => {
        e.preventDefault();
        // console.log(id);
        // console.log(stack);

        const data = {
            "id": id,
            "stack": stack,
            "sitNum": sitNum,
        };

        axios.post('/api/playerInfo', data).then(data => {
            console.log(data)
            if (data.data.isvalid) {
                setIsSit(true)
            }
        })
        // fetch("/api/playerInfo", {
        //     method: "post",
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // }).then(res => res.json()).then(data => {
        //     if (data.isvalid) {
        //         setIsSit(true)
        //     }
        // })



    }


    return (
        <div>
            {isSit ?
                <div>
                    <h3>{sitNum}번자리</h3>
                    <p>{id}</p>
                    <p>스택: {stack}</p>
                </div> :
                <div>
                    <h3>{sitNum}번자리</h3>
                    <span>이름</span>
                    <input onChange={idHandler} value={id}></input><br></br>
                    <span>스택</span>
                    <input onChange={stackHandler} value={stack}></input>
                    <button onClick={submitHandler}>확인</button>
                </div>

            }





        </div>

    )



}

export default PlayerInfo