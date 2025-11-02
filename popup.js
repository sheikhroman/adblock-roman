// popup UI: show simple toggles for the three sites
document.addEventListener('DOMContentLoaded', () => {
  const sites = {
    "youtube.com": "YouTube",
    "facebook.com": "Facebook",
    "instagram.com": "Instagram"
  };
  const container = document.getElementById('sites');

  chrome.storage.local.get('enabled_sites', (res) => {
    const map = res.enabled_sites || {
      "youtube.com": true,
      "facebook.com": true,
      "instagram.com": true
    };
    Object.keys(sites).forEach(host => {
      const row = document.createElement('div');
      row.className = 'site';
      const label = document.createElement('div');
      label.textContent = sites[host];
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!map[host];
      input.addEventListener('change', () => {
        map[host] = input.checked;
        chrome.storage.local.set({ enabled_sites: map });
      });
      row.appendChild(label);
      row.appendChild(input);
      container.appendChild(row);
    });
  });

  document.getElementById('openOptions').addEventListener('click', () => {
    // helpful shortcut to chrome extensions page
    chrome.tabs.create({ url: 'chrome://extensions/' });
  });
});
