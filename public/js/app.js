addEventListener('DOMContentLoaded', ()=>{
    const btn = document.querySelector("#bton")
    if (btn){
        btn.addEventListener('click' ,()=>{
            const menu_item = document.querySelector('.menu-item')
            menu_item.classList.toggle('show')
        })
    }
})