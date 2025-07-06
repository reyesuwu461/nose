// Main Application Coordinator
const App = (function() {
  function init() {
    // Initialize all systems
    Auth.init();
    Theme.init();
    Game.init();
    
    // Load additional modules if needed
    if (Auth.getCurrentUser()) {
      loadRoleSpecificModules();
    }
  }

  function loadRoleSpecificModules() {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) return;

    const container = document.getElementById('role-content');
    switch(currentUser.role) {
      case 'admin':
        if (typeof AdminModule !== 'undefined') AdminModule.init(container);
        break;
      case 'seller':
        if (typeof SellerModule !== 'undefined') SellerModule.init(container);
        break;
      case 'user':
        if (typeof UserModule !== 'undefined') UserModule.init(container);
        break;
    }
  }

  return { init };
})();

// Start the application
document.addEventListener('DOMContentLoaded', App.init);