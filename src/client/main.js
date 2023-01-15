
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
let noEdit = true
// const storageName = localStorage.getItem('name')

//SENDING INFO FROM LOCALSTORAGE
webSocket.addEventListener("open", () => {
    console.log("Client connected Succesfuly")
    sendInfoFromLocalStorage()
    // refreshList()
})

//SAVING NAME, SENDING TO SERVER
saveNameButton.addEventListener('click', e => { console.log("Save name button pressed!"); sendSaveName() })

//EDIT NAME
editNameButton.addEventListener('click', e => { console.log("Edit name button pressed!"); nameEdit() })

//SENDING MESSAGE TO SERVER
sendButton.addEventListener("click", e => { console.log("Send Message button pressed!"); sendMessageToServer() })

textfieldMessage.addEventListener('keypress', e => {
    const key = e.key
    if (key == 'Enter') {
        sendMessageToServer()
    }
})


//REFRESH LIST REQ
refreshBtn.addEventListener('click', e => { console.log("Refresh List button pressed!"); refreshList() })


//RECEIVING MESSAGE FROM SERVER
webSocket.addEventListener("message", (e) => {
    console.log("received message", e.data)
    let data = JSON.parse(e.data)
    let typeofMessage = MessageType(data.type)
    console.log('typeofMessage = ', data.type)
    if (typeofMessage == 'message')
        handleIfMessage(data)
    if (typeofMessage == 'list')
        handleIfList(data)
    if (typeofMessage == 'history')
        handleIfHistory(data)

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


function handleIfMessage(messageInfo) {
    if (messageInfo.name == textfieldName.value && messageInfo.id == localStorage.getItem('ClientID')) {
        let message = (`<p class="user">${messageInfo.date} ${messageInfo.name}: ${messageInfo.text}</p><br>`)
        chat.innerHTML += message

    }
    else {
        let message = `<p class="otheruser">${messageInfo.date} ${messageInfo.name}: ${messageInfo.text}</p><br>`
        chat.innerHTML += message
    }

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
        if (noEdit)
            window.localStorage.setItem('ClientID', clientUniqueIDGenerator())
        let storeID = localStorage.getItem('ClientID')
        let name = textfieldName.value
        let messageToServer = { text: name, type: 'name', id: storeID }
        webSocket.send(JSON.stringify(messageToServer))
        document.querySelector("#hello").textContent = 'Hello ' + textfieldName.value
    }
}

function nameEdit() {
    saveNameButton.disabled = false
    editname.disabled = false
    noEdit == false

}


function handleIfList(listItem) {

    list.innerHTML = ''
    let userList = listItem.list
    console.log(userList)
    userList.forEach(elem => {
        if (elem.status === 'online')
            list.innerHTML += `<li>${elem.name}  <img id="statusicon" src="images/greenicon.png" alt="online"></li>`
        if (elem.status === 'offline')
            list.innerHTML += `<li>${elem.name}  <img id="statusicon" src="images/greyicon.png" alt="offline"></li>`
    })
}


function handleIfHistory(messageInfo) {
    if (messageInfo.name == textfieldName.value && messageInfo.id == localStorage.getItem('ClientID')) {
        let message = (`<p class="user">${messageInfo.date} ${messageInfo.name}: ${messageInfo.text}</p><br>`)
        chat.innerHTML += message

    }
    else {
        let message = `<p class="otheruser">${messageInfo.date} ${messageInfo.name}: ${messageInfo.text}</p><br>`
        chat.innerHTML += message
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
    if (!(localStorage.getItem('ClientID')))
        window.localStorage.setItem('ClientID', clientUniqueIDGenerator()) //REGISTER ID TO STORAGE
    else {
        saveNameButton.disabled = true
        editNameButton.disabled = false
        sendButton.disabled = false
        textfieldMessage.disabled = false
        const user = localStorage.getItem('name')
        let clientID = localStorage.getItem('ClientID');
        let messageToServer = { text: user, type: 'name', id: clientID }
        document.querySelector("#hello").textContent = 'Hello ' + user
        textfieldName.value = user
        webSocket.send(JSON.stringify(messageToServer))
        webSocket.send(JSON.stringify({ type: 'history' }))
    }
}

