# YouTube Clone
이스트 캠프 오르미 백엔드 과정(11기) 1차 프로젝트 - 유튜브 클론코딩 프로젝트 입니다.

프로젝트 기간 : 2025/04/21 ~ 2025/05/12 (공휴일 제외 총 12일)

## Our Team
<table border= 1px solid>
  <thead>
  <tr><td colspan=3 align="center">Team 98.9</td></tr>
  </thead>
  <tr align="center">
    <td>팀장 노윤표</td>
    <td>팀원 김진욱</td>
    <td>팀원 방준철</td>
  </tr>

  <tr>
    <td><a href=https://github.com/Nyppp><img object-fit=fill src=https://avatars.githubusercontent.com/u/63279872?v=4 width="300" height="300" alt="깃허브 페이지 바로가기"></a></td>
    <td><a href=https://github.com/Jaykim98z><img object-fit=fill src=https://avatars.githubusercontent.com/u/99804318?v=4 width="300" height="300" alt="깃허브 페이지 바로가기"></a></td>
    <td><a href=https://github.com/bangjjun><img  object-fit=fill src=https://avatars.githubusercontent.com/u/206670961?v=4 width="300" height="300" alt="깃허브 페이지 바로가기"></a></td>
  </tr>
</table>

---
## 🛠️ 사용 기술

- **사용 언어**: HTML, CSS, JavaScript(vanilla JS)
- **API**: techfree-oreumi-api(비디오 정보 API), 어휘 간 유사도 분석 API
- **사용 툴**: VScode, Github
---

## 🌐 주요 구현 기능
<details>
  <summary>비디오 리스트 페이지(메인 담당 : 노윤표)</summary>
  
  ---
  <div align="center">
    <img src=https://github.com/user-attachments/assets/a0455ba0-178f-4711-ac35-f52cda401525 width="600px" hegiht="600px" alt="비디오 리스트 페이지">
  </div>
  <details><summary>그리드 + 미디어 쿼리를 사용한 반응형 페이지 구현</summary>
    <div align="center">
      <img src= "https://github.com/user-attachments/assets/7fc3d644-3647-4b72-bc00-b6541359a6bd" width="600px" hegiht="600px">
    </div>
    <ul>
      <li>개발 담당자 : 노윤표</li>
      <li>코드 요약 : 단말 규격에 맞춰 전체적인 페이지 반응형처리 구현 </li>
      <li><a href="https://github.com/Nyppp/Youtube_Clone/blob/cf21bf096de551dfa77ffab58719f5b788214f34/Css/Video-Container.css#L29">코드 바로가기</a>
      </li>
    </ul>
  </details>
  <details><summary>상단 태그 버튼 > 비디오 리스트 정렬 기능 구현</summary>
    <div align="center">
      <img src= "https://github.com/user-attachments/assets/1fab51b7-17ad-43ee-97f7-f0975404770f" width="600px" hegiht="600px">
    </div>
    <ul>
      <li>개발 담당자 : 노윤표</li>
      <li>코드 요약 : 비디오 속성으로 가지고 있는 id, 조회수, 좋아요, 게시 날짜, 비디오 태그를 기준으로 정렬해주는 기능 구현 </li>
      <li>
        <a href="https://github.com/Nyppp/Youtube_Clone/blob/cf21bf096de551dfa77ffab58719f5b788214f34/Script/videoCard.js#L66">코드 바로가기</a>
      </li>
    </ul>
  </details>

---

</details>

<details><summary>비디오 플레이어 페이지(메인 담당 : 방준철)</summary>
    
---
<div align="center">
    <img src=https://github.com/user-attachments/assets/ef845287-0efb-48c1-8f5e-35fed8cc3a9d width="600px" hegiht="600px" alt="비디오 플레이어 페이지">
</div>

  <details><summary>API 연동 및 비디오 재생 기능 구현</summary>
    <div align="center">
      <img src= "https://github.com/user-attachments/assets/aeabd996-bbfa-4ef2-8762-247477dbc493" width="600px" hegiht="600px">
    </div>
    <ul>
      <li>개발 담당자 : 방준철</li>
      <li>코드 요약 : techfree-oreumi-api에 연결하여 비디오 정보를 가져오고, 이를 페이지 내 비디오 태그에 정보를 연결해주는 기능 구현</li>
      <li>
        <a href="https://github.com/Nyppp/Youtube_Clone/blob/cf21bf096de551dfa77ffab58719f5b788214f34/Script/video_page.js#L9C1-L75C2">코드 바로가기</a>
      </li>
    </ul>
  </details>

  <details><summary>ai API 연동 및 비디오 추천 기능 구현</summary>
    <div align="center">
      <img src= "https://github.com/user-attachments/assets/7c6b9dc1-69ea-4ba2-b41d-94a958d14b1a" width="600px" hegiht="600px">
    </div>
    <ul>
      <li>개발 담당자 : 노윤표</li>
      <li>코드 요약 : 어휘 간 유사도 분석 API에 연결하여 태그 - 태그 간 유사도를 계산 후, 이를 바탕으로 비디오 플레이어 페이지 우측 추천 비디오 리스트를 호출하는 기능 구현 </li>
      <li>
        <a href="https://github.com/Nyppp/Youtube_Clone/blob/cf21bf096de551dfa77ffab58719f5b788214f34/Script/commonModule.js#L222">코드 바로가기</a>
      </li>
    </ul>
  </details>

  <details><summary>댓글 작성 및 상호작용 기능 구현</summary>
    <div align="center">
      <img src= "https://github.com/user-attachments/assets/79dc243e-2228-426e-88fa-b01a510d06d2" width="600px" hegiht="600px">
    </div>
    <ul>
      <li>개발 담당자 : 방준철</li>
      <li>코드 요약 : 현재 보고있는 비디오에 대해 코멘트 작성 및 좋아요, 싫어요 인터렉션 기능 구현</li>
      <li>
        <a href="https://github.com/Nyppp/Youtube_Clone/blob/main/Script/comment.js#L4">코드 바로가기</a>
      </li>
    </ul>
  </details>

---
</details>

<details><summary>채널 페이지(메인 담당 : 김진욱)</summary>
    
---
<div align="center">
    <img src=https://github.com/user-attachments/assets/da5eb13c-df93-44f4-b11c-291f10efd526 width="600px" hegiht="600px" alt="채널 페이지">
</div>
  <details><summary>API 연동 및 채널 정보 렌더링 구현</summary>
    <ul>
      <li>개발 담당자 : 김진욱</li>
      <li>코드 요약 : 채널 정보 + 채널 내 비디오 리스트를 불러와서 화면에 렌더링</li>
      <li>
        <a href="https://github.com/Nyppp/Youtube_Clone/blob/main/Script/channel.js">코드 바로가기</a>
      </li>
    </ul>
  </details>

  ---
</details>
<details>
  <summary>사이드, 헤더(메인 담당 : 김진욱)</summary>

  ---
  <details><summary>사이드 바 토글 애니메이션 처리</summary>
  <div align="center">
      <img src= "https://github.com/user-attachments/assets/fcbb22f6-520c-4d9f-9479-4670098866b2" width="600px" hegiht="600px">
    </div>
    <ul>
      <li>개발 담당자 : 김진욱</li>
      <li>코드 요약 : 사이드바 햄버거 버튼 상호작용 - 숨기기, 펼치기 기능 및 애니메이션 처리 구현</li>
      <li>
        <a href="https://github.com/Nyppp/Youtube_Clone/blob/cf21bf096de551dfa77ffab58719f5b788214f34/Script/index.js#L108">코드 바로가기</a>
      </li>
    </ul>
  </details>
  <details><summary>검색 기능 > 비디오 제목, 태그에 맞춰 키워드 검색 구현</summary>
    <div align="center">
      <img src= "https://github.com/user-attachments/assets/8a509f3d-34a1-4288-a64f-c332f543e583" width="600px" hegiht="600px">
    </div>
    <ul>
      <li>개발 담당자 : 김진욱</li>
      <li>코드 요약 : 쿼리 파라미터를 이용해 비디오 제목, 태그를 기반으로 검색 후 결과를 화면에 렌더링 처리</li>
      <li>
        <a href="https://github.com/Nyppp/Youtube_Clone/blob/cf21bf096de551dfa77ffab58719f5b788214f34/Script/Search.js#L53">코드 바로가기</a>
      </li>
    </ul>
  </details>
  
  ---
</details>
<details>
  <summary>추가 구현 기능(팀원 당 1개 이상의 추가 기능 구현)</summary>

  ---
  <details><summary>비디오 프리뷰 기능</summary>
    <div align="center">
      <img src=https://github.com/user-attachments/assets/433fc1c3-908e-4af2-9223-d6f54436fd3a width="600px" hegiht="600px" alt="비디오 프리뷰">
    </div>
    <ul>
      <li>개발 담당자 : 노윤표</li>
      <li>코드 요약 : 마우스 enter, leave 이벤트에 맞춰 비디오 썸네일 이미지 / 비디오 재생 서로 변경 되는 동작 구현</li>
      <li>
        <a href="https://github.com/Nyppp/Youtube_Clone/blob/cf21bf096de551dfa77ffab58719f5b788214f34/Script/commonModule.js#L197">코드 바로가기</a>
      </li>
    </ul>
  </details>
  <details><summary>다크 - 라이트 모드 토글 기능</summary>
    <div align="center">
      <img src="https://github.com/user-attachments/assets/492db45a-39a8-474f-9b4f-502989042c84" width="600px" hegiht="600px" alt="">
    </div>
    <ul>
      <li>개발 담당자 : 방준철</li>
      <li>코드 요약 : 모든 페이지에 대응되는 다크, 라이트 테마 스타일 전환 기능 구현</li>
      <li>
        <a href="https://github.com/Nyppp/Youtube_Clone/blob/main/Script/theme.js">코드 바로가기</a>
      </li>
    </ul>
  </details>
  <details><summary>구독 추가 / 해제 기능 구현</summary>
    <div align="center">
      <img src="https://github.com/user-attachments/assets/ef6a905a-bac0-45df-abb1-f0f546d8d2c0" width="600px" hegiht="600px" alt="">
    </div>
    <ul>
      <li>개발 담당자 : 김진욱</li>
      <li>코드 요약 : 채널에 대해 구독 버튼 클릭 시, 로컬 스토리지에 구독 한 채널을 저장하며 해당 리스트를 사이드바에 노출시키는 동작 구현</li>
      <li>
        <a href="https://github.com/Nyppp/Youtube_Clone/blob/main/Script/subscription.js">코드 바로가기</a>
      </li>
    </ul>
  </details>

  ---
</details>

---
