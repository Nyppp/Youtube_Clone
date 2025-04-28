document.addEventListener('DOMContentLoaded', function () {
  const videoId = 1;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId}`, true);

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
});

// 사이드 비디오 리스트 가져오기
function getVideoList() {
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

    const thumbnailImg = document.createElement('img');
    thumbnailImg.classList.add('thumbnail');
    thumbnailImg.src = list.thumbnail;

    // 비디오 정보 영역
    const sideInfo = document.createElement('div');
    sideInfo.classList.add('side-Info');

    const sideTitle = document.createElement('a');
    sideTitle.classList.add('side-title');
    sideTitle.textContent = list.title;

    const sideUsername = document.createElement('a');
    sideUsername.classList.add('side-username');

    const sideVideoDesc = document.createElement('a');
    sideVideoDesc.classList.add('side-videoDesc');
    sideVideoDesc.textContent = setViewUnit(list.views) + " views . " + timeAgo(list.created_dt);

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

// 조회수 표기 > 1000을 넘기면 K 붙이기
function setViewUnit(viewCount) {
  if (viewCount > 1000) {
    viewCount = Math.floor(viewCount / 1000);
    return viewCount + "K";
  }
  return viewCount;
}

// 업로드 날짜 < > 현재 시간 상대 시간 계산
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

getVideoList();