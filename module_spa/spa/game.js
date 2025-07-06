const Game = (function() {
  let isGameOpen = false;

  function init() {
    setupEventListeners();
  }

  function setupEventListeners() {
    document.getElementById('game-icon')?.addEventListener('click', toggleGame);
    document.getElementById('close-game-btn')?.addEventListener('click', closeGame);
    document.getElementById('retry-game-btn')?.addEventListener('click', retryGame);
    
    const gameIframe = document.getElementById('game-iframe');
    if (gameIframe) {
      gameIframe.addEventListener('load', handleGameLoad);
      gameIframe.addEventListener('error', handleGameError);
    }
  }

  function toggleGame(e) {
    e.preventDefault();
    e.stopPropagation();
    isGameOpen ? closeGame() : openGame();
  }

  function openGame() {
    if (isGameOpen) return;
    
    isGameOpen = true;
    document.getElementById('game-overlay').style.display = 'block';
    
    setTimeout(() => {
      const iframe = document.getElementById('game-iframe');
      try {
        if (iframe.contentDocument === null) {
          handleGameError();
        }
      } catch (error) {
        console.warn('Error checking game:', error);
      }
    }, 2000);
  }

  function closeGame() {
    document.getElementById('game-overlay').style.display = 'none';
    isGameOpen = false;
  }

  function handleGameLoad() {
    document.getElementById('game-error').style.display = 'none';
  }

  function handleGameError() {
    const errorDiv = document.getElementById('game-error');
    const iframe = document.getElementById('game-iframe');
    
    errorDiv.style.display = 'block';
    iframe.style.display = 'none';
  }

  function retryGame() {
    const iframe = document.getElementById('game-iframe');
    const errorDiv = document.getElementById('game-error');
    
    errorDiv.style.display = 'none';
    iframe.style.display = 'block';
    iframe.src = iframe.src;
  }

  return {
    init
  };
})();

document.addEventListener('DOMContentLoaded', Game.init);