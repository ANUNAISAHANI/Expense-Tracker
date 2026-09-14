/* ==========================================
   INDIVIDUAL JS FOR INDEX.HTML (NO MIXING)
   ========================================== */

/**
 * Function to toggle between Dark Mode and Light Mode
 * It switches the CSS class on the main body element silently.
 */
function toggleThemeMode() {
    const targetBody = document.getElementById('main-body-container');
    targetBody.classList.toggle('dark-mode-active');
}