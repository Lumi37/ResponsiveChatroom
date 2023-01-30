
export function listConstructor(listItem) {

    list.innerHTML = ''
   
    let userList = listItem.list
    userList.forEach(elem => {
    let dateRightNow = new Date()
    let name ='';
    let message = '';
    let lastOnline =elem.dateHours;
    if(elem.dateHours!='online'){
        lastOnline = String(((dateRightNow.getDay()+1) - elem.dateDay)*24 + ((dateRightNow.getHours()+1) - elem.dateHours))+'h'
        console.log(((dateRightNow.getDay()+1) - elem.dateDay)*24 + ((dateRightNow.getHours()+1) - elem.dateHours))
    }
            
    if(elem.name.length> 15)
        name = elem.name.slice(0,14) + '...'
    else
        name = elem.name
    if(elem.lastMessage.length>15)
        message = elem.lastMessage.slice(0,16) + '...'
    else 
        message = elem.lastMessage
    list.innerHTML += `
            <li class="listItemsContainer">  
                <div id="imgContainerList">
                    <img src="${`images/${elem.id}.png`}" id="listUserIcon" alt=""> 
                    <div id="${elem.status}"></div>
                </div>
                <div class="listNameMessageContainer">
                    <div id="userListName">${name}<div class="tooltip"">${elem.name}</div></div>
                    <div id="userLastMessage">${message}</div>
                </div>
                <div id="dateContainer"><div id="lastOnline">${lastOnline}</div></div>
            </li>`             
    })
    
}