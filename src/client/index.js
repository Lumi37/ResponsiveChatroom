const webSocket = new WebSocket('ws://localhost:3001');
const textfieldName = document.querySelector('#username')
const saveNameButton = document.querySelector("#saveButton")
const textfieldMessage = document.querySelector('#typingArea')
const chat = document.querySelector('#messagesDisplay')
const list = document.querySelector('#list')
const refreshButton = document.querySelector('#refreshList')
const editNameButton = document.querySelector('#editNameButton')
const storageID = localStorage.getItem('ClientID')
const hiddenUsernamefield = document.querySelector('#hiddenusername')
const hiddenIDfield = document.querySelector('#userID')
const sendButton = document.querySelector("#paperAirplane")
const uploadButton = document.querySelector('#uploadButton')
const fileInput = document.querySelector('#fileupload')
const submitFileButton =document.querySelector('#submitFile')
const mainPicture = document.querySelector('.userProfilePicture')
let messegerIMGs = []
mainPicture.src = 'images/'+storageID+'.png'
let date = new Date()
let noEdit = true
let otherUserTexts = []
let changedPicture = false
otherUserTexts.push({date: '', name: '', text: '', type: '', id: '', icon: ''})

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
saveNameButton.addEventListener('click', e => { if(saveNameButton.id === 'saveButton')sendSaveName() })

//EDIT NAME
editNameButton.addEventListener('click', e => { if(editNameButton.id === 'editNameButton')nameEdit() })

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


//CHECK MAIN IMG SRC
mainPicture.addEventListener('error',e=>{
    mainPicture.src = 'images/default.png'
})
messegerIMGs.forEach(img=>{
    img.addEventListener('error',e=>{
        img.src = 'images/default.png'
    })
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
        case 'refreshList':
            return 'refreshList'
        default:
            console.log('unknown error')
    }
}


function handleIfMessage(messageInfo) {
    let message = messageConstructor(messageInfo)
    console.log(message)
    chat.innerHTML += message
    chat.scrollTop +=  maxScrollHeight()
    settleChatIcons()
    refreshList()
    
}
function maxScrollHeight(){
    let maximumScrollHeight = 0
    document.querySelectorAll('#messagesDisplay>div').forEach(p=>{
        maximumScrollHeight += p.offsetHeight
    })
    return maximumScrollHeight
}




function sendMessageToServer() {
    let ChatText = textfieldMessage.value;
    if(ChatText.length>200){
        ChatText = ChatText.slice(0,200)
    }
    let userName = textfieldName.value;
    let storeID = localStorage.getItem('ClientID')
    textfieldMessage.value = ''
    if (ChatText !== '' || ChatText !=='\n'){
        let messageToServer = { text: ChatText, name: userName, type: 'message', id: storeID }
        webSocket.send(JSON.stringify(messageToServer))
}
}


function sendSaveName() {
    console.log('save pressed!')
    if (!textfieldName.value == '') {
        saveNameButton.id = 'saveButtonDisabled'
        editNameButton.id = 'editNameButton'
        textfieldMessage.disabled = false
        window.localStorage.setItem('name', textfieldName.value)
        console.log('savename',noEdit)
        if (noEdit)
            window.localStorage.setItem('ClientID', clientUniqueIDGenerator())
        let storeID = localStorage.getItem('ClientID')
        let storeName = localStorage.getItem('name')
        console.log('StoreID = ', storeID)
        hiddenUsernamefield.value = storeName
        hiddenIDfield.value = storeID
        console.log('hiddenIDfield = ', hiddenIDfield.value)
        let name = textfieldName.value
        let messageToServer = { text: name, type: 'name', id: storeID }
        webSocket.send(JSON.stringify(messageToServer))
    }
    refreshList()
}

function nameEdit() {
    saveNameButton.id='saveButton'
    console.log('edit pressed!')
    editNameButton.id = 'editNameButtonDisabled'
    noEdit = false
    console.log('edit',noEdit)

}


function handleIfList(listItem) {

    list.innerHTML = ''
   
    let userList = listItem.list
    userList.forEach(elem => {
    let dateRightNow = new Date()
    let name ='';
    let message = '';
    let lastOnline =elem.dateHours;
    if(elem.dateHours!='online'){
        lastOnline = String(((dateRightNow.getDay()+1) - elem.dateDay)*24 + ((dateRightNow.getHours()+1) - elem.dateHours))+'h'
        console.log(((dateRightNow.getDay()+1) - elem.dateDay)*24 + ((dateRightNow.getHours()+1) - elem.dateHours))
    }
            
    if(elem.name.length> 15)
        name = elem.name.slice(0,14) + '...'
    else
        name = elem.name
    if(elem.lastMessage.length>15)
        message = elem.lastMessage.slice(0,16) + '...'
    else 
        message = elem.lastMessage
    list.innerHTML += `
            <li class="listItemsContainer">  
                <div id="imgContainerList">
                    <img src="${`images/${elem.id}.png`}" id="listUserIcon" alt=""> 
                    <div id="${elem.status}"></div>
                </div>
                <div class="listNameMessageContainer">
                    <div id="userListName">${name}<div class="tooltip"">${elem.name}</div></div>
                    <div id="userLastMessage">${message}</div>
                </div>
                <div id="dateContainer"><div id="lastOnline">${lastOnline}</div></div>
            </li>`             
    })
    settleListIcons()
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
    console.log('sendInfoFromLocalStorage')
    if (!(localStorage.getItem('ClientID'))){
        window.localStorage.setItem('ClientID', clientUniqueIDGenerator()) //REGISTER ID TO STORAGE
        hiddenIDfield.value = localStorage.getItem('ClientID')
    }
    else {
        saveNameButton.id='saveButtonDisabled'
        // editNameButton.classList.remove('editNameButtonDisabled')
        // editNameButton.classList.add('editNameButton')
        // sendButton.disabled = false 
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
    if (type == 'list')
        handleIfList(data)
    if (type == 'history')
        handleIfHistory(data)
    if (type == 'refreshList')
        refreshList()
    
}


function messageConstructor(messageInfo){
    let message
    if(messageInfo.text.length > 14){
        if (messageInfo.name == textfieldName.value && messageInfo.id == localStorage.getItem('ClientID')){
            message = `<div class="mainUser" id='text' data-text-type="textOverflow">${messageInfo.text}</div>` 
            otherUserTexts.push(messageInfo)
        }
        else{
            console.log('CHOICE--->',messageInfo.icon === otherUserTexts[otherUserTexts.length-1].icon)
            if(messageInfo.id === otherUserTexts[otherUserTexts.length-1].id)
                message = `<div class="otherUser" id='text' data-text-type="textonly">${messageInfo.text}</div>` 
            else{
                otherUserTexts.push(messageInfo)
                // messegerIMGs.push()
                message = `
                <div class="messageContainer">
                    <img class="chatImages" src="${`images/${messageInfo.id}.png`}"></img>
                    <div class="otherUser" id='text' >${messageInfo.text}</div>
                </div>`  
            }
        }    
    }else{
        if (messageInfo.name == textfieldName.value && messageInfo.id == localStorage.getItem('ClientID')){
            message = `<div class="mainUser">${messageInfo.text}</div>` 
            otherUserTexts.push(messageInfo)
        }
        else{
            if(messageInfo.id === otherUserTexts[otherUserTexts.length-1].id)
                message = `<div class="otherUser" data-text-type="textonly">${messageInfo.text}</div>` 
            else{
                otherUserTexts.push(messageInfo)
                // messegerIMGs.push()
                message = `
                <div class="messageContainer">
                    <img class="chatImages" src="${`images/${messageInfo.id}.png`}"></img>
                    <div class="otherUser" >${messageInfo.text}</div>
                </div>`  
            }
        } 
    }
    return message
}

function refreshPage(){
    setTimeout( ()=>{ window.location.reload()} , 500 ) 
}

function settleListIcons(){
 document.querySelectorAll('#listUserIcon').forEach(img=>{
    img.addEventListener('error',e=>{
        img.src='images/default.png '
    })
 })
}
 function settleChatIcons(){
    document.querySelectorAll('.chatImages').forEach(img=>{
        img.addEventListener('error',e=>{
            img.src='images/default.png '
        })
    }) 
 }

