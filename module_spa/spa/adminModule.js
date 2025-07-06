const AdminModule = (function() {
  function init() {
    renderDashboard();
    setupEventListeners();
  }

  function renderDashboard() {
    document.getElementById('role-content').innerHTML = `
      <section class="admin-section">
        <h2>Admin Dashboard</h2>
        <div class="admin-controls">
          <button id="manage-users-btn" class="admin-btn">Manage Users</button>
          <button id="manage-content-btn" class="admin-btn">Manage All Content</button>
          <button id="system-settings-btn" class="admin-btn">System Settings</button>
        </div>
        <div id="admin-content-container"></div>
      </section>
    `;
  }

  function setupEventListeners() {
    document.getElementById('manage-users-btn')?.addEventListener('click', showUserManagement);
    document.getElementById('manage-content-btn')?.addEventListener('click', showContentManagement);
    document.getElementById('system-settings-btn')?.addEventListener('click', showSystemSettings);
  }

  function showUserManagement() {
    document.getElementById('admin-content-container').innerHTML = `
      <div class="admin-panel">
        <h3>User Management</h3>
        <p>Here you can manage all system users.</p>
      </div>
    `;
  }

  function showContentManagement() {
    document.getElementById('admin-content-container').innerHTML = `
      <div class="admin-panel">
        <h3>Content Management</h3>
        <div class="content-tabs">
          <button class="tab-btn active" data-content-type="posts">Articles</button>
          <button class="tab-btn" data-content-type="products">Products</button>
        </div>
        <div id="content-container"></div>
        <div class="form-container">
          <h4 id="form-title">Add New Article</h4>
          <form id="admin-content-form"></form>
        </div>
      </div>
    `;

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        loadContent(this.dataset.contentType);
      });
    });

    loadContent('posts');
    ContentManager.generateForm('admin-content-form', 'form-title', 'posts');
  }

  function showSystemSettings() {
    document.getElementById('admin-content-container').innerHTML = `
      <div class="admin-panel">
        <h3>System Settings</h3>
        <p>Configure system-wide settings.</p>
      </div>
    `;
  }

  function loadContent(contentType) {
    const data = JSON.parse(localStorage.getItem(contentType) || '[]');
    const container = document.getElementById('content-container');
    
    container.innerHTML = data.map(item => 
      ContentManager.createContentItem(item, contentType)
    ).join('');
    
    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editItem(contentType, parseInt(btn.dataset.id)));
    });
    
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteItem(contentType, parseInt(btn.dataset.id)));
    });
  }

  function editItem(contentType, id) {
    ContentManager.generateForm('admin-content-form', 'form-title', contentType, id);
    ContentManager.fillFormForEdit('admin-content-form', contentType, id);
  }

  function deleteItem(contentType, id) {
    if (confirm('Are you sure you want to delete this item?')) {
      const data = JSON.parse(localStorage.getItem(contentType) || '[]');
      const filteredData = data.filter(item => item.id !== id);
      localStorage.setItem(contentType, JSON.stringify(filteredData));
      loadContent(contentType);
    }
  }

  return {
    init
  };
})();