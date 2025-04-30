import * as common from "./commonModule.js";

function getVideoData(){
  const videoId = window.location.search.split('=');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId[1]}`, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      console.log(response);
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
      console.log(channelResponse);
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

function parseJsonchanneldata(channelData) {
  document.getElementById('channelName').textContent = channelData.channel_name;

  const channelProfileImg = document.getElementById('channelProfile');
  channelProfileImg.src = channelData.channel_profile;

  document.getElementById('subscribtionText').textContent = `${channelData.subscribers.toLocaleString()} subscribers`;
}

// 사이드 비디오 리스트 가져오기
function getVideoList() {
  if(window.videoListRes != null){
    parseJsondata(window.videoListRes);
    return;
  }

  const xhrVideoList = new XMLHttpRequest();
  xhrVideoList.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoList`, true);

  xhrVideoList.onload = function () {
    if (xhrVideoList.status === 200) {
      const videoListResponse = JSON.parse(xhrVideoList.responseText);
      console.log(videoListResponse);
      parseJsonVideoListdata(videoListResponse);
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

  videoListData.forEach(function (list) {
    // 리스트 안에 있는 비디오 박스 전체 영역
    const videoListBlock = document.createElement('div');
    videoListBlock.classList.add('video-listblock');

    // 썸네일 영역
    const thumbnailBox = document.createElement('a');
    thumbnailBox.classList.add('thumbnailBox');
    thumbnailBox.href = `?video_id=${list.id}`;

    const thumbnailImg = document.createElement('img');
    thumbnailImg.classList.add('thumbnail');
    thumbnailImg.src = list.thumbnail;

    // 비디오 정보 영역
    const sideInfo = document.createElement('div');
    sideInfo.classList.add('side-Info');

    const sideTitle = document.createElement('a');
    sideTitle.classList.add('side-title');
    sideTitle.textContent = list.title;
    sideTitle.href = `?video_id=${list.id}`;

    const sideUsername = document.createElement('a');
    sideUsername.classList.add('side-username');
    sideUsername.href = `?channel_id=${list.channel_id}`;

    const sideVideoDesc = document.createElement('div');
    sideVideoDesc.classList.add('side-videoDesc');
    sideVideoDesc.textContent = common.setViewUnit(list.views) + " views . " + common.timeAgo(list.created_dt);

    // 채널 이름 가져오기
    fetchChannelName(list.channel_id, function (channelName) {
      sideUsername.textContent = channelName;
    });

    videoListBlock.appendChild(thumbnailBox);
    thumbnailBox.appendChild(thumbnailImg);
    videoListBlock.appendChild(sideInfo);
    sideInfo.appendChild(sideTitle);
    sideInfo.appendChild(sideUsername);
    sideInfo.appendChild(sideVideoDesc);
    videoList.appendChild(videoListBlock);
  });
}

// 사이드바용 채널 이름만 가져오는 함수
function fetchChannelName(channelId, callback) {
  const xhrChannel = new XMLHttpRequest();
  xhrChannel.open('GET', `http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channelId}`, true);

  xhrChannel.onload = function () {
    if (xhrChannel.status === 200) {
      const channelResponse = JSON.parse(xhrChannel.responseText);
      callback(channelResponse.channel_name);
    } else {
      console.error('Error', xhrChannel.status);
    }
  };

  xhrChannel.onerror = function () {
    console.error('Network Error');
  };

  xhrChannel.send();
}

getVideoData();
getVideoList();