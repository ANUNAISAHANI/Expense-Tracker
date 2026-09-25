/* ==========================================
   INDIVIDUAL JS FOR LOGIN.HTML (NO MIXING)
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
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

            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('user_name', data.user.fullName);
                    localStorage.setItem('user_email', data.user.email);
                    localStorage.setItem('reg_state', data.user.state || "");
                    localStorage.setItem('reg_district', data.user.district || "");
                    localStorage.setItem('reg_city', data.user.city || "");
                    
                    window.location.href = "/dashboard";
                } else {
                    alert(data.message || "Invalid email or password!");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Something went wrong during login.");
            });
        });
    }
});