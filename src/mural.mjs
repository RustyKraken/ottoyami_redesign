// TEMPORARY: a line drawing after the painted wall in the dining room, a dragon flying through swirl
// clouds behind the gallery, drawn in while the section scrolls past. Every stroke carries pathLength="1"
// and a start/duration (--s, --d) on the shared scroll progress --draw that app.js sets.
// To take it out again, delete this file, its import and use in build.mjs and the
// "Temporary dragon sky" blocks in styles.css and app.js.
const f = n => +n.toFixed(1);
const pt = ([x,y]) => `${f(x)} ${f(y)}`;
const smooth = (a,b,x) => { const t=Math.min(1,Math.max(0,(x-a)/(b-a))); return t*t*(3-2*t); };
const line = (d,s,dur,extra='') => `<path d="${d}" pathLength="1" style="--s:${f(s*100)/100};--d:${f(dur*100)/100}"${extra}/>`;

// Catmull-Rom through the control points, resampled to an even step so scales and spikes space evenly.
function spine(points, step=4) {
  const dense=[];
  for (let i=0;i<points.length-1;i++) {
    const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];
    for (let k=0;k<24;k++) {
      const t=k/24,t2=t*t,t3=t2*t;
      dense.push([0,1].map(j=>.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));
    }
  }
  dense.push(points.at(-1));
  const out=[dense[0]]; let acc=0;
  for (let i=1;i<dense.length;i++) { acc+=Math.hypot(dense[i][0]-dense[i-1][0],dense[i][1]-dense[i-1][1]); if (acc>=step) { out.push(dense[i]); acc=0; } }
  return out;
}

// Head, leg and flame tufts face +x with the belly toward +y; the whiskers trail off into long streams.
const HEAD = [
  'M-4-26C14-40 38-42 56-34C68-29 80-31 90-25C98-20 98-11 90-8C78-6 64-7 54-3C42 1 22 3 0 8',
  'M10 6C28 4 44 5 58 10C70 14 80 20 84 30C76 32 62 28 50 24C36 20 22 20 4 22',
  'M60-5l3 7 3-7M68-6l3 7 3-7M76-7l3 6 3-6M84-8l2 9 3-9M62 12l3-7 3 8M70 15l3-7 3 9M78 19l2-8 3 10',
  'M40 6C54 8 66 12 74 20C80 26 88 28 96 22',
  'M28-34C36-44 50-46 60-36M37-28a8.5 5.2 0 1 0 17 0a8.5 5.2 0 1 0-17 0M46-32.5v9M58-30C66-26 76-26 86-22M86-25c4-4 10-2 9 3M92-26C100-34 98-46 86-48',
  'M24-36C20-54 10-70-6-82M14-34C6-52-8-64-32-72M0-56C-4-66-2-76 4-82M-12-64C-22-68-26-76-24-84',
  'M8-30C-2-46-16-50-30-64C-24-54-22-48-22-40C-30-46-40-48-52-48C-42-42-36-34-34-24M-8-20C-20-28-34-30-48-40C-42-30-40-24-40-16C-50-20-60-20-72-18C-60-12-52-4-48 4',
  'M40 22C34 36 22 44 6 48C16 40 20 34 20 26M58 26C56 40 48 50 36 58C42 48 44 38 42 28',
];
const WHISKERS = 'M88-14C108-24 120-50 106-70C96-84 100-100 118-110C150-128 200-118 240-140C280-162 300-200 350-210M80 24C98 40 106 64 96 82C88 96 94 110 110 118C140 132 190 120 230 140';
const LEG = 'M-12-4C-16 12-10 24 2 30C-6 36-12 44-12 54M14-4C18 10 22 28 12 36C4 42-2 48-4 56M14 22C4 18-8 20-18 12C-12 22-6 26 0 28C-8 30-14 34-22 34C-8 40 6 38 16 32M-12 54C-22 56-28 62-26 72C-24 64-20 60-12 61M-8 56C-14 62-14 72-8 78C-8 70-6 64-2 60M-3 55C2 62 8 64 16 62C8 60 4 57 1 53';
const TUFT = 'M4-8C-12-16-30-10-48-26C-40-12-40-4-46 6C-34 0-24 2-16 8C-26 12-32 20-34 30C-20 22-6 16 4 8';

// The dragon's shape for a given swim phase. The body bends in a wave that runs from the head down to
// the tail, strongest mid-body and calm at the head, so it winds forward without leaving its path.
// Shared by the build (first frame) and app.js, which re-shapes it as the page scrolls.
export const SKY_DRAGON = {points:[[-60,1760],[300,1650],[700,1690],[800,1450],[790,1150],[960,1030],[1300,1050],[1410,820],[1400,560],[1180,420],[940,380],[760,330]], size:1, flip:true, headFirst:true};
const baseSpines = new Map();
export function dragonGeometry({points, size=1, flip=false, headFirst=false}, phase=null) {
  if (!baseSpines.has(points)) baseSpines.set(points, spine(points));
  const base=baseSpines.get(points), n=base.length;
  const normal=(sp,i)=>{ const a=sp[Math.max(0,i-1)],b=sp[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,t=[dx/l,dy/l]; return {t,n:flip?[t[1],-t[0]]:[-t[1],t[0]]}; };
  const sp=phase!==null?base.map((p,i)=>{ const s=i/(n-1),amp=26*size*smooth(.98,.72,s),w=amp*Math.sin(i*4/520*Math.PI*2+phase),{n:nn}=normal(base,i); return [p[0]+nn[0]*w,p[1]+nn[1]*w]; }):base;
  const frames=sp.map((p,i)=>({p,...normal(sp,i)}));
  const W=30*size, order=list=>headFirst?list.reverse():list;
  const width=s=>(2+(W-2)*Math.pow(Math.sin(Math.min(1,s/.7)*Math.PI/2),.8))*(1-.25*smooth(.86,1,s));
  const at=(i,k)=>{ const {p,n:nn}=frames[i],w=width(i/(n-1)); return [p[0]+nn[0]*w*k,p[1]+nn[1]*w*k]; };
  const edge=k=>`M${order(frames.map((_,i)=>pt(at(i,k)))).join('L')}`;
  const place=(i,k,s=size)=>{ const [x,y]=at(i,k),{t}=frames[i]; return `translate(${f(x)} ${f(y)}) rotate(${f(Math.atan2(t[1],t[0])*180/Math.PI)}) scale(${f(s)} ${f(flip?-s:s)})`; };
  const idx=s=>Math.round(s*(n-1));
  const scales=[], belly=[], spikes=[at(idx(.04),-1)];
  for (let i=4,row=0;i<n*.9;i+=3,row++) for (const k of row%2?[-.7,-.25,.15]:[-.48,-.05]) {
    const c=at(i,k),{t,n:nn}=frames[i],r=width(i/(n-1))*.16+1.5;
    scales.push(`M${pt([c[0]+nn[0]*r,c[1]+nn[1]*r])}Q${pt([c[0]-t[0]*r*1.8,c[1]-t[1]*r*1.8])} ${pt([c[0]-nn[0]*r,c[1]-nn[1]*r])}`);
  }
  for (let i=idx(.05);i<n*.95;i+=3) belly.push(`M${pt(at(i,.4))}L${pt(at(i,.95))}`);
  for (let i=idx(.04);i<n*.86-4;i+=5) {
    const {t,n:nn}=frames[i],h=5+width(i/(n-1))*.6,b=at(i,-1);
    spikes.push([b[0]-nn[0]*h-t[0]*h*.8,b[1]-nn[1]*h-t[1]*h*.8],at(i+4,-1));
  }
  // The head nods a little with the wave behind it.
  const end=frames[n-1],nod=phase!==null?Math.sin(phase-1.2)*5:0;
  return {
    paths:{back:edge(1),belly:edge(-1),plates:edge(.4),spikes:`M${order(spikes).map(pt).join('L')}`,lines:order(belly).join(''),scales:order(scales).join('')},
    places:{tail:`${place(0,0)} rotate(180)`,leg1:place(idx(.3),.85),leg2:place(idx(.66),.85),tuft1:`${place(idx(.42),-1,size*.7)} rotate(180)`,tuft2:`${place(idx(.75),-1,size*.6)} rotate(180)`,
      head:`translate(${f(end.p[0])} ${f(end.p[1])}) rotate(${f(Math.atan2(end.t[1],end.t[0])*180/Math.PI+nod)}) scale(${f(size)} ${f(flip?-size:size)})`},
  };
}

// Order along the scroll: the body runs from one end to the other, details follow just behind it.
// headFirst draws from the head down to the tail; flip keeps the belly down when the dragon faces left.
function dragon(opts, from=.12, to=.8) {
  const {paths:p,places:at}=dragonGeometry(opts), span=to-from, when=s=>from+span*(opts.headFirst?1-s:s);
  const part=(name,d,s,dur,extra='')=>line(d,s,dur,` data-part="${name}"${extra}`);
  const headAt=opts.headFirst?from-.06:to-.04, whiskersAt=opts.headFirst?from-.02:to+.04, tailAt=when(0);
  return `<g class="sky-dragon">
${part('back',p.back,from,span)}${part('belly',p.belly,from,span)}${part('plates',p.plates,from+.04,span)}
${part('spikes',p.spikes,from+.06,span,' class="sky-fine"')}${part('lines',p.lines,from+.08,span,' class="sky-fine"')}${part('scales',p.scales,from+.1,span,' class="sky-fine"')}
<g data-place="tail" transform="${at.tail}">${line(TUFT,tailAt,.12)}<g transform="rotate(-30) scale(.8)">${line(TUFT,tailAt+.02,.12)}</g><g transform="rotate(32) scale(.75)">${line(TUFT,tailAt+.03,.12)}</g></g>
<g data-place="leg1" transform="${at.leg1}">${line(LEG,when(.3),.14)}</g><g data-place="leg2" transform="${at.leg2}">${line(LEG,when(.66),.14)}</g>
<g data-place="tuft1" transform="${at.tuft1}">${line(TUFT,when(.42),.1)}</g><g data-place="tuft2" transform="${at.tuft2}">${line(TUFT,when(.75),.1)}</g>
<g data-place="head" transform="${at.head}">${HEAD.map((d,i)=>line(d,headAt+i*.012,.14)).join('')}${line(WHISKERS,whiskersAt,.18)}</g></g>`;
}

// Swirl clouds: only the outer edge of the overlapping lobes is drawn, a spiral curls inside each big lobe.
function cloud(x,y,s,lobes,start) {
  const L=lobes.map(([cx,cy,r])=>[x+cx*s,y+cy*s,r*s]);
  let outline='';
  L.forEach(([cx,cy,r],j)=>{
    const N=64, out=Array.from({length:N},(_,i)=>{const a=i/N*Math.PI*2,p=[cx+Math.cos(a)*r,cy+Math.sin(a)*r];return L.every(([ox,oy,or],k)=>k===j||Math.hypot(p[0]-ox,p[1]-oy)>or-.5)?p:null;});
    const first=out.findIndex(p=>!p); if (first<0) { outline+=`M${out.map(pt).join('L')}Z`; return; }
    let run=[];
    for (let k=1;k<=N;k++) { const p=out[(first+k)%N]; if (p) run.push(p); else { if (run.length>1) outline+=`M${run.map(pt).join('L')}`; run=[]; } }
  });
  const curls=L.filter(l=>l[2]>=20*s).map(([cx,cy,r],i)=>{ let d=''; for (let a=0;a<=Math.PI*2.4;a+=.2) { const rr=r*.7*(1-a/(Math.PI*2.9)),aa=a*(i%2?-1:1)+i; d+=`${a?'L':'M'}${f(cx+Math.cos(aa)*rr)} ${f(cy+Math.sin(aa)*rr)}`; } return d; }).join('');
  return line(outline,start,.22)+line(curls,start+.08,.22,' class="sky-fine"');
}
const CLOUD_A=[[0,0,26],[34,-14,32],[72,-4,24],[100,6,18],[50,14,22]];
const CLOUD_B=[[0,0,20],[28,-18,28],[64,-22,22],[90,-6,26],[56,4,18]];

// Composed for the gallery (about 1440 × 1820 on desktop): the head rests in the open space beside the
// heading, the body winds down through the gaps between the photos. Everything draws in from top to bottom.
export function DragonSky() {
  const H=1820, at=y=>Math.max(0,y/H*.8-.04);
  // Long wind lines thread the clouds together and lead into the dragon.
  const streams=[
    'M640 270C760 200 900 230 1040 210C1180 190 1320 150 1480 170',
    'M-40 980C160 940 320 1030 520 1010C700 990 820 1050 960 1030C1120 1010 1280 1060 1480 1020',
    'M-40 1600C200 1560 360 1660 560 1640C760 1620 900 1690 1100 1660C1260 1640 1360 1690 1480 1670',
    'M-40 420C20 460 30 560 60 640C80 700 40 780 60 860',
    'M200 1780C500 1740 800 1790 1100 1760C1250 1745 1360 1770 1480 1750',
  ].map(d=>{ const y=+d.split(' ')[1].split('C')[0]; return line(d,at(y),.3); }).join('');
  const clouds=[[1150,110,1.5,CLOUD_B],[1240,470,1.1,CLOUD_A],[20,560,1.2,CLOUD_B],[400,1030,1.3,CLOUD_A],[1080,1080,1.2,CLOUD_B],[620,1660,1.4,CLOUD_A],[1220,1700,1.1,CLOUD_B]]
    .map(([x,y,s,l])=>cloud(x,y,s,l,at(y))).join('');
  const dots=[[1000,150,4],[1030,175,2.5],[1390,380,4],[30,800,3.5],[860,1250,4],[880,1280,2.5],[260,1700,3],[1400,1150,3.5]]
    .map(([x,y,r])=>`<circle class="sky-dot" cx="${x}" cy="${y}" r="${r}" style="--s:${f(at(y)*100)/100};--d:.12"/>`).join('');
  return `<div class="dragon-sky" aria-hidden="true"><svg viewBox="0 0 1440 ${H}" preserveAspectRatio="xMidYMin slice" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${streams}${clouds}${dots}${dragon(SKY_DRAGON,.08,.85)}</svg></div>`;
}
