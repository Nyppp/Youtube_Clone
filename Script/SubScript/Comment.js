// 댓글 추가
import { timeAgo } from "/Script/CommonPage/CommonModule.js";


let inputComment;
let buttonComment;
let newComment;
let commentCountDiv;
let commentCount = 3;

function initSearchElement(){
  window.onload = function(){
    inputComment = document.getElementById("commentInput");
    buttonComment = document.getElementById("enterBtn");
    newComment = document.getElementById("newComment");
    commentCountDiv = document.getElementById("commentCount");

    inputComment.addEventListener("keyup", function(e) {
        responseBtn();
        
        if (e.key === "Enter" && !buttonComment.disabled) {
          addComment(e);
        }
    });

    buttonComment.addEventListener("click", addComment);
  }
}

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

    const comment = document.createElement("div");
    const profileImg = document.createElement("div");
    const commentBox = document.createElement("div");
    const commentInfo = document.createElement("div");
    const userID = document.createElement("span");
    const commentTime = document.createElement("span");
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

    comment.classList.add("commentClass");
    profileImg.classList.add("profileImgClass");
    commentBox.classList.add("commentBoxClass");
    commentInfo.classList.add("commentInfoClass");
    userID.classList.add("userIDClass");
    commentTime.classList.add("commentTimeClass");
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

  userID.innerHTML = "Marcus Levin";
  commentTime.innerText = timeAgo(new Date());
  commentText.innerHTML = inputComment.value;
  likeCount.innerText = "0";
  hateCount.innerText = "0";
  replyBtn.innerHTML = "REPLY";
  deleteBtn.innerHTML = "DELETE";

  newComment.insertBefore(comment, newComment.firstChild);
  comment.appendChild(profileImg);
  comment.appendChild(commentBox);

  commentBox.appendChild(commentInfo);
  commentBox.appendChild(commentText);
  commentBox.appendChild(btnContainer);

  commentInfo.appendChild(userID);
  commentInfo.appendChild(commentTime);

  btnContainer.appendChild(likeContainer);
  btnContainer.appendChild(hateContainer);
  btnContainer.appendChild(replyBtn);
  btnContainer.appendChild(deleteBtn);
  
  likeContainer.appendChild(likeBtn);
  likeContainer.appendChild(likeCount);
  
  hateContainer.appendChild(hateBtn);
  hateContainer.appendChild(hateCount);

  inputComment.value = "";
  buttonComment.style.backgroundColor = "#181818";
  buttonComment.disabled = true;

  updateCommentCount(1);

  deleteBtn.addEventListener("click", function() {
    comment.remove();
    updateCommentCount(-1);
  });

  let liked = false;
  let hated = false;

  likeBtn.addEventListener("click", function() {
    if (!liked) {
      likeCount.innerText = parseInt(likeCount.innerText) + 1;
      liked = true;
      if (hated) {
        hateCount.innerText = parseInt(hateCount.innerText) - 1;
        hated = false;
      }
    } else {
      likeCount.innerText = parseInt(likeCount.innerText) - 1;
      liked = false;
    }
  });

  hateBtn.addEventListener("click", function() {
    if (!hated) {
      hateCount.innerText = parseInt(hateCount.innerText) + 1;
      hated = true;
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

// 댓글 개수 업데이트
function updateCommentCount(change) {
  commentCount += change;
  commentCountDiv.innerText = `${commentCount} Comments`;
}

// 기존 댓글 좋아요/싫어요 수 업데이트
const oldLikeBtns = document.getElementsByClassName("like-button");
const oldLikeCounts = document.getElementsByClassName("likeCount");
const oldHateBtns = document.getElementsByClassName("hate-button");
const oldHateCounts = document.getElementsByClassName("hateCount");

for (let i = 0; i < oldLikeBtns.length; i++) {
  let liked = false;
  let hated = false;

  oldLikeBtns[i].addEventListener("click", function () {
    let count = parseInt(oldLikeCounts[i].innerText);
    if (!liked) {
      oldLikeCounts[i].innerText = count + 1;
      liked = true;

      if (hated) {
        oldHateCounts[i].innerText = parseInt(oldHateCounts[i].innerText) - 1;
        hated = false;
      }
    } else {
      oldLikeCounts[i].innerText = count - 1;
      liked = false;
    }
  });

  oldHateBtns[i].addEventListener("click", function () {
    let count = parseInt(oldHateCounts[i].innerText);
    if (!hated) {
      oldHateCounts[i].innerText = count + 1;
      hated = true;

      if (liked) {
        oldLikeCounts[i].innerText = parseInt(oldLikeCounts[i].innerText) - 1;
        liked = false;
      }
    } else {
      oldHateCounts[i].innerText = count - 1;
      hated = false;
    }
  });
}

setTimeout(() => {
  initSearchElement();
}, 2000);
