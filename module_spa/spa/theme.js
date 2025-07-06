const Theme = (function() {
  function init() {
    applySavedTheme();
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  }

  function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      document.querySelector('.theme-icon').textContent = '☀️';
    }
  }

  function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (body.classList.contains('light-mode')) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      themeIcon.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  }

  return {
    init
  };
})();

document.addEventListener('DOMContentLoaded', Theme.init);