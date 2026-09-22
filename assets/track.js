/* อุ่นใจไอที — Google Analytics 4 + นับคลิกปุ่มติดต่อ (ใช้ร่วมกันทุกหน้า)
   event: contact_click
     method    = line | call | facebook
     placement = nav | nav-mobile | hero | contact | sticky           */
(function () {
  var GA_ID = 'G-YNR3SYYQY2';

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }

  if (GA_ID) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var method =
      href.indexOf('tel:') === 0 ? 'call' :
      /lin\.ee|line\.me/.test(href) ? 'line' :
      /facebook\.com/.test(href) ? 'facebook' : null;
    if (!method) return;
    gtag('event', 'contact_click', {
      method: method,
      placement: a.getAttribute('data-cta') || 'page',
      page_path: location.pathname
    });
  }, true);
})();
