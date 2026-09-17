/* ==========================================
   INDIVIDUAL JS FOR LOGIN.HTML (NO MIXING)
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("user-login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            // Prevent default form submission reload
            event.preventDefault();

            // Fetching input values using unique IDs
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            // Basic validation check (Backend integration will handle authentication later)
            if (email === "" || password === "") {
                return;
            }

            // Preparing user login payload object for future Flask backend integration
            const loginData = {
                email: email,
                password: password
            };

            // Resetting form fields securely after capture
            loginForm.reset();
        });
    }
});