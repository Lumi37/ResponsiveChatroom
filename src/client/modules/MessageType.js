export function MessageType(type) {
    switch (type) {
        case 'message':
            return 'message'
        case 'list':
            return 'list'
        case 'history':
            return 'history'
        case 'refreshList':
            return 'refreshList'
        default:
            console.log('unknown error')
    }
}
