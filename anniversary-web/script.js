const $ = id => document.getElementById(id);
$('n1').textContent = CONFIG.name1; $('n2').textContent = CONFIG.name2;

// kelopak jatuh (sekali saat dimuat)
(() => {
  const box = $('petals'), set = ['🌹','🌸','♥'];
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('span');
    p.className = 'petal'; p.textContent = set[i % 3];
    p.style.left = Math.random()*100 + '%';
    p.style.animationDuration = (9 + Math.random()*9) + 's';
    p.style.animationDelay = (-Math.random()*14) + 's';
    p.style.fontSize = (.9 + Math.random()*.9) + 'rem';
    box.appendChild(p);
  }
})();

// penghitung waktu bersama
function tick(){
  let d = Date.now() - new Date(CONFIG.since).getTime();
  if (isNaN(d) || d < 0) d = 0;
  $('cD').textContent = Math.floor(d/864e5);
  $('cH').textContent = Math.floor(d/36e5) % 24;
  $('cM').textContent = Math.floor(d/6e4) % 60;
  $('cS').textContent = Math.floor(d/1e3) % 60;
}
tick(); setInterval(tick, 1000);

// surat mengetik
let typedOnce = false;
function typeLetter(){
  if (typedOnce) return; typedOnce = true;
  const el = $('typed'), text = CONFIG.letter;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches){ el.textContent = text; $('sign').textContent = CONFIG.signature; return; }
  let i = 0;
  (function step(){
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(step, 38); else $('sign').textContent = CONFIG.signature;
  })();
}
new IntersectionObserver((es, ob) => { if (es[0].isIntersecting && $('gate').classList.contains('open')) { typeLetter(); ob.disconnect(); } }, {threshold:.4}).observe($('typed'));

$('openBtn').onclick = e => { $('gate').classList.add('open'); burst(e.clientX, e.clientY, 10); };

// galeri (dibaca dari CONFIG.photos)
const gal = $('gallery'), dlg = $('viewer');
const isVid = f => /\.(mp4|webm|mov|ogg)$/i.test(f);
const list = CONFIG.photos || [];
list.forEach(p => {
  const v = isVid(p.file);
  const f = document.createElement('figure'); f.className = 'frame'; f.style.margin = 0;
  const slot = document.createElement('button'); slot.className = 'slot';
  const m = document.createElement(v ? 'video' : 'img'); m.src = p.file;
  if (v){ m.muted = true; m.preload = 'metadata'; } else { m.alt = p.caption || 'Kenangan kita'; m.loading = 'lazy'; }
  m.onerror = () => f.remove();
  slot.appendChild(m); slot.onclick = () => openView(p.file, v);
  const cap = document.createElement('div'); cap.className = 'cap'; cap.textContent = p.caption || '';
  f.append(slot, cap); gal.appendChild(f);
});
$('emptyHint').style.display = list.length ? 'none' : 'block';
function openView(url, v){
  $('viewBody').innerHTML = v ? `<video src="${url}" controls autoplay playsinline></video>` : `<img src="${url}" alt="Kenangan kita">`;
  dlg.showModal();
}
function closeView(){ dlg.close(); $('viewBody').innerHTML = ''; }
$('closeView').onclick = closeView;
dlg.addEventListener('click', e => { if (e.target === dlg) closeView(); });

// interaksi: hati
function burst(x, y, count){
  const set = ['❤️','💖','🌹','💕'];
  for (let i = 0; i < count; i++){
    const s = document.createElement('span');
    s.className = 'pop'; s.textContent = set[i % set.length];
    s.style.left = x + 'px'; s.style.top = y + 'px';
    s.style.setProperty('--dx', (Math.random()*240 - 120) + 'px');
    s.style.animationDelay = (i*.05) + 's';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2200);
  }
}
let loves = 0;
$('yes').onclick = e => { loves++; $('loves').textContent = loves; burst(e.clientX, e.clientY, 8); };

const no = $('no'), row = $('row');
function dodge(e){
  e.preventDefault();
  const r = row.getBoundingClientRect(), b = no.getBoundingClientRect();
  no.style.position = 'absolute';
  no.style.left = Math.max(0, Math.random()*(r.width - b.width)) + 'px';
  no.style.top = Math.max(0, Math.random()*(r.height - b.height)) + 'px';
  no.textContent = ['Yakin?','Coba lagi deh','Masa sih?','Hehe, nggak bisa'][Math.floor(Math.random()*4)];
}
no.addEventListener('pointerenter', dodge);
no.addEventListener('click', dodge);

// alasan
let ri = -1;
$('reasonBtn').onclick = e => {
  ri = (ri + 1) % CONFIG.reasons.length;
  $('reason').textContent = CONFIG.reasons[ri];
  $('reasonBtn').textContent = 'Satu alasan lagi';
  burst(e.clientX, e.clientY, 4);
};
