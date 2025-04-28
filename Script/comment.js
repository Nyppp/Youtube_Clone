const inputComment = document.getElementById("input");
const buttonComment = document.getElementById("button");
const newComment = document.getElementById("newComment");
const commentForm = document.getElementsByClassName("comment")[0];

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
    buttonComment.style.color = "#065fd4";
    buttonComment.disabled = false;
  } else {
    buttonComment.style.color = "#181818";
    buttonComment.disabled = true;
  }
  return;
}

//댓글 추가 함수
function addComment(e) {
    e.preventDefault();

    const comment = document.createElement("div");
    const profileImg = document.createElement("img");
    const userID = document.createElement("span");
    const commentText = document.createElement("span");
    const likeContainer = document.createElement("div");
    const likeBtn = document.createElement("button");
    const likeCount = document.createElement("span");
    const hateContainer = document.createElement("div");
    const hateBtn = document.createElement("button");
    const hateCount = document.createElement("span");
    const deleteBtn = document.createElement("button");

    comment.classList.add("commentClass");
    profileImg.classList.add("profileImgClass");
    userID.classList.add("userIDClass");
    commentText.classList.add("commentTextClass");
    likeContainer.classList.add("likeContainerClass");
    likeBtn.classList.add("likeBtnClass");
    likeCount.classList.add("likeCountClass");
    hateContainer.classList.add("hateContainerClass");
    hateBtn.classList.add("hateBtnClass");
    hateCount.classList.add("hateCountClass");
    deleteBtn.classList.add("deleteBtnClass");

  userID.innerHTML = "James Gouse";
  commentText.innerHTML = inputComment.value;
  likeCount.innerText = "0";
  hateCount.innerText = "0";
  deleteBtn.innerHTML = "delete";

  newComment.appendChild(comment);
  comment.appendChild(profileImg);
  comment.appendChild(userID);
  comment.appendChild(commentText);
  
  comment.appendChild(likeContainer);
  likeContainer.appendChild(likeBtn);
  likeContainer.appendChild(likeCount);
  
  comment.appendChild(hateContainer);
  hateContainer.appendChild(hateBtn);
  hateContainer.appendChild(hateCount);

  comment.appendChild(deleteBtn);

// 댓글 등록 후 입력창 리셋, 버튼 비활성화
  inputComment.value = "";
  buttonComment.style.color = "#181818";
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