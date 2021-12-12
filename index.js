const express = require('express');
const app = express();
const port = 8080;
const Caver = require("caver-js");
const caver = new Caver('https://api.baobab.klaytn.net:8651');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(port, () => {
	console.log('Listening...');
});

app.get("/",async (req,res)=>{
 res.send('You can use more url-path');
})

app.get('/createaccount', async(req,res)=>{
    const account = await caver.klay.accounts.create();
    const create = await caver.klay.accounts.wallet.add(account);
    const newAccount = {
        accountAddress: create.address, 
        accountPrivateKey: create.privateKey
    }
    res.json(newAccount);
})

app.get('/getbalance', async(req,res)=>{
    const balance = await caver.klay.getBalance(req.body.address)
    const convert = caver.utils.convertFromPeb(balance,'KLAY')
    res.json(`잔고는 : ${convert}`);
})

app.get('/transfer', async(req,res)=>{

    const to = req.body.toAddress
    const amount = req.body.amount;

    let balance = await caver.klay.getBalance(process.env.FROM_ADDRESS)
    balance = caver.utils.convertFromPeb(balance,'KLAY')

    if(balance > amount){
        const keyring = caver.wallet.keyring.createFromPrivateKey(process.env.PRIVATE_KEY);
    
        const valueTransfer = caver.transaction.valueTransfer.create({
            from:keyring.address,
            to: to,
            value: caver.utils.convertToPeb(`${amount}`, 'KLAY'),
            gas: 30000,
        });
    
        const signed = await valueTransfer.sign(keyring)
        const receipt = await caver.rpc.klay.sendRawTransaction(signed)
        console.log(receipt);
        res.send(receipt);
    }
    else{
        res.status(400).send('transfer fail')
    }
})


app.post('/deploy', async(req,res)=>{
    
    const account = caver.klay.accounts.wallet.add(process.env.PRIVATE_KEY)

    const ABI = req.body.abi
    const Bytecode = req.body.bytecode;

    await caver.klay.sendTransaction({
        type: 'SMART_CONTRACT_DEPLOY',
        from :account.address,
        data: 
            caver.klay.abi.encodeContractDeploy(ABI,Bytecode, 1, 2),
        gas: '300000',
        value: 0,
    })
    .on('transactionHash', function(hash){
        console.log('트랜잭션 해시',hash)
    })
    .on('receipt', function(receipt){
        console.log(receipt)
        res.json(`컨트랙트 배포 성공`)
    })
    .on('error', console.error);
})


