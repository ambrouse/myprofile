document.addEventListener("DOMContentLoaded", function () {
    requestAnimationFrame(checkOrientation);

    const page = document.querySelectorAll('.profile .profile__item');

    for(let i = 0 ; i < page.length ; i++){
        const observer = new IntersectionObserver((entries) => {
        entries.forEach(async entry => {
            page[i].querySelector('.profile .profile__item .profile__item--name p').classList.add('animation')
            let title = page[i].querySelectorAll('.profile .profile__item .profile__item--infor .infor__item .infor__item--title p')
            let item_1 = page[i].querySelectorAll('.profile .profile__item .profile__item--infor .infor__item:nth-child(1) .infor__item--content p')
            let item_2 = page[i].querySelectorAll('.profile .profile__item .profile__item--infor .infor__item:nth-child(2) .infor__item--content p')
            let item_3 = page[i].querySelectorAll('.profile .profile__item .profile__item--infor .infor__item:nth-child(3) .infor__item--content p')
            let item_4 = page[i].querySelectorAll('.profile .profile__item .profile__item--infor .infor__item:nth-child(4) .infor__item--content p')
            let item_5 = page[i].querySelector('.profile .profile__item .profile__item--infor .infor__item:nth-child(4) .infor__item--content iframe')
            if (entry.isIntersecting) {
                for(let i = 0 ; i < title.length ; i++){
                    title[i].classList.add('animation')
                }
                for(let i = 0 ; i < item_1.length ; i++){
                    item_1[i].classList.add("animation_")
                    await sleep(50)
                }
                for(let i = 0 ; i < item_3.length ; i++){
                    item_3[i].classList.add("animation_")
                    await sleep(50)
                }
                for(let i = 0 ; i < item_2.length ; i++){
                    item_2[i].classList.add("animation_")
                    await sleep(50)
                }
                for(let i = 0 ; i < item_4.length ; i++){
                    item_4[i].classList.add("animation_")
                    await sleep(50)
                }
                if(item_5){
                    item_5.classList.add("animation_")
                }
            }else{
                for(let i = 0 ; i < title.length ; i++){
                    title[i].classList.remove('animation')
                }
                for(let i = 0 ; i < item_1.length ; i++){
                    item_1[i].classList.remove("animation_")
                    await sleep(50)
                }
                for(let i = 0 ; i < item_3.length ; i++){
                    item_3[i].classList.remove("animation_")
                    await sleep(50)
                }
                for(let i = 0 ; i < item_2.length ; i++){
                    item_2[i].classList.remove("animation_")
                    await sleep(50)
                }
                for(let i = 0 ; i < item_4.length ; i++){
                    item_4[i].classList.remove("animation_")
                    await sleep(50)
                }
                if(item_5){
                    item_5.classList.remove("animation_")
                }
            }
        });
        }, {
        threshold: 1
        });
        observer.observe(page[i]);
    }
});


function tog(index){
    if(index==0){
        document.querySelector('.profile').scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    document.querySelector('.profile').scrollTo({
        top: document.querySelector('.profile .profile__item:nth-child(1)').getBoundingClientRect().height * index,
        behavior: 'smooth'
    });
}


function preventScroll(e) {
  e.preventDefault();
}


function preventKeyScroll(e) {
  const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
  if (keys.includes(e.keyCode)) {
    e.preventDefault();
  }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function togithub(link){
    window.open(link, "_blank");
}


function checkOrientation() {
    if (window.matchMedia("(orientation: portrait)").matches) {
        document.querySelector(".warrning").classList.add("warrning__display")
    }else{
        document.querySelector(".warrning").classList.remove("warrning__display")
    }

    requestAnimationFrame(checkOrientation);
}


