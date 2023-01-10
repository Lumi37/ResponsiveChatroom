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
    ws.status = 'online'
    users.push(ws)
    console.log("New client Connected!")
    ConnectedClients += 1 
   
        // MESSAGES

    ws.on("message",  clientMessage=>{
        let data = JSON.parse(clientMessage)
        console.log("Received: ",data)
        const messageType = identifyMessageType(data.type)

        if(messageType==='name'){
            handleIfName(data.text,ws)
        }
        if(messageType==='message'){
            clientChat(data.text,ws.userName)
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
        try{ list[list.findIndex(Status=> Status.name === ws.userName)].status = 'offline' }
        catch(error){console.log('unregistered client')}
        ws.status = 'offline'
        if(ws.userName != undefined)
            console.log(`${ws.userName} Disconnected! (status:${ws.status})`)
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

function handleIfName(username,connection){
    console.log('\n\n\n-----------------handleIfName-----------------')
    connection.userName = username
    let userStatus = {name:username, status:'online'}
    list.push(userStatus)
    console.log(`User ${connection.userName} Connected!`)
}

function handleIfList(){
    console.log('\n\n\n-----------------handleIfList-----------------')
    users.forEach((user,i)=>{
        console.log('listed name: ',user.userName)
        console.log('list item: ',list)
    })
    users.forEach(user=>{
        user.send(JSON.stringify({list,type:'list'}))
    })
    
}

function updateList(name){
    console.log('updating list ...........')
    //console.log('index found :',list.findIndex(username=>{return  username == name}))

}

function  handleIfMessage(message, Name, currentdatetime){
    console.log('\t\n\n\n-----------------handleIfMessage-----------------')
    let messageToClient = {date:currentdatetime, name:Name, text:message,type:'message'}
    console.log('handleIfMessage returns ',messageToClient)
    return messageToClient
}



async function  clientChat(text, userName) {
    console.log('\n\n\n-----------------sendMessageToClients-----------------')
    let currentdate = new Date();
    const datetime =currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
    let pass =  JSON.stringify( handleIfMessage(text,  userName, datetime))
    console.log('final message: ',pass)
    users.forEach(user=>{
        console.log(user.userName)
        user.send(pass)})

}
