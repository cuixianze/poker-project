const img_board = {"Ac":["image/AC.png"], "2c":["image/2C.png"], "3c":["image/3C.png"], "4c":["image/4C.png"], "5c":["image/5C.png"], "6c":["image/6C.png"], "7c":["image/7C.png"], "8c":["image/8C.png"], "9c":["image/9C.png"], "Tc":["image/10C.png"], "Jc":["image/JC.png"], "Qc":["image/QC.png"], "Kc":["image/KC.png"],
                    "Ad":["image/AD.png"], "2d":["image/2D.png"], "3d":["image/3D.png"], "4d":["image/4D.png"], "5d":["image/5D.png"], "6d":["image/6D.png"], "7d":["image/7D.png"], "8d":["image/8D.png"], "9d":["image/9D.png"], "Td":["image/10D.png"], "Jd":["image/JD.png"], "Qd":["image/QD.png"], "Kd":["image/KD.png"],
                    "Ah":["image/AH.png"], "2h":["image/2H.png"], "3h":["image/3H.png"], "4h":["image/4H.png"], "5h":["image/5H.png"], "6h":["image/6H.png"], "7h":["image/7H.png"], "8h":["image/8H.png"], "9h":["image/9H.png"], "Th":["image/10H.png"], "Jh":["image/JH.png"], "Qh":["image/QH.png"], "Kh":["image/KH.png"], 
                    "As":["image/AS.png"], "2s":["image/2S.png"], "3s":["image/3S.png"], "4s":["image/4S.png"], "5s":["image/5S.png"], "6s":["image/6S.png"], "7s":["image/7S.png"], "8s":["image/8S.png"], "9s":["image/9S.png"], "Ts":["image/10S.png"], "Js":["image/JS.png"], "Qs":["image/QS.png"], "Ks":["image/KS.png"]}


function cardToImg(board){
  let cards=[];
    for (let i=0 ; i<2 ; i++){
      cards[i] = img_board[board[i]][0];
    }
    return cards;
  };


function Hand({ cards }) {
    cards = cardToImg(cards);
    return (
        <div>
          <img src={ process.env.PUBLIC_URL + cards[0]} width={70} height={70} alt="오류"/>
          <img src={ process.env.PUBLIC_URL + cards[1]} width={70} height={70} alt="오류" />
        </div>
    )
}

export default Hand