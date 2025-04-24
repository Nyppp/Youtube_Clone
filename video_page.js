function #() {
    const # = document.getElementById("#");
    const # = searchInput.value;
  
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://www.example.com/=${#}`, true);
  
    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        displayResults(response.Search);
      } else {
        console.error("Error:", xhr.status);
      }
    };
  
    xhr.onerror = function () {
      console.error("Network Error");
    };
  
    xhr.send();
  }