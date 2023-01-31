import { list,users } from "../server.mjs"
 
export function handleIfList() {
    console.log('\n\n\n-----------------handleIfList-----------------')
    list.forEach(user => {
        console.log(`List:\n${user.name} : ${user.id} : ${user.status}`)
    })
    users.forEach(user => {
        user.send(JSON.stringify({ list, type: 'list'}))
    })
}