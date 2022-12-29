import express from 'express'
import fs from 'fs/promises'
import { WebSocketServer } from 'ws'

const server = express()
const wsServer = new WebSocketServer({port:3001})
server.use(express.static('../client/'))
server.use(express.json());
let ConnectedClients = 0
let users = [];




wsServer.on("connection", (ws)=>{
    
   // let userName
    ws.id = null
    ws.userName = 't'
     //GET DATE   (.getDate for days, .getMonth()+1 for months, .getFullYear() for year)
    // let currentdate = new Date(); 
    // let datetime =currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
     //users.push(ws)
    console.log("New client Connected!")
    ConnectedClients += 1 
   
        // MESSAGES

    ws.on("message",  clientMessage=>{
        let data = JSON.parse(clientMessage)
        console.log("Received: ",data)
        const messageType = identifyMessageType(data.type)
        const connectionExists = findConnectionById(data.uniqueID)
        if (connectionExists) {
            ws = JSON.parse(JSON.stringify(connectionExists));
        } else {
            ws.id = data.uniqueID
            users.push(ws)
        }
        
        if(messageType==='name'){
            ws.userName = handleIfName(data.text)
        }
        if(messageType==='message'){
            sendMessageToClients(data.text,ws.userName)
        }
        
        console.log("Current List: ",users.length)
    })
    users.forEach(user=>console.log('--->',user.userName))
    console.log(`*68*Connected Clients : ${ConnectedClients}\nList: ${users.length}`)
    
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
console.log("*73* HAPPENS")
    switch(type){
        case 'name':
            console.log('identifyMessageType returns "name"')
            return 'name';
        case 'message':
            console.log('identifyMessageType returns "message"')
            return 'message';
        default:
            console.log(type)
            console.log('identifyMessageType returns "error"')
            return 'error';
    }
}

function handleIfName(name){
    console.log(`User ${name} Connected!`)
    return name;
}

function handleIfMessage(message, Name, currentdatetime){
    let messageToClient = {date:currentdatetime, name:Name, text:message,type:'message'}
    console.log('handleIfMessage returns ',messageToClient)
    return messageToClient
}

function findConnectionById(uID){
    let existence = null
    let debugExists = null
    users.forEach(user=>{
        if (user.id == uID){
            existence = user
            debugExists = 'Connection Exists'
        }
    })
    console.log("findConnectionById returns ",debugExists)
    return existence;
} 

function sendMessageToClients(text, userName) {
    let currentdate = new Date();
    const datetime =currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
    users.forEach(user => user.send(JSON.stringify(handleIfMessage(text,  userName, datetime))))
}