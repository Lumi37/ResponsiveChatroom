
const webSocket = new WebSocket('ws://localhost:3001');
const textfieldName = document.querySelector('#nameTextField')
const textfieldMessage = document.querySelector('#messageField')
const chat = document.querySelector("#chat")
const sendButton = document.querySelector("#sendMessage")
const saveNameBtn = document.querySelector("#saveName")
const list = document.querySelector('#list')
const refreshBtn = document.querySelector('#refreshList')
let listArr = []

    //SENDING INFO FROM LOCALSTORAGE
webSocket.addEventListener("open", ()=>{
    console.log("Client connected Succesfuly")
    // refreshList()
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

webSocket.addEventListener('close',(e)=>{
    userClosed()
})

document.querySelector('#clear').addEventListener("click",(e)=>{
    chat.innerHTML = ''
})


    //FUNCTIONS 

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
if (message.name == textfieldName.value )
    chat.innerHTML += `<p class="user">${message.date} ${message.name}: ${message.text}</p><br>`
else
    chat.innerHTML += `<p class="otheruser">${message.date} ${message.name}: ${message.text}</p><br>`
}




function sendMessageToServer(){
    let ChatText = textfieldMessage.value;
    let userName = textfieldName.value;
    textfieldMessage.value = ''
    let messageToServer = { text:ChatText, name:userName, type:'message'}
    if(ChatText!='')
        webSocket.send(JSON.stringify(messageToServer))
}


function sendSaveName(){
    let user = textfieldName.value 
    let messageToServer = { text:user, type:'name'}
    webSocket.send(JSON.stringify(messageToServer))
    document.querySelector("#hello").textContent = 'Hello ' + textfieldName.value   
}


function handleIfList(listItem){
    //listArr.push(listItem)
    // if ( listArr.includes(listItem.name)){
    //     console.log('if happens thus ',listArr.includes(listItem.name))
    //     listArr.pop()
    //     console.log('therefore pop')
    // }
    // else{
    //     console.log('else happens thus ',listArr.includes(listItem.name))
    //     listArr.push(listItem)
    //     console.log('therefore push')
    // }
    
    list.innerHTML = ''
    let userList = listItem.list
    console.log(userList)
    userList.forEach(elem => {
        let li = document.createElement('li')
        li.appendChild(document.createTextNode(elem))
        list.appendChild(li)
    })
    console.log('current arr', listArr);

    //  list.innerHTML += `<li>${data.name}<li>`
}


function userClosed(){
    let userName = textfieldName.value;
    let messageToServer = { name:userName , type:'closing'}
    webSocket.send(JSON.stringify(messageToServer))

}

function refreshList(){
    list.innerHTML = ''
    webSocket.send(JSON.stringify({type:'list'}))
}