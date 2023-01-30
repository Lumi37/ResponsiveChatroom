// import { storageID } from "./index.js"

const mainPicture = document.querySelector('.userProfilePicture')
mainPicture.src = 'images/'+localStorage.getItem('ClientID') +'.png'

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
   