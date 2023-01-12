
const webSocket = new WebSocket('ws://localhost:3001');
const textfieldName = document.querySelector('#nameTextField')
const textfieldMessage = document.querySelector('#messageField')
const chat = document.querySelector("#chat")
const sendButton = document.querySelector("#sendMessage")
const saveNameButton = document.querySelector("#saveName")
const list = document.querySelector('#list')
const refreshBtn = document.querySelector('#refreshList')
const editname = document.querySelector('#editname')
const storageID = localStorage.getItem('ClientID')
// const storageName = localStorage.getItem('name')

    //SENDING INFO FROM LOCALSTORAGE
webSocket.addEventListener("open", ()=>{
    console.log("Client connected Succesfuly")
    sendInfoFromLocalStorage()
   // refreshList()
})
    
    //SAVING NAME, SENDING TO SERVER
saveNameButton.addEventListener('click',e=>{console.log("Save name button pressed!"); sendSaveName() })
    
    //EDIT NAME
editname.addEventListener('click',e=>{ console.log("Edit name button pressed!"); nameEdit() })

    //SENDING MESSAGE TO SERVER
sendButton.addEventListener("click", e=>{ console.log("Send Message button pressed!"); sendMessageToServer() })

    //REFRESH LIST REQ
refreshBtn.addEventListener('click', e=>{console.log("Refresh List button pressed!"); refreshList() })

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
  //  userClosed()
})

    //CLEAR CHAT
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
    let storeID = localStorage.getItem('ClientID')
    textfieldMessage.value = ''
    let messageToServer = { text:ChatText, name:userName, type:'message', id:storeID }
    if(ChatText!='')
        webSocket.send(JSON.stringify(messageToServer))
}


function sendSaveName(){
    if(!textfieldName.value==''){
        saveNameButton.disabled = true
        window.localStorage.setItem('name',textfieldName.value)
        window.localStorage.setItem('ClientID',clientUniqueIDGenerator())
        let storeID = localStorage.getItem('ClientID')
        let name = textfieldName.value
        let messageToServer = { text:name , type:'name', id:storeID }
        webSocket.send(JSON.stringify(messageToServer))
        document.querySelector("#hello").textContent = 'Hello ' + textfieldName.value   
    }
}


function handleIfList(listItem){

    list.innerHTML = ''
    let userList = listItem.list
    console.log(userList)
    userList.forEach(elem => {
        if(elem.status === 'online')
            list.innerHTML  += `<li>${elem.name}  <img id="statusicon" src="images/greenicon.png" alt="online"></li>`
        if(elem.status === 'offline')
            list.innerHTML  += `<li>${elem.name}  <img id="statusicon" src="images/greyicon.png" alt="offline"></li>`
    })
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


    //GENERATES RANDOM ID
function clientUniqueIDGenerator(){
    let datenow = new Date()
    function idGen(){
        
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return idGen() + idGen() + '-' + idGen() + String(datenow.getMilliseconds())
}

function sendInfoFromLocalStorage(){
    if(!(localStorage.getItem('ClientID')))
       window.localStorage.setItem('ClientID',clientUniqueIDGenerator()) //REGISTER ID TO STORAGE
    else{
        saveNameButton.disabled = true 
        sendButton.disabled = false
        textfieldMessage.disabled = false
        const user = localStorage.getItem('name')
        let clientID = localStorage.getItem('ClientID');
        let messageToServer = {text:user, type:'name',id:clientID}
        document.querySelector("#hello").textContent = 'Hello ' + user
        textfieldName.value =  user
        webSocket.send(JSON.stringify(messageToServer))
    } 
}
