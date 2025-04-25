document.addEventListener('DOMContentLoaded', function () {
  const videoId = 1;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId}`, true);

  xhr.onload = function () {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            parseJsondata(response);

            const channelId = response.channel_id;  // 채널 ID 가져오기
            fetchChannelInfo(channelId);  // 채널 정보 가져오는 함수 호출
          } else {
            console.error('Error', xhr.status);
          }
  };
  xhr.onerror = function(){
      console.error('Network Error');
  };

  xhr.send();

  function parseJsondata(data) {
      // 제목
      document.getElementById('video-title').textContent = data.title;

      // 영상 URL
      const videoSource = document.getElementById('video-source');
      videoSource.src = `https://storage.googleapis.com/youtube-clone-video/${data.id}.mp4`;

      // 영상 URL 출력
      const videoPlayer = document.getElementById('video-player');
      videoPlayer.load();

      // 조회수
      document.getElementById('views').textContent = `${data.views.toLocaleString()} views.`;

      // 날짜
      const date = new Date(data.created_dt);
      const formattedDate = `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
      document.getElementById('date').textContent = formattedDate;

      // 좋아요 수
      document.getElementById('likes').textContent = data.likes;

      // 싫어요 수
      document.getElementById('hates').textContent = data.dislikes;

      // 영상 설명(태그)
      document.getElementById('descText').textContent = data.tags.map(tag => `#${tag}`).join(' ');
  }

  // 두 번째 API 요청 (channel 정보를 가져옴)
  function fetchChannelInfo(channelId) {
    // 두 번째 API 호출
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
    // 채널 이름
    document.getElementById('channelName').textContent = channelData.channel_name;

    // 채널 프로필 이미지
    const channelProfileImg = document.getElementById('channelProfile');
    channelProfileImg.src = channelData.channel_profile; // 프로필 이미지 URL 설정

    // 구독자 수
    document.getElementById('subscribtionText').textContent = `${channelData.subscribers.toLocaleString()} subscribers`;
  }
});