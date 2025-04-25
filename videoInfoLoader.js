document.addEventListener('DOMContentLoaded', function () {
  const videoId = 1;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoInfo?video_id=${videoId}`, true);

  xhr.onload = function () {
          if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              console.log(response);
              parseJsondata(response);           
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
  }
});