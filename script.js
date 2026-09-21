/* ==========================================
   INDIVIDUAL JS FOR INDEX.HTML (NO MIXING)
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const targetBody = document.getElementById('main-body-container');
    
    // Page load hote hi localStorage se saved theme preference check karo
    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme === 'dark') {
        targetBody.classList.add('dark-mode-active');
    }
});

function toggleThemeMode() {
    const targetBody = document.getElementById('main-body-container');
    targetBody.classList.toggle('dark-mode-active');
    
    // Theme switch hone par preference ko localStorage mein save karo
    if (targetBody.classList.contains('dark-mode-active')) {
        localStorage.setItem('theme_preference', 'dark');
    } else {
        localStorage.setItem('theme_preference', 'light');
    }
}