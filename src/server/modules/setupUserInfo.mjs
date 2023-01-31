
import { list } from "../server.mjs"
 
export function setNewUserInfo(uID, username, connection) {
    console.log('\n\n\n-----------------setNewUserInfo-----------------')
    connection.userName = username
    connection.id = uID
    let datenow ='online'
    list.push({ name: username, id: uID, status: 'online', icon:'images/default.png', lastMessage:'' ,dateHours:datenow,dateDay:'' })
    console.log(`User ${connection.userName} Connected!`)
}


export function setUserInfo(id, name, connection) {
    console.log('\n\n\n-----------------setUserInfo-----------------')
    list.forEach(user => {
        if (id === user.id) {
            connection.userName = name
            connection.id = id
            user.name = name
            user.dateHours = 'online'
            console.log(user)
            user.status = 'online'
            console.log('user identified as ', connection.userName, 'with ID:', connection.id)
        }
    });
}
