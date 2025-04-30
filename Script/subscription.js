
// 로컬 스토리지에서 구독 목록 가져오기
function getSubscribedChannels() {
    const subscribedChannels = localStorage.getItem('subscribedChannels');
    return subscribedChannels ? JSON.parse(subscribedChannels) : [];
}

// 구독 목록에 채널 추가
function subscribeToChannel(channelId, channelName, channelProfile) {
    console.log(`채널 구독: ${channelId}, ${channelName}`);
    const subscribedChannels = getSubscribedChannels();
    
    // 이미 구독중인지 확인
    const isAlreadySubscribed = subscribedChannels.some(channel => channel.id === channelId);
    
    if (!isAlreadySubscribed) {
        subscribedChannels.push({
            id: channelId,
            name: channelName,
            profile: channelProfile
        });
        
        localStorage.setItem('subscribedChannels', JSON.stringify(subscribedChannels));
        console.log('구독 완료:', channelName);
    } else {
        console.log('이미 구독 중인 채널입니다:', channelName);
    }
    
    // 사이드바 구독 목록 업데이트
    updateSidebarSubscriptions();
    
    return !isAlreadySubscribed; // 새로 구독했으면 true, 이미 구독중이었으면 false
}

// 구독 목록에서 채널 제거
function unsubscribeFromChannel(channelId) {
    console.log(`채널 구독 취소: ${channelId}`);
    const subscribedChannels = getSubscribedChannels();
    const channelToRemove = subscribedChannels.find(channel => channel.id === channelId);
    
    if (channelToRemove) {
        console.log('구독 취소:', channelToRemove.name);
    }
    
    const updatedChannels = subscribedChannels.filter(channel => channel.id !== channelId);
    localStorage.setItem('subscribedChannels', JSON.stringify(updatedChannels));
    
    // 사이드바 구독 목록 업데이트
    updateSidebarSubscriptions();
    
    return true;
}

// 채널이 구독되었는지 확인
function isChannelSubscribed(channelId) {
    const subscribedChannels = getSubscribedChannels();
    return subscribedChannels.some(channel => channel.id === channelId);
}

// 구독 버튼 클릭 이벤트 처리
function handleSubscribeButtonClick(event) {
    const button = event.target;
    const channelId = button.dataset.channelId;
    const channelName = button.dataset.channelName;
    const channelProfile = button.dataset.channelProfile;
    
    if (!channelId || !channelName || !channelProfile) {
        console.error('채널 정보가 없습니다. data-* 속성을 확인하세요.');
        return;
    }
    
    if (isChannelSubscribed(channelId)) {
        // 이미 구독 중이면 구독 취소
        unsubscribeFromChannel(channelId);
        button.textContent = 'SUBSCRIBES';
        button.classList.remove('subscribed');
    } else {
        // 구독하지 않았으면 구독 추가
        subscribeToChannel(channelId, channelName, channelProfile);
        button.textContent = 'SUBSCRIBED';
        button.classList.add('subscribed');
    }
}

// 구독 버튼 초기화
function initSubscribeButtons() {
    // 페이지 내의 모든 구독 버튼 찾기
    const subscribeButtons = document.querySelectorAll('.subscribe-button');
    
    subscribeButtons.forEach(button => {
        // 이미 이벤트가 등록되어 있을 수 있으므로 기존 이벤트 제거
        button.removeEventListener('click', handleSubscribeButtonClick);
        
        // 버튼의 초기 상태 설정
        const channelId = button.dataset.channelId;
        if (channelId && isChannelSubscribed(channelId)) {
            button.textContent = 'SUBSCRIBED';
            button.classList.add('subscribed');
        } else {
            button.textContent = 'SUBSCRIBES';
            button.classList.remove('subscribed');
        }
        
        // 클릭 이벤트 등록
        button.addEventListener('click', handleSubscribeButtonClick);
    });
}

// 사이드바 구독 목록 업데이트
function updateSidebarSubscriptions() {
    const subscribedChannels = getSubscribedChannels();
    const subscriptionContainer = document.querySelector('.sidebar-Subscribtions');
    
    if (!subscriptionContainer) {
        console.error('사이드바의 구독 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    // 기존 h3 태그 저장
    const h3Element = subscriptionContainer.querySelector('h3');
    const h3Html = h3Element ? h3Element.outerHTML : '<h3>Subscriptions</h3>';
    
    // 구독 목록 HTML 생성
    let subscriptionsHtml = h3Html;
    
    if (subscribedChannels.length === 0) {
        subscriptionsHtml += '<p class="subscription-empty">No channels subscribed yet.</p>';
    } else {
        subscriptionsHtml += '<ul class="nav-list">';
        
        subscribedChannels.forEach(channel => {
            subscriptionsHtml += `
                <li class="nav-item">
                    <a href="?channel_id=${channel.id}" class="nav-link">
                        <img src="${channel.profile}" alt="${channel.name}">
                        <span class="nav-text">${channel.name}</span>
                    </a>
                </li>
            `;
        });
        
        subscriptionsHtml += '</ul>';
    }
    
    // 구독 목록 업데이트
    subscriptionContainer.innerHTML = subscriptionsHtml;
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('subscription.js 로드됨');
    
    // 사이드바가 로드된 후에 구독 목록 업데이트
    const sidebarElement = document.getElementById('main-sidebar');
    if (sidebarElement) {
        // MutationObserver로 사이드바 변화 감시
        const observer = new MutationObserver(function(mutations) {
            // 사이드바 내용이 변경되면 구독 목록 업데이트
            updateSidebarSubscriptions();
            
            // 채널 페이지일 경우 구독 버튼 초기화
            if (window.location.search.includes('channel_id')) {
                initSubscribeButtons();
            }
        });
        
        // 사이드바의 자식 요소 변화 감지
        observer.observe(sidebarElement, { childList: true });
    }
    
    // 페이지 URL에 channel_id가 있으면 채널 페이지로 간주하고 구독 버튼 초기화
    if (window.location.search.includes('channel_id')) {
        // URL에서 채널 ID 추출
        const urlParams = new URLSearchParams(window.location.search);
        const channelId = urlParams.get('channel_id');
        
        if (channelId) {
            // 약간의 지연 후 구독 버튼 초기화 (DOM이 모두 로드된 후)
            setTimeout(() => {
                console.log('채널 페이지 감지, 구독 버튼 초기화');
                
                // 채널 페이지에서 채널 정보 가져오기
                const channelName = document.querySelector('.channel-name')?.textContent || '';
                const channelProfile = document.querySelector('.profile-image')?.src || '';
                
                // 구독 버튼에 채널 정보 설정
                const subscribeButton = document.querySelector('.subscribe-button');
                if (subscribeButton) {
                    subscribeButton.dataset.channelId = channelId;
                    subscribeButton.dataset.channelName = channelName;
                    subscribeButton.dataset.channelProfile = channelProfile;
                    
                    // 구독 상태에 따라 버튼 텍스트 변경
                    if (isChannelSubscribed(channelId)) {
                        subscribeButton.textContent = 'SUBSCRIBED';
                        subscribeButton.classList.add('subscribed');
                    }
                    
                    // 클릭 이벤트 등록
                    subscribeButton.addEventListener('click', handleSubscribeButtonClick);
                }
            }, 500);
        }
    }
});

// 구독 버튼 스타일
const style = document.createElement('style');
style.textContent = `
    /* 구독 버튼 스타일 */
    .subscribe-button {
        background-color: #cc0000;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 2px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .subscribe-button:hover {
        background-color: #a00000;
    }

    /* 구독 상태일 때의 버튼 스타일 */
    .subscribe-button.subscribed {
        background-color: #606060;
    }

    .subscribe-button.subscribed:hover {
        background-color: #484848;
    }

    /* 사이드바 구독 섹션 스타일 */
    .subscription-empty {
        padding: 8px 24px;
        color: #909090;
        font-size: 13px;
    }

    .sidebar-Subscribtions .nav-list .nav-item img {
    border-radius: 50%;  
    width: 24px;         
    height: 24px;        
    object-fit: cover;  
}
`;
document.head.appendChild(style);