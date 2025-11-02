// Advanced YouTube ad handling: hide common ad elements, auto-skip when skip button appears,
// and remove promoted/sponsored items from lists.
(function() {
  isEnabledForHost((enabled) => {
    if (!enabled) return;
    // inject CSS to hide typical ad containers
    const css = `
      .ytp-ad-module, .ytp-ad-overlay-slot, .ad-showing, .ytd-display-ad-renderer,
      ytd-promoted-sparkles-web-renderer, ytd-paid-content-badge-renderer,
      ytd-promoted-video-renderer, .ytd-compact-ad-renderer { display: none !important; visibility: hidden !important; height: 0 !important; max-height: 0 !important; }
      /* hide promoted badges in lists */
      ytd-badge-supported-renderer[overlay-text="Sponsored"] { display: none !important; }
    `;
    const st = document.createElement('style');
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);

    function removePromotedFromLists() {
      // remove cards that contain "Ad" or "Sponsored"
      document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer').forEach(card => {
        try {
          const txt = card.innerText || '';
          if (/Sponsored|Ad|Promotion|Promoted|প্রায়োজনীয়|স্পন্সরড/i.test(txt)) {
            card.remove();
          }
        } catch(e){}
      });
    }

    function handlePlayerAds() {
      // hide in-player ad overlay elements
      removeBySelector('.ytp-ad-player-overlay, .ytp-ad-module, .video-ads, .ytp-ad-text, .ytp-ad-overlay-container');
      // try to auto-click skip button
      const skip = document.querySelector('.ytp-ad-skip-button.ytp-button, .ytp-ad-skip-button');
      if (skip) {
        try { skip.click(); console.log('Ad-Quiet: clicked skip'); } catch(e){}
      }
      // if midroll progress exists, try to hide ad container
      const adContainers = document.querySelectorAll('.ad-showing, .ytp-ad-related, .ytp-ad-image');
      adContainers.forEach(c => { try { c.style.display='none'; } catch(e){ } });
    }

    // watch for mutations: new ads injected
    observeMutations(() => {
      removePromotedFromLists();
      handlePlayerAds();
      // also remove by selectors often added dynamically
      removeBySelector('ytd-display-ad-renderer, ytd-promoted-sparkles-web-renderer, .ytp-ad-module, .ytd-compact-ad-renderer');
    });

    // interval fallback
    setInterval(() => {
      removePromotedFromLists();
      handlePlayerAds();
    }, 1200);
  });
})();
