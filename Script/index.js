// 비디오 리스트 정보를 담는 글로벌 변수
window.videoListRes = null;

// 페이지 로드 직후 바로 적용될 사이드바 상태 초기화 스크립트
(function() {
    // 페이지 시작 시 한번만 실행됨
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        document.body.classList.add('sidebar-collapsed');
    }
})();

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
        
        // 사이드바 로드 직후 상태 확인 및 적용
        applySidebarStateAfterLoad();
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

// 사이드바 상태를 적용하는 함수 (사이드바 로드 후 호출)
function applySidebarStateAfterLoad() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.add('collapsed');
        }
        
        const mainSidebar = document.getElementById('main-sidebar');
        if (mainSidebar) {
            mainSidebar.classList.add('collapsed');
        }
        
        const mainContent = document.getElementById('main-contentbox');
        if (mainContent) {
            mainContent.classList.add('expanded');
        }
    }
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
    const sidebar = document.getElementById('sidebar'); 
    const mainSidebar = document.getElementById('main-sidebar'); 
    const mainContent = document.getElementById('main-contentbox'); 
    
    // 두 요소 모두에 클래스 토글 적용
    sidebar.classList.toggle('collapsed');
    mainSidebar.classList.toggle('collapsed'); 
    // 메인 콘텐츠에도 확장 클래스 적용
    mainContent.classList.toggle('expanded');
    
    // body에 사이드바 상태 클래스 추가 
    const isCollapsed = sidebar.classList.contains('collapsed');
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    
    // 로컬 스토리지에 상태 저장
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// 햄버거 버튼 클릭 이벤트 추가 함수
function setupSidebarToggle() {
    const hamburgerButton = document.getElementById('Hamburger');
    if (hamburgerButton) {
        hamburgerButton.removeEventListener('click', handleHamburgerClick); // 기존 이벤트 리스너 제거
        hamburgerButton.addEventListener('click', handleHamburgerClick);
    }
}

// 햄버거 버튼 클릭 핸들러 (함수 분리)
function handleHamburgerClick(e) {
    e.preventDefault();
    toggleSidebar();
}