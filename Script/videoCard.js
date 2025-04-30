import * as common from "./commonModule.js";

// 전체 태그를 담는 변수
const videoTags = [];
let uniqueTag;

//비디오 리스트 가져오기
function getVideoList(callback){
    if(window.videoListRes != null){
        parseJsondata(window.videoListRes);
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoList`, true);

    xhr.onload = function(){
        if(xhr.status === 200){
            window.videoListRes = JSON.parse(xhr.responseText);
            parseJsondata(window.videoListRes);

            //페이지 호출 이후 추가 작업 필요할 때 콜백 사용
            if(callback) callback();

        } else{
            console.error('Error:', xhr.status);
        }
    };

    xhr.onerror = function(){
        console.error('Network Error');
    };

    xhr.send();
}

//영상 제목, 영상 아이디, 날짜, 게시자, 썸네일 등등을 가져와서 처리
function parseJsondata(results){
    const videoList = document.getElementById('Video-Container');
    // if(!videoList){
    //     return;
    // }

    if(!results || results.length ===0){
        videoList.textContent = "No videos found.";
        return;
    }

    common.drawList(videoList, results);

    results.forEach(function(video){
        video.tags.forEach(function(tag){
            videoTags.push(tag);
        });
    })

    //태그들 가져오기
    uniqueTag = [... new Set(videoTags)];
    initTagMenu(uniqueTag);
}

function changeImgToVideo(img){
    console.log('프리뷰 재생');
}

// 비디오 카드 페이지 상단 > 태그 버튼 초기화 함수
function initTagMenu(tags){
    const topMenu = document.getElementsByClassName('Top-Menu')[0];
    
    // 전체 선택 버튼 추가
    const allButton = document.createElement('a');
    allButton.classList.add('Top-Menu-All');
    allButton.textContent = 'All';
    allButton.href = "";

    // 좋아요 기준 버튼 추가
    const likesButton = document.createElement('a');
    likesButton.classList.add('Top-Menu-All');
    likesButton.textContent = 'Likes';
    likesButton.href = "";

    // 최신 순 선택 버튼 추가
    const dateButton = document.createElement('a');
    dateButton.classList.add('Top-Menu-All');
    dateButton.textContent = 'Date';
    dateButton.href = "";

    // 조회수 순 선택 버튼 추가
    const viewButton = document.createElement('a');
    viewButton.classList.add('Top-Menu-All');
    viewButton.textContent = 'Views';
    viewButton.href = "";

    //태그에 대한 기능 추가 (전체 보기 -> "" 상태로 검색되게끔)
    allButton.addEventListener("click", function(e){
        e.preventDefault();
        const searchInput = document.getElementById('Search');
        searchInput.value = "";
        document.getElementById('SearchBtn').click();
    });

    //태그에 대한 기능 추가 (좋아요 순으로 노출)
    likesButton.addEventListener("click", function(e){
        e.preventDefault();
        const searchInput = document.getElementById('Search');
        searchInput.value = "";
        document.getElementById('SearchBtn').click();

        const videoContainer = document.getElementById('Video-Container');

        const allVideos = Array.from(document.getElementsByClassName("Video-Item"));

        allVideos.sort((a,b) => {
            const aLikes = parseInt(a.getElementsByClassName('likesCount')[0].textContent);
            const bLikes = parseInt(b.getElementsByClassName('likesCount')[0].textContent);

            return bLikes - aLikes;
        });
        allVideos.forEach(videoItem=>{
            videoContainer.appendChild(videoItem);
        });
    });

    //태그에 대한 기능 추가 (날짜 순으로 노출)
    dateButton.addEventListener("click", function(e){
        e.preventDefault();
        const searchInput = document.getElementById('Search');
        searchInput.value = "";
        document.getElementById('SearchBtn').click();

        const videoContainer = document.getElementById('Video-Container');

        const allVideos = Array.from(document.getElementsByClassName("Video-Item"));
        const now = new Date();
        

        allVideos.sort((a,b) => {
            const atime = new Date(a.getElementsByClassName('timeData')[0].textContent);
            const btime = new Date(b.getElementsByClassName('timeData')[0].textContent);

            return btime - atime;
        });
        allVideos.forEach(videoItem=>{
            videoContainer.appendChild(videoItem);
        });
    });

    //태그에 대한 기능 추가 (조회수 순으로 노출)
    viewButton.addEventListener("click", function(e){
        e.preventDefault();
        const searchInput = document.getElementById('Search');
        searchInput.value = "";
        document.getElementById('SearchBtn').click();

        const videoContainer = document.getElementById('Video-Container');

        const allVideos = Array.from(document.getElementsByClassName("Video-Item"));

        allVideos.sort((a,b) => {
            const aLikes = parseInt(a.getElementsByClassName('viewsCount')[0].textContent);
            const bLikes = parseInt(b.getElementsByClassName('viewsCount')[0].textContent);

            return bLikes - aLikes;
        });
        allVideos.forEach(videoItem=>{
            videoContainer.appendChild(videoItem);
        });
    });

    //기본 정렬버튼 추가 (전체 ~ 조회수 순)
    topMenu.appendChild(allButton);
    topMenu.appendChild(likesButton);
    topMenu.appendChild(dateButton);
    topMenu.appendChild(viewButton);

    // 이후 각 영상 태그별로 버튼 추가
    tags.forEach(tag => {
        const tagButton = document.createElement('a');
        tagButton.classList.add('Top-Menu-Item');
        tagButton.textContent = tag;
        tagButton.href="";

        tagButton.addEventListener("click", function(e){
            e.preventDefault();
            const searchInput = document.getElementById('Search');
            searchInput.value = tag;

            document.getElementById('SearchBtn').click();
        });

        topMenu.appendChild(tagButton);
    });
}

getVideoList();