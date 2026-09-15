/* ==========================================
   INDIVIDUAL JS FOR REGISTER.HTML (NO MIXING)
   ========================================== */

/**
 * Event listener to handle registration form submission securely.
 * It prevents default reload and prepares manual inputs for backend integration.
 */

document.addEventListener("DOMContentLoaded", function () {
    const regForm = document.getElementById("user-registration-form");

    if (regForm) {
        regForm.addEventListener("submit", function (event) {
            event.preventDefault(); //Stop Page From Reloading

            //Gathering Manual Inputs AS Per User Rules
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