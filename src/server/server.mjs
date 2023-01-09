import express from 'express'
import fs from 'fs/promises'
import { WebSocketServer } from 'ws'

const server = express()
const wsServer = new WebSocketServer({port:3001})
server.use(express.static('../client/'))
server.use(express.json());
let ConnectedClients = 0
let users = [];
let list = [];




wsServer.on("connection", (ws)=>{
    
    ws.id = null
    ws.userName = ''
    users.push(ws)
    console.log("New client Connected!")
    ConnectedClients += 1 
   
        // MESSAGES

    ws.on("message",  clientMessage=>{
        let data = JSON.parse(clientMessage)
        console.log("Received: ",data)
        const messageType = identifyMessageType(data.type)

        if(messageType==='name'){
            ws.userName = handleIfName(data.text)
        }
        if(messageType==='message'){
             sendMessageToClients(data.text,ws.userName)
        }
        if(messageType === 'list'){
            handleIfList()
        }
        if(messageType === 'closing'){
            updateList(data.name)
        }
        
        console.log("Current List: ",users.length)
    })  
    console.log('\n\n\n-----------------USERLIST-----------------')
    users.forEach(user=>console.log('--->',user.userName))
    console.log(`*51*Connected Clients : ${ConnectedClients}\nList: ${users.length}`)
    
        // WHEN CLOSING
    
    ws.on('close', ()=>{                                        
        ConnectedClients -= 1
        if(ws.userName != undefined)
            console.log(`${ws.userName} Disconnected!`)
        else
            console.log('A client Disconnected!')
        console.log(`*78*Connected Clients : ${ConnectedClients}\nList: ${users.length}`)
    })
})
server.listen(3000, ()=>console.log("listens to 3000") )


function identifyMessageType(type){
    console.log('\n\n\n-----------------identifyMessageType-----------------')
    switch(type){
        case 'name':
            console.log('identifyMessageType returns "name"')
            return 'name';
        case 'message':
            console.log('identifyMessageType returns "message"')
            return 'message';
        case 'list':
            console.log('identifyMessageType returns "list"')
            return 'list';
        case 'closing':
            console.log('identifyMessage returns "closing"')
            return 'closing'
        default:
            console.log(type)
            console.log('identifyMessageType returns "error"')
            return 'error';
    }
}

function handleIfName(name){
    console.log('\n\n\n-----------------handleIfName-----------------')
    console.log(`User ${name} Connected!`)
    return name;
}

function handleIfList(){
    console.log('\n\n\n-----------------handleIfList-----------------')
    users.forEach((user,i)=>{
        list.push([user.userName,1])
        console.log('listed name: ',user.userName)
        console.log('list item: ',list)
    })
    users.forEach(user=>{
        user.send(JSON.stringify({list,type:'list'}))
    })
    
}

function updateList(name){
    console.log('index found :',list.findIndex(username=>{return  username == name}))

}
function  handleIfMessage(message, Name, currentdatetime){
    console.log('\t\n\n\n-----------------handleIfMessage-----------------')
    let messageToClient = {date:currentdatetime, name:Name, text:message,type:'message'}
    console.log('handleIfMessage returns ',messageToClient)
    return messageToClient
}



async function  sendMessageToClients(text, userName) {
    console.log('\n\n\n-----------------sendMessageToClients-----------------')
    let currentdate = new Date();
    const datetime =currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
    let pass =  JSON.stringify( handleIfMessage(text,  userName, datetime))
    console.log('final message: ',pass)
    users.forEach(user=>{
        console.log(user.userName)
        user.send(pass)})

}
