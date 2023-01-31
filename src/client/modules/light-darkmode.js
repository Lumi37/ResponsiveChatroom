
import { sunButton,moonButton } from "../index.js"

export function preference(preferedMode){
    if (preferedMode === 'light'){
        sunButton.setAttribute('display','none')
        try {
            
        document.querySelector('link[href="darkmode.css"]').href = 'lightmode.css'
        } catch (error) {
            
        }
        localStorage.setItem('preference','light')
        moonButton.removeAttribute('display')  
    }


       
    if(preferedMode ==='dark'){
        moonButton.setAttribute('display','none')
        try {
            document.querySelector('link[href="lightmode.css"]').href = 'darkmode.css' 
        } catch (error) {
            
        }
        
        localStorage.setItem('preference','dark')
        sunButton.removeAttribute('display')  
    }

            

}
