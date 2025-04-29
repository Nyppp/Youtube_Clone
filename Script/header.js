// let topMenu;
// let isDown = false;
// let startX;
// let scrollTop;

// const observer = new MutationObserver((mutationsList, observer) => {
//     const target = document.querySelector('.Top-Menu');

//     if (target) {
//         topMenu = target
//         observer.disconnect(); // 작업 끝났으면 바로 해제

//         topMenu.addEventListener('mousedown', (e) => {
//             isDown = true;
//             startX = e.pageX - topMenu.offsetTop;
//             scrollTop = topMenu.scrollTop;
//             console.log('hi');
//         });

//         topMenu.addEventListener('mouseleave', () => {
//             isDown = false;
//         });

//         topMenu.addEventListener('mouseup', () => {
//             isDown = false;
//         });

//         topMenu.addEventListener('mousemove', (e) => {
//             if (!isDown) return;
//             e.preventDefault(); // 텍스트 드래그 방지
        
//             const x = e.pageX - topMenu.offsetTop;
//             const walk = (x - startX) * 1.5; // 스크롤 속도 조절
//             topMenu.scrollTop = scrollTop - walk;
//         });
//     }
// });

// observer.observe(document.querySelector('#main-contentbox'), { childList: true });
