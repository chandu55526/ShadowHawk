document.addEventListener('DOMContentLoaded', () => {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const threatCount = document.getElementById('threatCount');
  const lastDetection = document.getElementById('lastDetection');
  const viewDashboard = document.getElementById('viewDashboard');

  // Get threat statistics
  chrome.runtime.sendMessage({ type: 'GET_THREAT_STATS' }, (response) => {
    threatCount.textContent = response.threatCount || 0;
    lastDetection.textContent = response.lastDetection || 'Never';
  });

  // Update status
  chrome.storage.local.get(['isActive'], (result) => {
    const isActive = result.isActive !== false; // Default to true
    statusIndicator.className = `status-indicator ${isActive ? 'active' : 'inactive'}`;
    statusText.textContent = isActive ? 'Active' : 'Inactive';
  });

  // View Dashboard button click handler
  viewDashboard.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' });
  });

  // Toggle status when clicking the status indicator
  statusIndicator.addEventListener('click', () => {
    chrome.storage.local.get(['isActive'], (result) => {
      const newStatus = !(result.isActive !== false);
      chrome.storage.local.set({ isActive: newStatus }, () => {
        statusIndicator.className = `status-indicator ${newStatus ? 'active' : 'inactive'}`;
        statusText.textContent = newStatus ? 'Active' : 'Inactive';
      });
    });
  });
}); 