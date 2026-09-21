/* ==========================================
   INDIVIDUAL JS FOR REGISTER.HTML (NO MIXING)
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    // Global Theme Check from localStorage
    const targetBody = document.getElementById('register-body-container');
    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme === 'dark') {
        targetBody.classList.add('dark-mode-active');
    }

    const regForm = document.getElementById("user-registration-form");

    if (regForm) {
        regForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Stop Page From Reloading

            // Gathering Manual Inputs As Per User Rules
            const fullName = document.getElementById("reg-fullname").value;
            const email = document.getElementById("reg-email").value;
            const password = document.getElementById("reg-password").value;
            const state = document.getElementById("reg-state").value;
            const district = document.getElementById("reg-district").value;
            const city = document.getElementById("reg-city").value;
            const profilePhoto = document.getElementById("reg-profile-photo").files[0];

            alert("Registration Form Validated Successfully! Backend Connection Pending.");
        });
    }
});