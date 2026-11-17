/* =====================================================================
   Jr.CLUB市原 動きの部品（ハコトト「チーム版」の team.js と同じもの。説明は docs/design.md）
   ※ hacototo-app の prototype/team/team.js を直したら、ここにも同じ変更を入れる
   ・TEAM.calm        … 動きを止めるべき端末か（動きを減らす設定／通信量の節約）
   ・TEAM.hero(canvas) … 上の動く絵（ボール・コートの線・光）。選手や子どもの姿は描かない
   ・TEAM.go(fn)       … 画面を切り替えるときの動き
   ・TEAM.seg(el)      … 切り替えボタンの「すべる枠」
   ・TEAM.sheet / TEAM.toast / TEAM.fold … 下から出る案内・ひとこと・開閉
   ===================================================================== */
var TEAM = (function () {
  var mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var conn = navigator.connection || {};
  /* 動きを止める条件：動きを減らす設定／通信量の節約（データセーバー）／とても遅い回線 */
  var calm = mq.matches || conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || '');
  if (calm) document.documentElement.classList.add('calm');

  /* ---------- 上の動く絵 ---------- */
  function hero(cv) {
    var x = cv.getContext('2d'), W = 0, H = 0, raf = 0, t0 = 0, last = 0, seen = true, first = true;
    var css = getComputedStyle(cv), brand = (css.getPropertyValue('--brand') || '#ffeb3b').trim();
    var trail = [], sparks = [], streaks = [], hit = false;
    for (var i = 0; i < 7; i++) streaks.push({ y: Math.random(), s: 0.25 + Math.random() * 0.5, p: Math.random(), l: 0.12 + Math.random() * 0.2 });
    function rgba(a) { /* #rrggbb → rgba */
      var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(brand); if (!m) return 'rgba(255,235,59,' + a + ')';
      return 'rgba(' + parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) + ',' + a + ')';
    }
    function size() {
      var r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d); x.setTransform(d, 0, 0, d, 0, 0);
    }
    function path(p, fn) { /* 線を少しずつ描く（p=0〜1） */
      x.beginPath(); fn(); x.setLineDash(p >= 1 ? [] : [2600 * p, 2600]); x.stroke(); x.setLineDash([]);
    }
    function court(p) {
      /* 床を斜め上から見た形にゆがめて、コートの線を描く */
      x.save();
      x.transform(1, 0, -0.62, 0.42, W * 0.5, H * 0.42);
      var u = Math.max(W, 420) / 420;
      x.lineWidth = 2.2; x.strokeStyle = rgba(0.34); x.lineJoin = 'round';
      path(p, function () { x.rect(-260 * u, 0, 520 * u, 330 * u); });                                  /* 外の線 */
      path(p, function () { x.rect(-58 * u, 0, 116 * u, 150 * u); });                                   /* ゴール下の四角 */
      path(p, function () { x.arc(0, 150 * u, 58 * u, 0, Math.PI); });                                  /* フリースローの円 */
      path(p, function () { x.moveTo(-205 * u, 0); x.lineTo(-205 * u, 40 * u); x.arc(0, 40 * u, 205 * u, Math.PI, 0, true); x.lineTo(205 * u, 0); }); /* 3Pライン */
      path(p, function () { x.arc(0, 330 * u, 62 * u, Math.PI, 0); });                                   /* センターサークル */
      x.restore();
    }
    function ball(bx, by, r, ang, a) {
      x.save(); x.globalAlpha = a; x.translate(bx, by);
      var g = x.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
      g.addColorStop(0, '#fff8b0'); g.addColorStop(0.45, brand); g.addColorStop(1, '#b58a00');
      x.shadowColor = rgba(0.7); x.shadowBlur = r * 1.1;
      x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, 6.3); x.fill(); x.shadowBlur = 0;
      x.rotate(ang); x.strokeStyle = 'rgba(10,10,9,.82)'; x.lineWidth = Math.max(1.2, r * 0.09);
      x.beginPath(); x.moveTo(-r, 0); x.lineTo(r, 0); x.moveTo(0, -r); x.lineTo(0, r); x.stroke();
      x.beginPath(); x.arc(-r * 1.25, 0, r * 0.95, -0.82, 0.82); x.stroke();
      x.beginPath(); x.arc(r * 1.25, 0, r * 0.95, Math.PI - 0.82, Math.PI + 0.82); x.stroke();
      x.restore();
    }
    function hoop(hx, hy, rw, sw) { /* ボード・リング・ネット（sw=ゆれ） */
      x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2;
      x.strokeRect(hx - rw * 0.2, hy - rw * 1.5, rw * 2.1, rw * 1.45);
      x.strokeStyle = 'rgba(255,255,255,.3)'; x.strokeRect(hx + rw * 0.35, hy - rw * 0.75, rw, rw * 0.62);
      x.strokeStyle = rgba(0.5); x.lineWidth = 1.3;
      for (var i = 0; i <= 6; i++) { var f = i / 6, tx = hx - rw + f * rw * 2, bxx = hx - rw * 0.52 + f * rw * 1.04 + sw * (0.5 + f);
        x.beginPath(); x.moveTo(tx, hy); x.quadraticCurveTo((tx + bxx) / 2 + sw, hy + rw * 0.7, bxx, hy + rw * 1.25 + Math.abs(sw) * 0.6); x.stroke(); }
      x.strokeStyle = brand; x.lineWidth = 3.2; x.shadowColor = rgba(0.9); x.shadowBlur = 12;
      x.beginPath(); x.ellipse(hx, hy, rw, rw * 0.26, 0, 0, 6.3); x.stroke(); x.shadowBlur = 0;
    }
    function draw(t) {
      x.clearRect(0, 0, W, H);
      x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      /* 光：ゆっくり動くスポットライト */
      var lx = W * (0.55 + 0.25 * Math.sin(t * 0.35)), g = x.createRadialGradient(lx, -H * 0.2, 0, lx, -H * 0.2, H * 1.9);
      g.addColorStop(0, rgba(0.2)); g.addColorStop(0.5, rgba(0.05)); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      court(first ? Math.min(1, t / 1.5) : 1);
      /* スピード線 */
      x.lineCap = 'round';
      streaks.forEach(function (s) {
        var p = (s.p + t * s.s * 0.22) % 1.4 - 0.2, sx = p * W, sy = s.y * H, len = s.l * W;
        var lg = x.createLinearGradient(sx - len, 0, sx, 0); lg.addColorStop(0, rgba(0)); lg.addColorStop(1, rgba(0.2));
        x.strokeStyle = lg; x.lineWidth = 1.6; x.beginPath(); x.moveTo(sx - len, sy + len * 0.18); x.lineTo(sx, sy); x.stroke();
      });
      /* シュート：6.4秒で1回。弧を描いて、リングを通る */
      var hx = W * 0.85, hy = H * 0.36, rw = Math.max(15, H * 0.1), r = rw * 0.72;
      var c = (t + 5.3) % 6.4, T = 1.25, sw = 0;
      if (c > T && c < T + 1.3) sw = Math.sin((c - T) * 16) * rw * 0.22 * Math.exp(-(c - T) * 3);
      hoop(hx, hy, rw, sw);
      if (c < T) {
        var u = c / T, e = u * u * (3 - 2 * u) * 0.35 + u * 0.65;
        var ax = W * 0.1, ay = H * 1.05, cx = W * 0.44, cy = -H * 0.72;
        var bx = (1 - e) * (1 - e) * ax + 2 * (1 - e) * e * cx + e * e * hx, by = (1 - e) * (1 - e) * ay + 2 * (1 - e) * e * cy + e * e * (hy - r * 0.2);
        trail.push({ x: bx, y: by }); if (trail.length > 12) trail.shift();
        trail.forEach(function (p, i) { x.fillStyle = rgba(0.035 * i); x.beginPath(); x.arc(p.x, p.y, r * (0.35 + 0.05 * i), 0, 6.3); x.fill(); });
        ball(bx, by, r, t * 7, 1);
        hit = false;
      } else if (c < T + 0.6) {
        var d = (c - T) / 0.6; trail.length = 0;
        if (!hit) { hit = true; for (var k = 0; k < 16; k++) { var an = Math.random() * 6.3; sparks.push({ x: hx, y: hy, vx: Math.cos(an) * (60 + Math.random() * 150), vy: Math.sin(an) * (40 + Math.random() * 110) - 30, l: 1 }); } }
        ball(hx + sw * 0.4, hy + d * d * H * 0.75, r * (1 - d * 0.12), t * 7, 1 - d * 0.85);
        /* ロゴと同じ六角の輪が、リングから広がる */
        for (var q = 0; q < 2; q++) { var rr = rw * (1.2 + (d + q * 0.25) * 4.2); x.strokeStyle = rgba(Math.max(0, 0.55 * (1 - d) - q * 0.2)); x.lineWidth = 2 - q;
          x.beginPath(); for (var v = 0; v < 6; v++) { var va = Math.PI / 6 + v * Math.PI / 3; x[v ? 'lineTo' : 'moveTo'](hx + Math.cos(va) * rr, hy + Math.sin(va) * rr); } x.closePath(); x.stroke(); }
        /* 入った瞬間の光 */
        x.fillStyle = rgba(0.16 * (1 - d)); x.beginPath(); x.moveTo(W * (d * 1.6 - 0.5), 0); x.lineTo(W * (d * 1.6 - 0.3), 0); x.lineTo(W * (d * 1.6 - 0.55), H); x.lineTo(W * (d * 1.6 - 0.75), H); x.fill();
      }
      /* 火花 */
      for (var j = sparks.length - 1; j >= 0; j--) { var s = sparks[j]; s.l -= 0.03; if (s.l <= 0) { sparks.splice(j, 1); continue; }
        s.x += s.vx * 0.016; s.y += s.vy * 0.016; s.vy += 4;
        x.strokeStyle = rgba(s.l); x.lineWidth = 2; x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x - s.vx * 0.05, s.y - s.vy * 0.05); x.stroke(); }
      /* 文字が読めるよう、左を少し暗くする */
      var sh = x.createLinearGradient(0, 0, W * 0.75, 0); sh.addColorStop(0, 'rgba(0,0,0,.78)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = sh; x.fillRect(0, 0, W, H);
    }
    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (now - last < 30) return; /* 1秒に約30コマまで（電池と発熱をおさえる） */
      last = now; if (!t0) t0 = now;
      var t = (now - t0) / 1000; if (t > 1.6) first = false;
      draw(t);
    }
    function start() { if (!W) size(); if (!raf && seen && !document.hidden && !calm) raf = requestAnimationFrame(loop); }
    function stop() { cancelAnimationFrame(raf); raf = 0; }
    size();
    if (calm) { first = false; draw(5.9); /* 止まった1枚：線は描き終わり、ボールは弧の途中 */ }
    else {
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; seen ? start() : stop(); }).observe(cv); /* 見えていないときは止める */
      document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
      start();
    }
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); if (calm) draw(5.9); }, 120); });
    return { stop: stop, start: start };
  }

  /* ---------- 画面の切り替え ---------- */
  function go(fn) {
    if (calm || !document.startViewTransition) { fn(); return; }
    var vt = document.startViewTransition(fn), no = function () {}; /* 続けて押されたときの「とばした」という知らせは無視する */
    vt.ready.catch(no); vt.finished.catch(no);
  }

  /* ---------- 切り替えボタンの「すべる枠」 ---------- */
  function seg(el) {
    var ind = el.querySelector('.ind'); if (!ind) { ind = document.createElement('i'); ind.className = 'ind'; el.appendChild(ind); }
    function place() { var on = el.querySelector('[aria-selected="true"]'); if (!on) { ind.style.display = 'none'; return; }
      ind.style.display = ''; ind.style.width = on.offsetWidth + 'px'; ind.style.transform = 'translateX(' + on.offsetLeft + 'px)'; }
    el.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || b.getAttribute('aria-selected') === 'true') return;
      [].forEach.call(el.querySelectorAll('button'), function (o) { o.setAttribute('aria-selected', o === b ? 'true' : 'false'); });
      place(); el.dispatchEvent(new CustomEvent('seg', { detail: b.dataset.v })); });
    addEventListener('resize', place); requestAnimationFrame(place); setTimeout(place, 300);
    return place;
  }

  /* ---------- 下から出る案内 ---------- */
  var bg, sh;
  function sheet(html) {
    if (!bg) { bg = document.createElement('div'); bg.className = 'sheet-bg'; sh = document.createElement('div'); sh.className = 'sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true');
      document.body.appendChild(bg); document.body.appendChild(sh); bg.addEventListener('click', closeSheet);
      addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); }); }
    sh.innerHTML = '<div class="grip"></div><div class="sheet-in">' + html + '</div>';
    requestAnimationFrame(function () { bg.classList.add('on'); sh.classList.add('on'); var f = sh.querySelector('button,a,input'); if (f) f.focus({ preventScroll: true }); });
    return sh;
  }
  function closeSheet() { if (bg) { bg.classList.remove('on'); sh.classList.remove('on'); } }

  var tEl, tT;
  function toast(msg) {
    if (!tEl) { tEl = document.createElement('div'); tEl.className = 'toast'; tEl.setAttribute('role', 'status'); document.body.appendChild(tEl); }
    tEl.textContent = msg; tEl.classList.add('on'); clearTimeout(tT); tT = setTimeout(function () { tEl.classList.remove('on'); }, 2200);
  }

  /* 開閉（試合を押すと詳しく）：<button class="game-btn" aria-expanded> の次の .fold を開く */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.game-btn,[data-fold]'); if (!b) return;
    var f = b.nextElementSibling, open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', open); if (f) f.classList.toggle('open', open);
  });

  /* 数字がふえていく動き */
  function count(el, to, pre) {
    if (calm) { el.textContent = (pre || '') + to.toLocaleString('ja-JP'); return; }
    var s = performance.now(); (function f(n) { var p = Math.min(1, (n - s) / 700), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = (pre || '') + v.toLocaleString('ja-JP'); if (p < 1) requestAnimationFrame(f); })(s);
  }


  /* =====================================================================
     ロゴ（Jr.CLUB市原）。画像ではなく線で描くので、どの大きさでもくっきり出る。
     形は、クラブのロゴの動画から取り出したもの。色は team.css の --brand に合わせる。
     ===================================================================== */
  var LOGO_W = '15,145 15,405 240,535 465,405 465,296 402,332 401,369 242,461 78,368 78,182 174,126 109,90'; /* 白い六角 */
  var LOGO_Y = '242,15 176,51 401,182 195,303 193,232 130,195 130,349 186,381 465,220 465,144';               /* 黄色いチェック */
  var LOGO_HEX = '240,15 465,145 465,405 240,535 15,405 15,145';
  var LOGO_WORD = ["M-19.8 588.5 -19 695 -20.5 697.5 -4.8 697.8 -6.2 693.5 -6.2 592.8 -4.8 589Z", "M26 588.5 18.5 595.5 18.5 690.8 25.2 697.8 59.5 697.8 66 691.2 66 671 67 667.5 52 667.8 53 670.2 52.2 685 31.5 684.2 31.5 602.5 32.2 601.5 52.2 601.5 53.2 602.8 53.2 614.5 51.8 618.5 67 619 66 615.2 66 595.5 59 588.5Z", "M91.8 588.5 92.8 592 92.8 694.2 91.2 697.5 107 697.8 105.8 695.2 105.5 650.5 126.5 649.8 127.2 693.8 126 697.8 141.5 697.8 140.2 694.8 140.2 591.8 141.5 589 126 589 127.2 592.2 127 636.2 106.2 636.8 105.8 591 107 588.8Z", "M165.8 588.5 167 592.2 167 694.2 165.2 697.5 181 697.8 179.8 695.2 179.8 591.2 181 588.8Z", "M205.5 588.5 206.5 592.5 206.5 694 205 697.5 221 697.5 219.5 694 219.8 650 240.2 649.8 241 695 239.5 697.5 255.2 697.8 253.8 694.2 253.8 592.5 255.2 588.5 239.8 588.8 241 591.5 240.2 636.8 219.8 636.2 219.5 592 220.8 588.8Z", "M302.2 588.5 302 597 282 691.5 279.2 697.5 296 697.8 295 691.5 309 625.2 310.2 623.2 320 668.8 303.5 670.2 309.8 682.8 323.2 683.5 325 691 324.2 697.8 340.5 697.8 337.8 690.5 317.8 596.2 318.2 588.8Z", "M363.5 588.5 364.5 591.8 364.5 694.8 363.2 697.8 379 697.5 377.8 695.5 377.5 602.8 378.5 601.5 399 602 399.2 649.2 398 650.5 382.5 651 402 691.5 402.8 695.2 401.5 697.5 418.8 697.8 403.5 665 412 656.8 411.8 594.8 404.8 588.5Z", "M462.5 588.5 462.8 594.8 443 688.5 439.5 697.5 456.5 697.5 455.2 695 455.8 689.2 469 626.5 470.5 623.2 480.2 668.8 464.5 669.2 464 670.8 469.8 682.5 483.5 683.2 485.2 691.8 484.5 697.8 501 697.8 497.8 689.2 478 596.2 478.5 588.8Z"]; /* ICHIHARA の8文字 */
  function word() { return '<g class="lg-word">' + LOGO_WORD.map(function (d, i) { return '<path class="lg-l" style="--i:' + i + '" d="' + d + '"/>'; }).join('') + '</g>'; }
  /* ロゴだけ（mark）／文字つき（lockup） */
  function mark(cls) { return '<svg class="lg ' + (cls || '') + '" viewBox="0 0 480 550" aria-hidden="true"><polygon class="lg-w" points="' + LOGO_W + '"/><polygon class="lg-y" points="' + LOGO_Y + '"/></svg>'; }
  function lockup(cls) { return '<svg class="lg ' + (cls || '') + '" viewBox="-30 0 540 715" role="img" aria-label="Jr.CLUB市原のロゴ"><polygon class="lg-w" points="' + LOGO_W + '"/><polygon class="lg-y" points="' + LOGO_Y + '"/>' + word() + '</svg>'; }
  /* 完了のしるし：白い六角が出て、黄色いチェックが飛んできて「カチッ」とはまる */
  function markDone() {
    return '<svg class="lg lg-done" viewBox="-150 -130 780 810" aria-hidden="true"><polygon class="lg-ring r1" points="' + LOGO_HEX + '"/><polygon class="lg-ring r2" points="' + LOGO_HEX + '"/>' +
      '<polygon class="lg-w" points="' + LOGO_W + '"/><polygon class="lg-y" points="' + LOGO_Y + '"/></svg>';
  }
  /* 読み込み中：六角の線がぐるっと走る */
  function loader() { return '<svg class="lg lg-load" viewBox="-40 -40 560 630" role="img" aria-label="読み込み中"><polygon class="lg-ring" points="' + LOGO_HEX + '"/><polygon class="lg-w" points="' + LOGO_W + '"/><polygon class="lg-y" points="' + LOGO_Y + '"/></svg>'; }

  /* ---------- 開いたときのロゴの動き ----------
     full ＝その日はじめて開いたとき（約2.6秒）：パーツが飛んできて、ぶつかって光り、文字が出て、上のロゴの場所へ飛んでいく
     short＝同じ日の2回目から（約1秒）：光って、すぐ上へ
     動きを止める端末では出さない。画面を押すと、すぐ飛ばせる。 */
  function intro(target, mode) {
    if (calm || !mode) return;
    var ghosts = function (pts, cls) { return [3, 2, 1].map(function (k) { return '<g class="in-g g' + k + '"><polygon class="' + cls + '" points="' + pts + '"/></g>'; }).join(''); };
    var sparks = ''; for (var i = 0; i < 18; i++) { var a = i * 20 + Math.random() * 14, l = 26 + Math.random() * 44, r = 300 + Math.random() * 40;
      sparks += '<g transform="rotate(' + a.toFixed(1) + ' 240 275)"><line class="in-sp" style="--d:' + (Math.random() * 0.12).toFixed(2) + 's" x1="240" y1="' + (275 - r) + '" x2="240" y2="' + (275 - r - l).toFixed(0) + '"/></g>'; }
    var el = document.createElement('div'); el.className = 'intro ' + mode; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="in-glow"></div><div class="in-flash"></div><div class="in-stage"><svg class="lg in-logo" viewBox="-30 0 540 715">' +
      '<defs><clipPath id="inClip"><polygon points="' + LOGO_W + '"/><polygon points="' + LOGO_Y + '"/></clipPath></defs>' +
      '<polygon class="lg-ring r1" points="' + LOGO_HEX + '"/><polygon class="lg-ring r2" points="' + LOGO_HEX + '"/>' + sparks +
      '<g class="in-w">' + ghosts(LOGO_W, 'lg-w') + '<polygon class="lg-w" points="' + LOGO_W + '"/></g>' +
      '<g class="in-y">' + ghosts(LOGO_Y, 'lg-y') + '<polygon class="lg-y" points="' + LOGO_Y + '"/></g>' +
      '<g clip-path="url(#inClip)"><rect class="in-shine" x="-260" y="-40" width="170" height="640" transform="skewX(-24)"/></g>' + word() + '</svg>' +
      '<div class="in-sub"><i></i><b>Jr.CLUB 市原</b><span>BASKETBALL CLUB</span></div></div>';
    document.body.appendChild(el);
    var gone = false, timer = setTimeout(leave, mode === 'full' ? 2650 : 1050);
    el.addEventListener('click', leave);
    function leave() {
      if (gone) return; gone = true; clearTimeout(timer);
      var st = el.querySelector('.in-logo'), a = st.getBoundingClientRect(), b = target && target.getBoundingClientRect();
      el.classList.add('bye');
      if (b && b.width && st.animate) { /* ロゴが、上のロゴの場所へ飛んでいく */
        var s = b.height / a.height, dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
        st.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }], { duration: 560, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' });
      }
      setTimeout(function () { el.remove(); if (target) { target.classList.remove('pulse'); void target.offsetWidth; target.classList.add('pulse'); } }, 580);
    }
  }


  return { calm: calm, hero: hero, go: go, seg: seg, sheet: sheet, closeSheet: closeSheet, toast: toast, count: count,
    mark: mark, lockup: lockup, markDone: markDone, loader: loader, intro: intro };
})();
