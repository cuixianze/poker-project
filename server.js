
const express = require('express');
const path = require('path');
const { send } = require('process');


const app = express()

var playerCount = 0;
var info = {}
var users = {}
const DECK = ["AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC", "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD", "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH", "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS"]


var bettingLine = []

var dealer = -1
var turnOfWho = -1
var gameState = 0
var board = []

const smallBlind = 500
const bigBlind = 1000


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
    board = [0, 0, 0, 0, 0].map(c => { return deck.pop() })
    info.board = board
    console.log(info)
    var keyList = Object.keys(users);
    for (key in keyList) {
        var hands = [0, 0].map(c => { return deck.pop() })
        var cards = "cards"
        users[keyList[key]][cards] = hands
        bettingLine.push(new Array(2).fill(0))

        if (users[keyList[key]].pos === 1) {
            dealer = key
        }
    }

    bettingLine[(dealer + 1) % (keyList.length)] = [0, smallBlind];
    bettingLine[(dealer + 2) % (keyList.length)] = [0, bigBlind];
    turnOfWho = (dealer + 3) % (keyList.length)
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
    console.log(req.body)
    //bettingLine 수전
    if (req.body.action === 'call') {
        var max_bet = -1
        bettingLine.forEach((item) => {
            if (item[1] > max_bet) { max_bet = item[1] }
        })
        bettingLine[req.body.who] = [1, max_bet]
    } else if (req.body.action === 'fold') {
        bettingLine[req.body.who][0] = -1
    } else {
        bettingLine.forEach((item) => {
            if (item[0] === 1) { item[0] = 0 }
        })
        bettingLine[req.body.who] = [1, req.body.action]

    }


    var checkE = checkEnd(req.body.who, bettingLine)


    if (checkE[0] === 1) {

        var keyList = Object.keys(users);
        turnOfWho = checkE[1]
        for (key in keyList) {
            const isyourturn = "isyourturn"
            if (turnOfWho === parseInt(key)) {
                users[key][isyourturn] = 1
                console.log("헤헤걸렸당")
            } else {
                users[key][isyourturn] = 0
            }
        }
        res.send(JSON.stringify(info))

    } else if (checkE[0] === 0) {
        var keyList = Object.keys(users);
        gameState = gameState + 1
        console.log(gameState)
        console.log("여기까지나옴")
        bettingLine = reSetBettingLine(bettingLine)
        console.log(bettingLine)
        turnOfWho = checkTurnOfWho(dealer, bettingLine)
        console.log(turnOfWho)
        for (key in keyList) {
            const isyourturn = "isyourturn"
            if (turnOfWho === parseInt(key)) {
                users[key][isyourturn] = 1
                console.log("헤헤걸렸당")
            } else {
                users[key][isyourturn] = 0
            }
        }
        info.gameState = gameState
        console.log(info.gameState)
        res.send(JSON.stringify(info))
    } else {
        //게임끝 
    }




})






app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행')
})
