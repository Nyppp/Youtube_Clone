import * as common from "./commonModule.js";
//비디오 리스트 가져오기
function getChannelInfo(){

    //url 파라미터 가져오고, id값만 추출( = 우측에 오는 값만 사용 > channel_id[1])
    const channel_id = window.location.search.split('=');
    
    
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://techfree-oreumi-api.kro.kr:5000/channel/getChannelInfo?id=${channel_id[1]}`, true);

    xhr.onload = function(){
        if(xhr.status === 200){
            let response = JSON.parse(xhr.responseText);

            displayChannelInfo(response)
        } else{
            console.error('Error:', xhr.status);
        }
    };

    xhr.onerror = function(){
        console.error('Network Error');
    };

    xhr.send();
}

function displayChannelInfo(info){
    const profileImg = document.getElementsByClassName('profile-image')[0];
    profileImg.src = info.channel_profile;

    const bannerImg = document.getElementsByClassName('banner-image')[0];
    bannerImg.src = info.channel_banner;

    const channelName = document.getElementsByClassName('channel-name')[0];
    channelName.textContent = info.channel_name;

    const subscribers = document.getElementsByClassName('subscriber-count')[0];
    subscribers.textContent = common.setViewUnit(info.subscribers) + ' subscribers';
}

getChannelInfo();