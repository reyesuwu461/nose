import CryptoJS from 'crypto-js';

const Auth = {
  currentUser: null,

  init() {
    this.checkSession();
    this.setupLoginForm();
    this.setupLogout();
  },

  checkSession() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        this.currentUser = JSON.parse(userData);
        this.redirectBasedOnRole();
      } catch (e) {
        this.clearSession();
      }
    }
  },

  async login(username, password) {
    try {
      // Simulación de API - en producción sería fetch a tu backend
      const users = {
        admin: { passwordHash: CryptoJS.SHA256('admin123').toString(), role: 'admin', token: 'admin_token' },
        seller: { passwordHash: CryptoJS.SHA256('seller123').toString(), role: 'seller', token: 'seller_token' },
        user: { passwordHash: CryptoJS.SHA256('user123').toString(), role: 'user', token: 'user_token' }
      };

      const user = users[username];
      const inputHash = CryptoJS.SHA256(password).toString();

      if (user && inputHash === user.passwordHash) {
        this.currentUser = {
          username,
          role: user.role,
          token: user.token
        };
        
        localStorage.setItem('authToken', user.token);
        localStorage.setItem('userData', JSON.stringify(this.currentUser));
        sessionStorage.setItem('isLoggedIn', 'true');
        
        this.redirectBasedOnRole();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  redirectBasedOnRole() {
    if (!this.currentUser) return;
    
    switch(this.currentUser.role) {
      case 'admin':
        window.location.href = 'spa/index.html#admin';
        break;
      case 'seller':
        window.location.href = 'spa/index.html#seller';
        break;
      case 'user':
        window.location.href = 'spa/index.html#user';
        break;
      default:
        window.location.href = 'login.html';
    }
  },

  setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  },

  logout() {
    this.clearSession();
    window.location.href = 'login.html';
  },

  clearSession() {
    this.currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('isLoggedIn');
  }
};

export default Auth;
