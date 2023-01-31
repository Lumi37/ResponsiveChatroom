
import { sunButton,moonButton } from "../index.js"

export function preference(preferedMode){
    if (preferedMode === 'light'){
        sunButton.classList.add('darkmodeDisabled')
        document.querySelector('#searchicon').src = 'images/lightmode/searchicon.png'
        try {
            
        document.querySelector('link[href="darkmode.css"]').href = 'lightmode.css'
        } catch (error) {
            
        }
        localStorage.setItem('preference','light')
        moonButton.classList.remove('lightmodeDisabled')
        
    }


       
    if(preferedMode ==='dark'){
        moonButton.classList.add('lightmodeDisabled')
        document.querySelector('#searchicon').src = 'images/darkmode/searchicon.png'
        try {
            document.querySelector('link[href="lightmode.css"]').href = 'darkmode.css' 
        } catch (error) {
            
        }
        
        localStorage.setItem('preference','dark')
        sunButton.classList.remove('darkmodeDisabled')
    }

            

}
