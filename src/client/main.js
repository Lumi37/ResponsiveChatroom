

const webSocket = new WebSocket('ws://localhost:3001');
const textfieldName = document.querySelector('#nameTextField')
const textfieldMessage = document.querySelector('#messageField')
const chat = document.querySelector("#chat")
const sendButton = document.querySelector("#sendMessage")
const saveNameBtn = document.querySelector("#saveName")
let clientID = localStorage.getItem('ClientID')
webSocket.addEventListener("open",()=>{
    console.log("Client connected Succesfuly")
   
    if(!(localStorage.getItem('ClientID')))
       window.localStorage.setItem('ClientID',ClientUniqueIDGenerator()) //REGISTER ID TO STORAGE
    else{
        const user = localStorage.getItem('name')
        let clientID = localStorage.getItem('ClientID');
        let messageToServer = {text:user, type:'name',ID:clientID}
        document.querySelector("#hello").textContent = 'Hello ' + user
        webSocket.send(JSON.stringify(messageToServer))
    }


})
    //SAVING NAME, SENDING TO SERVER
saveNameBtn.addEventListener("click",e=>{
    let user = textfieldName.value 
    let clientID = localStorage.getItem('ClientID')
    let messageToServer = { text:user, type:'name', UniqueID:clientID}
    window.localStorage.setItem('name',user) //REGISTER NAME TO STORAGE
    window.localStorage.setItem('ClientID',ClientUniqueIDGenerator())
    webSocket.send(JSON.stringify(messageToServer))
    document.querySelector("#hello").textContent = 'Hello ' + textfieldName.value
})
    //SENDING MESSAGE TO SERVER
sendButton.addEventListener("click", e=>{
    let ChatText = textfieldMessage.value;
    let userName = textfieldName.value;
    let messageToServer = { text:ChatText, name:userName, type:'message'}
    webSocket.send(JSON.stringify(messageToServer))
})
    //RECEIVING MESSAGE FROM SERVER
webSocket.addEventListener("message", (e)=>{
    console.log("received message",e.data)
    let data = JSON.parse(e.data)
    if(MessageType(data.type) == 'message')
        handleIfMessage(data) 
        //chat.innerHTML += `<p>${e.data}</p><br>`
})

document.querySelector('#clear').addEventListener("click",(e)=>{
    chat.innerHTML = ''
})
document.querySelector('#ls').addEventListener('click',(e)=>{

})

function MessageType(type){
    switch (type){
        case 'message':
            return 'message'
        case 'list':
            return 'list'
        default:
            console.log('unknown error')
    }
}

function handleIfMessage(message){
if (message.name == textfieldName.value)
    chat.innerHTML += `<p class="user">${message.date} ${message.name}: ${message.text}</p><br>`
else
    chat.innerHTML += `<p class="otheruser">${message.date} ${message.name}: ${message.text}</p><br>`
}

function ClientUniqueIDGenerator(){
    function idGen(){
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return idGen() + idGen() + '-' + idGen()
}
