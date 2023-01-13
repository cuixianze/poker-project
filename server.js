
const express = require('express');
const path = require('path');
const { send } = require('process');
const PokerEvaluator = require('poker-evaluator');


const app = express()

var playerCount = 0;
var users = {}
const DECK = ["Ac", "2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "Tc", "Jc", "Qc", "Kc", "Ad", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "Td", "Jd", "Qd", "Kd", "Ah", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "Th", "Jh", "Qh", "Kh", "As", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "Ts", "Js", "Qs", "Ks"]


var bettingLine = []

var dealer = -1
var turnOfWho = -1
var gameState = 0
var board = []
var pot = 0

var info = {
    "users": users,
    "gameState": gameStateh,
    "board": board,
    "pot": pot,
    "finished": 0
}

const smallBlind = 500
const bihBlind = 1000



function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function checkEnd(x, users) {
    let state = [];
    let idx = parseInt(x)

    let max_bet = 0;
    let num = 0;
    for (let i = 0; i < users.length; i++) {
        if (users[i][0] == -1) {
            num++;
        }
        if (users[i][1] > max_bet) {
            max_bet = users[i][1];

        }
    }

    //혼자남았을때 미리 검증, 게임끝
    if (num === users.length - 1) {
        return [-1, null, null];
    }
    //무조건 다음차례 있을때
    while (true) {
        idx++;
        if (users[(idx) % users.length][0] === 1) {
            return [0, null, null];
        }
        if (users[(idx) % users.length][0] === 0) {
            state.push(1);
            state.push((idx) % users.length);
            if (max_bet === users[(idx) % users.length][1]) {
                //check
                state.push(2);
            }
            else {
                //call
                state.push(1);
            }
            return state;
        }
    }
};

function reset_info(info){
    let idx=0;
    for(let key in info.users){
        if (info.users[key].pos===1){
            info.users[key].pos=0;
            idx = toString(parseInt(key)+1)
        }
        info.users[key].cards = [];
    }
    info.users[idx%(info.users.length)].pos=1;
    info.gameState = 0;
    info.board = [];
    info.pot = 0;

    return info;
}

function gameover(info, betline){
    //남아있는 사람수 1명일때 -> 스택만 높이고 싹다 초기화
    let num=0;
    let idx = [];
    for (let i=0 ; i<betline.length ; i++){
        if (betline[i][0]===1){
            num++;
            idx.push(toString(i)); //i를 스트링으로 바꿔야됨
        }
    }
    //한명남아서 게임종료
    if (num===1){
        //스택 저장
        info.users[idx[0]].stack += info.pot;
        //나머지들 초기화
        info = reset_info(info);
        return info;
    }
    //리버끝나고 왔을때
    else{
        let winer_idx = [];
        let max_value = -1
        //winer_idx에 이긴놈(들) 저장되어있음
        idx.forEach((idx) => {
            //함수불러서 핸드밸류 조사 -> 핸드밸류비교후 같은놈 있는지 체크
            let x = PokerEvaluator.evalHand([...board, ...info.users[idx].cards])
            if (x.value > max_value){
                winer_idx = [];
                winer_idx.push(idx);
                max_value = x.value
            }else if(x.value===max_value){
                winer_idx.push(idx);
            }
        })
        //스택에 저장
        if (winer_idx.length===1){
            info.users[winer_idx[0]].stack +=  info.pot;
        }
        else{
            winer_idx.forEach((idx)=>{
                info.users[idx].stack +=  info.pot/parseInt(winer_idx.length);
            })
        }
        info = reset_info(info);
        return info;
    }
};

function reSetBettingLine(bettingLine) {
    //0이없을때 -> return state++, 리스트변경-1빼고 
    //0이 있다 -> 
    for (let i = 0; i < bettingLine.length; i++) {
        if (bettingLine[i][0] === -1) {
            bettingLine[i][0] = -1;
            bettingLine[i][1] = 0;
        }
        else {
            bettingLine[i][0] = 0;
            bettingLine[i][1] = 0;
        }
    }

    return bettingLine;
}

function checkTurnOfWho(btn, bettingLine) {
    let btn_idx = parseInt(btn);

    while (true) {
        btn_idx++;
        if (bettingLine[(btn_idx) % (bettingLine.length)][0] === 0) {
            return (btn_idx) % (bettingLine.length);
        }
    }
}

function setUserStack(users, size, idx) {
    users[idx].stack = users[idx].stack - size;
}

function resetInfo(info) {
    let idx = 0;
    for (let key in info.users) {
        if (info.users[key].pos === 1) {
            info.users[key].pos = 0;
            idx = parseInt(key) + 1
        }
        info.users[key].cards = [];
    }
    const keyList = Object.keys(users)
    console.log("=============", info.users[idx % (keyList.length)])
    console.log(keyList.length)
    console.log(idx % (keyList.length))
    console.log(typeof (idx % (keyList.length)))
    info.users[idx % (keyList.length)].pos = 1;
    info.gameState = 0;
    info.board = [];
    info.pot = 0;
    console.log("여기까지")
    return info;
}


function gameOver(info, betline) {
    //남아있는 사람수 1명일때 -> 스택만 높이고 싹다 초기화
    let num = 0;
    let idx = [];
    console.log(betline);
    for (let i = 0; i < betline.length; i++) {
        if ((betline[i][0] === 1) || (betline[i][0] === 0)) {
            num++;
            idx.push(i); //i를 스트링으로 바꿔야됨
        }
    }
    //한명남아서 게임종료
    if (num === 1) {
        console.log("한명남아서 종료할예정")
        //스택 저장
        console.log(idx)
        console.log(info.users[idx[0]])
        info.users[idx[0]].stack += info.pot;
        //나머지들 초기화
        info = resetInfo(info);
        info.finished = [idx[0]]
        return info;
    }
    //리버끝나고 왔을때
    else {
        console.log("리버에서 쇼다운할예정")
        let winer_idx = [];
        let max_value = -1
        //winer_idx에 이긴놈(들) 저장되어있음
        idx.forEach((idx) => {
            //함수불러서 핸드밸류 조사 -> 핸드밸류비교후 같은놈 있는지 체크
            let x = PokerEvaluator.evalHand([...board, ...info.users[idx].cards])
            if (x.value > max_value) {
                winer_idx = [];
                winer_idx.push(idx);
                max_value = x.value
            } else if (x.value === max_value) {
                winer_idx.push(idx);
            }
        })
        //스택에 저장
        if (winer_idx.length === 1) {
            info.users[winer_idx[0]].stack += info.pot;
        }
        else {
            winer_idx.forEach((idx) => {
                info.users[idx].stack += info.pot / parseInt(winer_idx.length);
            })
        }

        info = resetInfo(info);
        info.finished = winer_idx
        return info;
    }
};





app.set('port', 5000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Hello!")
})



app.post('/api/playerInfo', (req, res) => {
    console.log(req.body)

    if (playerCount == 0) {
        users[playerCount] = req.body;
        users[playerCount].pos = 1;
        playerCount = playerCount + 1

    } else {
        users[playerCount] = req.body;
        users[playerCount].pos = 0;
        playerCount = playerCount + 1
    }

    res.send({
        'isvalid': true
    })
})

app.post('/api/startGame', (req, res) => {
    const deck = DECK.slice()
    shuffle(deck)
    info.users = users
    info.gameState = gameState
    pot = smallBlind + bigBlind
    info.pot = pot
    board = [0, 0, 0, 0, 0].map(c => { return deck.pop() })
    info.board = board
    info.finished = 0
    console.log("게임시작전 베팅라인", bettingLine)
    var keyList = Object.keys(users);
    for (key in keyList) {
        var hands = [0, 0].map(c => { return deck.pop() })
        var cards = "cards"
        users[keyList[key]][cards] = hands
        bettingLine.push(new Array(2).fill(0))

        if (users[keyList[key]].pos === 1) {
            dealer = parseInt(key)
        }
    }
    console.log("푸쉬한후 베팅라인", bettingLine)

    bettingLine[(dealer + 1) % (keyList.length)] = [0, smallBlind];
    bettingLine[(dealer + 2) % (keyList.length)] = [0, bigBlind];
    setUserStack(users, smallBlind, (dealer + 1) % (keyList.length))
    setUserStack(users, bigBlind, (dealer + 2) % (keyList.length))
    turnOfWho = (parseInt(dealer) + 3) % (keyList.length)

    console.log(dealer)
    console.log("지금은 *턴입니다", turnOfWho)
    for (key in keyList) {
        const isyourturn = "isyourturn"
        if (turnOfWho === parseInt(key)) {
            users[key][isyourturn] = 1
            console.log(turnOfWho)

        } else {
            users[key][isyourturn] = 0
        }
    }

    res.send(JSON.stringify(info))
})





app.post('/api/action', (req, res) => {
    console.log("액션할때 배팅라인", bettingLine)
    //bettingLine 수전
    if (req.body.action === 'call') {
        var max_bet = -1
        bettingLine.forEach((item) => {
            if (item[1] > max_bet) { max_bet = item[1] }
        })
        shouldPay = max_bet - bettingLine[req.body.who][1]
        bettingLine[req.body.who] = [1, parseInt(max_bet)]
        setUserStack(users, shouldPay, req.body.who)
        info.pot = info.pot + shouldPay
        // console.log(info)

    } else if (req.body.action === 'fold') {
        bettingLine[req.body.who][0] = -1
    } else {
        bettingLine.forEach((item) => {
            if (item[0] === 1) { item[0] = 0 }
        })
        setUserStack(users, req.body.action - bettingLine[req.body.who][1], req.body.who)
        info.pot = info.pot + parseInt(req.body.action - bettingLine[req.body.who][1])
        bettingLine[req.body.who] = [1, parseInt(req.body.action)]

    }
    console.log(info.users, "===")

    var checkE = checkEnd(req.body.who, bettingLine)
    console.log("누구차례", checkE)
    if (checkE[0] === 1) {

        var keyList = Object.keys(users);
        turnOfWho = checkE[1]
        for (key in keyList) {
            const isyourturn = "isyourturn"
            if (turnOfWho === parseInt(key)) {
                users[key][isyourturn] = checkE[2]

            } else {
                users[key][isyourturn] = 0
            }
        }
        res.send(JSON.stringify(info))

    } else if (checkE[0] === 0) {
        //리버인상태에서 스트릿종료가될때
        if (gameState === 3) {
            info = gameOver(info, bettingLine)
            bettingLine = [];
            console.log(info)

            res.send(JSON.stringify(info))
        } else {
            //여기에 도착을 안함
            console.log("before", info)
            var keyList = Object.keys(users);
            info.gameState = info.gameState + 1


            bettingLine = reSetBettingLine(bettingLine)

            turnOfWho = checkTurnOfWho(dealer, bettingLine)

            for (key in keyList) {
                const isyourturn = "isyourturn"
                if (turnOfWho === parseInt(key)) {
                    info.users[key][isyourturn] = 2
                } else {
                    info.users[key][isyourturn] = 0
                }
            }
            console.log("after", info)

            res.send(JSON.stringify(info))
        }

    } else {
        //게임끝 
    }




})






app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행')
})
