const UserModule = {
  init: function(container) {
    container.innerHTML = `
      <div class="user-dashboard">
        <h2>Welcome Player</h2>
        <div class="user-actions">
          <button id="play-game-btn" class="action-btn">
            <i class="fas fa-gamepad"></i> Play Game
          </button>
          <button id="view-inventory" class="action-btn">
            <i class="fas fa-chess-knight"></i> My Inventory
          </button>
        </div>
        <div id="game-stats" class="stats-container">
          <h3>Your Stats</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <i class="fas fa-trophy"></i>
              <span>Level: 15</span>
            </div>
            <div class="stat-card">
              <i class="fas fa-coins"></i>
              <span>Gold: 2,450</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById('play-game-btn').addEventListener('click', () => {
      document.getElementById('game-overlay').style.display = 'block';
    });
  }
};