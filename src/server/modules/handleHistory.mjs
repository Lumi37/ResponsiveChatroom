import { history,users } from "../server.mjs"
import { accessChatLog,client } from "./mongoDB.mjs"

export async function handleIfHistory(id) {
    console.log('\n\n\n-----------------handleIfHistory-----------------\nLoading: ', history.length, 'messages...')
    try {
        let historyLog  = await accessChatLog()
                                .then()
                                .catch(console.error())
                                .finally(()=>client.close);
        console.log('HISTORYLOG:',historyLog,'\nTYPEOF:',typeof(historyLog))
        users.forEach(user => {
            historyLog.forEach(item => {
            // messageObject.requesterID = id
            let messageObject = JSON.stringify(item.historyTextObj)
            let sliced  
            sliced = messageObject.slice(0,messageObject.length-1)+`,"requesterID":"${id}"}`
            user.send(sliced)
        })
    })

    } catch (error) {console.log(error)} 
}
