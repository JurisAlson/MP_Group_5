//FUNCTION FOR DISPLAYING CURRENT USERNAME

function getUsernameFromLocalStorage() {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username;
    }
    return null;
  }
  
  var logged_username = getUsernameFromLocalStorage();
  
  function displayUsername(){
  
    //validation
    if (logged_username) {
        console.log("Username retrieved from localStorage:", logged_username);
    } else {
        console.log("No username found in localStorage.");
    }
  
    //display username of logged user
    const usernameElement = document.getElementById('nav-user');
    if (usernameElement !== null){
        usernameElement.innerHTML = `<h3>${logged_username}</h3>`; 
    }
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    displayUsername();
  });