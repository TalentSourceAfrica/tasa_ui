(function ($) {
  'use strict';
  // $(document).ready(function () {
  //   alert('Coming to js');
  // });
  // $(document).ready(function() {
  //   !(function() {
  //     var t = (window.driftt = window.drift = window.driftt || []);
  //     if (!t.init) {
  //       if (t.invoked)
  //         return void (
  //           window.console &&
  //           console.error &&
  //           console.error('Drift snippet included twice.')
  //         );
  //       (t.invoked = !0),
  //         (t.methods = [
  //           'identify',
  //           'config',
  //           'track',
  //           'reset',
  //           'debug',
  //           'show',
  //           'ping',
  //           'page',
  //           'hide',
  //           'off',
  //           'on'
  //         ]),
  //         (t.factory = function(e) {
  //           return function() {
  //             var n = Array.prototype.slice.call(arguments);
  //             return n.unshift(e), t.push(n), t;
  //           };
  //         }),
  //         t.methods.forEach(function(e) {
  //           t[e] = t.factory(e);
  //         }),
  //         (t.load = function(t) {
  //           var e = 3e5,
  //             n = Math.ceil(new Date() / e) * e,
  //             o = document.createElement('script');
  //           (o.type = 'text/javascript'),
  //             (o.async = !0),
  //             (o.crossorigin = 'anonymous'),
  //             (o.src = 'https://js.driftt.com/include/' + n + '/' + t + '.js');
  //           var i = document.getElementsByTagName('script')[0];
  //           i.parentNode.insertBefore(o, i);
  //         });
  //     }
  //   })();
  //   drift.SNIPPET_VERSION = '0.3.1';
  //   drift.load('epf4ps3t7zx6');
  // });

  // Mouse pointer
  // $('.wrapper-main').prepend("<div class='mouse-pointer'></div>");

  // function showCoords(event) {
  //   var x = event.pageX;
  //   var y = event.pageY;
  //   var follower = $('.mouse-pointer');
  //   follower.css({
  //     left: x + -12.5 + 'px',
  //     top: y + -12.5 + 'px'
  //   });
  // }

  // $(window).on('mousemove', function(event) {
  //   showCoords(event);
  // });

  // $('li, a, button, input, textarea, .navbar-toggles').mouseenter(function() {
  //   $('.mouse-pointer').css('opacity', '0');
  //   $('li, a, button, input, textarea, .navbar-toggles').mouseleave(function() {
  //     $('.mouse-pointer').css('opacity', '1');
  //   });
  // });

  // fixed-menu
  // $(window).on('scroll', function() {
  //   if ($(window).scrollTop() > 50) {
  //     $('.top-nav').addClass('fixed-menu');
  //   } else {
  //     $('.top-nav').removeClass('fixed-menu');
  //   }
  // });

  // blog-slider
  // $('#blog-slider').owlCarousel({
  //   items: 3,
  //   itemsDesktop: [1199, 3],
  //   itemsDesktopSmall: [1000, 2],
  //   itemsMobile: [650, 1],
  //   navigationText: false,
  //   autoPlay: true
  // });

  // customers-slider
  // $('#customers-slider').owlCarousel({
  //   items: 5,
  //   itemsDesktop: [1199, 5],
  //   itemsDesktopSmall: [1000, 3],
  //   itemsMobile: [650, 2],
  //   navigationText: false,
  //   autoPlay: true
  // });

  $('.parallax100').parallax100();
})(window.jQuery);
