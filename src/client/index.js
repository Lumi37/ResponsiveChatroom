
import { settleChatIcons,settleListIcons } from './modules/settleIcons.js'
import { messageConstructor } from './modules/messageConstructor.js';
import { maxScrollHeight } from './modules/maxScrollHeight.js'
import { sendMessageToServer } from './modules/sendMessageToServer.js';
import { sendSavedNameToServer } from './modules/sendSavedNameToServer.js';
import { listConstructor } from './modules/listConstructor.js';
import { MessageType } from './modules/MessageType.js';
import { preference } from './modules/light-darkmode.js';
import { clientUniqueIDGenerator } from './modules/randomIDGenerator.js';

const webSocket = new WebSocket(`ws://${location.hostname}:3001`);//('ws://localhost:3001')
document.querySelector('#uploadForm').action = location.href

export const textfieldName = document.querySelector('#username')
export const editNameButton = document.querySelector('#editNameButton')
export const hiddenUsernamefield = document.querySelector('#hiddenusername')
export const hiddenIDfield = document.querySelector('#userID')
export const textfieldMessage = document.querySelector('#typingArea')
export const list = document.querySelector('#list')
export const saveNameButton = document.querySelector("#saveButton")
export let preferedMode = localStorage.getItem('preference')
export let noEdit = true
export const sunButton = document.querySelector('#darkmode')
export const moonButton = document.querySelector('#lightmode')
const chat = document.querySelector('#messagesDisplay')
const storageID = localStorage.getItem('ClientID')
const refreshButton = document.querySelector('#refreshList')
const sendButton = document.querySelector("#paperAirplane")
const uploadButton = document.querySelector('#uploadButton')
const fileInput = document.querySelector('#fileupload')
const submitFileButton =document.querySelector('#submitFile')


// file submit
uploadButton.addEventListener('click',e=>{
    fileInput.click()
})
fileInput.onchange = ()=>{
    submitFileButton.click();
    refreshPage()
}

//SENDING INFO FROM LOCALSTORAGE
webSocket.addEventListener("open", () => { sendInfoFromLocalStorage() })

//SAVING NAME, SENDING TO SERVER
saveNameButton.addEventListener('click', e => {
     if(saveNameButton.id === 'saveButton')
        webSocket.send( sendSavedNameToServer() );
     refreshList(); 
})


//EDIT NAME
editNameButton.addEventListener('click', e => { if(editNameButton.id === 'editNameButton')nameEdit() })

// SENDING MESSAGE TO SERVER
 sendButton.addEventListener("click", e => {  webSocket.send(sendMessageToServer()) })

textfieldMessage.addEventListener('keypress', e => {
    const key = e.key
    if (key == 'Enter') {
        webSocket.send(sendMessageToServer())
    }
})

//REFRESH LIST REQ
refreshButton.addEventListener('click', e => { refreshList() })


//RECEIVING MESSAGE FROM SERVER
webSocket.addEventListener("message", (e) => { 
    let data = JSON.parse(e.data)
    choiceBy(MessageType(data.type), data)
 })

    sunButton.addEventListener('click',e=>{
            preference('light')
    })

    


    moonButton.addEventListener('click',e=>{
            preference('dark')
    })

 //FUNCTIONS 


function handleIfMessage(messageInfo) {
    let message = messageConstructor(messageInfo)
    console.log(message)
    chat.innerHTML += message
    chat.scrollTop +=  maxScrollHeight()
    settleChatIcons()
    refreshList()
}


function nameEdit() {
    saveNameButton.id='saveButton'
    console.log('edit pressed!')
    editNameButton.id = 'editNameButtonDisabled'
    noEdit = false
    console.log('edit',noEdit)

}
 


function handleIfHistory(messageInfo) {
    if (messageInfo.requesterID === storageID){
        chat.innerHTML += messageConstructor(messageInfo)
        chat.scrollTop +=  maxScrollHeight()
        settleChatIcons()
        refreshList()
    }
}


function refreshList() {
    list.innerHTML = ''
    webSocket.send(JSON.stringify({ type: 'list' }))
}





//SENDING USER INFO FROM LOCALSTORAGE
function sendInfoFromLocalStorage() {
    console.log('sendInfoFromLocalStorage')
    if (!(localStorage.getItem('ClientID'))){
        window.localStorage.setItem('ClientID', clientUniqueIDGenerator()) //REGISTER ID TO STORAGE
        window.localStorage.setItem('preference','dark')
        hiddenIDfield.value = localStorage.getItem('ClientID')
    }
    else {
        preference(preferedMode)
        saveNameButton.id='saveButtonDisabled'
        textfieldMessage.disabled = false
        const user = localStorage.getItem('name')
        let clientID = localStorage.getItem('ClientID');
        hiddenUsernamefield.value = user
        hiddenIDfield.value = clientID
        let messageToServer = { text: user, type: 'name', id: clientID }
        textfieldName.value = user
        webSocket.send(JSON.stringify(messageToServer))
        webSocket.send(JSON.stringify({ type: 'history',id:clientID}))
    }
    refreshList()
}

//DETERMINE MESSAGE ACTION          

function choiceBy(type, data) {
    if (type == 'message')
        handleIfMessage(data)
    if (type == 'list'){
        listConstructor(data)
        settleListIcons()
    }
    if (type == 'history')
        handleIfHistory(data)
    if (type == 'refreshList')
        refreshList()
    
}




function refreshPage(){
    setTimeout( ()=>{ window.location.reload()} , 500 ) 
}


