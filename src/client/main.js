
const webSocket = new WebSocket('ws://localhost:3001');
const textfieldName = document.querySelector('#nameTextField')
const textfieldMessage = document.querySelector('#messageField')
const chat = document.querySelector("#chat")
const sendButton = document.querySelector("#sendMessage")
const saveNameBtn = document.querySelector("#saveName")
let clientID = localStorage.getItem('ClientID')
const list = document.querySelector('#list')
const refreshBtn = document.querySelector('#refreshList')
let listArr = []

    //SENDING INFO FROM LOCALSTORAGE
webSocket.addEventListener("open", ()=>{
    console.log("Client connected Succesfuly")
    sendInfoFromLocalStorage()
    refreshList()
})
    //SAVING NAME, SENDING TO SERVER
saveNameBtn.addEventListener('click',e=>{
    sendSaveName()
})
    //SENDING MESSAGE TO SERVER
sendButton.addEventListener("click", e=>{
    sendMessageToServer()
})
refreshBtn.addEventListener('click', e=>{
    refreshList()
})

textfieldMessage.addEventListener('keypress',e=>{
    const key= e.key
    if(key == 'Enter'){
        sendMessageToServer()
    }       
})
    //RECEIVING MESSAGE FROM SERVER
webSocket.addEventListener("message", (e)=>{
    console.log("received message",e.data)
    let data = JSON.parse(e.data)
    let typeofMessage = MessageType(data.type)
    console.log('typeofMessage = ',data.type)
    if(typeofMessage == 'message')
        handleIfMessage(data) 
    if(typeofMessage == 'list')
        handleIfList(data)

})

document.querySelector('#clear').addEventListener("click",(e)=>{
    chat.innerHTML = ''
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
if (message.name == textfieldName.value && message.userID == localStorage.getItem('ClientID'))
    chat.innerHTML += `<p class="user">${message.date} ${message.name}: ${message.text}</p><br>`
else
    chat.innerHTML += `<p class="otheruser">${message.date} ${message.name}: ${message.text}</p><br>`
}


    //GENERATES RANDOM ID
function clientUniqueIDGenerator(){
    let datenow = new Date()
    function idGen(){
        
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return idGen() + idGen() + '-' + idGen() + String(datenow.getMilliseconds())
}


 async function sendInfoFromLocalStorage(){
    if(!(localStorage.getItem('ClientID')))
       window.localStorage.setItem('ClientID',clientUniqueIDGenerator()) //REGISTER ID TO STORAGE
    else{
        const user = localStorage.getItem('name')
        let clientID = localStorage.getItem('ClientID');
        let messageToServer = {text:user, type:'name',uniqueID:clientID}
        document.querySelector("#hello").textContent = 'Hello ' + user
        textfieldName.value =  user
        webSocket.send(JSON.stringify(messageToServer))
    } 
}


function sendMessageToServer(){
    let ChatText = textfieldMessage.value;
    let userName = textfieldName.value;
    let clientID = localStorage.getItem('ClientID')
    textfieldMessage.value = ''
    let messageToServer = { text:ChatText, name:userName, type:'message',uniqueID:clientID}
    if(ChatText!='')
        webSocket.send(JSON.stringify(messageToServer))
}


function sendSaveName(){
    let user = textfieldName.value 
    window.localStorage.setItem('name',user) //REGISTER NAME TO STORAGE
    window.localStorage.setItem('ClientID',clientUniqueIDGenerator())
    let clientID = localStorage.getItem('ClientID')
    let messageToServer = { text:user, type:'name', uniqueID:clientID}
    webSocket.send(JSON.stringify(messageToServer))
    document.querySelector("#hello").textContent = 'Hello ' + textfieldName.value   
}


function handleIfList(data){
    if ( listArr.includes(data.name) && listArr.includes(data.id) )
        listArr.pop()
    else
        listArr.push(data)
    listArr.forEach(elem => {
        let li = document.createElement('li')
        li.appendChild(document.createTextNode(elem.name))
        list.appendChild(li)
    });
    
    
    
    //  list.innerHTML += `<li>${data.name}<li>`


}
function refreshList(){
    list.innerHTML = ''
    webSocket.send(JSON.stringify({type:'list'}))
    list.innerHTML = ''
}