import * as common from "./commonModule.js";
//비디오 리스트 가져오기
function getChannelInfo(){
    //url 파라미터 가져오고, id값만 추출( = 우측에 오는 값만 사용 > channel_id[1])
    const channel_id = window.location.search.split('=');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${channel_id[1]}`, true);

    xhr.onload = function(){
        if(xhr.status === 200){
            let response = JSON.parse(xhr.responseText);

            displayChannelInfo(response);
            //다음 api 호출 동작 중, 채널 이름 가져오는 부분 위해 첫 api 처리 완료된 시점에 수행
            getChannelVideoList();
        } else{
            console.error('Error:', xhr.status);
        }
    };

    xhr.onerror = function(){
        console.error('Network Error');
    };

    xhr.send();
}

function getChannelVideoList(){
    //url 파라미터 가져오고, id값만 추출( = 우측에 오는 값만 사용 > channel_id[1])
    const channel_id = window.location.search.split('=');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.techfree-oreumi-api.ai.kr/video/getChannelVideoList?channel_id=${channel_id[1]}`, true);

    xhr.onload = function(){
        if(xhr.status === 200){
                let response = JSON.parse(xhr.responseText);
                displayChannelVideoList(response);
        } else{
            console.error('Error:', xhr.status);
        }
    };

    xhr.onerror = function(){
        console.error('Network Error');
    };

    xhr.send();
}

//채널 정보 출력 함수
function displayChannelInfo(info){
    const channel_id = window.location.search.split('=');
    const profileImg = document.getElementsByClassName('profile-image')[0];
    profileImg.src = info.channel_profile;

    const bannerImg = document.getElementsByClassName('banner-image')[0];
    bannerImg.src = info.channel_banner;

    const channelName = document.getElementsByClassName('channel-name')[0];
    channelName.textContent = info.channel_name;

    const subscribers = document.getElementsByClassName('subscriber-count')[0];
    subscribers.textContent = common.setViewUnit(info.subscribers) + ' subscribers';
}

//비디오 리스트 출력 함수
function displayChannelVideoList(results){
    const videoGrid = document.getElementsByClassName('video-grid')[0];
    console.log(videoGrid);
    videoGrid.innerHTML = "";

    let maxView = -1;
    let mainVideoInfo;

    results.forEach(function(video){
        if(maxView < video.views){
            maxView = video.views;
            mainVideoInfo = video;
        }
    });

    if(!results || results.length ===0){
        videoList.textContent = "No videos found.";
        return;
    }

    common.drawList(videoGrid, results);
    displayMainVideo(mainVideoInfo);
}

//메인 비디오 정보 세팅 함수
function displayMainVideo(video){
    const mainThumbnailBox = document.getElementsByClassName('main-video-player-container')[0];

    const mainVideo = document.getElementsByClassName('main-video-player')[0];
    mainVideo.src = `https://storage.googleapis.com/youtube-clone-video/${video.id}.mp4`;

    const mainVideoTitle = document.getElementsByClassName('main-video-title')[0];
    mainVideoTitle.textContent = video.title;
    mainVideoTitle.href = `?video_id=${video.id}`;

    const mainVideoMeta = document.getElementsByClassName('main-video-meta')[0];
    mainVideoMeta.textContent = video.views + " views . " + common.timeAgo(video.created_dt);

    const mainVideoDesc = document.getElementsByClassName('main-video-description')[0];
    mainVideoDesc.textContent = video.description;
}

getChannelInfo();