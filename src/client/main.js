const webSocket = new WebSocket('ws://localhost:443/');
const userName = document.querySelector('#name')
const chat = document.querySelector("#chat")
webSocket.addEventListener("message", (e)=>{
    chat.value = e.data;
})
document.querySelector('#saveName').addEventListener("click",e=>{
    userName.value = 
})