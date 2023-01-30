
import {textfieldMessage,textfieldName} from '../index.js'

export function sendMessageToServer() {
    let ChatText = textfieldMessage.value;
    if(ChatText.length>200){
        ChatText = ChatText.slice(0,200)
    }
    let userName = textfieldName.value;
    let storeID = localStorage.getItem('ClientID')
    textfieldMessage.value = ''
    if (ChatText !== '' || ChatText !=='\n'){
        let messageToServer = { text: ChatText, name: userName, type: 'message', id: storeID }
        return JSON.stringify(messageToServer)
    }
}