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
    
    ws.id = null
    ws.userName = ''
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
            console.log('\n\n\n-----------------connectionExists-----------------')
            console.log('CONNECTION USERNAME:',ws.userName,'\nID:',ws.id)
        } else {
            ws.id = data.uniqueID
            users.push(ws)
        }
        
        if(messageType==='name'){
            ws.userName = handleIfName(data.text)
        }
        if(messageType==='message'){
             sendMessageToClients(data.text,ws.userName,ws.id)
        }
        if(messageType === 'list'){
            handleIfList()
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
    users.forEach(user=>{
        let list = {}
        list.name = user.userName
        list.id = user.id
        list.type = 'list'
        console.log('list item: ',list)
        user.send(JSON.stringify(list))
    })
}


function  handleIfMessage(message, Name, currentdatetime ,uID){
    console.log('\t\n\n\n-----------------handleIfMessage-----------------')
    let messageToClient = {date:currentdatetime, name:Name, text:message,type:'message', userID:uID}
    console.log('handleIfMessage returns ',messageToClient)
    return messageToClient
}

function findConnectionById(uID){
    console.log('\n\n\n-----------------findConnectionById-----------------')
    let existence = null
    let debugExists = null
    if(!uID){
        existence = users[users.length-1]
        debugExists = 'received null id'
        console.log("findConnectionById returns ",debugExists)
        return existence
    }
    users.forEach(user=>{
        if (user.id == uID){
            existence = user
            debugExists = 'Connection Exists'
        }
    })
    console.log("findConnectionById returns ",debugExists)
    return existence;
} 

async function  sendMessageToClients(text, userName,uID) {
    console.log('\n\n\n-----------------sendMessageToClients-----------------')
    let currentdate = new Date();
    const datetime =currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
    let pass =  JSON.stringify( handleIfMessage(text,  userName, datetime,uID))
    users.forEach(user=>{
        console.log(user.userName,'---',user.id)
        user.send(pass)})

}