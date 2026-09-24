/* ==========================================
   INDIVIDUAL JS FOR LOGIN.HTML (NO MIXING)
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    // Global Theme Check from localStorage
    const targetBody = document.getElementById('login-body-container');
    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme === 'dark') {
        targetBody.classList.add('dark-mode-active');
    }

    const loginForm = document.getElementById("user-login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            if (email === "" || password === "") {
                return;
            }

           const loginData = {
                email: email,
                password: password
            };

            window.location.href = "dashboard.html";

            loginForm.reset();
        });
    }
});