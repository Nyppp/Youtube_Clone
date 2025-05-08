const toggleBtn = document.getElementById('toggle-theme');
const body = document.body;

// 페이지 로드 시 localStorage에서 테마 상태 불러오기
if (localStorage.getItem("theme") === "light") {
    body.classList.add("light-mode");
}

// 버튼 클릭 시 테마 적용
toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");

    // 현재 상태 저장
  if (body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});