// 글로벌 변수로 비디오 데이터 저장
let allVideos = [];
let filteredVideos = [];

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM이 로드되었습니다.');
    
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
    
    console.log('검색 입력란:', searchInput);
    console.log('검색 버튼:', searchButton);
    console.log('검색 폼:', searchForm);
    
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
        const url = new URL(window.location.href);
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

function parseJsondata(results) {
    let videoList = document.getElementById('Video-Container');
    if (!videoList) {
        setVideoCardPage();
        const interval = setInterval(()=>{
            if(videoList){
                clearInterval(interval);
                drawList(videoList, results);
            }
            videoList = document.getElementById('Video-Container');
        }, 100);
    }
    else{
        drawList(videoList, results);
    }
}

function drawList(videoList, results){
    // 기존 비디오 목록 비우기
    videoList.innerHTML = '';
    
    if (!results || results.length === 0) {
        videoList.textContent = "No videos found.";
        return;
    }
    
    results.forEach(function(video) {
        // 비디오 박스 전체영역
        const videoItem = document.createElement('div');
        videoItem.classList.add('Video-Item');
        
        // 썸네일 영역
        const thumbnailBox = document.createElement('a');
        thumbnailBox.classList.add('Thumbnail');
        thumbnailBox.href = `?video_id=${video.id}`; // 링크 추가
        
        const thumbnailImg = document.createElement('img');
        thumbnailImg.classList.add('Thumbnail-Image');
        thumbnailImg.src = video.thumbnail;
        
        const videoTime = document.createElement('p');
        videoTime.classList.add('VideoTime');
        
        // 비디오 정보 영역
        const videoInfoBox = document.createElement('div');
        videoInfoBox.classList.add('Video-Info');
        
        const videoProfile = document.createElement('a');
        videoProfile.classList.add('Video-Profile');
        videoProfile.href = `?channel_id=${video.channel_id}`; // 링크 추가
        
        const profileImg = document.createElement('img');
        profileImg.classList.add('Video-Profile_image');
        
        const videoDesc = document.createElement('div');
        videoDesc.classList.add('Video-Description');
        
        const videoTitle = document.createElement('a');
        videoTitle.classList.add('Video-Title');
        videoTitle.href = `?video_id=${video.id}`; // 링크 추가
        videoTitle.textContent = video.title;
        
        const videoChannel = document.createElement('a');
        videoChannel.classList.add('Video-Channel');
        videoChannel.href = `?channel_id=${video.channel_id}`; // 링크 추가
        
        const uploadDate = document.createElement('a');
        uploadDate.classList.add('Time');
        uploadDate.textContent = setViewUnit(video.views) + " views . " + timeAgo(video.created_dt);
        
        getChannelInfo(video.channel_id, function(channelName, channelProfile) {
            videoChannel.textContent = channelName;
            profileImg.src = channelProfile;
        });
        
        // 비디오 설명 영역
        videoDesc.appendChild(videoTitle);
        videoDesc.appendChild(videoChannel);
        videoDesc.appendChild(uploadDate);
        
        // 비디오 설명 + 채널 프로필 이미지 영역
        videoProfile.appendChild(profileImg);
        
        videoInfoBox.appendChild(videoProfile);
        videoInfoBox.appendChild(videoDesc);
        
        // 썸네일 영역
        thumbnailBox.appendChild(thumbnailImg);
        thumbnailBox.appendChild(videoTime);
        
        // 전체 구조
        videoItem.appendChild(thumbnailBox);
        videoItem.appendChild(videoInfoBox);
        
        videoList.appendChild(videoItem);
    });
}

// 채널 정보 가져오기 함수
function getChannelInfo(channelId, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channelId}`, true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            callback(response.channel_name, response.channel_profile);
        } else {
            console.error('Error:', xhr.status);
        }
    };
    
    xhr.onerror = function() {
        console.error('Network Error');
    };
    
    xhr.send();
}

// 조회수 표기 함수
function setViewUnit(viewCount) {
    if (viewCount > 1000) {
        viewCount = Math.floor(viewCount / 1000);
        return viewCount + "K";
    }
    return viewCount;
}

// 상대 시간 계산 함수
function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    const rtf = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });
    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, "second");
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return rtf.format(-diffInMinutes, "minute");
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return rtf.format(-diffInHours, "hour");
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return rtf.format(-diffInDays, "day");
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 5) {
        return rtf.format(-diffInWeeks, "week");
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return rtf.format(-diffInMonths, "month");
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return rtf.format(-diffInYears, "year");
}