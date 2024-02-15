// Listen for web requests
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Analyze the request URL
    const url = new URL(details.url);
    
    // Check for potential threats
    const threatLevel = analyzeUrl(url);
    
    if (threatLevel > 0) {
      // Send threat data to the server
      sendThreatData({
        url: details.url,
        threatLevel,
        timestamp: new Date().toISOString(),
        threatType: 'suspicious_url'
      });
      
      // Notify the user
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Potential Threat Detected',
        message: `A suspicious URL was detected: ${url.hostname}`
      });
    }
  },
  { urls: ['<all_urls>'] }
);

// Function to analyze URLs for potential threats
function analyzeUrl(url) {
  let threatLevel = 0;
  
  // Check for known malicious patterns
  const maliciousPatterns = [
    /phishing/i,
    /malware/i,
    /scam/i,
    /hack/i,
    /exploit/i
  ];
  
  maliciousPatterns.forEach(pattern => {
    if (pattern.test(url.href)) {
      threatLevel += 1;
    }
  });
  
  // Check for suspicious TLDs
  const suspiciousTlds = ['.xyz', '.top', '.club', '.online'];
  if (suspiciousTlds.some(tld => url.hostname.endsWith(tld))) {
    threatLevel += 1;
  }
  
  return threatLevel;
}

// Function to send threat data to the server
async function sendThreatData(data) {
  try {
    const response = await fetch('http://localhost:5001/api/threats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.error('Failed to send threat data:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending threat data:', error);
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_THREAT_STATS') {
    // Get threat statistics from storage
    chrome.storage.local.get(['threatStats'], (result) => {
      sendResponse(result.threatStats || {});
    });
    return true; // Will respond asynchronously
  }
}); 