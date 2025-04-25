function initDisplay(callback){
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

    //콜백으로 사이드, 탑 영역 제외 어떤 부분 불러올지 호출
    callback();
}

// 비디오 카드 리스트 페이지 호출
function setVideoCardPage(){
    fetch('video_card.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-contentbox').innerHTML = html;
        import('./videoCard.js');
    });
}

// 비디오 플레이어 페이지 호출
function setVideoPlayerPage(){
    fetch('video_page.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-contentbox').innerHTML = html;
        console.log("load video player page.");
    });
}

// 채널 페이지 호출
function setChannelPage(){
    fetch('Channel.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-contentbox').innerHTML = html;
    });
}

initDisplay(setVideoCardPage);

//최초 실행 > 해당 페이지에 노출되는 html 태그 설정
console.log(window.location.search);

window.onload = function(){
    if(window.location.search.indexOf('channel') > 0){
        //setChannelPage();
        setChannelPage();
    } else if (window.location.search.indexOf('video') > 0){
        setVideoPlayerPage();
    } else {
        setVideoCardPage();
    }
}
