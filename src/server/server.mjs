import express from 'express'
import fileUpload from 'express-fileupload'
import fs from 'fs/promises'
import { WebSocketServer } from 'ws'
// import _ from 'lodash'

const server = express()
const wsServer = new WebSocketServer({ port: 3001 })
server.use(express.static('/home/kostas/ResponsiveChatroom/src/client/'))
server.use(express.json());
server.use(fileUpload({
    limits: {
        fileSize: 20000000 //20 MB
    }
}));
let ConnectedClients = 0
let users = [];
let list = [];
let history = []

server.post('/', function (req, res) {
    handleFile(req, res)
});



wsServer.on("connection", (ws) => {
   
    
    ws.id = null
    ws.userName = ''
    ws.status = 'online'

    users.push(ws)
    console.log("New client Connected!")
    ConnectedClients += 1

    // MESSAGES

    ws.on("message", clientMessage => {

        
        let data = JSON.parse(clientMessage)
        console.log("Received: ", data)
        const messageType = identifyMessageType(data.type)
        if (messageType === 'name') {
            if (identifyUserById(data.id)) { setUserInfo(data.id, data.text, ws) }     // ws = JSON.parse(JSON.stringify(identifyUserById(data.id,ws)))//_.cloneDeep(identifyUserById(data.id,ws)) //"DEEPCLONE" EXISTING USER '
            else { setNewUserInfo(data.id, data.text, ws) }
        }
        if (messageType === 'message') {
            handleIfMessage(data.text, data.name, data.id)
        }
        if (messageType === 'list') { handleIfList() }
        if (messageType === 'history') { handleIfHistory() }

        console.log("Current List: ", users.length)
    })
    console.log('\n\n\n-----------------USERLIST-----------------')
    list.forEach(user => console.log('--->', user.name, ' : ', user.id))
    console.log(`Connected Clients : ${ConnectedClients}\nList: ${list.length}`)

    // WHEN CLOSING

    ws.on('close', () => {
        ConnectedClients -= 1
        try {
            list[list.findIndex(user => user.id === ws.id)].status = 'offline'
        }
        catch (error) {
            console.log('unregistered client')
        }
        ws.status = 'offline'
        if (ws.userName != undefined)
            console.log(`${ws.userName} Disconnected! (status:${ws.status})`)
        else
            console.log('A client Disconnected!')
        console.log(`*78*Connected Clients : ${ConnectedClients}\nList: ${users.length}`)

        // updateUserArray()
    })
})
server.listen(3000, () => console.log("listens to 3000"))





//FUNCTIONS


function identifyMessageType(type) {
    console.log('\n\n\n-----------------identifyMessageType-----------------')
    switch (type) {
        case 'name':
            console.log('identifyMessageType returns "name"')
            return 'name';
        case 'message':
            console.log('identifyMessageType returns "message"')
            return 'message';
        case 'list':
            console.log('identifyMessageType returns "list"')
            return 'list';
        case 'history':
            console.log('identifyMessage returns "history"')
            return 'history'
        default:
            console.log(type)
            console.log('identifyMessageType returns "error"')
            return 'error';
    }
}

function setNewUserInfo(uID, username, connection) {
    console.log('\n\n\n-----------------setNewUserInfo-----------------')
    connection.userName = username
    connection.id = uID
    list.push({ name: username, id: uID, status: 'online', icon:'images/default.png', lastMessage:'' })
    console.log(`User ${connection.userName} Connected!`)
}

function handleIfList() {
    console.log('\n\n\n-----------------handleIfList-----------------')
    list.forEach(user => {
        console.log(`List:\n${user.name} : ${user.id} : ${user.status}`)
    })
    users.forEach(user => {
        user.send(JSON.stringify({ list, type: 'list'}))
    })

}
function handleIfHistory() {
    console.log('\n\n\n-----------------handleIfHistory-----------------\nLoading: ', history.length, 'messages...')
    users.forEach(user => {
        history.forEach(messageObject => {
            let messageToClient = messageObject
            user.send(messageToClient)
        })

    })

}

function handleIfMessage(message, Name, userID) {
    console.log('\t\n\n\n-----------------handleIfMessage-----------------')
    const currentdate = dateNow()
    const listCurrentIndex = list.findIndex(user => user.id ==  userID)
    list[listCurrentIndex].lastMessage = message
    let userIcon = list[listCurrentIndex].icon
    let messageToClient = JSON.stringify({ date: currentdate, name: Name, text: message, type: 'message', id: userID, icon: userIcon})
    let historyText = JSON.stringify({ date: currentdate, name: Name, text: message, type: 'history', id: userID, icon: userIcon})
    history.push(historyText) //SAVING TO HISTORY ARR
    console.log('Final Message: ', messageToClient)
    users.forEach(user => {
        user.send((messageToClient))
    })

}
// CURRENT DATE
function dateNow() {
    let currentdate = new Date();
    const datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
    return datetime
}

function identifyUserById(id) {
    let outcome = false
    console.log('\n\n\n-----------------identifyUserById-----------------\nlist.length: ', list.length)
    list.forEach(user => {
        if (id === user.id) {
            console.log('user identified as ', user.name, 'with ID:', user.id)
            console.log('RETURNS TRUE')
            outcome = true
        }
    })
    if (outcome) { return outcome }
    else { console.log('RETURNS FALSE'); return outcome }
}

function setUserInfo(id, name, connection) {
    console.log('\n\n\n-----------------setUserInfo-----------------')
    list.forEach(user => {
        if (id === user.id) {
            connection.userName = name
            connection.id = id
            user.status = 'online'
            console.log('user identified as ', connection.userName, 'with ID:', connection.id)
        }
    });
}

function handleFile(req, res) {
    let sampleFile, uploadPath, name, id,fileExtention
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    name = req.body.name
    id = req.body.id
    sampleFile = req.files.sampleFile;
    fileExtention = sampleFile.name.slice(sampleFile.name.indexOf('.'),sampleFile.name.length)
    sampleFile.name = id + fileExtention
    uploadPath = '/home/kostas/projects/ResponsiveChatroom/src/client/images/' + sampleFile.name;
    list[list.findIndex(user => user.id ==  id)].icon = `images/${sampleFile.name}`  //Register icon to user (found by id)
    console.log('file size: ', req.files.sampleFile.size)
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);

        console.log(`Received a file: ${sampleFile.name}\nfrom:${name}`)
    });

}




// function updateUserArray(id,connection){
//     console.log('\n\n\n-----------------updateUserArray-----------------')
//     users.forEach(user => {
//         if (id === user.id){
//             console.log('user identified as ',user.userName,'with ID:',user.id)
//             user = _.cloneDeep(connection)
//             console.log('user Updated...')
//         }
//     })
// }

