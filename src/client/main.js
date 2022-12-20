const webSocket = new WebSocket('ws://localhost:3001');
const textfieldName = document.querySelector('#nameTextField')
const textfieldMessage = document.querySelector('#messageField')
const chat = document.querySelector("#chat")
const sendButton = document.querySelector("#sendMessage")
const saveNameBtn = document.querySelector("#saveName")

webSocket.addEventListener("open",()=>{
    console.log("Client connected Succesfuly")
})
    //SAVING NAME, SENDING TO SERVER
saveNameBtn.addEventListener("click",e=>{
    webSocket.send("[NAME]" + textfieldName.value) 
})
    //SENDING MESSAGE TO SERVER
sendButton.addEventListener("click", e=>{
    webSocket.send(textfieldMessage.value)
})
    //RECEIVING MESSAGE FROM SERVER
webSocket.addEventListener("message", (e)=>{
    console.log("received message",e, e.data)
    chat.textContent += e.data
})