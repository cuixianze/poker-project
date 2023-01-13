import { useEffect, useState } from 'react';
import Hand from './Hand';
import Action from './Action';


function PlayerInfoOfGame({ sitN, users, setUsers, setStreet }) {

    const [isS, setIsS] = useState(false)
    const [userIdx, setUserIdx] = useState("")
    useEffect(() => {

        Object.keys(users).map(c => {

            if (users[c].sitNum === sitN) {
                setUserIdx(c)
                setIsS(true)
            }
        })
    }, [])


    return (

        // <h1>{users[sitN - 1].sitNum === sitN ? <div>
        //     <Hand cards={users[sitNum].cards} />
        //     <div>{users[sitNum].id}</div>
        //     <div>stack: {users[sitNum].stack}</div>
        // </div>
        //     : "없다"}</h1>
        <div>{isS ?
            <h1>

                <Hand cards={users[userIdx].cards} />
                <div>{users[userIdx].pos ? "딜러" : null}</div>
                < div > {users[userIdx].id}</div>
                <div>stack: {users[userIdx].stack}</div>
                {users[userIdx].isyourturn === 0 ?
                    null :
                    <div>
                        <Action userIdx={userIdx} COC={users[userIdx].isyourturn} setUsers={setUsers} setStreet={setStreet} />
                        {/* COC는CHECK OR CALL */}
                    </div>}

            </h1> : "없다"}</div>
    )
}
export default PlayerInfoOfGame