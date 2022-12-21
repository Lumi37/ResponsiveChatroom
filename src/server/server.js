import express from 'express'
import { WebSocketServer } from 'ws'

const server = express()
const wsServer = new WebSocketServer({port:3001})
server.use(express.static('../client/'))
let ConnectedClients = 0
let users = [];
wsServer.on("connection", (ws)=>{
    let userName
    users.push(ws)
    console.log("New client Connected!")
    ConnectedClients += 1 
   
        // MESSAGES
   
    ws.on("message",  clientMessage=>{
        let data = String(clientMessage)
        if (data.includes("[NAME]") == true){ 
            userName = data.replace("[NAME]","")
            console.log(`User ${userName} Connected!`)
        }else{
            ws.send(data)        
        }  
        console.log("Received from Client : ",data)   
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