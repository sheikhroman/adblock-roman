// Instagram heuristic ad removal: hide sponsored posts in feed/reels and suggested ads
(function() {
  isEnabledForHost((enabled) => {
    if (!enabled) return;

    function scanAndRemove() {
      // posts (articles) often contain "Sponsored" near the top
      document.querySelectorAll('article, div').forEach(el => {
        try {
          if (el.dataset.__adq) return;
          el.dataset.__adq = '1';
          const txt = (el.innerText || '');
          if (/Sponsored|Sponsored for you|প্রায়|স্পন্সরড|Sponsored·/i.test(txt)) {
            const post = el.closest('article') || el;
            tryRemove(post);
          }
        } catch(e){}
      });

      // hide reels/sponsored UI
      document.querySelectorAll('div').forEach(d => {
        if (d.dataset.__adq2) return;
        try {
          d.dataset.__adq2 = '1';
          if (d.innerText && /Sponsored|Suggested for you|Sponsored for you/i.test(d.innerText)) d.remove();
        } catch(e){}
      });
    }

    observeMutations(() => scanAndRemove());
    setInterval(scanAndRemove, 1300);
  });
})();
