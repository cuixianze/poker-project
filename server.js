
const express = require('express');
const path = require('path');

const app = express()

var playerCount = 0;
var users = {}
const DECK = ["AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC", "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD", "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH", "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS"]




function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

app.set('port', 5000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Hello!")
})



app.post('/api/playerInfo', (req, res) => {
    console.log(req.body)

    users[playerCount] = req.body
    playerCount = playerCount + 1
    console.log(users)
    res.send({
        'isvalid': true
    })
})

app.post('/api/startGame', (req, res) => {
    const deck = DECK.slice()
    shuffle(deck)
    var keyList = Object.keys(users);

    for (key in keyList) {
        var hands = [0, 0].map(c => { return deck.pop() })
        var cards = "cards"
        users[keyList[key]][cards] = hands

    }


    res.send(JSON.stringify(users))
})

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행')
})
