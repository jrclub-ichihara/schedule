/* 下のメニュー（全ページ）：予定表・お休み・選手・アルバム。
   ハコトトに移ったときは、5つ目に「お金」が増えるだけ（順番と名前は変えない）。予定表のページでも読み込む */
(function () {
  if (document.querySelector('nav.bnav')) return;
  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var cur = { 'index.html': 0, '': 0, 'absence.html': 1, 'roster.html': 2, 'album.html': 3, 'upload.html': 3, 'faces.html': 3 }[file];
  var I = {
    cal: '<path d="M4 5h16v15H4zM4 10h16M8.5 3v4M15.5 3v4"/>',
    rest: '<path d="M3 18v-7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7M3 15h18M7 12h4"/>',
    team: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 3-5 6-5s5.4 1.6 6 5M16 5.2a3.2 3.2 0 0 1 0 5.6M18 15.3c1.7.7 2.7 2.2 3 4.7"/>',
    photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m4 18 5-5 4 4 3-3 4 4"/>'
  };
  var items = [['./', 'cal', '予定表'], ['absence.html', 'rest', 'お休み'], ['roster.html', 'team', '選手'], ['album.html', 'photo', 'アルバム']];
  var el = document.createElement('nav');
  el.className = 'bnav'; el.setAttribute('aria-label', 'メニュー');
  el.innerHTML = '<div class="bnav-in">' + (cur == null ? '' : '<i class="bar" style="transform:translateX(' + cur * 100 + '%)"></i>') +
    items.map(function (it, i) { return '<a href="' + it[0] + '"' + (i === cur ? ' aria-current="page"' : '') + '><svg viewBox="0 0 24 24" aria-hidden="true">' + I[it[1]] + '</svg>' + it[2] + '</a>'; }).join('') + '</div>';
  document.body.appendChild(el);
  document.body.classList.add('has-nav');
})();

/* 予定表以外のページで使う：見出しのロゴを線で描くロゴにして、開いたときのロゴの動きを出す（club.js のあとに読み込む） */
(function () {
  var img = document.querySelector('.hero .in > img');
  if (!img || !window.TEAM) return;
  var box = document.createElement('div');
  box.className = 'logo'; box.setAttribute('role', 'img'); box.setAttribute('aria-label', 'Jr.CLUB市原のロゴ');
  box.innerHTML = TEAM.lockup();
  img.parentNode.replaceChild(box, img);
  /* その日はじめては長いほう、同じ日の2回目からは短いほう、同じ訪問の中ではもう出さない（予定表と共通） */
  var seen = null, day = new Date().toDateString(), how = '';
  try { seen = sessionStorage.getItem('jr_intro'); sessionStorage.setItem('jr_intro', '1'); } catch (e) {}
  if (!seen) { var last = ''; try { last = localStorage.getItem('jr_intro_day') || ''; localStorage.setItem('jr_intro_day', day); } catch (e) {} how = last === day ? 'short' : 'full'; }
  TEAM.intro(box, how);
})();
