
const webSocket = new WebSocket('ws://localhost:3001');
const textfieldName = document.querySelector('#nameTextField')
const textfieldMessage = document.querySelector('#messageField')
const chat = document.querySelector("#chat")
const sendButton = document.querySelector("#sendMessage")
const saveNameButton = document.querySelector("#saveName")
const list = document.querySelector('#list')
const refreshBtn = document.querySelector('#refreshList')
const editNameButton = document.querySelector('#editname')
const storageID = localStorage.getItem('ClientID')
const hiddenIDfield = document.querySelector('#userID')
const uploadButton = document.querySelector('#uploadButton')
let noEdit = true
let otherUserTexts = []
otherUserTexts.push({date: '', name: '', text: '', type: '', id: '', icon: ''})
console.log('14',noEdit)
// const storageName = localStorage.getItem('name')



uploadButton.addEventListener('click',e=>{
    
    console.log("refreshing")
    setTimeout(window.location.reload(),3000)
    refreshList()
    
})

//SENDING INFO FROM LOCALSTORAGE
webSocket.addEventListener("open", () => {
    console.log("Client connected Succesfuly")
    sendInfoFromLocalStorage()
    refreshList()
})

//SAVING NAME, SENDING TO SERVER
saveNameButton.addEventListener('click', e => { sendSaveName() })

//EDIT NAME
editNameButton.addEventListener('click', e => { nameEdit() })

//SENDING MESSAGE TO SERVER
sendButton.addEventListener("click", e => { sendMessageToServer() })

textfieldMessage.addEventListener('keypress', e => {
    const key = e.key
    if (key == 'Enter') {
        sendMessageToServer()
    }
})


//REFRESH LIST REQ
refreshBtn.addEventListener('click', e => { refreshList() })


//RECEIVING MESSAGE FROM SERVER
webSocket.addEventListener("message", (e) => {
    let data = JSON.parse(e.data)
    console.log('type: ', MessageType(data.type), 'data: ',data)
    choiceBy(MessageType(data.type),data)
})

//CLEAR CHAT
document.querySelector('#clear').addEventListener("click", (e) => {
    chat.innerHTML = ''
})







//FUNCTIONS 

function MessageType(type) {
    switch (type) {
        case 'message':
            return 'message'
        case 'list':
            return 'list'
        case 'history':
            return 'history'
        default:
            console.log('unknown error')
    }
}

function choiceBy(type,data){
    if (type == 'message')
        handleIfMessage(data)
    if (type == 'list')
        handleIfList(data)
    if (type == 'history')
        handleIfHistory(data)
}

function handleIfMessage(messageInfo) {
        chat.innerHTML += messageConstructor(messageInfo)   //`<p class="user">${messageInfo.date} ${messageInfo.name}: ${messageInfo.text}</p><br>`
}




function sendMessageToServer() {
    let ChatText = textfieldMessage.value;
    let userName = textfieldName.value;
    let storeID = localStorage.getItem('ClientID')
    textfieldMessage.value = ''
    let messageToServer = { text: ChatText, name: userName, type: 'message', id: storeID }
    if (ChatText != '')
        webSocket.send(JSON.stringify(messageToServer))
}


function sendSaveName() {
    if (!textfieldName.value == '') {
        saveNameButton.disabled = true
        textfieldMessage.disabled = false
        sendButton.disabled = false
        editname.disabled = false
        window.localStorage.setItem('name', textfieldName.value)
        console.log('125',noEdit)
        if (noEdit)
            window.localStorage.setItem('ClientID', clientUniqueIDGenerator())
        let storageID = localStorage.getItem('ClientID')
        hiddenIDfield.value = storageID
        let name = textfieldName.value
        let messageToServer = { text: name, type: 'name', id: storageID }
        webSocket.send(JSON.stringify(messageToServer))
        document.querySelector("#hello").textContent = 'Hello ' + textfieldName.value
    }
}

function nameEdit() {
    saveNameButton.disabled = false
    editname.disabled = true
    noEdit = false
    console.log('141',noEdit)

}


function handleIfList(listItem) {

    list.innerHTML = ''
    let userList = listItem.list
    console.log(userList)
    userList.forEach(elem => {  
        console.log(elem.icon)
        if (elem.status === 'online')
            list.innerHTML += `<li>${elem.name}<img id="usericon" src="${elem.icon}" alt=""><img id="statusicon" src="images/greenicon.png" alt="online"> </li>` //<div class="listname">${elem.name}</div>
        if (elem.status === 'offline')
            list.innerHTML += `<li>${elem.name}<img id="usericon" src="${elem.icon}" alt=""><img id="statusicon" src="images/greyicon.png" alt="offline"> </li>` //<div class="listname">${elem.name}</div>
    })
}


function handleIfHistory(messageInfo) {
    chat.innerHTML += messageConstructor(messageInfo)
}


function refreshList() {
    list.innerHTML = ''
    webSocket.send(JSON.stringify({ type: 'list' }))
}


//GENERATES RANDOM ID
function clientUniqueIDGenerator() {
    let datenow = new Date()
    function idGen() {

        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return idGen() + idGen() + '-' + idGen() + String(datenow.getMilliseconds())
}


//SENDING USER INFO FROM LOCALSTORAGE
function sendInfoFromLocalStorage() {
    if (!(localStorage.getItem('ClientID'))){
        window.localStorage.setItem('ClientID', clientUniqueIDGenerator()) //REGISTER ID TO STORAGE
        hiddenIDfield.value = localStorage.getItem('ClientID')

    }
    else {
        saveNameButton.disabled = true
        editNameButton.disabled = false
        sendButton.disabled = false
        textfieldMessage.disabled = false
        const user = localStorage.getItem('name')
        let clientID = localStorage.getItem('ClientID');
        hiddenIDfield.value = clientID
        let messageToServer = { text: user, type: 'name', id: clientID }
        document.querySelector("#hello").textContent = 'Hello ' + user
        textfieldName.value = user
        webSocket.send(JSON.stringify(messageToServer))
        webSocket.send(JSON.stringify({ type: 'history' }))
    }
}
// Create HTML elements for picture, date, message
function messageConstructor(messageInfo){
    let message
    console.log('--->',otherUserTexts)
    if (messageInfo.name == textfieldName.value && messageInfo.id == localStorage.getItem('ClientID')){
        message = `<div class='textMessageUser'><p class="user">${messageInfo.text}</p></div><br>` //<p class='date'></p>
        otherUserTexts.push(messageInfo)
    }
    else{
        console.log('CHOICE--->',messageInfo.icon === otherUserTexts[otherUserTexts.length-1].icon)
        if(messageInfo.icon === otherUserTexts[otherUserTexts.length-1].icon)
            message = `<div class ='textMessageOtherUserNoImage'><p class="otheruser">${messageInfo.text}</p></div><br>` //<img></img><p class='date'></p>
        else{
            otherUserTexts.push(messageInfo)
            message = `<div class ='textMessageOtherUser'><img class='messageUserIcon'src='${messageInfo.icon}'><p class="otheruser">${messageInfo.text}</p></div><br>` 
        }
    }    
    return message
}