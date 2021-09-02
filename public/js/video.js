addEventListener('DOMContentLoaded', ()=>{
    const btn = document.querySelector("#bton")
    if (btn){
        btn.addEventListener('click' ,()=>{
            const player = document.querySelector('#video')
            player.classList.toggle('none')
        })
    }
})