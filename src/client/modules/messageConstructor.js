
import  {textfieldName} from '../index.js'

let otherUserTexts = []
otherUserTexts.push({date: '', name: '', text: '', type: '', id: '', icon: ''})

export function messageConstructor(messageInfo){
    let message
    if(messageInfo.text.length > 14){
        if (messageInfo.name == textfieldName.value && messageInfo.id == localStorage.getItem('ClientID')){
            message = `<div class="mainUser" id='text' data-text-type="textOverflow">${messageInfo.text}</div>` 
            otherUserTexts.push(messageInfo)
        }
        else{
            console.log('CHOICE--->',messageInfo.icon === otherUserTexts[otherUserTexts.length-1].icon)
            if(messageInfo.id === otherUserTexts[otherUserTexts.length-1].id)
                message = `<div class="otherUser" id='text' data-text-type="textonly">${messageInfo.text}</div>` 
            else{
                otherUserTexts.push(messageInfo)
                // messegerIMGs.push()
                message = `
                <div class="messageContainer">
                    <img class="chatImages" src="${`images/${messageInfo.id}.png`}"></img>
                    <div class="otherUser" id='text' >${messageInfo.text}</div>
                </div>`  
            }
        }    
    }else{
        if (messageInfo.name == textfieldName.value && messageInfo.id == localStorage.getItem('ClientID')){
            message = `<div class="mainUser">${messageInfo.text}</div>` 
            otherUserTexts.push(messageInfo)
        }
        else{
            if(messageInfo.id === otherUserTexts[otherUserTexts.length-1].id)
                message = `<div class="otherUser" data-text-type="textonly">${messageInfo.text}</div>` 
            else{
                otherUserTexts.push(messageInfo)
                // messegerIMGs.push()
                message = `
                <div class="messageContainer">
                    <img class="chatImages" src="${`images/${messageInfo.id}.png`}"></img>
                    <div class="otherUser" >${messageInfo.text}</div>
                </div>`  
            }
        } 
    }
    return message
}