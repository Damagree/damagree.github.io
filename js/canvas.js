// ═══════════════════════════════════════════════════════════════
// canvas.js — CORE_v4 Node Network Engine
// To update nodes: edit the STACK array below.
// Each entry: { label, sub, rgb:[r,g,b], orbit, spd, sz }
// ═══════════════════════════════════════════════════════════════

const canvas = document.getElementById('core-canvas');
const ctx = canvas.getContext('2d');

// ── Responsive canvas sizing ─────────────────────────────────
// Canvas internal resolution always matches its CSS display size.
// This ensures sharp rendering on all screen sizes including mobile.
let SIZE, CX, CY;

let nodes = [];

function resizeCanvas() {
  const wrap = canvas.parentElement;
  const css = Math.round(wrap.getBoundingClientRect().width);
  SIZE = css || 560;
  CX = SIZE / 2; CY = SIZE / 2;
  canvas.width  = SIZE;
  canvas.height = SIZE;
  // Re-sync node orbit radii relative to new size
  if (typeof nodes !== 'undefined') {
    const scale = SIZE / 560;
    nodes.forEach((n, i) => {
      n.baseR = STACK[i].orbit * scale;
      n.sz    = STACK[i].sz   * scale;
    });
  }
}
window.addEventListener('resize', resizeCanvas, { passive: true });

const STACK = [
  { label:'XR',     sub:'AR / VR',             rgb:[180, 80,255], orbit:175, spd: 0.0018, sz:5.5 },
  { label:'UNITY',  sub:'Engine',              rgb:[160, 60,255], orbit:195, spd:-0.0014, sz:4.5 },
  { label:'UNREAL', sub:'Engine',              rgb:[200,100,255], orbit:160, spd: 0.0022, sz:4.5 },
  { label:'PHYSX',  sub:'Simulation',          rgb:[255,140, 30], orbit:215, spd:-0.0016, sz:4.0 },
  { label:'RT-SIM', sub:'Lighting / Robotics', rgb:[255,180, 40], orbit:200, spd: 0.0012, sz:4.5 },
  { label:'CLOUD',  sub:'Infra / CDN',         rgb:[ 60,255,140], orbit:185, spd: 0.0020, sz:4.5 },
  { label:'API',    sub:'Backend Svc',         rgb:[ 40,220,120], orbit:210, spd:-0.0013, sz:4.0 },
  { label:'DB',     sub:'Data Layer',          rgb:[ 80,255,160], orbit:170, spd: 0.0017, sz:4.0 },
  { label:'WEB',    sub:'Platform',            rgb:[  0,245,255], orbit:190, spd:-0.0019, sz:4.5 },
  { label:'ARCH',   sub:'Clean Arch',          rgb:[ 30,200,240], orbit:175, spd: 0.0015, sz:4.0 },
  { label:'MENTOR', sub:'Teaching',            rgb:[255,210, 60], orbit:205, spd: 0.0010, sz:5.0 },
  { label:'DEVEX',  sub:'Game Dev Edu',        rgb:[255,240, 80], orbit:185, spd:-0.0021, sz:4.0 },
];

function toRgba([r,g,b], a) { return `rgba(${r},${g},${b},${a})`; }

// ── Pointer state (unified mouse + touch) ─────────────────────
let mouse = { x: 0, y: 0, active: false };

function getCanvasPos(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (clientX - r.left) * (SIZE / r.width),
    y: (clientY - r.top)  * (SIZE / r.height),
  };
}
function setHud(text) {
  const el = document.getElementById('hud-activity');
  if (el) el.textContent = text;
}
function firePulse(mx, my) {
  let nearest = nodes[0], nearD = Infinity;
  nodes.forEach(n => { const d = Math.hypot(n.x-mx,n.y-my); if(d<nearD){nearD=d;nearest=n;} });
  for (let i = 0; i < 16; i++) particles.push(new Particle(nearest.x,nearest.y,true,(Math.PI*2/16)*i,nearest.rgb));
  for (let i = 0; i < 8;  i++) particles.push(new Particle(CX,CY,true,(Math.PI*2/8)*i,[0,245,255]));
  setHud(`PULSE: ${nearest.label}`);
  setTimeout(() => setHud(mouse.active ? 'TRACKING' : 'IDLE'), 1500);
}

// Mouse
canvas.addEventListener('mousemove', e => {
  const p = getCanvasPos(e.clientX, e.clientY);
  mouse.x = p.x; mouse.y = p.y; mouse.active = true;
  setHud('TRACKING');
});
canvas.addEventListener('mouseleave', () => { mouse.active = false; setHud('IDLE'); });
canvas.addEventListener('click', e => {
  const p = getCanvasPos(e.clientX, e.clientY);
  firePulse(p.x, p.y);
});

// Touch — treat first touch like mouse, tap like click
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const t = e.touches[0];
  const p = getCanvasPos(t.clientX, t.clientY);
  mouse.x = p.x; mouse.y = p.y; mouse.active = true;
  setHud('TRACKING');
}, { passive: false });

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const t = e.touches[0];
  const p = getCanvasPos(t.clientX, t.clientY);
  mouse.x = p.x; mouse.y = p.y; mouse.active = true;
}, { passive: false });

canvas.addEventListener('touchend', e => {
  // If finger lifted without much movement, fire a pulse at last position
  firePulse(mouse.x, mouse.y);
  // Keep "tracking" glow for a moment before going idle
  setTimeout(() => { mouse.active = false; setHud('IDLE'); }, 800);
}, { passive: true });

class Node {
  constructor(def, idx) {
    this.label=def.label; this.sub=def.sub; this.rgb=def.rgb;
    const scale = SIZE / 560;
    this.baseR=def.orbit*scale; this.r=def.orbit*scale;
    this.speed=def.spd*(idx%2===0?1:-1); this.sz=def.sz*scale;
    this.angle=(Math.PI*2/STACK.length)*idx+idx*0.31;
    this.pulsePhase=idx*0.71; this.active=false;
    this.activeCooldown=0; this.hoverScale=1;
  }
  get x() { return CX+Math.cos(this.angle)*this.r; }
  get y() { return CY+Math.sin(this.angle)*this.r; }
  update(t) {
    this.angle+=this.speed;
    this.r=this.baseR+Math.sin(t*0.0008+this.pulsePhase)*(SIZE/56);
    const touchRadius = SIZE * 0.16; // ~16% of canvas = comfortable tap zone
    if (mouse.active) {
      const d=Math.hypot(this.x-mouse.x,this.y-mouse.y);
      if(d<touchRadius){ this.active=true; this.activeCooldown=50; this.hoverScale=Math.min(this.hoverScale+0.1,2.2); }
    }
    if(this.activeCooldown>0) this.activeCooldown--;
    else { this.active=false; this.hoverScale=Math.max(this.hoverScale-0.05,1); }
  }
  draw(t) {
    const pulse=0.5+0.5*Math.sin(t*0.0025+this.pulsePhase);
    const glow=this.active?1.0:0.45+pulse*0.3;
    const sz=this.sz*this.hoverScale;
    const halo=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,sz*5);
    halo.addColorStop(0,toRgba(this.rgb,glow*0.35));
    halo.addColorStop(0.5,toRgba(this.rgb,glow*0.1));
    halo.addColorStop(1,'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(this.x,this.y,sz*5,0,Math.PI*2); ctx.fillStyle=halo; ctx.fill();
    if(this.active){
      ctx.beginPath(); ctx.arc(this.x,this.y,sz*3.5,0,Math.PI*2);
      ctx.strokeStyle=toRgba(this.rgb,0.5); ctx.lineWidth=1; ctx.setLineDash([3,4]); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.beginPath(); ctx.arc(this.x,this.y,sz,0,Math.PI*2); ctx.fillStyle=toRgba(this.rgb,glow); ctx.fill();
    ctx.beginPath(); ctx.arc(this.x,this.y,sz*0.4,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${glow*0.7})`; ctx.fill();
    const labelSize = Math.max(7, Math.round(SIZE * 0.016));
    ctx.font=`700 ${labelSize}px "Space Mono"`; ctx.textAlign='center';
    ctx.fillStyle=toRgba(this.rgb,this.active?1.0:glow*0.85);
    ctx.fillText(this.label,this.x,this.y-sz*2.4);
    if(this.active){
      const subSize = Math.max(6, Math.round(SIZE * 0.013));
      ctx.font=`400 ${subSize}px "Space Mono"`; ctx.fillStyle=toRgba(this.rgb,0.65);
      ctx.fillText(this.sub,this.x,this.y+sz*3.2);
      const s=sz*2.8; ctx.strokeStyle=toRgba(this.rgb,0.9); ctx.lineWidth=1.2;
      ctx.beginPath();
      ctx.moveTo(this.x-s,this.y-s+s*0.4); ctx.lineTo(this.x-s,this.y-s); ctx.lineTo(this.x-s+s*0.4,this.y-s);
      ctx.moveTo(this.x+s-s*0.4,this.y-s); ctx.lineTo(this.x+s,this.y-s); ctx.lineTo(this.x+s,this.y-s+s*0.4);
      ctx.moveTo(this.x-s,this.y+s-s*0.4); ctx.lineTo(this.x-s,this.y+s); ctx.lineTo(this.x-s+s*0.4,this.y+s);
      ctx.moveTo(this.x+s-s*0.4,this.y+s); ctx.lineTo(this.x+s,this.y+s); ctx.lineTo(this.x+s,this.y+s-s*0.4);
      ctx.stroke();
    }
  }
}

class Particle {
  constructor(x,y,burst=false,angle=0,rgb=[0,245,255]) {
    this.x=x; this.y=y; this.rgb=rgb;
    if(burst){ const spd=1.5+Math.random()*3.5; this.vx=Math.cos(angle)*spd; this.vy=Math.sin(angle)*spd; this.life=1.0; this.decay=0.018+Math.random()*0.02; this.size=1.5+Math.random()*2.5; }
    else { const a=Math.random()*Math.PI*2,spd=0.2+Math.random()*0.6; this.vx=Math.cos(a)*spd; this.vy=Math.sin(a)*spd; this.life=0.5+Math.random()*0.5; this.decay=0.003+Math.random()*0.004; this.size=0.8+Math.random()*1.5; }
  }
  update() { this.x+=this.vx; this.y+=this.vy; this.life-=this.decay; }
  draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fillStyle=toRgba(this.rgb,this.life*0.9); ctx.fill(); }
}

const rings = [
  {r:220,speed: 0.0008,dash:[14,22],lw:0.7,rgba:'rgba(180,80,255,0.10)', dotR:3.5},
  {r:195,speed:-0.0012,dash:[5,9],  lw:0.6,rgba:'rgba(255,140,30,0.08)', dotR:0  },
  {r:168,speed: 0.0015,dash:[2,5],  lw:0.8,rgba:'rgba(60,255,140,0.10)', dotR:3  },
  {r:138,speed:-0.002, dash:[1,3],  lw:0.6,rgba:'rgba(0,245,255,0.10)',  dotR:0  },
  {r:105,speed: 0.0025,dash:[6,10], lw:0.5,rgba:'rgba(255,210,60,0.08)', dotR:2.5},
];
const ringAngles=rings.map(()=>0);
nodes=STACK.map((def,i)=>new Node(def,i));
resizeCanvas();

const hudNodes=document.getElementById('hud-nodes');
if(hudNodes) hudNodes.textContent=`NODES: ${STACK.length}`;

let particles=[];
function spawnAmbient(){
  const n=nodes[Math.floor(Math.random()*nodes.length)];
  const a=Math.random()*Math.PI*2,r=40+Math.random()*60;
  // Scale particle spawn position to canvas size
  const sc = SIZE/560;
  particles.push(new Particle(n.x+Math.cos(a)*r*sc,n.y+Math.sin(a)*r*sc,false,0,n.rgb));
}
let scanY=0,frameCount=0;

function draw(t) {
  frameCount++;
  ctx.fillStyle='rgba(4,6,10,0.18)'; ctx.fillRect(0,0,SIZE,SIZE);
  const sc=SIZE/560; // scale factor for all size-dependent values
  rings.forEach((ring,i)=>{
    ringAngles[i]+=ring.speed;
    ctx.save(); ctx.translate(CX,CY); ctx.rotate(ringAngles[i]); ctx.translate(-CX,-CY);
    ctx.beginPath(); ctx.arc(CX,CY,ring.r*sc,0,Math.PI*2);
    ctx.strokeStyle=ring.rgba; ctx.lineWidth=ring.lw; ctx.setLineDash(ring.dash); ctx.stroke(); ctx.setLineDash([]);
    if(ring.dotR>0){
      for(let d=0;d<6;d++){
        const da=(Math.PI/3)*d;
        ctx.beginPath(); ctx.arc(CX+Math.cos(da)*ring.r*sc,CY+Math.sin(da)*ring.r*sc,ring.dotR*sc,0,Math.PI*2);
        ctx.fillStyle=ring.rgba.replace(/[\d.]+\)$/,'0.6)'); ctx.fill();
      }
    }
    ctx.restore();
  });
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const ni=nodes[i],nj=nodes[j],d=Math.hypot(ni.x-nj.x,ni.y-nj.y);
      if(d<150*sc){
        const alpha=(1-d/(150*sc))*0.3,boost=(ni.active||nj.active)?3.5:1;
        const grad=ctx.createLinearGradient(ni.x,ni.y,nj.x,nj.y);
        grad.addColorStop(0,toRgba(ni.rgb,Math.min(alpha*boost,0.8)));
        grad.addColorStop(1,toRgba(nj.rgb,Math.min(alpha*boost,0.8)));
        ctx.beginPath(); ctx.moveTo(ni.x,ni.y); ctx.lineTo(nj.x,nj.y);
        ctx.strokeStyle=grad; ctx.lineWidth=(ni.active||nj.active)?1.2:0.4; ctx.stroke();
      }
    }
  }
nodes.forEach(n => {

  // Skip kalau koordinat belum valid
  if (
    !Number.isFinite(n.x) ||
    !Number.isFinite(n.y) ||
    !Number.isFinite(CX) ||
    !Number.isFinite(CY)
  ) return;

  const pulse = 0.5 + 0.5 * Math.sin(t * 0.0018 + n.pulsePhase);
  const alpha = n.active ? 0.55 : 0.05 + pulse * 0.07;

  const grad = ctx.createLinearGradient(CX, CY, n.x, n.y);
  grad.addColorStop(0, `rgba(0,245,255,${alpha})`);
  grad.addColorStop(1, toRgba(n.rgb, alpha));

  ctx.beginPath();
  ctx.moveTo(CX, CY);
  ctx.lineTo(n.x, n.y);
  ctx.strokeStyle = grad;
  ctx.lineWidth = n.active ? 1.0 : 0.3;

  if (!n.active) ctx.setLineDash([3, 7]);
  ctx.stroke();
  ctx.setLineDash([]);

});

if (mouse.active) {

  if (!nodes.length) return;

  let nearest = nodes[0];
  let nearD = Infinity;

  nodes.forEach(n => {
    if (!Number.isFinite(n.x) || !Number.isFinite(n.y)) return;
    const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
    if (d < nearD) {
      nearD = d;
      nearest = n;
    }
  });

  if (
    nearD < 220 * sc &&
    Number.isFinite(mouse.x) &&
    Number.isFinite(mouse.y) &&
    Number.isFinite(nearest.x) &&
    Number.isFinite(nearest.y)
  ) {

    const grad = ctx.createLinearGradient(
      mouse.x,
      mouse.y,
      nearest.x,
      nearest.y
    );

    grad.addColorStop(0, toRgba(nearest.rgb, 0.8));
    grad.addColorStop(1, toRgba(nearest.rgb, 0));

    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    ctx.lineTo(nearest.x, nearest.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 6 * sc, 0, Math.PI * 2);
    ctx.strokeStyle = toRgba(nearest.rgb, 0.8);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.strokeStyle = toRgba(nearest.rgb, 0.45);
    ctx.lineWidth = 0.8;

    const ch = 14 * sc;
    const cg = 4 * sc;

    [
      [mouse.x - ch, mouse.y, mouse.x - cg, mouse.y],
      [mouse.x + cg, mouse.y, mouse.x + ch, mouse.y],
      [mouse.x, mouse.y - ch, mouse.x, mouse.y - cg],
      [mouse.x, mouse.y + cg, mouse.x, mouse.y + ch],
    ].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  }
}
  const coreT=t*0.001,coreGlow=0.5+0.5*Math.sin(t*0.002);
  [[0,245,255],[180,80,255],[60,255,140],[255,140,30],[255,210,60]].forEach(([r,g,b],ci)=>{
    const angle=coreT+(Math.PI*2/5)*ci,px=CX+Math.cos(angle)*22*sc,py=CY+Math.sin(angle)*22*sc;
    const g2=ctx.createRadialGradient(px,py,0,px,py,28*sc);
    g2.addColorStop(0,`rgba(${r},${g},${b},0.25)`); g2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(px,py,28*sc,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill();
  });
  const cg=ctx.createRadialGradient(CX,CY,0,CX,CY,40*sc);
  cg.addColorStop(0,`rgba(220,255,255,${coreGlow*0.4})`); cg.addColorStop(0.4,`rgba(0,245,255,${coreGlow*0.15})`); cg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(CX,CY,40*sc,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill();
  ctx.beginPath(); ctx.arc(CX,CY,4.5*sc,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${coreGlow})`; ctx.fill();
  ctx.beginPath(); ctx.arc(CX,CY,8*sc,0,Math.PI*2); ctx.strokeStyle=`rgba(0,245,255,${coreGlow*0.6})`; ctx.lineWidth=1; ctx.stroke();
  const bs=20*sc; ctx.strokeStyle=`rgba(0,245,255,${coreGlow*0.7})`; ctx.lineWidth=1.8;
  [[CX-bs,CY-bs,1,1],[CX+bs,CY-bs,-1,1],[CX-bs,CY+bs,1,-1],[CX+bs,CY+bs,-1,-1]].forEach(([x,y,sx2,sy])=>{
    ctx.beginPath(); ctx.moveTo(x+sx2*8*sc,y); ctx.lineTo(x,y); ctx.lineTo(x,y+sy*8*sc); ctx.stroke();
  });
  scanY=(scanY+0.8)%SIZE;
  ctx.beginPath(); ctx.moveTo(0,scanY); ctx.lineTo(SIZE,scanY);
  ctx.strokeStyle='rgba(0,245,255,0.04)'; ctx.lineWidth=2; ctx.stroke();
  if(frameCount%3===0) spawnAmbient();
  particles=particles.filter(p=>p.life>0); particles.forEach(p=>{p.update();p.draw();});
  nodes.forEach(n=>{n.update(t);n.draw(t);});
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
