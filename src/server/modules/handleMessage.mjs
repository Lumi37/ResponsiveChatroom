import { list,history,users } from "../server.mjs"
 
export function handleIfMessage(message, Name, userID) {
    console.log('\t\n\n\n-----------------handleIfMessage-----------------')
    if(message !== '' && message!=='\n'){
        const currentdate = dateNow()
        const listCurrentIndex = list.findIndex(user => user.id ==  userID)
        list[listCurrentIndex].lastMessage = message
        let userIcon = list[listCurrentIndex].icon
        let messageToClient = JSON.stringify({ date: currentdate, name: Name, text: message, type: 'message', id: userID, icon: userIcon})
        let historyText = JSON.stringify({ date: currentdate, name: Name, text: message, type: 'history', id: userID, icon: userIcon})
        history.push(historyText) //SAVING TO HISTORY ARR
        console.log('Final Message: ', messageToClient)
        users.forEach(user => {
            user.send((messageToClient))
        })
    }
}

// CURRENT DATE
function dateNow() {
    let currentdate = new Date();
    const datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
    return datetime
}
