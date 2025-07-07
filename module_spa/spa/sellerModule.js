export const SellerModule = {
  init(container) {
    container.innerHTML = `
      <div class="seller-dashboard">
        <h2>Seller Dashboard</h2>
        <div class="seller-actions">
          <button id="viewInventory">View Inventory</button>
          <button id="makeSale">Make Sale</button>
        </div>
        <div id="sellerContent"></div>
      </div>
    `;
  }
};
