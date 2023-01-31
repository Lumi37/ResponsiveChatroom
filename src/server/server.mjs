import express from 'express'
import fileUpload from 'express-fileupload'
import { WebSocketServer } from 'ws'
import { identifyUserById } from './modules/identifyUserByID.mjs'
import { setNewUserInfo,setUserInfo } from './modules/setupUserInfo.mjs'
import { handleIfMessage } from './modules/handleMessage.mjs'
import { handleFile } from './modules/handleFile.mjs'
import { identifyMessageType } from './modules/identifyMessageType.mjs'
import { handleIfList } from './modules/handleList.mjs'
import { handleIfHistory } from './modules/handleHistory.mjs'
// import _ from 'lodash'

const server = express()
const wsServer = new WebSocketServer({ port: 3001 })
const __dirname = new URL('.', import.meta.url).pathname
server.use(express.static(`${__dirname}/../client/`))
server.use(express.json());
server.use(fileUpload({
    limits: {
        fileSize: 20000000 //20 MB
    }
}));
let ConnectedClients = 0
export let users = [];
export let list = [];
export let history = []

console.log(__dirname)
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
        if (messageType === 'history') { handleIfHistory(data.id) }

        console.log("Current List: ", users.length)
    })
    console.log('\n\n\n-----------------USERLIST-----------------')
    list.forEach(user => console.log('--->', user.name, ' : ', user.id))
    console.log(`Connected Clients : ${ConnectedClients}\nList: ${list.length}`)

    // WHEN CLOSING

    ws.on('close', () => {
        ConnectedClients -= 1
        try {
            let listIndex = list.findIndex(user => user.id === ws.id)
            let dateOffline = new Date()
            list[listIndex].dateHours = dateOffline.getHours()+1
            list[listIndex].dateDay = dateOffline.getDay()+1
            list[listIndex].status = 'offline'
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





