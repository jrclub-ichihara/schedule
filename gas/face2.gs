/**
 * Jr.CLUB市原 顔の見分け（2026/11 改良版）
 *
 * 【入れ方】
 *  GASのエディタで「ファイル ＋」→「スクリプト」→ 名前を「顔の見分け」にして、このファイルの中身を全部貼り付けて保存。
 *  ※このファイルは、ファイル一覧の「いちばん下」に置いてください（コード.gs より下）。
 *    同じ名前の関数は、下にあるファイルのほうが使われるので、コード.gs は書き換えなくてOKです。
 *  貼ったら、上の関数の選択で「faceSetupCheck」を選んで「実行」→ 実行ログに「OK」が並べば準備完了。
 *  最後に「デプロイ」→「デプロイを管理」→ 鉛筆 →「バージョン：新バージョン」→「デプロイ」（URLは変わりません）。
 *
 * 【変わること】
 *  ・見本：1人1つの平均 →「名前が確定した顔ぜんぶ」（人が付けた顔を優先、1人20個まで）
 *  ・名前を直した顔は、すぐ次から見本になる
 *  ・自信がない顔は「候補（◯◯？）」として保存（「顔データ」シートの G〜J列：候補・自信・横顔・顔の幅）
 *  ・新しい「まとめて名前付け」ページ（faces.html）用の関数：getFaceBank / setFaceNames / setFaceExclude
 *  ・「この子は顔の自動の見分けから外す」設定（スクリプトのプロパティ FACE_EXCLUDE に保存）
 *  顔の見分けの計算はこれまでどおりスマホ・PCの中だけ。GASは数字と名前を保存して返すだけです。
 */

const FACE2_RPC = ['getFaceBank', 'setFaceNames', 'setFaceExclude'];
const FACE2_EXTRA_HEAD = ['候補', '自信', '横顔', '顔の幅']; // 顔データシートの G〜J列
const FACE2_REF_MAX = 20;    // 1人あたりの見本の数（多すぎると古いスマホで重くなる）
const FACE2_BANK_MAX = 500;  // まとめて名前付けページに出す「名前のない顔」の数（新しい順）
const FACE2_NEW_PAGE = 'https://jrclub-ichihara.github.io/schedule/faces.html';

/** 新サイトからの呼び出し口（コード.gs の rpc_ に、新しい関数を足したもの） */
function rpc_(body) {
  const out = r => ContentService.createTextOutput(JSON.stringify(r)).setMimeType(ContentService.MimeType.JSON);
  try {
    if (RPC_OK.concat(FACE2_RPC).indexOf(body.rpc) < 0) throw new Error('使えない操作です');
    return out({ ok: 1, r: globalThis[body.rpc].apply(null, Array.isArray(body.args) ? body.args : []) });
  } catch (err) { return out({ ok: 0, e: String(err && err.message || err) }); }
}

/* ===== 共通 ===== */

/** 「自動の見分けから外す」子の名前の一覧 */
function faceExclude_() {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('FACE_EXCLUDE') || '[]'); } catch (e) { return []; }
}

/** 顔データシートに G〜J列の見出しを付ける */
function face2Head_() {
  const sh = faceSheet_();
  if (!sh.getRange(1, 7).getValue()) sh.getRange(1, 7, 1, FACE2_EXTRA_HEAD.length).setValues([FACE2_EXTRA_HEAD]).setFontWeight('bold');
}

/** 顔データを読む（顔の写真の列は重いので、withCrop のときだけ） */
function face2Rows_(withCrop) {
  const sh = faceSheet_(), last = sh.getLastRow();
  if (last < 2) return [];
  const n = last - 1;
  const a = sh.getRange(2, 1, n, 4).getValues();  // 顔ID・写真ID・名前・顔の特徴
  const b = sh.getRange(2, 6, n, 5).getValues();  // 付け方・候補・自信・横顔・顔の幅
  const c = withCrop ? sh.getRange(2, 5, n, 1).getValues() : null;
  const num = v => (v === '' || v == null || isNaN(Number(v))) ? -1 : Number(v);
  return a.map((r, i) => ({
    row: i + 2, id: String(r[0]), photo: String(r[1]), name: String(r[2]).trim(), d: String(r[3]),
    how: String(b[i][0]), q: String(b[i][1] || '').trim(), p: num(b[i][2]), y: num(b[i][3]), w: Number(b[i][4]) || 0,
    c: c ? String(c[i][0]) : ''
  })).filter(f => f.id);
}

function face2Vec_(d) {
  const v = String(d || '').split(',').map(Number);
  return v.length === 128 && !v.some(isNaN) ? v : null;
}

/**
 * 見本：名前が確定した顔ぜんぶ（コード.gs の「1人1つの平均」の代わり）
 *  ・人が付けた・直した顔（付け方＝手）は全部（新しい順に1人 FACE2_REF_MAX まで）
 *  ・自動で付いた顔は、自信80以上で正面に近いものだけ、すき間をうめる
 *  返す形：[{n:名前, d:[128個の数], how:'手'|'自動'}]（前の写真アップページでもそのまま使える形）
 */
function faceRefs_(faces) {
  const by = {};
  faces.slice().reverse().forEach(f => { // 新しい順
    if (!f.name || f.name === '対象外') return;
    const manual = f.how === '手';
    if (!manual && !(f.p >= 80 && f.y >= 0 && f.y < 0.4)) return;
    const v = face2Vec_(f.d);
    if (!v) return;
    const L = by[f.name] = by[f.name] || { m: [], a: [] };
    (manual ? L.m : L.a).push(v);
  });
  const out = [];
  Object.keys(by).forEach(n => {
    const L = by[n];
    L.m.slice(0, FACE2_REF_MAX).forEach(v => out.push({ n, d: v, how: '手' }));
    L.a.slice(0, Math.max(0, FACE2_REF_MAX - L.m.length)).forEach(v => out.push({ n, d: v, how: '自動' }));
  });
  return out;
}

/* ===== 写真アップページ ===== */

/** 写真アップページの最初（見本と「外す子」も返す） */
function getUpInit(pass) {
  if (!teamPassOk_(pass)) return { needPass: true };
  const today = toDate(new Date());
  const from = new Date(today.getTime() - 150 * 86400000), to = new Date(today.getTime() + 2 * 86400000);
  const ev = {};
  readEvents_().filter(e => e.date >= from && e.date <= to).forEach(e => {
    const k = ymd(e.date);
    (ev[k] = ev[k] || []).push(e.title);
  });
  const sugg = Object.keys(ev).sort().reverse().map(k => ({ ymd: String(k), title: Array.from(new Set(ev[k])).join('・') }));
  const heavy = albCache_('upinit2', () => ({ refs: faceRefs_(face2Rows_(false)), hashes: readAlbum_().map(p => p.hash).filter(Boolean) }));
  return { sugg, refs: heavy.refs, hashes: heavy.hashes, faceExclude: faceExclude_(), faceapi: FACEAPI_VER, url: webUrl_() };
}

/** 1枚保存（顔に「候補・自信・横顔・顔の幅」も保存する） */
function saveAlbumPhoto(pass, meta, full, thumb, faces) {
  albBump_();
  if (!teamPassOk_(pass)) throw new Error('パスコードが違います');
  meta = meta || {};
  const date = ymdToDate_(meta.ymd) || toDate(new Date());
  thumb = String(thumb || '');
  if (thumb.indexOf('data:image/jpeg;base64,') !== 0 || thumb.length > 200000) throw new Error('写真の形式が違います');
  const bytes = Utilities.base64Decode(String(full || ''));
  if (bytes.length > 4 * 1024 * 1024) throw new Error('写真が大きすぎます');
  const hash = String(meta.hash || '').slice(0, 80);
  const ex = {}; faceExclude_().forEach(n => { ex[n] = 1; });
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    if (hash) { const sh0 = albumSheet_(), l0 = sh0.getLastRow(); if (l0 >= 2 && sh0.getRange(2, 11, l0 - 1, 1).getValues().some(r => String(r[0]) === hash)) return { dup: true }; }
    const id = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyMMddHHmmss') + Math.floor(Math.random() * 900 + 100);
    const file = albumFolder_().createFile(Utilities.newBlob(bytes, 'image/jpeg', id + '.jpg'));
    const tf = thumbFolder_().createFile(Utilities.newBlob(Utilities.base64Decode(thumb.split(',')[1]), 'image/jpeg', id + '_t.jpg'));
    const title = String(meta.title || '').trim().slice(0, 60) || (date.getMonth() + 1) + '/' + date.getDate() + ' の写真';
    const sh = albumSheet_();
    sh.getRange(sh.getLastRow() + 1, 1, 1, ALBUM_HEAD.length).setValues([[id, file.getId(), date, title, fiscalYear_(date),
      String(meta.who || '').trim().slice(0, 30), 'f:' + tf.getId(), Math.round(Number(meta.score) || 0), '公開', new Date(), hash]]);
    const numOr = (v, lo, hi) => { const x = Number(v); return v === '' || v == null || isNaN(x) ? '' : Math.max(lo, Math.min(hi, x)); };
    const rows = (faces || []).slice(0, 40).filter(f => f && f.d && String(f.c || '').indexOf('data:image/jpeg;base64,') === 0 && String(f.c).length < 12000)
      .map((f, i) => {
        let n = String(f.n || '').slice(0, 30), q = String(f.q || '').slice(0, 30);
        if (ex[n]) n = '';  // 外す子には自動で名前を付けない
        if (ex[q] || q === n) q = '';
        return [id + '-' + (i + 1), id, n, String(f.d).slice(0, 2000), String(f.c), n ? '自動' : '',
          q, numOr(f.p, 0, 100), numOr(f.y, 0, 1), numOr(f.w, 0, 20000)];
      });
    if (rows.length) { face2Head_(); const fs = faceSheet_(); fs.getRange(fs.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows); }
    return { id };
  } finally { lock.releaseLock(); }
}

/* ===== アルバムページ ===== */

/** アルバムの1枚に写っている顔（候補「◯◯？」も返す） */
function getPhotoFaces(pass, photoId) {
  if (!teamPassOk_(pass)) throw new Error('パスコードが違います');
  const sh = faceSheet_(), last = sh.getLastRow();
  if (last < 2) return [];
  const pid = String(photoId), ab = sh.getRange(2, 1, last - 1, 2).getValues();
  const ex = {}; faceExclude_().forEach(n => { ex[n] = 1; });
  const out = [];
  ab.forEach((r, i) => {
    if (String(r[1]) !== pid) return;
    const v = sh.getRange(i + 2, 1, 1, 7).getValues()[0];
    const n = String(v[2]).trim(), q = String(v[6] || '').trim();
    out.push({ id: String(v[0]), n, c: String(v[4] || ''), how: String(v[5] || ''), q: !n && q && !ex[q] ? q : '' });
  });
  return out;
}

/** その場で「この顔は○○」に直す（候補は消す。直した顔は次から見本になる） */
function fixPhotoFace(pass, faceId, name) {
  albBump_();
  if (!teamPassOk_(pass)) throw new Error('パスコードが違います');
  name = String(name || '').replace(/^#\S*\s+/, '').trim().slice(0, 30);
  if (name && !rosterNameOk_(name)) throw new Error('選手名簿にない名前です');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const f = readFaces_().find(x => x.id === String(faceId));
    if (!f) throw new Error('顔が見つかりません');
    const sh = faceSheet_();
    if (!name && /-T\d+$/.test(f.id)) { sh.deleteRow(f.row); return true; } // 手で足した名前は行ごと消す
    sh.getRange(f.row, 3).setValue(name);
    sh.getRange(f.row, 6, 1, 2).setValues([[name ? '手' : '', '']]);
    return true;
  } finally { lock.releaseLock(); }
}

/* ===== まとめて名前付けページ（faces.html） ===== */

/** 名前のない顔（新しい順に FACE2_BANK_MAX まで）と、見本の顔 */
function getFaceBank(pass, adminPass) {
  if (!faceEditOk_(pass)) return { needPass: true };
  const hidden = {};
  readAlbum_().forEach(p => { if (p.status === '非表示') hidden[p.id] = 1; });
  const all = face2Rows_(false);
  const un = all.filter(f => !f.name && !hidden[f.photo] && face2Vec_(f.d)).slice(-FACE2_BANK_MAX);
  const faces = [];
  if (un.length) {
    const sh = faceSheet_(), first = un[0].row; // 行は上から順なので、いちばん上の行から下だけ読む
    const crops = sh.getRange(first, 5, sh.getLastRow() - first + 1, 1).getValues();
    un.forEach(f => faces.push({ id: f.id, d: f.d, n: '', q: f.q, w: f.w || 60, c: String(crops[f.row - first][0] || '') }));
  }
  faceRefs_(all).forEach(r => faces.push({ id: '', d: r.d, n: r.n, how: r.how }));
  const roster = rosterPlayers_().filter(p => !/^（例）/.test(p.name) && !isStaff_(p)).sort((a, b) => noKey(a.no) - noKey(b.no)).map(p => ({ name: p.name, no: p.no }));
  return { faces, roster, exclude: faceExclude_(), isAdmin: !!String(adminPass || '').trim() && planPassOk_(readSettings_(), adminPass) };
}

/** まとめて名前を付ける items=[{id, n}]。n は名前・「対象外」・空（名前を外す） */
function setFaceNames(pass, items) {
  albBump_();
  if (!faceEditOk_(pass)) throw new Error('パスコードが違います');
  const ok = {}; rosterPlayers_().forEach(p => { ok[p.name] = 1; }); ok['対象外'] = 1;
  const want = {};
  (items || []).slice(0, 3000).forEach(x => {
    const n = String(x && x.n || '').replace(/^#\S*\s+/, '').trim().slice(0, 30);
    if (n && !ok[n]) throw new Error('選手名簿にない名前です：' + n);
    if (x && x.id) want[String(x.id)] = n;
  });
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sh = faceSheet_(), last = sh.getLastRow();
    if (last < 2) return 0;
    const ids = sh.getRange(2, 1, last - 1, 1).getValues();
    const nm = sh.getRange(2, 3, last - 1, 1).getValues();
    const hq = sh.getRange(2, 6, last - 1, 2).getValues(); // 付け方・候補
    let n = 0;
    ids.forEach((r, i) => {
      const k = String(r[0]);
      if (!Object.prototype.hasOwnProperty.call(want, k)) return;
      nm[i][0] = want[k]; hq[i][0] = want[k] ? '手' : ''; hq[i][1] = ''; n++;
    });
    if (n) { sh.getRange(2, 3, last - 1, 1).setValues(nm); sh.getRange(2, 6, last - 1, 2).setValues(hq); }
    return n;
  } finally { lock.releaseLock(); }
}

/**
 * 「この子は顔の自動の見分けから外す」を保存（予定入力ページのパスコードが必要）
 *  外した子の「自動で付いた名前」と「候補」は消します（人が手で付けた名前は残します）
 */
function setFaceExclude(adminPass, names) {
  albBump_();
  if (!String(adminPass || '').trim() || !planPassOk_(readSettings_(), adminPass)) throw new Error('コーチ・スタッフ用のパスコード（予定入力ページのパスコード）が必要です');
  const ok = {}; rosterPlayers_().forEach(p => { ok[p.name] = 1; });
  const list = Array.from(new Set((names || []).map(n => String(n).trim()).filter(n => ok[n])));
  PropertiesService.getScriptProperties().setProperty('FACE_EXCLUDE', JSON.stringify(list));
  if (!list.length) return list;
  const ex = {}; list.forEach(n => { ex[n] = 1; });
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sh = faceSheet_(), last = sh.getLastRow();
    if (last < 2) return list;
    const nm = sh.getRange(2, 3, last - 1, 1).getValues();
    const hq = sh.getRange(2, 6, last - 1, 2).getValues();
    let ch = false;
    nm.forEach((r, i) => {
      if (ex[String(r[0]).trim()] && hq[i][0] !== '手') { r[0] = ''; hq[i][0] = ''; ch = true; }
      if (ex[String(hq[i][1]).trim()]) { hq[i][1] = ''; ch = true; }
    });
    if (ch) { sh.getRange(2, 3, last - 1, 1).setValues(nm); sh.getRange(2, 6, last - 1, 2).setValues(hq); }
  } finally { lock.releaseLock(); }
  return list;
}

/** 前の「顔の名前付け」ページ（?mode=faces）は、新しいページへ移動する */
function faceAdminHtml_() {
  const u = FACE2_NEW_PAGE;
  return '<!DOCTYPE html><html><head><base target="_top"><meta charset="utf-8"></head>' +
    '<body style="margin:0;background:#000;color:#fff;font-family:-apple-system,sans-serif;text-align:center;padding:48px 20px">' +
    '<p>新しい「顔の名前付け」ページに移動します…</p><a href="' + u + '" target="_top" style="color:#ffeb3b;font-weight:700">開く ›</a>' +
    '<script>try{window.top.location.replace("' + u + '")}catch(e){}</script></body></html>';
}

/** 【確認用】エディタで実行すると、正しく入ったかを実行ログに出します */
function faceSetupCheck() {
  const msg = [];
  msg.push('呼び出し口：' + (String(rpc_).indexOf('FACE2_RPC') >= 0 ? 'OK' : 'NG（このファイルを、ファイル一覧のいちばん下に移動してください）'));
  msg.push('見本の作り方：' + (String(faceRefs_).indexOf('FACE2_REF_MAX') >= 0 ? 'OK' : 'NG（同上）'));
  msg.push('写真の保存：' + (String(saveAlbumPhoto).indexOf('face2Head_') >= 0 ? 'OK' : 'NG（同上）'));
  face2Head_();
  const rows = face2Rows_(false), refs = faceRefs_(rows), per = {};
  refs.forEach(r => { per[r.n] = (per[r.n] || 0) + 1; });
  msg.push('顔データ：' + rows.length + '個（名前なし ' + rows.filter(f => !f.name).length + '個）');
  msg.push('見本：' + refs.length + '個・' + Object.keys(per).length + '人');
  msg.push('外す子：' + (faceExclude_().join('、') || 'なし'));
  albBump_();
  Logger.log(msg.join('\n'));
  return msg.join('\n');
}
