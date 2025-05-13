import * as common from "/Script/CommonPage/CommonModule.js";

const videoTags = [];
let uniqueTag;
let simTags = [];
let sameTagVideos = [];

//현재 보고 있는 비디오 정보 가져오기
function getVideoData(){
  const videoId = window.location.search.split('=');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://www.techfree-oreumi-api.ai.kr/video/getVideoInfo?video_id=${videoId[1]}`, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      parseJsondata(response);

      const channelId = response.channel_id;
      fetchChannelInfo(channelId);
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

  document.getElementById('descText').textContent = data.description;
}

// 메인 비디오용 채널 정보 가져오기
function fetchChannelInfo(channelId) {
  const xhrChannel = new XMLHttpRequest();
  xhrChannel.open('GET', `https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${channelId}`, true);

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

  const profileLink = document.getElementsByClassName('profileLink')[0];
  profileLink.href = `?channel_id=${channelData.id}`;

  document.getElementById('subscribtionText').textContent = `${channelData.subscribers.toLocaleString()} subscribers`;
  
  const subscribeButton = document.getElementById('subscribe-button');
  if (subscribeButton) {
    subscribeButton.dataset.channelId = channelData.id;
    subscribeButton.dataset.channelName = channelData.channel_name;
    subscribeButton.dataset.channelProfile = channelData.channel_profile;
    
    const subscribedChannels = localStorage.getItem('subscribedChannels');
    const channels = subscribedChannels ? JSON.parse(subscribedChannels) : [];
    const isSubscribed = channels.some(channel => channel.id === channelData.id);
    
    if (isSubscribed) {
      subscribeButton.textContent = 'SUBSCRIBED';
      subscribeButton.classList.add('subscribed');
    } else {
      subscribeButton.textContent = 'SUBSCRIBES';
      subscribeButton.classList.remove('subscribed');
    }
    
    if (typeof window.initSubscribeButtons === 'function') {
      window.initSubscribeButtons();
    }
  }

  const showmoreBtn = document.getElementById('descOpenButton');

  showmoreBtn.addEventListener('click', function(e){
    const descText = document.getElementById('descText');

    if(descText.style.webkitLineClamp == 'none'){
      descText.style.webkitLineClamp = 2;
    }else{
      descText.style.webkitLineClamp = 'none';
    }

    
  });

  const likeBtn = document.getElementsByClassName('likes-button')[0];
  const hateBtn = document.getElementsByClassName('hates-button')[0];

  const likeCount = document.getElementById('likes');
  const hateCount = document.getElementById('hates');

  let liked = false;
  let hated = false;

  likeBtn.addEventListener("click", function() {
    if (!liked) {
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
      liked = true;
      if (hated) {
        hateCount.textContent = parseInt(hateCount.textContent) - 1;
        hated = false;
      }
    } else {
      likeCount.textContent = parseInt(likeCount.textContent) - 1;
      liked = false;
    }
  });

  hateBtn.addEventListener("click", function() {
    if (!hated) {
      hateCount.textContent = parseInt(hateCount.textContent) + 1;
      hated = true;
      if (liked) {
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
        liked = false;
      }
    } else {
      hateCount.textContent = parseInt(hateCount.textContent) - 1;
      hated = false;
    }
  });
}

// 사이드 비디오 리스트 가져오기
async function getVideoList() {
  const videoId = window.location.search.split('=');

  if(window.videoListRes != null){
    parseJsondata(window.videoListRes);
    return;
  }

  const xhrVideoList = new XMLHttpRequest();
  xhrVideoList.open('GET', `https://www.techfree-oreumi-api.ai.kr/video/getVideoList`, true);

  xhrVideoList.onload = async function () {
    if (xhrVideoList.status === 200) {
      window.videoListRes = JSON.parse(xhrVideoList.responseText);
      parseJsonVideoListdata(window.videoListRes);
      
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
  let videoList = document.getElementById('video-list');
  const interval = setInterval(()=>{
    if(videoList){
        clearInterval(interval);
        common.drawList(videoList, videoListData);
    }
    videoList = document.getElementById('video-list');
  }, 100);

  videoListData.forEach(function(video){
    video.tags.forEach(function(tag){
        videoTags.push(tag);
    });
  })

  uniqueTag = [... new Set(videoTags)];
  initTagMenu(uniqueTag);

  setSameTagVideo();
}

//현재 보고 있는 비디오와 태그가 같은 비디오들 리스트 저장
async function setSameTagVideo(){
  const allVideos = Array.from(document.getElementsByClassName("Video-Item"));
  const currentVideoId = window.location.search.split('=');

  let currentTags = [];
  let videos = [];

  allVideos.forEach(videoItem=>{
    if(videoItem.getElementsByClassName('videoId')[0].textContent == currentVideoId[1]){
      currentTags = videoItem.getElementsByClassName('videoTag')[0].textContent.split(',');
    }
  });
  
  allVideos.forEach(videoItem=>{
    const videoTags = videoItem.getElementsByClassName('videoTag')[0].textContent;

    

    currentTags.forEach(tag=>{
      if (videoTags.indexOf(tag)>=0){
        videos.push(videoItem.getElementsByClassName('videoId')[0].textContent);
      }
    });
  });

  sameTagVideos = [... new Set(videos)];

  simTags = await common.getSimilarity(currentVideoId[1], window.videoListRes, sameTagVideos);
}

// 비디오 카드 페이지 상단 > 태그 버튼 초기화 함수
function initTagMenu(tags){
  const topMenu = document.getElementsByClassName('recommend-topMenu')[0];
  
  const allButton = document.createElement('a');
  allButton.classList.add('Top-Menu-All');
  allButton.classList.add('active');
  allButton.textContent = 'All';
  allButton.href = "";

  const recommendButton = document.createElement('a');
  recommendButton.classList.add('Top-Menu-All');
  recommendButton.textContent = 'Recommend';
  recommendButton.href = "";
  recommendButton.style.width = "100px";

  const likesButton = document.createElement('a');
  likesButton.classList.add('Top-Menu-All');
  likesButton.textContent = 'Likes';
  likesButton.href = "";

  const dateButton = document.createElement('a');
  dateButton.classList.add('Top-Menu-All');
  dateButton.textContent = 'Date';
  dateButton.href = "";

  const viewButton = document.createElement('a');
  viewButton.classList.add('Top-Menu-All');
  viewButton.textContent = 'Views';
  viewButton.href = "";

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

  recommendButton.addEventListener("click", async function(e){
    e.preventDefault();
    const currentVideoId = window.location.search.split('=');

    const allVideos = Array.from(document.getElementsByClassName("Video-Item"));

    allVideos.forEach(video=>{
      video.style.display = 'none';

      if(video.getElementsByClassName('videoId')[0].textContent == currentVideoId[1]){
        return;
      }

      if(sameTagVideos.indexOf(video.getElementsByClassName('videoId')[0].textContent) >= 0){
        video.style.display = 'flex';
      }

      simTags.forEach(tag=>{
        if(video.getElementsByClassName('videoTag')[0].textContent.indexOf(tag) > 0){
          video.style.display = 'flex';
        }
      });
    })
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

  topMenu.appendChild(allButton);
  topMenu.appendChild(recommendButton);
  topMenu.appendChild(likesButton);
  topMenu.appendChild(dateButton);
  topMenu.appendChild(viewButton);

  for(const btn of topMenu.children){
    btn.addEventListener('click', function(e){
        for(const otherBtn of topMenu.children){
            otherBtn.classList.remove('active');
        }
        btn.classList.add('active');
        
    });
}
}

//비디오 데이터 가져오고 > 리스트 출력 수행
if(window.location.search.indexOf('video_id=') > 0){
  getVideoData();
  getVideoList();
}