import { history,users } from "../server.mjs"

export function handleIfHistory(id) {
    console.log('\n\n\n-----------------handleIfHistory-----------------\nLoading: ', history.length, 'messages...')
    users.forEach(user => {
        history.forEach(messageObject => {
            // messageObject.requesterID = id
            console.log(messageObject)
            let sliced
            sliced = messageObject.slice(0,messageObject.length-1)+`,"requesterID":"${id}"}`
            user.send(sliced)
        })
    })
}
