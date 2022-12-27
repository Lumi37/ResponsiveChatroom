import express from 'express'
import { WebSocketServer } from 'ws'

const server = express()
const wsServer = new WebSocketServer({port:3001})
server.use(express.static('../client/'))
let ConnectedClients = 0
let users = [];
// wsServer.ClientID = function(){
//     function idGen(){
//         return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
//     }
//     return idGen() + idGen() + '-' + idGen()
// }




wsServer.on("connection", (ws)=>{
   // ws.id = wsServer.ClientID(); // GENERATING UNIQUE CLIENT ID 
    let userName
     //GET DATE   (.getDate for days, .getMonth()+1 for months, .getFullYear() for year)
    let currentdate = new Date(); 
    let datetime =currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    users.push(ws)
    console.log("New client Connected!")
    ConnectedClients += 1 
   
        // MESSAGES
   
    ws.on("message",  clientMessage=>{
        let data = String(clientMessage)
        users.forEach((ws,i)=>{
            if (data.includes("[NAME]") == true){ 
                userName = data.replace("[NAME]","")
                //usersName.push(userName)
                console.log(`User ${userName} Connected!`)
            }else{
                if(userName != undefined)
                   ws.send(`${datetime} ${userName}: ${data}`)// ws.send(datetime+" "+ userName+": "+data+"<br>")        
                else{
                    ws.send(`${datetime} Unknown_User: ${data}`)//ws.send(datetime+" "+ userName+": "+data+"<br>")
                
                }        
            }  
            console.log("Received from Client : ",data)   
            
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