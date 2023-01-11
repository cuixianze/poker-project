
const express = require('express');
const path = require('path');

const app = express()

app.set('port', 5000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Hello!")
})

app.get('/api/players', (req, res) => {
    res.send({
        "p1": {
            "id": "최현택",
            "stack": 10000
        },
        "p2": {
            "id": "이재훈",
            "stack": 10000
        }
    })
})

app.post('/api/playerInfo', (req, res) => {
    console.log(req.body)
    res.send({
        'isvalid': true
    })
})

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행')
})
