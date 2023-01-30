
import {saveNameButton,editNameButton,textfieldMessage,textfieldName,noEdit,hiddenIDfield,hiddenUsernamefield} from '../index.js'

export function sendSavedNameToServer() {
    console.log('save pressed!')
    if (!textfieldName.value == '') {
        saveNameButton.id = 'saveButtonDisabled'
        editNameButton.id = 'editNameButton'
        textfieldMessage.disabled = false
        window.localStorage.setItem('name', textfieldName.value)
        console.log('savename',noEdit)
        if (noEdit)
            window.localStorage.setItem('ClientID', clientUniqueIDGenerator())
        let storeID = localStorage.getItem('ClientID')
        let storeName = localStorage.getItem('name')
        console.log('StoreID = ', storeID)
        hiddenUsernamefield.value = storeName
        hiddenIDfield.value = storeID
        console.log('hiddenIDfield = ', hiddenIDfield.value)
        let name = textfieldName.value
        let messageToServer = { text: name, type: 'name', id: storeID }
        return JSON.stringify(messageToServer)
        
    }
   
}
