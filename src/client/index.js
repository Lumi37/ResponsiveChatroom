const webSocket = new WebSocket('ws://localhost:3001');
const textfieldName = document.querySelector('#username')
const saveNameButton = document.querySelector("#saveButton")
const textfieldMessage = document.querySelector('#typingArea')
const chat = document.querySelector('#messagesDisplay')
const list = document.querySelector('#list')
const refreshButton = document.querySelector('#refreshList')
const editNameButton = document.querySelector('#editName')
const uploadButton = document.querySelector('#uploadButton')
const storageID = localStorage.getItem('ClientID')
const hiddenIDfield = document.querySelector('#userID')
const sendButton = document.querySelector("#paperAirplane")
let date = new Date()
let noEdit = true
let historyTimeLimit = true
let otherUserTexts = []
otherUserTexts.push({date: '', name: '', text: '', type: '', id: '', icon: ''})



//SENDING INFO FROM LOCALSTORAGE
webSocket.addEventListener("open", () => { sendInfoFromLocalStorage() })

//SAVING NAME, SENDING TO SERVER
saveNameButton.addEventListener('click', e => { sendSaveName() })

//EDIT NAME
editNameButton.addEventListener('click', e => { nameEdit() })

// SENDING MESSAGE TO SERVER
 sendButton.addEventListener("click", e => { sendMessageToServer() })

textfieldMessage.addEventListener('keypress', e => {
    const key = e.key
    if (key == 'Enter') {
        sendMessageToServer()
    }
})

//REFRESH LIST REQ
refreshButton.addEventListener('click', e => { refreshList() })


//RECEIVING MESSAGE FROM SERVER
webSocket.addEventListener("message", (e) => { 
    let data = JSON.parse(e.data)
    choiceBy(MessageType(data.type), data)
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


function handleIfMessage(messageInfo) {
    let message = messageConstructor(messageInfo)
    chat.innerHTML += message
    chat.scrollTop +=  maxScrollHeight()
}
function maxScrollHeight(){
    let maximumScrollHeight = 0
    document.querySelectorAll('p').forEach(p=>{
        maximumScrollHeight += p.offsetHeight
    })
    return maximumScrollHeight
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
        // submitFileButton.disabled = false
        saveNameButton.disabled = true
        textfieldMessage.disabled = false
        sendButton.disabled = false
        editname.disabled = false
        window.localStorage.setItem('name', textfieldName.value)
        if (noEdit)
            window.localStorage.setItem('ClientID', clientUniqueIDGenerator())
        let storeID = localStorage.getItem('ClientID')
        hiddenIDfield.value = storageID
        let name = textfieldName.value
        let messageToServer = { text: name, type: 'name', id: storeID }
        webSocket.send(JSON.stringify(messageToServer))
    }
}

function nameEdit() {
    saveNameButton.disabled = false
    editName.disabled = true
    noEdit == false

}


function handleIfList(listItem) {

    list.innerHTML = ''
    let userList = listItem.list
    console.log(userList)
    userList.forEach(elem => {
            list.innerHTML += `<li class="listItemsContainer"><div id="imgContainerList"><img src="${elem.icon}" id="listUserIcon" alt="">
            <div id="${elem.status}"></div></div><div><div id="userListName">${elem.name}<span class="tooltip"">${elem.name}</span></div><div id="userLastMessage">kapapapapap</div></div>
            <div id="dateContainer"><div id="lastOnline">48h</div></div></li>`
    })
}


function handleIfHistory(messageInfo) {
    let datenow = new Date()
    console.log(datenow.getSeconds()-date.getSeconds())
    if (datenow.getSeconds()-date.getSeconds() < 3){
        chat.innerHTML += messageConstructor(messageInfo)
        chat.scrollTop +=  maxScrollHeight()
    }
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
        hiddenIDfield.value = localStorage.getItem('ClientID')}
    else {
        saveNameButton.disabled = true
        editNameButton.disabled = false
        sendButton.disabled = false
        textfieldMessage.disabled = false
        const user = localStorage.getItem('name')
        let clientID = localStorage.getItem('ClientID');
        let messageToServer = { text: user, type: 'name', id: clientID }
        textfieldName.value = user
        webSocket.send(JSON.stringify(messageToServer))
        webSocket.send(JSON.stringify({ type: 'history' }))
    }
}

//DETERMINE MESSAGE ACTION          

function choiceBy(type, data) {
    if (type == 'message')
        handleIfMessage(data)
    if (type == 'list')
        handleIfList(data)
    if (type == 'history')
        handleIfHistory(data)
}


function messageConstructor(messageInfo){
    let message
    console.log('--->',otherUserTexts)
    if (messageInfo.name == textfieldName.value && messageInfo.id == localStorage.getItem('ClientID')){
        message = `<p id="mainUser">${messageInfo.text}</p>` //<p class='date'></p>
        otherUserTexts.push(messageInfo)
    }
    else{
        console.log('CHOICE--->',messageInfo.icon === otherUserTexts[otherUserTexts.length-1].icon)
        if(messageInfo.id === otherUserTexts[otherUserTexts.length-1].id)
            message = `<p id="otherUser">${messageInfo.text}</p>` //<img></img><p class='date'></p>
        else{
            otherUserTexts.push(messageInfo)
            message = `<div class="messageContainer">
            <img class="chatImages" src="${messageInfo.icon}">
            </img><p id="otherUser">${messageInfo.text}</p></div>` 
        }
    }    
    return message
}