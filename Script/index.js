function initDisplay(){
    // 상단 바 초기화 함수
    fetch('topbar.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('topbar').innerHTML = html;
    });

    // 사이드 바 초기화 함수
    fetch('sidebar.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-sidebar').innerHTML = html;
    });

    // 메인 페이지 영역 초기화 함수 (최초 페이지 > 비디오 카드 리스트)
    fetch('video_card.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-contentbox').innerHTML = html;
    });
}

//최초 실행 > 해당 페이지에 노출되는 html 태그 설정
initDisplay();

