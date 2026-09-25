/* ==========================================
   INDIVIDUAL JS FOR REGISTER.HTML (NO MIXING)
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const targetBody = document.getElementById('register-body-container');
    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme === 'dark') {
        targetBody.classList.add('dark-mode-active');
    }

    const regForm = document.getElementById("user-registration-form");

    if (regForm) {
        regForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fullName = document.getElementById("reg-fullname").value;
            const email = document.getElementById("reg-email").value;
            const password = document.getElementById("reg-password").value;
            const state = document.getElementById("reg-state").value;
            const district = document.getElementById("reg-district").value;
            const city = document.getElementById("reg-city").value;

            const userData = {
                fullName: fullName,
                email: email,
                password: password,
                state: state,
                district: district,
                city: city
            };

            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Registration Successful! Please login now.");
                    window.location.href = "/login";
                } else {
                    alert(data.message || "Registration failed!");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Something went wrong during registration.");
            });
        });
    }
});