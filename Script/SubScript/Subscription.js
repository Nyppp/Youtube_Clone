// 로컬 스토리지에서 구독 목록 가져오기
function getSubscribedChannels() {
    const subscribedChannels = localStorage.getItem('subscribedChannels');
    return subscribedChannels ? JSON.parse(subscribedChannels) : [];
}

// 구독 목록에 채널 추가
function subscribeToChannel(channelId, channelName, channelProfile) {
    console.log(`채널 구독: ${channelId}, ${channelName}`);
    const subscribedChannels = getSubscribedChannels();
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
    
    updateSidebarSubscriptions();
    
    return !isAlreadySubscribed;
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
        unsubscribeFromChannel(channelId);
        button.textContent = 'SUBSCRIBES';
        button.classList.remove('subscribed');
    } else {
        subscribeToChannel(channelId, channelName, channelProfile);
        button.textContent = 'SUBSCRIBED';
        button.classList.add('subscribed');
    }
}

// 구독 버튼 초기화
function initSubscribeButtons() {
    const subscribeButtons = document.querySelectorAll('.subscribe-button');
    
    subscribeButtons.forEach(button => {
        button.removeEventListener('click', handleSubscribeButtonClick);
        
        const channelId = button.dataset.channelId;
        if (channelId && isChannelSubscribed(channelId)) {
            button.textContent = 'SUBSCRIBED';
            button.classList.add('subscribed');
        } else {
            button.textContent = 'SUBSCRIBES';
            button.classList.remove('subscribed');
        }
        
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
    
    const h3Element = subscriptionContainer.querySelector('h3');
    const h3Html = h3Element ? h3Element.outerHTML : '<h3>Subscriptions</h3>';
    
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
    
    subscriptionContainer.innerHTML = subscriptionsHtml;
}

// 페이지 로드 시 실행 > 구독 목록 / 버튼 초기화
document.addEventListener('DOMContentLoaded', function() {
    const sidebarElement = document.getElementById('main-sidebar');
    if (sidebarElement) {
        const observer = new MutationObserver(function(mutations) {
            updateSidebarSubscriptions();
            
            if (window.location.search.includes('channel_id')) {
                initSubscribeButtons();
            }
        });
        
        observer.observe(sidebarElement, { childList: true });
    }
    
    if (window.location.search.includes('channel_id')) {
        const urlParams = new URLSearchParams(window.location.search);
        const channelId = urlParams.get('channel_id');
        
        if (channelId) {
            setTimeout(() => {
                const channelName = document.querySelector('.channel-name')?.textContent || '';
                const channelProfile = document.querySelector('.profile-image')?.src || '';
                
                const subscribeButton = document.querySelector('.subscribe-button');
                if (subscribeButton) {
                    subscribeButton.dataset.channelId = channelId;
                    subscribeButton.dataset.channelName = channelName;
                    subscribeButton.dataset.channelProfile = channelProfile;
                    
                    if (isChannelSubscribed(channelId)) {
                        subscribeButton.textContent = 'SUBSCRIBED';
                        subscribeButton.classList.add('subscribed');
                    }
                    
                    subscribeButton.addEventListener('click', handleSubscribeButtonClick);
                }
            }, 1000);
        }
    }
});

// 구독 버튼 스타일 적용
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