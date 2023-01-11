function Board({ boardState, board }) {

    const flop = board.slice(0, 3)
    const turn = board.slice(0, 4)



    if (boardState === "free-flop") {
        return <div></div>
    } else if (boardState === "flop") {
        return (
            <ul>
                {flop.map((card) => {
                    return <li key={card}>{card}</li>
                })}
            </ul>
        )


    } else if (boardState === "turn") {
        return (
            <ul>
                {turn.map((card) => {
                    return <li key={card}>{card}</li>
                })}
            </ul>
        )
    } else if (boardState === "rever") {
        return (
            <ul>
                {board.map((card) => {
                    return <li key={card}>{card}</li>
                })}
            </ul>
        )
    }


}
export default Board