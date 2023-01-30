const lightmode = document.querySelector('#darkmode')

lightmode.addEventListener('click',e=>{
    document.querySelector('link[href="darkmode.css"]').href = 'lightmode.css'
})