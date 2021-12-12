# caver-KAS-klaytnServer

Web3.js를 KAS에선 Caver를 사용하여 직접 요청을 보낼 수 있다.

1. Web3.js과 비슷한 Caver를 사용하여 KAS기반 클레이튼 서버 개발

2. /createaccount를 통해 새로운 주소와 PrivateKey를 만들어 낼 수 있다.

3. /getbalance를 통해 body로 전송받은 address를 입력하여 잔고를 확인 할 수 있다.

4. /trasnfer를 통해 body로 전송받은 toAddress와 amount로 토큰을 전송 할 수 있다.

5. /deploy를 통해 json객체타입으로 전송받은 abi와 bytecode로 스마트컨트랙트를 배포 할 수 있다.

<.env 설정>
FROM_ADDRESS = ~ \n
PRIVATE_KEY = ~

<req 요청조건>
1. /getbalance => req.body.address : 잔고를 확인 할 주소
2. /transfer => req.body.toAddress : 송금 받을 주소
                req.body.amount : 보낼 토큰 양
3. /deploy => JSON {
                      "abi" : "~"
                      "bytecode" : "~"
                   }

