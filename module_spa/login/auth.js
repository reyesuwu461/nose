// Auth Module - Production Ready
const Auth = (function() {
  const validCredentials = {
    admin: { uid: "157894227", code: "814923" },
    seller: { uid: "033550336", code: "358416" },
    user: { uid: "842917463", code: "467982" }
  };

  let currentUser = null;

  function init() {
    checkSession();
    setupLoginForm();
    setupLogout();
  }

  function checkSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
        showAppContent();
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    // Role selection
    document.querySelectorAll('.role-option').forEach(option => {
      option.addEventListener('click', function() {
        document.querySelectorAll('.role-option').forEach(opt => {
          opt.classList.remove('active');
        });
        this.classList.add('active');
      });
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const uid = document.getElementById('uid').value.trim();
      const code = document.getElementById('code').value.trim();
      const activeRole = document.querySelector('.role-option.active')?.dataset.role;

      if (!activeRole || !validateCredentials(uid, code, activeRole)) {
        return;
      }

      currentUser = { 
        role: activeRole,
        uid: uid,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      showAppContent();
    });
  }

  function validateCredentials(uid, code, role) {
    if (!uid || !code) {
      alert("Both fields are required");
      return false;
    }

    if (!/^\d{6,9}$/.test(uid) || !/^\d{6}$/.test(code)) {
      alert("Invalid UID or code format");
      return false;
    }

    if (uid !== validCredentials[role].uid || code !== validCredentials[role].code) {
      alert("Invalid credentials");
      return false;
    }

    return true;
  }

  function showAppContent() {
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
    updateUI();
    loadRoleModule();
  }

  function updateUI() {
    if (!currentUser) return;

    // Update role display
    const roleDisplay = document.getElementById('user-role-display');
    if (roleDisplay) {
      roleDisplay.textContent = currentUser.role.toUpperCase();
      roleDisplay.className = `${currentUser.role}-role`;
    }

    // Update title
    document.getElementById('app-title').textContent = 
      `${currentUser.role.toUpperCase()} Dashboard`;

    // Toggle game icon
    document.getElementById('game-icon-container').style.display = 
      currentUser.role === 'user' ? 'block' : 'none';
  }

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

  function showModuleError(container, moduleName) {
    container.innerHTML = `
      <div class="module-error">
        <h3>${moduleName} Module Error</h3>
        <p>The ${moduleName.toLowerCase()} module failed to load.</p>
        <button onclick="location.reload()">Reload Page</button>
      </div>
    `;
  }

  function setupLogout() {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      currentUser = null;
      localStorage.removeItem('currentUser');
      document.getElementById('loginForm').reset();
      document.getElementById('login-overlay').style.display = 'flex';
      document.getElementById('app-content').style.display = 'none';
    });
  }

  return {
    init,
    getCurrentUser: () => currentUser,
    logout: () => {
      currentUser = null;
      localStorage.removeItem('currentUser');
    }
  };
})();

// Initialize auth system
document.addEventListener('DOMContentLoaded', Auth.init);