!(function (e) {
  var t = {};
  function o(r) {
    if (t[r]) return t[r].exports;
    var n = (t[r] = { i: r, l: !1, exports: {} });
    return e[r].call(n.exports, n, n.exports, o), (n.l = !0), n.exports;
  }
  (o.m = e),
    (o.c = t),
    (o.d = function (e, t, r) {
      o.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
    }),
    (o.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (o.t = function (e, t) {
      if ((1 & t && (e = o(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if ((o.r(r), Object.defineProperty(r, 'default', { enumerable: !0, value: e }), 2 & t && 'string' != typeof e))
        for (var n in e)
          o.d(
            r,
            n,
            function (t) {
              return e[t];
            }.bind(null, n)
          );
      return r;
    }),
    (o.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return o.d(t, 'a', t), t;
    }),
    (o.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (o.p = '/'),
    o((o.s = 84));
})({
  84: function (e, t, o) {
    e.exports = o(85);
  },
  85: function (e, t, o) {
    'use strict';
    o.r(t);
    o(86), o(87), o(88), o(89), o(90);
  },
  86: function (e, t) {
    !(function () {
      'use strict';
      domFactory.handler.autoInit(), $('[data-toggle="tooltip"]').tooltip();
    })();
  },
  87: function (e, t) {
    !(function () {
      'use strict';
      $('[data-perfect-scrollbar]').each(function () {
        const e = $(this),
          t = new PerfectScrollbar(this, {
            wheelPropagation:
              void 0 !== e.data('perfect-scrollbar-wheel-propagation') && e.data('perfect-scrollbar-wheel-propagation'),
            swipeEasing: !1,
          });
        Object.defineProperty(this, 'PerfectScrollbar', { configurable: !0, writable: !1, value: t });
      });
    })();
  },
  88: function (e, t) {
    !(function () {
      'use strict';
      window.addEventListener('load', function () {
        $('.preloader').fadeOut(), domFactory.handler.upgradeAll();
      });
    })();
  },
  89: function (e, t) {},
  90: function (e, t) {
    !(function () {
      'use strict';
      var e = document.querySelectorAll('[data-toggle="sidebar"]');
      (e = Array.prototype.slice.call(e)).forEach(function (e) {
        e.addEventListener('click', function (e) {
          var t = e.currentTarget.getAttribute('data-target') || '#default-drawer',
            o = document.querySelector(t);
          o && o.mdkDrawer.toggle();
        });
      }),
        $('.sidebar .collapse').on('show.bs.collapse', function (e) {
          $(this).closest('.sidebar-menu').find('.open').find('.collapse').collapse('hide'),
            $(this).closest('li').addClass('open');
        }),
        $('.sidebar .collapse').on('hidden.bs.collapse', function (e) {
          $(this).closest('li').removeClass('open');
        }),
        $('.sidebar .collapse').on(
          'show.bs.collapse hide.bs.collapse shown.bs.collapse hidden.bs.collapse',
          function () {
            const e = $(this).closest('[data-perfect-scrollbar]').get(0);
            e && void 0 !== e.PerfectScrollbar && e.PerfectScrollbar.update();
          }
        );
    })();
  },
});
