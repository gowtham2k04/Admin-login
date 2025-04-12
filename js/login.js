document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");
  
    // Simple admin credentials (can be extended)
    if (username === "admin" && password === "admin123") {
      window.location.href = "employee.html";
    } else {
      errorMsg.textContent = "Invalid username or password!";
    }
  });
  

 
  window.addEventListener("load", () => {
    document.querySelector(".login-container").style.animationPlayState = "running";
  });


  document.querySelector('.login-image').addEventListener('click', function() {
    this.classList.add('clicked'); // Add 'clicked' class to trigger fade out
  });
  
