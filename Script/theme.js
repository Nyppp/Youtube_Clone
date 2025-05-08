// let toggleBtn;
// const body = document.body;

// //토글 버튼이 유효할 때 까지 반복
// const interval = setInterval(()=>{
//   if(toggleBtn){
//     // 버튼 클릭 시 테마 적용
//     toggleBtn.addEventListener("click", () => {
//       body.classList.toggle("light-mode");

//       // 현재 상태 저장
//       if (body.classList.contains("light-mode")) {
//         localStorage.setItem("theme", "light");
//       } else {
//         localStorage.setItem("theme", "dark");
//       }
//     });
//       clearInterval(interval);
//   }
//   toggleBtn = document.getElementById('toggle-theme');
//   document.documentElement.classList.add("light-mode");
  
// }, 100);


// // 페이지 로드 시 localStorage에서 테마 상태 불러오기
// if (localStorage.getItem("theme") === "light") {
//     body.classList.add("light-mode");

//     console.log(localStorage.getItem("theme"));
// }
let toggleBtn;
const body = document.body;
const html = document.documentElement;

// 토글 버튼이 유효할 때까지 반복
const interval = setInterval(() => {
  toggleBtn = document.getElementById('toggle-theme');
  
  if (toggleBtn) {
    // 버튼 클릭 시 테마 적용
    toggleBtn.addEventListener("click", () => {
      const isLight = body.classList.toggle("light-mode");
      html.classList.toggle("light-mode", isLight); // html에도 toggle

      // 현재 상태 저장
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });

    clearInterval(interval); // 더 이상 반복 필요 없음
  }
}, 100);

// 페이지 로드 시 localStorage에서 테마 상태 불러오기
if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
  html.classList.add("light-mode");

  console.log(localStorage.getItem("theme")); // 확인용 출력
}