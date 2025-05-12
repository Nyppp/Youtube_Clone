
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


// 조회수 표기 > 1000을 넘기면 K 붙이기
function setViewUnit(viewCount){
    if(viewCount > 1000){
        viewCount = Math.floor(viewCount / 1000);

        
        return viewCount + "K";
    }
    return viewCount;
}

//채널 정보 가져오기
function getChannelInfo(channelId, callback){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${channelId}`, true);

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

// 검색 결과 > 렌더링 하는 함수 (비디오 카드 형식으로 렌더링 하는 곳에서 사용)
function drawList(videoList, results){
    // 기존 비디오 목록 비우기
    videoList.innerHTML = '';
    
    if (!results || results.length === 0) {
        videoList.textContent = "No videos found.";
        return;
    }
    
    results.forEach(function(video) {
        // 비디오 박스 전체영역
        const videoItem = document.createElement('div');
        videoItem.classList.add('Video-Item');
        
        // 썸네일 영역
        const thumbnailBox = document.createElement('a');
        thumbnailBox.classList.add('Thumbnail');
        thumbnailBox.href = `?video_id=${video.id}`; // 링크 추가
        
        const thumbnailImg = document.createElement('img');
        thumbnailImg.classList.add('Thumbnail-Image');
        thumbnailImg.src = video.thumbnail;

        const videoPreview = document.createElement('video');
        videoPreview.classList.add('video-preview');
        videoPreview.preload = "none";
        videoPreview.style.display = "none";
        videoPreview.autoplay = true;
        videoPreview.muted = true;
        videoPreview.loop = true;
        
        const videoTime = document.createElement('p');
        videoTime.classList.add('VideoTime');
        
        // 비디오 정보 영역
        const videoInfoBox = document.createElement('div');
        videoInfoBox.classList.add('Video-Info');
        
        const videoProfile = document.createElement('a');
        videoProfile.classList.add('Video-Profile');
        videoProfile.href = `?channel_id=${video.channel_id}`; // 링크 추가
        
        const profileImg = document.createElement('img');
        profileImg.classList.add('Video-Profile_image');
        
        const videoDesc = document.createElement('div');
        videoDesc.classList.add('Video-Description');
        
        const videoTitle = document.createElement('a');
        videoTitle.classList.add('Video-Title');
        videoTitle.href = `?video_id=${video.id}`; // 링크 추가
        videoTitle.textContent = video.title;
        
        const videoChannel = document.createElement('a');
        videoChannel.classList.add('Video-Channel');
        videoChannel.href = `?channel_id=${video.channel_id}`; // 링크 추가
        
        const uploadDate = document.createElement('a');
        uploadDate.classList.add('Time');
        uploadDate.textContent = setViewUnit(video.views) + " views . " + timeAgo(video.created_dt);
        
        getChannelInfo(video.channel_id, function(channelName, channelProfile) {
            videoChannel.textContent = channelName;
            profileImg.src = channelProfile;
        });

        // 정렬을 위한 데이터 삽입
        const videoIdData = document.createElement('p');
        videoIdData.textContent = video.id;
        videoIdData.style.display = "none";
        videoIdData.classList.add("videoId");

        const likesData = document.createElement('p');
        likesData.textContent = video.likes;
        likesData.style.display = "none";
        likesData.classList.add("likesCount");

        const viewsData = document.createElement('p');
        viewsData.textContent = video.views;
        viewsData.style.display = "none";
        viewsData.classList.add("viewsCount");

        const timeData = document.createElement('p');
        timeData.textContent = video.created_dt;
        timeData.style.display = "none";
        timeData.classList.add("timeData");

        const videoTags = document.createElement('p');
        videoTags.textContent = video.tags;
        videoTags.style.display = "none";
        videoTags.classList.add("videoTag");

        const videoId = document.createElement('p');
        videoId.textContent = video.id;
        videoId.style.display = "none";
        videoId.classList.add("videoId");

        videoItem.appendChild(likesData);
        videoItem.appendChild(viewsData);
        videoItem.appendChild(timeData);
        videoItem.appendChild(videoTags);
        videoItem.appendChild(videoId);

        // 비디오 설명 영역
        videoDesc.appendChild(videoTitle);
        videoDesc.appendChild(videoChannel);
        videoDesc.appendChild(uploadDate);
        
        // 비디오 설명 + 채널 프로필 이미지 영역
        videoProfile.appendChild(profileImg);
        
        videoInfoBox.appendChild(videoProfile);
        videoInfoBox.appendChild(videoDesc);
        
        // 썸네일 영역
        thumbnailBox.appendChild(thumbnailImg);
        thumbnailBox.appendChild(videoIdData);
        thumbnailBox.appendChild(videoPreview);

        thumbnailBox.addEventListener('mouseenter', ()=>{
            const videoId = thumbnailBox.getElementsByClassName('videoId')[0].textContent;
            videoPreview.src = `https://storage.googleapis.com/youtube-clone-video/${videoId}.mp4`;
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
        
        videoList.appendChild(videoItem);
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//유사도 계산 함수 (api 호출 + 유사도 계산)
async function getSimilarity(videoId, allVideos, skipVideos){

    let startTime = window.performance.now();
    let firstTags;

    let allTags = [];
    let allUniqueTags

    let targetVideos = [];

    //현재 보고있는 비디오의 태그와, 다른 비디오들 태그 유사도 계산
    //태그 중 단 한개라도 일치하는 비디오는 이미 추천 리스트 올라갔으니 계산 제외(skipVideos)

    allVideos.forEach(video=>{
        //현재 보고있는 비디오의 태그들 추출
        if(video.id == videoId){
            firstTags = video.tags;
        }

        if(!skipVideos.includes(String(video.id))){
            targetVideos.push(video);
        }
    });

    targetVideos.forEach(video=>{
        video.tags.forEach(tag=>{
            allTags.push(tag);
        })
    })

    //전체 태그 중복제거
    allUniqueTags = [... new Set(allTags)];
    console.log(allUniqueTags);

    const simTags = [];

    for (const secondTag of allUniqueTags){
        if(firstTags[0] == secondTag){
            continue;
        }

        if(simTags.indexOf(secondTag) > 0){
            continue;
        }

        await delay(50);
        //api 호출 + 유사도 평균값 계산하여 출력
        let sim = await calcSimilarity(firstTags[0], secondTag);
        if (sim > 0){
            //유사도가 0 이상인 경우, 유사 태그로 지정한다
            simTags.push(secondTag);
        }
    }
    let endTime = window.performance.now();

    console.log("유사도 계산 완료, 걸린 시간 : " + (endTime - startTime) + "\n" + simTags);

    return simTags;
}

async function calcSimilarity(firstWord, secondWord){
    return new Promise((resolve, reject)=> {
        const openApiURL = 'https://www.techfree-oreumi-api.ai.kr/WiseWWN/WordRel';
        const access_key = '34f8f74f-733c-4b95-b8a4-2998d4580dbd';
        const requestJson = {
            argument: {
                first_word: firstWord,
                second_word: secondWord,
            }
        };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', openApiURL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', access_key);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try{
                    const responseData = JSON.parse(xhr.responseText);
                    const wordRelInfo = responseData.return_object['WWN WordRelInfo'].WordRelInfo.Distance;

                    //결과값을 내려줄 때 까지 대기 > promise객체
                    resolve(wordRelInfo);
                    } catch(e){
                        reject(e);
                    }

                } else {
                    console.error('HTTP 요청 실패:', xhr.status);
                }
            }
        };

        xhr.onerror = function () {
            console.error('네트워크 오류 발생');
        };
        xhr.send(JSON.stringify(requestJson));
    });
}

export {timeAgo, setViewUnit, drawList, getSimilarity}