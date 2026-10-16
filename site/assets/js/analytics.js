// Google Analytics 4. Only loaded when SITE.gaId is set in site/content/site.mjs.
(() => {
  const id = document.currentScript && document.currentScript.dataset.ga;
  if (!id) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);
})();
