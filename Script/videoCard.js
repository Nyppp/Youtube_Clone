
//비디오 리스트 가져오기
function getVideoList(){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/video/getVideoList`, true);

    xhr.onload = function(){
        if(xhr.status === 200){
            let response = JSON.parse(xhr.responseText);
            console.log(response);
            parseJsondata(response);
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
            console.log(response);
            
            callback(response.channel_name, response.channel_profile);
            
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
    videoList.innerHTML = '';

    if(!results || results.length ===0){
        videoList.textContent = "No videos found.";
        return;
    }

    results.forEach(function(video){
        // 비디오 박스 전체영역
        const videoItem = document.createElement('div');
        videoItem.classList.add('Video-Item');

        // 썸네일 영역
        const thumbnailBox = document.createElement('a');
        thumbnailBox.classList.add('Thumbnail');

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

        const profileImg = document.createElement('img');
        profileImg.classList.add('Video-Profile_image');

        const videoDesc = document.createElement('div');
        videoDesc.classList.add('Video-Description');

        const videoTitle = document.createElement('a');
        videoTitle.classList.add('Video-Title');
        videoTitle.textContent = video.title;

        const videoChannel = document.createElement('a');
        videoChannel.classList.add('Video-Channel');

        const uploadDate = document.createElement('a');
        uploadDate.classList.add('Time');
        uploadDate.textContent = setViewUnit(video.views) + " views . " + timeAgo(video.created_dt);

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

        // 전체 구조
        videoItem.appendChild(thumbnailBox);
        videoItem.appendChild(videoInfoBox);
        

        videoList.appendChild(videoItem);
    });
}


// 조회수 표기 > 1000을 넘기면 K 붙이기
function setViewUnit(viewCount){
    if(viewCount > 1000){
        viewCount = Math.floor(viewCount / 1000);

        
        return viewCount + "K";
    }
    return viewCount;
}

//업로드 날짜 < > 현재 시간 상대 시간 계산
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