import Auth from './auth.js';
import { AdminModule } from './adminModule.js';
import { SellerModule } from './sellerModule.js';
import { UserModule } from './userModule.js';

document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
  
  // Router simple para SPA
  const route = () => {
    const hash = window.location.hash.substring(1);
    const contentDiv = document.getElementById('main-content');
    
    if (!Auth.currentUser) {
      window.location.href = '../login.html';
      return;
    }

    switch(hash) {
      case 'admin':
        AdminModule.init(contentDiv);
        break;
      case 'seller':
        SellerModule.init(contentDiv);
        break;
      case 'user':
        UserModule.init(contentDiv);
        break;
      default:
        contentDiv.innerHTML = '<h2>Welcome to the Dashboard</h2>';
    }
  };

  window.addEventListener('hashchange', route);
  route();
});
