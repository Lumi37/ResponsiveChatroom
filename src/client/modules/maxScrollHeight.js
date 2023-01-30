export function maxScrollHeight(){
    let maximumScrollHeight = 0
    document.querySelectorAll('#messagesDisplay>div').forEach(p=>{
        maximumScrollHeight += p.offsetHeight
    })
    return maximumScrollHeight
}
