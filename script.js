/* ==========================================
   INDIVIDUAL JS FOR INDEX.HTML (NO MIXING)
   ========================================== */

/**
 * Function to toggle between Dark Mode and Light Mode
 * It switches the CSS class on the main body element.
 */
function toggleThemeMode() {
    const targetBody = document.getElementById('main-body-container');
    
    // Toggle the dark-mode-active class on the body
    targetBody.classList.toggle('dark-mode-active');
    
    // Optional: Save user preference in browser local storage
    if (targetBody.classList.contains('dark-mode-active')) {
        console.log("Dark mode enabled by user.");
    } else {
        console.log("Light mode enabled by user.");
    }
}