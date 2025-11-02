// Facebook heuristic ad removal: hide sponsored posts, right-rail ads, suggested posts
(function() {
  isEnabledForHost((enabled) => {
    if (!enabled) return;

    // inject CSS for some known selectors
    const css = `
      [data-pagelet^="FeedUnit_"] [data-ad-preview], [aria-label="Sponsored"],
      a[aria-label="Sponsored"], [data-testid="fbfeed_story"], [data-testid="story-subtitle"],
      [role="complementary"] ._4ikz { display: none !important; }
    `;
    const st = document.createElement('style');
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);

    function scanAndRemove() {
      // remove nodes that contain "Sponsored" in multiple languages
      const cand = document.querySelectorAll('div, span, a, section, article');
      cand.forEach(el => {
        try {
          if (el.dataset.__adq) return;
          el.dataset.__adq = '1';
          const text = (el.innerText || '').trim();
          if (!text) return;
          if (/(Sponsored|Sponsored|SPONSORED|Sponsored·|স্পন্সরড|প্রদত্ত|প্রায়|উৎসাহিত)/i.test(text)) {
            const container = el.closest('[role="article"]') || el.closest('[data-pagelet^="FeedUnit_"]') || el.closest('._5pcr');
            if (container) tryRemove(container);
            else tryRemove(el);
          }
        } catch(e){}
      });

      // remove right-rail ad boxes
      document.querySelectorAll('[aria-label="Ads"], [data-testid="ad"], [data-testid="ad_link"] , [role="complementary"] iframe, iframe[src*="ads"]').forEach(e=>e.remove());
    }

    observeMutations(() => scanAndRemove());
    setInterval(scanAndRemove, 1500);
  });
})();
