import express from 'express'
import { WebSocketServer } from 'ws'

const server = express()
const wsServer = new WebSocketServer({port:3001})
server.use(express.static('../client/'))
wsServer.on("connection", (ws)=>{
    console.log("New client Connected!!!!!!")
    ws.send()
    ws.on('close', ()=>console("client Disconnected!"))
})
server.listen(3000, ()=>console.log("listens to 3000") )