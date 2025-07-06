const StorageManager = (function() {
  function init() {
    setupEventListeners();
  }

  function setupEventListeners() {
    document.getElementById('save-storage')?.addEventListener('click', saveToStorage);
    document.getElementById('get-storage')?.addEventListener('click', getFromStorage);
    document.getElementById('remove-storage')?.addEventListener('click', removeFromStorage);
    document.getElementById('clear-storage')?.addEventListener('click', clearStorage);
  }

  function saveToStorage() {
    const key = document.getElementById('storage-key').value;
    const value = document.getElementById('storage-value').value;
    
    if (!key.trim()) {
      alert('Please enter a key');
      return;
    }
    
    try {
      localStorage.setItem(key, value);
      alert(`Saved: ${key} = ${value}`);
    } catch (error) {
      alert('Error saving: ' + error.message);
    }
  }

  function getFromStorage() {
    const key = document.getElementById('storage-key').value;
    
    if (!key.trim()) {
      alert('Please enter a key');
      return;
    }
    
    const value = localStorage.getItem(key);
    if (value !== null) {
      document.getElementById('storage-value').value = value;
    } else {
      alert(`Key not found: ${key}`);
    }
  }

  function removeFromStorage() {
    const key = document.getElementById('storage-key').value;
    
    if (!key.trim()) {
      alert('Please enter a key');
      return;
    }
    
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
      alert(`Removed: ${key}`);
    } else {
      alert(`Key not found: ${key}`);
    }
  }

  function clearStorage() {
    if (confirm('Are you sure you want to clear all Local Storage?')) {
      localStorage.clear();
      alert('Local Storage cleared');
    }
  }

  return {
    init
  };
})();

document.addEventListener('DOMContentLoaded', StorageManager.init);