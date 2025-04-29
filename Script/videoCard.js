import * as common from "./commonModule.js";

// 전체 태그를 담는 변수
const videoTags = [];
let uniqueTag;

//비디오 리스트 가져오기
function getVideoList(callback){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoList`, true);

    xhr.onload = function(){
        if(xhr.status === 200){
            let response = JSON.parse(xhr.responseText);
            parseJsondata(response);

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

//채널 정보 가져오기
function getChannelInfo(channelId, callback){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channelId}`, true);

    xhr.onload = function(){
        if(xhr.status === 200){
            const response = JSON.parse(xhr.responseText);
            
            //페이지 호출 이후 추가 작업 필요할 때 콜백 사용
            if(callback) callback(response.channel_name, response.channel_profile);
            
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
    videoList.innerHTML = '';

    if(!results || results.length ===0){
        videoList.textContent = "No videos found.";
        return;
    }

    results.forEach(function(video){

        video.tags.forEach(function(tag){
            videoTags.push(tag);
        });
        // 비디오 박스 전체영역
        const videoItem = document.createElement('div');
        videoItem.classList.add('Video-Item');

        // 썸네일 영역
        const thumbnailBox = document.createElement('a');
        thumbnailBox.classList.add('Thumbnail');
        thumbnailBox.href =`?video_id=${video.id}`;

        const videoPreview = document.createElement('video');
        videoPreview.src = `https://storage.googleapis.com/youtube-clone-video/${video.id}.mp4`;
        videoPreview.preload = "none";
        videoPreview.style.display = "none";
        videoPreview.autoplay = true;
        videoPreview.muted = true;
        videoPreview.loop = true;

        videoPreview.style.width = "276px";
        videoPreview.style.height = "155px";

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
        videoProfile.href =`?channel_id=${video.channel_id}`;

        const profileImg = document.createElement('img');
        profileImg.classList.add('Video-Profile_image');

        const videoDesc = document.createElement('div');
        videoDesc.classList.add('Video-Description');

        const videoTitle = document.createElement('a');
        videoTitle.classList.add('Video-Title');
        videoTitle.href =`?video_id=${video.id}`;
        videoTitle.textContent = video.title;

        const videoChannel = document.createElement('a');
        videoChannel.classList.add('Video-Channel');
        videoChannel.href =`?channel_id=${video.channel_id}`;

        const uploadDate = document.createElement('a');
        uploadDate.classList.add('Time');
        uploadDate.textContent = common.setViewUnit(video.views) + " views . " + common.timeAgo(video.created_dt);

        //비디오 추가 정보 (게시자, 프로필 이미지) 받아오기 위해 api 요청
        getChannelInfo(video.channel_id, function(channelName, channelProfile){
            videoChannel.textContent = channelName;
            profileImg.src = channelProfile;
        });

        //비디오 설명 영역
        videoDesc.appendChild(videoTitle);
        videoDesc.appendChild(videoChannel);
        videoDesc.appendChild(uploadDate);

        //비디오 설명 + 채널 프로필 이미지 영역
        videoProfile.appendChild(profileImg);
        videoInfoBox.appendChild(videoProfile);
        videoInfoBox.appendChild(videoDesc);

        //썸네일 영역
        
        thumbnailImg.appendChild(videoTime);
        thumbnailBox.appendChild(thumbnailImg);
        thumbnailBox.appendChild(videoPreview);

        thumbnailBox.addEventListener('mouseenter', ()=>{
            thumbnailBox.firstChild.style.display = "none";
            thumbnailBox.lastChild.style.display = "block";
        });

        thumbnailBox.addEventListener('mouseleave', ()=>{
            thumbnailBox.firstChild.style.display = "block";
            thumbnailBox.lastChild.style.display = "none";
        });

        // 전체 구조
        videoItem.appendChild(thumbnailBox);
        videoItem.appendChild(videoInfoBox);
        
        //그리드에 비디오 정보 추가
        videoList.appendChild(videoItem);
    });

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

    allButton.addEventListener("click", function(e){
        e.preventDefault();
        const searchInput = document.getElementById('Search');
        searchInput.value = "";
        document.getElementById('SearchBtn').click();
    });

    topMenu.appendChild(allButton);

    // 이후 태그별로 버튼 추가
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