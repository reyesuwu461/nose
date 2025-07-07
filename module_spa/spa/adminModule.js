function showUserManagement() {
  document.getElementById('admin-content-container').innerHTML = `
    <div class="admin-panel">
      <h3>User Management</h3>
      <button id="delete-user-btn" class="danger-btn">Delete User</button>
      <select id="user-role-select">
        <option value="user">User</option>
        <option value="seller">Seller</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  `;
}

function showSystemSettings() {
  document.getElementById('admin-content-container').innerHTML = `
    <div class="admin-panel">
      <h3>System Settings</h3>
      <label>Maintenance Mode: 
        <input type="checkbox" id="maintenance-mode">
      </label>
    </div>
  `;
}
