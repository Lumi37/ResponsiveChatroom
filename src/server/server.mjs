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
   
    let userName
     //GET DATE   (.getDate for days, .getMonth()+1 for months, .getFullYear() for year)
    let currentdate = new Date(); 
    let datetime =currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    users.push(ws)
    console.log("New client Connected!")
    ConnectedClients += 1 
   
        // MESSAGES

    ws.on("message",  clientMessage=>{
        let data = JSON.parse(clientMessage)
        console.log(data)
        users.forEach((ws,i)=>{
          if (MessageTypeIdentifier(data.type)=='name')
           userName = handleIfName(data.text);
          else if(MessageTypeIdentifier(data.type)=='message')
            ws.send(JSON.stringify(handleIfMessage(data.text,  userName, datetime)));
          else{
            console.log('error unknown type of data.')
          } 
        })
    })

    console.log(`Connected Clients : ${ConnectedClients}`)
    
        // WHEN CLOSING
    
    ws.on('close', ()=>{                                        
        ConnectedClients -= 1
        if(userName != undefined)
            console.log(`${userName} Disconnected!`)
        else
            console.log('A client Disconnected!')
        console.log(`Connected Clients : ${ConnectedClients}`)
    })
})
server.listen(3000, ()=>console.log("listens to 3000") )


function MessageTypeIdentifier(type){
 switch(type){
    case 'name':
        return 'name';
    case 'message':
        return 'message';
    default:
        return 'error';
 }
}
function handleIfName(name){
    console.log(`User ${name} Connected!`)
    return name;
}

function handleIfMessage(message, Name, currentdatetime){
    let messageToClient = {date:currentdatetime, name:Name, text:message,type:'message'}
    return messageToClient
}