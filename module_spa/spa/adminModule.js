export const AdminModule = {
  init(container) {
    container.innerHTML = `
      <div class="admin-dashboard">
        <h2>Admin Dashboard</h2>
        <div class="admin-actions">
          <button id="manageProducts">Manage Products</button>
          <button id="manageUsers">Manage Users</button>
          <button id="viewReports">View Reports</button>
        </div>
        <div id="adminContent"></div>
      </div>
    `;
    
    // Implementar funcionalidades específicas
    document.getElementById('manageProducts').addEventListener('click', () => {
      document.getElementById('adminContent').innerHTML = '<p>Product management panel</p>';
    });
  }
};
