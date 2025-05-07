import * as common from "./commonModule.js";


const videoTags = []; // 전체 태그를 담는 변수
let uniqueTag; //전체 태그 > 중복 제거 값
let simTags = []; //유사도 계산용
let sameTagVideos = []; //동일 태그 비디오들 id 저장

//현재 보고 있는 비디오 정보 가져오기
function getVideoData(){
  const videoId = window.location.search.split('=');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId[1]}`, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      parseJsondata(response);

      const channelId = response.channel_id; // 채널 ID 가져오기
      fetchChannelInfo(channelId); // 메인 채널 정보 가져오기
    } else {
      console.error('Error', xhr.status);
    }
  };
  
  xhr.onerror = function () {
    console.error('Network Error');
  };

  xhr.send();
}

//비디오 정보를 화면에 출력
function parseJsondata(data) {
  document.getElementById('video-title').textContent = data.title;

  const videoSource = document.getElementById('video-source');
  videoSource.src = `https://storage.googleapis.com/youtube-clone-video/${data.id}.mp4`;

  const videoPlayer = document.getElementById('video-player');
  videoPlayer.load();

  document.getElementById('views').textContent = `${data.views.toLocaleString()} views.`;

  const date = new Date(data.created_dt);
  const formattedDate = `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
  document.getElementById('date').textContent = formattedDate;

  document.getElementById('likes').textContent = data.likes;
  document.getElementById('hates').textContent = data.dislikes;

  document.getElementById('descText').textContent = data.tags.map(tag => `#${tag}`).join(' ');
}

// 메인 비디오용 채널 정보 가져오기
function fetchChannelInfo(channelId) {
  const xhrChannel = new XMLHttpRequest();
  xhrChannel.open('GET', `http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channelId}`, true);

  xhrChannel.onload = function () {
    if (xhrChannel.status === 200) {
      const channelResponse = JSON.parse(xhrChannel.responseText);
      parseJsonchanneldata(channelResponse);
    } else {
      console.error('Error', xhrChannel.status);
    }
  };

  xhrChannel.onerror = function () {
    console.error('Network Error');
  };

  xhrChannel.send();
}

//채널 데이터 연동
function parseJsonchanneldata(channelData) {
  document.getElementById('channelName').textContent = channelData.channel_name;

  const channelProfileImg = document.getElementById('channelProfile');
  channelProfileImg.src = channelData.channel_profile;

  document.getElementById('subscribtionText').textContent = `${channelData.subscribers.toLocaleString()} subscribers`;
  
  // 구독버튼 설정
  const subscribeButton = document.getElementById('subscribe-button');
  if (subscribeButton) {
    // 필수 data 속성 설정
    subscribeButton.dataset.channelId = channelData.id;
    subscribeButton.dataset.channelName = channelData.channel_name;
    subscribeButton.dataset.channelProfile = channelData.channel_profile;
    
    // 구독 상태에 따라 버튼 텍스트와 스타일 설정
    if (isChannelSubscribed(channelData.id)) {
      subscribeButton.textContent = 'SUBSCRIBED';
      subscribeButton.classList.add('subscribed');
    } else {
      subscribeButton.textContent = 'SUBSCRIBES';
      subscribeButton.classList.remove('subscribed');
    }
    
    // 클릭 이벤트 설정
    subscribeButton.removeEventListener('click', handleSubscribeButtonClick);
    subscribeButton.addEventListener('click', handleSubscribeButtonClick);
  }
}

// 사이드 비디오 리스트 가져오기
async function getVideoList() {
  const videoId = window.location.search.split('=');

  if(window.videoListRes != null){
    parseJsondata(window.videoListRes);
    simTags = await common.getSimilarity(videoId[1], window.videoListRes);
    return;
  }

  const xhrVideoList = new XMLHttpRequest();
  xhrVideoList.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoList`, true);

  xhrVideoList.onload = async function () {
    if (xhrVideoList.status === 200) {
      window.videoListRes = JSON.parse(xhrVideoList.responseText);
      parseJsonVideoListdata(window.videoListRes);
      //simTags = await common.getSimilarity(videoId[1], window.videoListRes);
    } else {
      console.error('Error:', xhrVideoList.status);
    }
  };

  xhrVideoList.onerror = function () {
    console.error('Network Error');
  };

  xhrVideoList.send();
}

// 사이드 비디오 리스트 출력
function parseJsonVideoListdata(videoListData) {
  const videoList = document.getElementById('video-list');
  videoList.innerHTML = '';

  if (!videoListData || videoListData.length === 0) {
    videoList.textContent = "No videos found.";
    return;
  }

  common.drawList(videoList, videoListData);

  videoListData.forEach(function(video){
    video.tags.forEach(function(tag){
        videoTags.push(tag);
    });
  })

  //태그들 가져오기
  uniqueTag = [... new Set(videoTags)];
  initTagMenu(uniqueTag);

  setSameTagVideo();
}

//현재 보고 있는 비디오와 태그가 같은 비디오들 리스트 저장
function setSameTagVideo(){
  const allVideos = Array.from(document.getElementsByClassName("Video-Item"));
  const currentVideoId = window.location.search.split('=');

  let currentTags = [];
  let videos = [];

  //모든 영상 리스트를 보이지 않음 설정 후, 현재 보고있는 영상 태그 저장
  allVideos.forEach(videoItem=>{
    if(videoItem.getElementsByClassName('videoId')[0].textContent == currentVideoId[1]){
      currentTags = videoItem.getElementsByClassName('videoTag')[0].textContent.split(',');
    }
  });
  
  //전체 영상 중, 현재 보고있는 영상 태그를 가지고 있는 비디오는 모두 추천 리스트로 등록
  allVideos.forEach(videoItem=>{
    const videoTags = videoItem.getElementsByClassName('videoTag')[0].textContent;

    

    currentTags.forEach(tag=>{
      if (videoTags.indexOf(tag)>=0){
        videos.push(videoItem.getElementsByClassName('videoId')[0].textContent);
      }
    });
  });

  sameTagVideos = [... new Set(videos)];
}

// 비디오 카드 페이지 상단 > 태그 버튼 초기화 함수
function initTagMenu(tags){
  const topMenu = document.getElementsByClassName('recommend-topMenu')[0];
  
  // 전체 선택 버튼 추가
  const allButton = document.createElement('a');
  allButton.classList.add('Top-Menu-All');
  allButton.textContent = 'All';
  allButton.href = "";

  // 조회수 순 선택 버튼 추가
  const recommendButton = document.createElement('a');
  recommendButton.classList.add('Top-Menu-All');
  recommendButton.textContent = 'Recommend';
  recommendButton.href = "";

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

  //태그에 대한 기능 추가 (전체 보기 > id 순서로 정렬)
  allButton.addEventListener("click", function(e){
      e.preventDefault();
      const allVideos = Array.from(document.getElementsByClassName("Video-Item"));
      const videoContainer = document.getElementById('video-list');

      allVideos.forEach(videoItem=>{
        videoItem.style.display = 'flex';
      });

      allVideos.sort((a,b) => {
        const aId = parseInt(a.getElementsByClassName('videoId')[0].textContent);
        const bId = parseInt(b.getElementsByClassName('videoId')[0].textContent);

        return aId - bId;
    });
      allVideos.forEach(videoItem=>{
        videoContainer.appendChild(videoItem);
    });

  });

  //추천 탭에 대한 이벤트 추가
  recommendButton.addEventListener("click", async function(e){
    e.preventDefault();
    const currentVideoId = window.location.search.split('=');

    console.log(sameTagVideos);

    const allVideos = Array.from(document.getElementsByClassName("Video-Item"));

    allVideos.forEach(video=>{
      video.style.display = 'none';

      //자신 제외
      if(video.getElementsByClassName('videoId')[0].textContent == currentVideoId[1]){
        return;
      }

      if(sameTagVideos.indexOf(video.getElementsByClassName('videoId')[0].textContent) >= 0){
        video.style.display = 'flex';
      }
    })

    // if(simTags){
    //   allVideos.forEach(video=>{
    //     const videoTag = video.getElementsByClassName('videoTag')[0];
        
    //     let isSim = false;
    //     simTags.forEach(tag=>{
    //       if(videoTag.textContent.indexOf(tag) > 0){
    //         isSim = true;
    //       }
    //     });

    //     if(!isSim){
    //       video.style.display = 'none';
    //     }
    //   });
    // } else{
    //   console.log('유사도 배열 로드 중...');
    // }

  });

  //태그에 대한 기능 추가 (좋아요 순으로 노출)
  likesButton.addEventListener("click", function(e){
      e.preventDefault();
      const videoContainer = document.getElementById('video-list');
      const allVideos = Array.from(document.getElementsByClassName("Video-Item"));
      allVideos.forEach(videoItem=>{
        videoItem.style.display = 'flex';
      });

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
      const videoContainer = document.getElementById('video-list');
      const allVideos = Array.from(document.getElementsByClassName("Video-Item"));
      allVideos.forEach(videoItem=>{
        videoItem.style.display = 'flex';
      });
      

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
      const allVideos = Array.from(document.getElementsByClassName("Video-Item"));
      const videoContainer = document.getElementById('video-list');
      allVideos.forEach(videoItem=>{
        videoItem.style.display = 'flex';
      });

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
  topMenu.appendChild(recommendButton);
  topMenu.appendChild(likesButton);
  topMenu.appendChild(dateButton);
  topMenu.appendChild(viewButton);
}

getVideoData();
getVideoList();