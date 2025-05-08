// 비디오 리스트 정보를 담는 글로벌 변수
window.videoListRes = null;

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
    if(callback) callback();
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
    return fetch('video_page.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-contentbox').innerHTML = html;
        import('./video_page.js');
        import('./comment.js');
    });
}

// 채널 페이지 호출
function setChannelPage(){
    fetch('Channel.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-contentbox').innerHTML = html;
        import('./channel.js');
    });
}

//페이지가 로드될 때, 주소값의 정보를 가져와서 페이지 렌더링
window.onload = function(){
    if(window.location.search.indexOf('channel_id=') > 0){
        initDisplay(setChannelPage);
    } else if (window.location.search.indexOf('video_id=') > 0){
        initDisplay(setVideoPlayerPage);
    } else {
        initDisplay(setVideoCardPage);
    }

    //햄버거버튼 설정
    const topbarElement = document.getElementById('topbar');
    if (topbarElement) {
        const observer = new MutationObserver(function(mutations) {
            setupSidebarToggle();
        });
        observer.observe(topbarElement, { childList: true });
    }
}

// 사이드바 토글 기능 추가
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar'); // 실제 사이드바 HTML 요소
    const mainSidebar = document.getElementById('main-sidebar'); // 사이드바 컨테이너
    const mainContent = document.getElementById('main-contentbox'); // 메인 콘텐츠 영역
    
    // 두 요소 모두에 클래스 토글 적용
    sidebar.classList.toggle('collapsed');
    mainSidebar.classList.toggle('collapsed'); // 이 부분이 중요!
    
    // 메인 콘텐츠에도 확장 클래스 적용
    mainContent.classList.toggle('expanded');
    
    // 로컬 스토리지에 상태 저장
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// 햄버거 버튼 클릭 이벤트 추가 함수
function setupSidebarToggle() {
    const hamburgerButton = document.getElementById('Hamburger');
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSidebar();
        });
    }
    
    // 페이지 로드 시 저장된 사이드바 상태 적용
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-contentbox');
        if (sidebar) {
            sidebar.classList.add('collapsed');
        }
        if (mainContent) {
            mainContent.classList.add('expanded');
        }
    }
}