
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

export {timeAgo, setViewUnit}