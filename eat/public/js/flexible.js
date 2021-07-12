(function (resolving) {
  var n = window,
    e = n.document,
    t = e.documentElement,
    i = resolving,
    d = i / 100,
    o = 'orientationchange' in n ? 'orientationchange' : 'resize',
    a = function () {
      var w = t.clientWidth || 320;
      w > resolving && (w = resolving);
      t.style.fontSize = w / d + 'px';
    };
  e.addEventListener && (n.addEventListener(o, a, !1), e.addEventListener('DOMContentLoaded', a, !1));
})(375);
