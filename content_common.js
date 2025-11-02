// common helpers for content scripts
function removeBySelector(sel) {
  document.querySelectorAll(sel).forEach(e => e.remove());
}
function hideBySelector(sel) {
  document.querySelectorAll(sel).forEach(e => {
    e.style.setProperty('display','none','important');
    e.style.setProperty('visibility','hidden','important');
    e.style.setProperty('height','0','important');
    e.style.setProperty('max-height','0','important');
  });
}
function tryRemove(el) {
  try { if (el) el.remove(); } catch(e){}
}
function isEnabledForHost(callback) {
  const host = location.hostname.replace('www.','');
  chrome.storage.local.get('enabled_sites', (res) => {
    const map = res.enabled_sites || {};
    const enabled = !!(map[host] || map[location.hostname] || map[host.replace(/^m\./,'')]);
    callback(enabled);
  });
}
function observeMutations(cb) {
  const mo = new MutationObserver((mutations) => {
    cb(mutations);
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  // run once
  cb([]);
}
