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
