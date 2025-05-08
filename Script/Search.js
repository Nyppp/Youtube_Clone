import * as common from "./commonModule.js";
// 글로벌 변수로 비디오 데이터 저장
let allVideos = [];
let filteredVideos = [];

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 검색 요소 초기화
    const topbarElement = document.getElementById('topbar');
    if (topbarElement) {
        const observer = new MutationObserver(function(mutations) {
            // topbar 내용이 변경되면 검색 요소 초기화
            initSearchFunctionality();
        });
        
        // topbar의 자식 요소 변화 감지
        observer.observe(topbarElement, { childList: true });
    }
    
    // 비디오 데이터를 먼저 로드
    fetchAndStoreVideos();
});

// 검색 기능 초기화
function initSearchFunctionality() {
    const searchInput = document.getElementById('Search');
    const searchButton = document.getElementById('SearchBtn');
    const searchForm = document.querySelector('.SearchBox');
    
    // 요소가 존재하지 않으면 함수 종료
    if (!searchInput || !searchButton || !searchForm) {
        console.error('검색 요소를 찾을 수 없습니다. 나중에 다시 시도합니다.');
        return;
    }
    
    // URL에서 검색어 가져와서 검색 수행
    checkUrlForSearchQuery(searchInput);
    
    // 검색 버튼 클릭 이벤트
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        updateUrlAndSearch(searchInput);
    });
    
    // 폼 제출 이벤트
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateUrlAndSearch(searchInput);
    });
}

// URL 업데이트 및 검색 실행
function updateUrlAndSearch(searchInput) {
    const searchTerm = searchInput.value.trim();
    console.log(searchInput);
    
    // 검색어가 있을 때만 URL 업데이트
    if (searchTerm) {
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('q', searchTerm);
        window.history.pushState({}, '', url);
    } else {
        // 검색어가 없으면 쿼리 파라미터 제거
        const url = new URL(window.location.href);
        url.searchParams.delete('q');
        window.history.pushState({}, '', url);
    }
    
    // 검색 실행
    performSearch(searchTerm);
}

// URL에서 검색어 확인
function checkUrlForSearchQuery(searchInput) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        // 검색창에 검색어 설정
        searchInput.value = query;
        
        // 검색 수행
        performSearch(query);
    }
}

// 비디오 데이터 로드
function fetchAndStoreVideos() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoList`, true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            // 원본 데이터 저장
            allVideos = response;
            filteredVideos = [...allVideos];
            
            // URL에서 검색어 확인하고 결과 표시
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');
            if (query) {
                performSearch(query);
            } else {
                // 검색어가 없으면 모든 비디오 표시
                //parseJsondata(allVideos);
            }
        } else {
            console.error('Error:', xhr.status);
        }
    };
    
    xhr.onerror = function() {
        console.error('Network Error');
    };
    
    xhr.send();
}

// 검색 실행 함수
function performSearch(searchTerm) {
    
    // 검색어가 없으면 모든 비디오 표시
    if (!searchTerm) {
        filteredVideos = [...allVideos];
        parseJsondata(filteredVideos);
        return;
    }
    
    // 검색어를 소문자로 변환
    searchTerm = searchTerm.toLowerCase();
    
    // 비디오 필터링
    filteredVideos = allVideos.filter(video => {
        // 제목에서 검색
        if (video.title && video.title.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // 태그에서 검색
        if (video.tags && Array.isArray(video.tags) && 
            video.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
            return true;
        }
        
        return false;
    });
    
    // 결과 표시
    console.log(`검색 결과: ${filteredVideos.length}개의 비디오를 찾았습니다.`);
    
    parseJsondata(filteredVideos);
}

// 검색 결과 데이터파일을 객체화
function parseJsondata(results) {
    let videoList = document.getElementById('Video-Container');


    // 비디오 페이지가 아닌 곳에서 검색 > 비디오 페이지를 우선 불러와야 하기에, 페이지 호출
    // 그 이후 videoList 객체가 defined 상태가 될 때까지 렌더링 하지 않고 대기
    if (!videoList) {
        setVideoCardPage();
        const interval = setInterval(()=>{
            if(videoList){
                clearInterval(interval);
                common.drawList(videoList, results);
            }
            videoList = document.getElementById('Video-Container');
            drawSearchList(videoList);
        }, 100);
    }
    else{
        common.drawList(videoList, results);
        drawSearchList(videoList);
    }
}

function drawSearchList(videoList){
    videoList.style.gridTemplateColumns = "repeat(1, 1fr)";

    const allVideos = Array.from(document.getElementsByClassName("Video-Item"));

    allVideos.forEach(video=>{
        video.style.flexDirection = 'row';
        video.style.justifySelf = 'left';
        video.style.width = '100%';

        const profileElement = video.getElementsByClassName('Video-Profile')[0];
        const discElement = video.getElementsByClassName('Video-Description')[0];

        profileElement.firstChild.style.width="20px";
        profileElement.firstChild.style.height="20px";

        const discBox = document.createElement('div');

        discBox.appendChild(profileElement);
        discBox.appendChild(discElement.getElementsByClassName('Video-Channel')[0]);

        discBox.style.display = 'flex';
        discBox.style.gap = '5px';
        discBox.style.alignItems = 'center';

        discElement.insertBefore(discBox, discElement.lastChild);
    })

    document.getElementsByClassName('Top-Menu')[0].style.display = 'none';

}