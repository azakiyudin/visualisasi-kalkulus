window.MathJax={tex:{inlineMath:[['\\(','\\)']]},startup:{typeset:false}};
const $=id=>document.getElementById(id);
function set(id,o){const e=$(id);for(const k in o)e.setAttribute(k,o[k])}
function rm(el){
  if(!(window.MathJax&&MathJax.typesetPromise))return;
  MathJax.startup.promise=MathJax.startup.promise.then(()=>MathJax.typesetPromise([el])).catch(()=>{});
}
function note(s){const n=$('note');if(n.dataset.s===s)return;n.dataset.s=s;n.textContent=s;rm(n)}
function put(id,cx,cy){set(id,{x:cx-50,y:cy-16})}
const NS='http://www.w3.org/2000/svg';
// label MathJax di dalam SVG (dipanggil sebelum start())
function lab(id,tex,color){
  const f=document.createElementNS(NS,'foreignObject');f.id=id;f.setAttribute('width',100);f.setAttribute('height',32);
  f.innerHTML='<div class="lab"'+(color?' style="color:'+color+'"':'')+'>\\('+tex+'\\)</div>';$('sv').appendChild(f);
}
// orang berjalan (batang): manInit lalu manPose(id,x,y,fase,skala,arah)
function manInit(id){
  const g=document.createElementNS(NS,'g');g.id=id;g.setAttribute('stroke-linecap','round');
  g.innerHTML='<line id="'+id+'1" stroke="var(--fg)" stroke-width="6"/><line id="'+id+'2" stroke="var(--fg)" stroke-width="6" opacity=".65"/><line x1="0" y1="-30" x2="0" y2="-50" stroke="var(--acc)" stroke-width="10"/><line x1="0" y1="-47" x2="-16" y2="-34" stroke="#e8b98a" stroke-width="4.5"/><circle cx="0" cy="-61" r="8.5" fill="#f2c9a0" stroke="var(--fg)" stroke-width="1.5"/>';
  $('sv').appendChild(g);
}
function manPose(id,x,y,ph,k,dir){
  k=k||1;set(id,{transform:`translate(${x},${y}) scale(${(dir||1)*k},${k})`});
  const a=.6*Math.sin(ph),sx=30*Math.sin(a),cy=-30+30*Math.cos(a);
  set(id+'1',{x1:0,y1:-30,x2:sx,y2:cy});set(id+'2',{x1:0,y1:-30,x2:-sx,y2:cy});
}
function sign(v){return v>0?'bertambah':'berkurang'}
function start(draw,ids){
  ids.forEach(i=>$(i).addEventListener('input',draw));
  draw();
  const s=document.createElement('script');
  s.async=true;s.src='https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js';
  s.onload=()=>MathJax.startup.promise.then(()=>rm(document.body));
  document.head.appendChild(s);
}
// putar skenario: apply(u) mengisi slider untuk parameter u in [u0,u1], lalu menggambar ulang
function play(btn,u0,u1,spd,apply,cur){
  let t=null,u=u0;const b=$(btn);
  const stop=()=>{clearInterval(t);t=null;b.textContent='Putar'};
  b.onclick=()=>{
    if(t){stop();return}
    b.textContent='Berhenti';
    if(cur){u=cur();if(!(u>=u0&&u<u1))u=u0}else if(u>=u1)u=u0;
    t=setInterval(()=>{u=Math.min(u1,u+spd);apply(u);if(u>=u1)stop()},30)};
  return stop;
}
function arrowLen(v,k,cap){const m=Math.max(16,Math.min(cap||130,Math.abs(v)*k));return v<0?-m:m}
function anim(btn,sl,step,draw){
  let t=null,dir=1;const el=$(sl),b=$(btn);
  b.onclick=()=>{
    if(t){clearInterval(t);t=null;b.textContent='Putar';return}
    b.textContent='Berhenti';
    t=setInterval(()=>{
      let v=+el.value+dir*step;const lo=+el.min,hi=+el.max;
      if(v<=lo){v=lo;dir=1}if(v>=hi){v=hi;dir=-1}
      el.value=v;draw()},40)};
  return ()=>{clearInterval(t);t=null;b.textContent='Putar'};
}
// ubah isi label MathJax hanya jika berubah (hindari render ulang tiap frame)
function setLab(id,tex){const d=$(id).querySelector('.lab'),h='\\('+tex+'\\)';if(d.dataset.h===h)return;d.dataset.h=h;d.innerHTML=h;rm($(id))}
// aset gambar bersama (dipakai semua halaman supaya tampilannya seragam): asset(idGrup,nama,skala)
const ASSET={
  rocket:'<g class="fl"><polygon points="-6,20 6,20 0,46" fill="#ff9d2e"/><polygon points="-3,20 3,20 0,34" fill="#ffe066"/></g><path d="M-8,6 L-17,22 L-8,16Z M8,6 L17,22 L8,16Z" fill="var(--lad)" stroke="var(--fg)" stroke-width="1"/><path d="M0,-26 C10,-14 9,12 8,20 L-8,20 C-9,12 -10,-14 0,-26Z" fill="var(--body)" stroke="var(--fg)" stroke-width="1.5"/><path d="M0,-26 C5,-20 8,-15 8.6,-10 L-8.6,-10 C-8,-15 -5,-20 0,-26Z" fill="var(--lad)" stroke="var(--fg)" stroke-width="1.5"/><circle cx="0" cy="2" r="4.5" fill="var(--acc)" stroke="var(--fg)" stroke-width="1.5"/>',
  // pesawat tampak samping, hidung ke kanan
  planeSide:'<g stroke="#333" stroke-width="1.2" stroke-linejoin="round"><path d="M-27,-4 L-37,-24 L-26,-24 L-12,-5Z" fill="#c0392b"/><path d="M-30,0 L-42,-6 L-38,-1Z" fill="#cfd8e6"/><path d="M-34,0 C-34,-8 -22,-9 -8,-9 L20,-9 C32,-9 38,-3 38,0 C38,5 28,7 18,7 L-14,7 C-26,7 -34,5 -34,0Z" fill="#fff"/><rect x="-33" y="1" width="68" height="3.2" fill="#2563eb" stroke="none"/><path d="M-6,3 L-22,17 L-12,17 L8,3Z" fill="#cfd8e6"/><path d="M-22,17 L-12,17 L-14,14 L-21,14Z" fill="#2563eb"/><ellipse cx="2" cy="10" rx="5" ry="3" fill="#7a8599"/><path d="M22,-8 L31,-8 L35,-2 L22,-2Z" fill="#7fc1ff"/><g fill="#7fc1ff" stroke="none"><circle cx="-18" cy="-3" r="1.7"/><circle cx="-11" cy="-3" r="1.7"/><circle cx="-4" cy="-3" r="1.7"/><circle cx="3" cy="-3" r="1.7"/><circle cx="10" cy="-3" r="1.7"/></g></g>',
  // pesawat tampak atas, hidung ke atas
  planeTop:'<g stroke="#333" stroke-width="1.2" stroke-linejoin="round"><path d="M-4,-2 L-32,16 L-32,23 L-4,13Z M4,-2 L32,16 L32,23 L4,13Z" fill="#cfd8e6"/><path d="M-32,16 L-32,23 L-27,21 L-27,15Z M32,16 L32,23 L27,21 L27,15Z" fill="#2563eb"/><path d="M-3,19 L-14,29 L-14,32 L-2,27Z M3,19 L14,29 L14,32 L2,27Z" fill="#cfd8e6"/><ellipse cx="0" cy="3" rx="5.5" ry="26" fill="#fff"/><rect x="-5.2" y="-4" width="10.4" height="3.5" fill="#2563eb" stroke="none"/><ellipse cx="0" cy="-17" rx="2.8" ry="4.5" fill="#7fc1ff"/><circle cx="-15" cy="12" r="3.2" fill="#7a8599"/><circle cx="15" cy="12" r="3.2" fill="#7a8599"/><path d="M0,18 L0,31" stroke="#c0392b" stroke-width="3.5"/></g>'
};
function asset(id,name,k){$(id).innerHTML='<g'+(k?' transform="scale('+k+')"':'')+'>'+ASSET[name]+'</g>'}
