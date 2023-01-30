// import { storageID } from "./index.js"

const storageID = localStorage.getItem('ClientID')
const mainPicture = document.querySelector('.userProfilePicture')
mainPicture.src = 'images/'+storageID +'.png'

mainPicture.addEventListener('error',e=>{
    mainPicture.src = 'images/default.png'
})



export function settleListIcons(){
    document.querySelectorAll('#listUserIcon').forEach(img=>{
        img.addEventListener('error',e=>{
            img.src='images/default.png '
        })
    })
}


export function settleChatIcons(){
    document.querySelectorAll('.chatImages').forEach(img=>{
        img.addEventListener('error',e=>{
            img.src='images/default.png '
        })
    }) 
}
   