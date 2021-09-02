addEventListener('DOMContentLoaded', ()=>{
    const btn = document.querySelector("#f3")
    if (btn){
        btn.addEventListener('click' ,()=>{
            const search = document.querySelector('.menu-item')
            search.classList.toggle('none')
        })
    }
})