

const webSocket = new WebSocket('ws://localhost:3001');
const textfieldName = document.querySelector('#nameTextField')
const textfieldMessage = document.querySelector('#messageField')
const chat = document.querySelector("#chat")
const sendButton = document.querySelector("#sendMessage")
const saveNameBtn = document.querySelector("#saveName")

webSocket.addEventListener("open",()=>{
    console.log("Client connected Succesfuly")
    try{
        const user = JSON.parse(localStorage.getItem('user'))
        document.querySelector("#hello").textContent = 'Hello ' + user.name
        webSocket.send('[NAME]' + user.name )
    }catch(err){

    }

})
    //SAVING NAME, SENDING TO SERVER
saveNameBtn.addEventListener("click",e=>{

    let LS = textfieldName.value
    window.localStorage.setItem('user',JSON.stringify({name:LS}))
    webSocket.send("[NAME]" + textfieldName.value)
    document.querySelector("#hello").textContent = 'Hello ' + textfieldName.value
})
    //SENDING MESSAGE TO SERVER
sendButton.addEventListener("click", e=>{
    webSocket.send(textfieldMessage.value)
})
    //RECEIVING MESSAGE FROM SERVER
webSocket.addEventListener("message", (e)=>{
    console.log("received message",e.data)
    // let p = document.createElement('p');
    // p = e.data
    chat.innerHTML += `<p>${e.data}</p><br>`
})

document.querySelector('#clear').addEventListener("click",(e)=>{
    chat.innerHTML = ''
})
document.querySelector('#ls').addEventListener('click',(e)=>{

})