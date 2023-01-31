
export function identifyMessageType(type) {
    console.log('\n\n\n-----------------identifyMessageType-----------------')
    switch (type) {
        case 'name':
            console.log('identifyMessageType returns "name"')
            return 'name';
        case 'message':
            console.log('identifyMessageType returns "message"')
            return 'message';
        case 'list':
            console.log('identifyMessageType returns "list"')
            return 'list';
        case 'history':
            console.log('identifyMessage returns "history"')
            return 'history'
        default:
            console.log(type)
            console.log('identifyMessageType returns "error"')
            return 'error';
    }
}
