addEventListener('DOMContentLoaded', ()=>{
    const btn = document.querySelector("#bton")
    if (btn){
        btn.addEventListener('click' ,()=>{
            const slider = document.querySelector('#carouselExampleControls')
            slider.classList.toggle('none')
        })
    }
})