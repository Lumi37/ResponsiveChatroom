

export function preference(preferedMode){
    if (preferedMode === 'light')
        document.querySelector('link[href="darkmode.css"]').href = 'lightmode.css'
    if(preferedMode ==='dark')
        document.querySelector('link[href="lightmode.css"]').href = 'darkmode.css'
}
