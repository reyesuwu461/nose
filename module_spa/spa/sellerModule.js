const SellerModule = (function() {
  function init() {
    renderDashboard();
    setupEventListeners();
  }

  function renderDashboard() {
    document.getElementById('role-content').innerHTML = `
      <section class="seller-section">
        <h2>Seller Dashboard</h2>
        <div class="seller-tabs">
          <button class="tab-btn active" data-content-type="products">My Products</button>
          <button class="tab-btn" data-content-type="orders">Orders</button>
        </div>
        <div id="seller-content-container"></div>
        <div class="form-container">
          <h4 id="form-title">Add New Product</h4>
          <form id="seller-content-form"></form>
        </div>
      </section>
    `;
  }

  function setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        loadContent(this.dataset.contentType);
      });
    });

    loadContent('products');
    ContentManager.generateForm('seller-content-form', 'form-title', 'products');
  }

  function loadContent(contentType) {
    const container = document.getElementById('seller-content-container');
    
    if (contentType === 'products') {
      const data = JSON.parse(localStorage.getItem('products') || '[]');
      container.innerHTML = data.map(item => 
        ContentManager.createContentItem(item, 'products')
      ).join('');
      
      container.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editItem(parseInt(btn.dataset.id)));
      });
      
      container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteItem(parseInt(btn.dataset.id)));
      });
    } else {
      container.innerHTML = `
        <div class="orders-list">
          <h3>Orders Management</h3>
          <p>View and manage your orders here.</p>
        </div>
      `;
    }
  }

  function editItem(id) {
    ContentManager.generateForm('seller-content-form', 'form-title', 'products', id);
    ContentManager.fillFormForEdit('seller-content-form', 'products', id);
  }

  function deleteItem(id) {
    if (confirm('Are you sure you want to delete this product?')) {
      const data = JSON.parse(localStorage.getItem('products') || '[]');
      const filteredData = data.filter(item => item.id !== id);
      localStorage.setItem('products', JSON.stringify(filteredData));
      loadContent('products');
    }
  }

  return {
    init
  };
})();