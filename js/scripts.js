(function(window, document, undefined) {
  console.log('hello world!');

  $.euCookieLaw({
    message: 'En cumplimiento con Ley 34/2002, de servicios de la sociedad de la información te recordamos que al navegar por este sitio estás aceptando el uso de cookies propias y ajenas.',
    acceptButtonText: 'Aceptar',
    declineButtonText: '',
    readMoreButtonText: 'Mas información',
    readMoreLink: '/politica-de-cookies/',
    position: 'bottom',
    cookieDomain: '',
    cookieNames: ['__utma', '__utmb', '__utmc', '__utmz']
});

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $(function() {
    $('a.page-scroll').bind('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top
      }, 1500, 'easeInOutExpo');
      event.preventDefault();
    });
  });
})(window, document);
