const inputComment = document.getElementById("commentInput");
const buttonComment = document.getElementById("enterBtn");
const newComment = document.getElementById("newComment");
const commentForm = document.getElementsByClassName("comment-addArea")[0];

inputComment.addEventListener("keyup", function(e) {
    responseBtn();
    
    if (e.key === "Enter" && !buttonComment.disabled) {
      addComment(e);
    }
});

buttonComment.addEventListener("click", addComment);

// 버튼 활성화 함수
function responseBtn() {
  const inputValue = inputComment.value;
  
  if (inputValue.length > 0) {
    buttonComment.style.backgroundColor = "#3ea6ff";
    buttonComment.disabled = false;
  } else {
    buttonComment.style.backgroundColor = "#181818";
    buttonComment.disabled = true;
  }
  return;
}

//댓글 추가 함수
function addComment(e) {
    e.preventDefault();

    // 태그 추가
    const comment = document.createElement("div");
    const profileImg = document.createElement("img");
    const commentBox = document.createElement("div");
    const userID = document.createElement("span");
    const commentText = document.createElement("span");
    const btnContainer = document.createElement("div");
    const likeContainer = document.createElement("div");
    const likeBtn = document.createElement("button");
    const likeCount = document.createElement("span");
    const hateContainer = document.createElement("div");
    const hateBtn = document.createElement("button");
    const hateCount = document.createElement("span");
    const replyBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    // 태그 클래스 추가
    comment.classList.add("commentClass");
    profileImg.classList.add("profileImgClass");
    commentBox.classList.add("commentBoxClass");
    userID.classList.add("userIDClass");
    commentText.classList.add("commentTextClass");
    btnContainer.classList.add("btnContainerClass");
    likeContainer.classList.add("likeContainerClass");
    likeBtn.classList.add("likeBtnClass");
    likeCount.classList.add("likeCountClass");
    hateContainer.classList.add("hateContainerClass");
    hateBtn.classList.add("hateBtnClass");
    hateCount.classList.add("hateCountClass");
    replyBtn.classList.add("replyBtnClass");
    deleteBtn.classList.add("deleteBtnClass");

  userID.innerHTML = "James Gouse";
  commentText.innerHTML = inputComment.value;
  likeCount.innerText = "0";
  hateCount.innerText = "0";
  replyBtn.innerHTML = "REPLY";
  deleteBtn.innerHTML = "DELETE";

  // 요소 추가
  newComment.appendChild(comment);
  comment.appendChild(profileImg);
  comment.appendChild(commentBox);

  commentBox.appendChild(userID);
  commentBox.appendChild(commentText);
  commentBox.appendChild(btnContainer);

  btnContainer.appendChild(likeContainer);
  btnContainer.appendChild(hateContainer);
  btnContainer.appendChild(replyBtn);
  btnContainer.appendChild(deleteBtn);
  
  likeContainer.appendChild(likeBtn);
  likeContainer.appendChild(likeCount);
  
  hateContainer.appendChild(hateBtn);
  hateContainer.appendChild(hateCount);

// 댓글 등록 후 입력창 리셋, 버튼 비활성화
  inputComment.value = "";
  buttonComment.style.backgroundColor = "#181818";
  buttonComment.disabled = true;

// 삭제 기능
deleteBtn.addEventListener("click", function() {
    comment.remove();
  });

// 토글 상태 저장
let liked = false;
let hated = false;

// 좋아요 버튼 클릭
likeBtn.addEventListener("click", function() {
  if (!liked) {
    likeCount.innerText = parseInt(likeCount.innerText) + 1;
    liked = true;
    // 싫어요가 눌려있다면 초기화
    if (hated) {
      hateCount.innerText = parseInt(hateCount.innerText) - 1;
      hated = false;
    }
  } else {
    likeCount.innerText = parseInt(likeCount.innerText) - 1;
    liked = false;
  }
});

// 싫어요 버튼 클릭
hateBtn.addEventListener("click", function() {
  if (!hated) {
    hateCount.innerText = parseInt(hateCount.innerText) + 1;
    hated = true;
    // 좋아요가 눌려있다면 초기화
    if (liked) {
      likeCount.innerText = parseInt(likeCount.innerText) - 1;
      liked = false;
    }
  } else {
    hateCount.innerText = parseInt(hateCount.innerText) - 1;
    hated = false;
  }
});
}