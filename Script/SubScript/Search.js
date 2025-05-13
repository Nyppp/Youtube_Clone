import * as common from "/Script/CommonPage/CommonModule.js";

// 글로벌 변수로 비디오 데이터 저장
let allVideos = [];
let filteredVideos = [];

// 검색 요소 초기화
document.addEventListener('DOMContentLoaded', function() {
    const topbarElement = document.getElementById('topbar');
    if (topbarElement) {
        const observer = new MutationObserver(function(mutations) {
            initSearchFunctionality();
        });
        
        observer.observe(topbarElement, { childList: true });
    }
    
    fetchAndStoreVideos();
});

// 검색 기능 초기화
function initSearchFunctionality() {
    const searchInput = document.getElementById('Search');
    const searchButton = document.getElementById('SearchBtn');
    const searchForm = document.querySelector('.SearchBox');
    
    if (!searchInput || !searchButton || !searchForm) {
        console.error('검색 요소를 찾을 수 없습니다. 나중에 다시 시도합니다.');
        return;
    }
    
    checkUrlForSearchQuery(searchInput);
    
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        updateUrlAndSearch(searchInput);
    });
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateUrlAndSearch(searchInput);
    });
}

// URL 업데이트 및 검색 실행
function updateUrlAndSearch(searchInput) {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('q', searchTerm);
        window.history.pushState({}, '', url);
    } else {
        const url = new URL(window.location.href);
        url.searchParams.delete('q');
        window.history.pushState({}, '', url);
    }
    
    performSearch(searchTerm);
}

// URL에서 검색어 존재 여부 확인 후 검색 수행
function checkUrlForSearchQuery(searchInput) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        searchInput.value = query;
        
        performSearch(query);
    }
}

// 비디오 데이터 로드
function fetchAndStoreVideos() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.techfree-oreumi-api.ai.kr/video/getVideoList`, true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            allVideos = response;
            filteredVideos = [...allVideos];
            
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');
            if (query) {
                performSearch(query);
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
    if (!searchTerm) {
        filteredVideos = [...allVideos];
        parseJsondata(filteredVideos);
        return;
    }
    
    searchTerm = searchTerm.toLowerCase();
    
    filteredVideos = allVideos.filter(video => {
        if (video.title && video.title.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        if (video.tags && Array.isArray(video.tags) && 
            video.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
            return true;
        }
        
        return false;
    });
    
    parseJsondata(filteredVideos);
}

// 검색 결과 데이터파일을 객체화
function parseJsondata(results) {
    let videoList = document.getElementById('Video-Container');
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

//검색 결과에 대해 화면에 렌더링
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