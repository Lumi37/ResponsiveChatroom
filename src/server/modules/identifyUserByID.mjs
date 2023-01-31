import { list } from "../server.mjs"

 export function identifyUserById(id) {
    let outcome = false
    console.log('\n\n\n-----------------identifyUserById-----------------\nlist.length: ', list.length)
    list.forEach(user => {
        if (id === user.id) {
            console.log('user identified as ', user.name, 'with ID:', user.id)
            console.log('RETURNS TRUE')
            outcome = true
        }
    })
    if (outcome) { return outcome }
    else { console.log('RETURNS FALSE'); return outcome }
}