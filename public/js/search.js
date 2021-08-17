addEventListener('DOMContentLoaded', ()=>{
    const search = document.querySelector(".f3")
    if (search){
        btn.addEventListener('click' ,()=>{
            const search_item = document.querySelector('#f4')
            search_item.classList.toggle('look')
        })
    }
    else{
        console.log("ERROR")
    }
})