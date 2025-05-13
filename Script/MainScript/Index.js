
import('./VideoCard.js');
import('./VideoPage.js');
import('./Channel.js');

// 비디오 리스트 정보를 담는 글로벌 변수
window.videoListRes = null;


function initDisplay(callback){
    setHeaderPage();
    setSidePage();
}

function setSidePage(){
    fetch('/Page/SubPage/Sidebar.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-sidebar').innerHTML = html;
        
        applySidebarStateAfterLoad();
    });
}

function setHeaderPage(){
    fetch('/Page/SubPage/Topbar.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('topbar').innerHTML = html;
    });
}

// 비디오 카드 리스트 페이지 호출
function setVideoCardPage(){
    fetch('/Page/MainPage/VideoCard.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-contentbox').innerHTML = html;
        
    });
}

// 비디오 플레이어 페이지 호출
function setVideoPlayerPage(){
    return fetch('/Page/MainPage/VideoPage.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-contentbox').innerHTML = html;
        
    });
}

// 채널 페이지 호출
function setChannelPage(){
    fetch('/Page/MainPage/Channel.html')
    .then(res => res.text())
    .then(html=>{
        document.getElementById('main-contentbox').innerHTML = html;
        
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
        initDisplay();
        setChannelPage();
    } else if (window.location.search.indexOf('video_id=') > 0){
        initDisplay();
        setVideoPlayerPage();
    } else {
        initDisplay();
        setVideoCardPage();
    }
    initSidebarStat();
}

//사이드바 상태 초기화 함수
function initSidebarStat(){
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        document.body.classList.add('sidebar-collapsed');
    }

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
    
    sidebar.classList.toggle('collapsed');
    mainSidebar.classList.toggle('collapsed'); 
    mainContent.classList.toggle('expanded');
    
    const isCollapsed = sidebar.classList.contains('collapsed');
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// 햄버거 버튼 클릭 이벤트 추가 함수
function setupSidebarToggle() {
    const hamburgerButton = document.getElementById('Hamburger');
    if (hamburgerButton) {
        hamburgerButton.removeEventListener('click', handleHamburgerClick);
        hamburgerButton.addEventListener('click', handleHamburgerClick);
    }
}

// 햄버거 버튼 클릭 핸들러 (함수 분리)
function handleHamburgerClick(e) {
    e.preventDefault();
    toggleSidebar();
}