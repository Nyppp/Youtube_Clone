//버튼 변수 및 dom 객체 초기화
let toggleBtn;
const body = document.body;
const html = document.documentElement;

// 토글 버튼이 유효할 때까지 반복 (다크 / 라이트모드 버튼 초기화)
const interval = setInterval(() => {
  toggleBtn = document.getElementById('toggle-theme');
  
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isLight = body.classList.toggle("light-mode");
      html.classList.toggle("light-mode", isLight);

      localStorage.setItem("theme", isLight ? "light" : "dark");
    });

    clearInterval(interval);
  }
}, 100);


// 페이지 로드 시 localStorage에서 테마 상태 불러오기
if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
  html.classList.add("light-mode");

  console.log(localStorage.getItem("theme"));
}