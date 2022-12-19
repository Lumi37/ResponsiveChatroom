import express from 'express'
import { WebSocketServer } from 'ws'

const server = express()
const wsServer = new WebSocketServer({port:3001})
server.use(express.static('src/client/'))
server.listen(3000, ()=>console.log("listens to 3000") )