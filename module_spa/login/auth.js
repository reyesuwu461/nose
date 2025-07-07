// Auth Module - Inventory System with Role Management
const Auth = (function() {
  // API simulation using JSON Server
  const userApi = {
    "validCredentials": [
      {
        "id": 1,
        "username": "admin",
        "password": "814923",
        "passwordHash": CryptoJS.SHA256("814923").toString(),
        "role": "admin",
        "token": "admin_token_xyz123",
        "redirect": "dashboard.html"
      },
      {
        "id": 2,
        "username": "seller",
        "password": "358416",
        "passwordHash": CryptoJS.SHA256("358416").toString(),
        "role": "seller",
        "token": "seller_token_abc456",
        "redirect": "products.html"
      },
      {
        "id": 3,
        "username": "user",
        "password": "467982",
        "passwordHash": CryptoJS.SHA256("467982").toString(),
        "role": "user",
        "token": "user_token_def789",
        "redirect": "home.html"
      }
    ]
  };

  let currentUser = null;

  // Initialize authentication system
  function init() {
    checkSession();
    setupLoginForm();
    setupLogout();
    protectRoutes();
  }

  // Check for existing session
  function checkSession() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        currentUser = JSON.parse(userData);
        showAppContent();
        updateUrlWithToken(token);
      } catch (e) {
        clearSession();
      }
    }
  }

  // Set up login form handlers
  function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('uid').value.trim();
      const password = document.getElementById('verification_code').value.trim();
      
      // Validate input fields
      if (!username || !password) {
        alert('Please enter username and password');
        return;
      }
      
      // Validate credentials against API
      const validUser = validateCredentials(username, password);
      
      if (validUser) {
        // Create user session
        currentUser = { 
          id: validUser.id,
          username: validUser.username,
          role: validUser.role,
          token: validUser.token,
          timestamp: new Date().toISOString()
        };
        
        // Store session data
        localStorage.setItem('authToken', currentUser.token);
        localStorage.setItem('userData', JSON.stringify(currentUser));
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('lastUser', currentUser.username);
        
        // Update UI and URL
        showAppContent();
        updateUrlWithToken(currentUser.token);
        
        // Redirect based on role
        window.location.href = validUser.redirect;
      } else {
        alert('Invalid username or password');
        // Clear fields
        document.getElementById('uid').value = '';
        document.getElementById('verification_code').value = '';
        document.getElementById('uid').focus();
      }
    });
  }

  // Validate user credentials against API
  function validateCredentials(username, password) {
    const passwordHash = CryptoJS.SHA256(password).toString();
    return userApi.validCredentials.find(user => 
      user.username === username && user.passwordHash === passwordHash
    );
  }

  // Show main application content
  function showAppContent() {
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
    updateUI();
    loadRoleModule();
  }

  // Update UI based on user role
  function updateUI() {
    if (!currentUser) return;

    // Update role display
    const roleDisplay = document.getElementById('user-role-display');
    if (roleDisplay) {
      roleDisplay.textContent = currentUser.role.toUpperCase();
      roleDisplay.className = `role-badge ${currentUser.role}-role`;
    }

    // Update dashboard title
    document.getElementById('app-title').textContent = 
      `${currentUser.role.toUpperCase()} Dashboard`;

    // Show/hide elements based on role
    document.getElementById('admin-features').style.display = 
      currentUser.role === 'admin' ? 'block' : 'none';
      
    document.getElementById('seller-features').style.display = 
      currentUser.role === 'seller' ? 'block' : 'none';
      
    document.getElementById('user-features').style.display = 
      currentUser.role === 'user' ? 'block' : 'none';
  }

  // Load appropriate module based on role
  function loadRoleModule() {
    const roleContent = document.getElementById('role-content');
    if (!roleContent || !currentUser) return;

    roleContent.innerHTML = ''; // Clear previous content

    switch(currentUser.role) {
      case 'admin':
        if (typeof AdminModule !== 'undefined') {
          AdminModule.init(roleContent);
        } else {
          showModuleError(roleContent, 'Admin');
        }
        break;
      case 'seller':
        if (typeof SellerModule !== 'undefined') {
          SellerModule.init(roleContent);
        } else {
          showModuleError(roleContent, 'Seller');
        }
        break;
      case 'user':
        if (typeof UserModule !== 'undefined') {
          UserModule.init(roleContent);
        } else {
          showModuleError(roleContent, 'User');
        }
        break;
    }
  }

  // Show module loading error
  function showModuleError(container, moduleName) {
    container.innerHTML = `
      <div class="module-error">
        <h3>${moduleName} Module Error</h3>
        <p>The ${moduleName.toLowerCase()} module failed to load.</p>
        <button onclick="location.reload()">Reload Page</button>
      </div>
    `;
  }

  // Set up logout functionality
  function setupLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      logout();
    });
  }

  // Logout function
  function logout() {
    clearSession();
    document.getElementById('loginForm').reset();
    document.getElementById('login-overlay').style.display = 'flex';
    document.getElementById('app-content').style.display = 'none';
    window.history.pushState({}, '', window.location.pathname); // Clear token from URL
    window.location.href = 'login.html';
  }

  // Clear user session
  function clearSession() {
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('lastUser');
  }

  // Protect routes from unauthorized access
  function protectRoutes() {
    const protectedRoutes = ['/dashboard', '/products', '/inventory', '/settings'];
    const currentPath = window.location.pathname;

    if (protectedRoutes.includes(currentPath) && !localStorage.getItem('authToken')) {
      window.location.href = '/login.html';
    }
  }

  // Update URL with encrypted token
  function updateUrlWithToken(token) {
    const encryptedToken = CryptoJS.AES.encrypt(token, 'secret_key').toString();
    window.history.pushState({}, '', `?token=${encodeURIComponent(encryptedToken)}`);
  }

  // Public API
  return {
    init,
    getCurrentUser: () => currentUser,
    logout,
    isAdmin: () => currentUser?.role === 'admin',
    isSeller: () => currentUser?.role === 'seller',
    isUser: () => currentUser?.role === 'user',
    checkLoggedIn: () => sessionStorage.getItem('isLoggedIn') === 'true'
  };
})();

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  Auth.init();
  
  // Check login status on page load
  if (Auth.checkLoggedIn()) {
    const lastUser = sessionStorage.getItem('lastUser');
    const user = userApi.validCredentials.find(u => u.username === lastUser);
    if (user) {
      window.location.href = user.redirect;
    }
  }
});

// Export for JSON Server (simulated)
if (typeof exports !== 'undefined') {
  exports.userApi = userApi;
}
