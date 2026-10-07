export function Blossom() {
  // Five notched petals, outlined in the heart colour so overlapping petals stay readable at icon size.
  const petal = 'M16 16.5C12.2 14 9.6 9.8 10.6 6.2C11.3 3.6 13.4 2.3 14.9 2.9L16 4.9L17.1 2.9C18.6 2.3 20.7 3.6 21.4 6.2C22.4 9.8 19.8 14 16 16.5Z';
  return `<svg viewBox="0 0 32 32" aria-hidden="true" class="blossom"><g fill="currentColor" stroke="var(--blossom-heart,var(--color-background))" stroke-width=".8" stroke-linejoin="round">${Array.from({length:5},(_,i)=>`<path d="${petal}" transform="rotate(${i*72} 16 16.5)"/>`).join('')}</g><circle cx="16" cy="16.5" r="2.6" fill="var(--blossom-heart,var(--color-background))"/><g fill="currentColor">${Array.from({length:5},(_,i)=>{const a=(i*72+36-90)*Math.PI/180;return `<circle cx="${(16+Math.cos(a)*4.1).toFixed(2)}" cy="${(16.5+Math.sin(a)*4.1).toFixed(2)}" r=".75"/>`;}).join('')}<circle cx="16" cy="16.5" r="1"/></g></svg>`;
}

const f = n => +n.toFixed(1);
const lerp = (a,b,t) => a+(b-a)*t;
// Great wave after an ukiyo-e print, traced to a single path (public/assets/great-wave.svg).
// It is used as a CSS mask so the ink colour follows the theme.
export function Wave() {
  return `<div class="wave-art" aria-hidden="true"><div class="wave-ink"></div></div>`;
}
// Seigaiha: overlapping scales with concentric rings. Each scale is filled so rows in front hide rows behind.
export function seigaiha({stroke,fill,r=32,rings=4,opacity=1,width=1}) {
  const centres=[[r,-r/2],[0,0],[2*r,0],[r,r/2],[0,r],[2*r,r],[r,3*r/2]];
  const scale=([x,y])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="none"/>${Array.from({length:rings},(_,i)=>`<circle cx="${x}" cy="${y}" r="${f(r*(1-i/rings)-width/2)}" fill="none"/>`).join('')}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${2*r}" height="${r}" viewBox="0 0 ${2*r} ${r}"><g stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${width}">${centres.map(scale).join('')}</g></svg>`;
}
// Pattern tiles per theme; the scale fill must match the section background behind it.
export const patterns = {
  'waves-light.svg': seigaiha({stroke:'#9C7B52',fill:'#303338',r:36,rings:3,opacity:.55,width:1.6}),
  'waves-dark.svg': seigaiha({stroke:'#8A6A44',fill:'#0D0B09',r:36,rings:3,opacity:.55,width:1.6}),
  'seigaiha-light.svg': seigaiha({stroke:'#C89763',fill:'#EFE1CF',r:30,rings:4,opacity:.8,width:1.1}),
  'seigaiha-dark.svg': seigaiha({stroke:'#C89763',fill:'#1D1915',r:30,rings:4,opacity:.45,width:1.1}),
};

// Detailed sakura branch, redrawn after a botanical painting. Flowers and buds are drawn at unit size 100 and scaled.
const rand = seed => () => (seed = (seed*16807) % 2147483647) / 2147483647;
function sakuraFlower([x,y,r,rot,tilt],index) {
  const rnd = rand(index*97+13);
  const petal = `M0 0C-24-10-60-38-58-70C-56-92-36-102-14-101C-7-100-3-98 0-95C3-98 7-100 14-101C36-102 56-92 58-70C60-38 24-10 0 0Z`;
  const petals = Array.from({length:5},(_,i)=>{
    const a=i*72+(rnd()-.5)*14, s=.9+rnd()*.14;
    return `<g transform="rotate(${f(a)}) scale(${f(s*100)/100})"><path d="${petal}" fill="url(#sb-petal)" stroke="#CF9EA3" stroke-width="1.3"/><path d="M0-6C-10-30-20-52-30-80M0-6C-2-36-3-60-4-86M0-6C6-34 14-58 26-84" stroke="#E2A2AD" stroke-width="1" fill="none" opacity=".5"/></g>`;
  }).join('');
  const stamens = Array.from({length:18},(_,i)=>{const a=i/18*Math.PI*2+rnd()*.3,l=30+rnd()*20;return [Math.cos(a)*l,Math.sin(a)*l];});
  return `<g class="sb-flower" style="--i:${index}"><g transform="translate(${x} ${y}) rotate(${rot}) scale(${f(r/100*100)/100} ${f(r/100*tilt*100)/100})">${petals}<circle r="12" fill="url(#sb-heart)"/><path d="${stamens.map(([a,b])=>`M0 0L${f(a)} ${f(b)}`).join('')}" stroke="#D47F93" stroke-width="1" fill="none"/><g fill="#C99A2E">${stamens.map(([a,b])=>`<circle cx="${f(a)}" cy="${f(b)}" r="3.3"/>`).join('')}</g><path d="M0 0L2-14" stroke="#9FA154" stroke-width="2"/></g></g>`;
}
function sakuraBud([x,y,angle,length,stem=0],index) {
  const s=length/100;
  return `<g class="sb-bud" style="--i:${index}"><g transform="translate(${x} ${y}) rotate(${angle}) scale(${f(s*100)/100})">${stem?`<path d="M${-stem} 0L0 0" stroke="#7C7A3E" stroke-width="${f(3/s)}"/>`:''}<path d="M4 0C20-33 72-38 100 0C72 38 20 33 4 0Z" fill="url(#sb-bud)" stroke="#BE6178" stroke-width="1.5"/><path d="M28-14C54-14 78-8 98-1M34 12C58 10 80 6 98 1" stroke="#C25774" stroke-width="1.6" fill="none" opacity=".55"/><path d="M60-20C76-16 88-9 96-3" stroke="#FBE3E7" stroke-width="3" fill="none" opacity=".5"/><path d="M0 0C6-20 22-28 34-24C24-16 16-8 0 0ZM0 0C6 20 22 28 34 24C24 16 16 8 0 0ZM0 0C10-6 22-6 30 0C22 6 10 6 0 0Z" fill="#8A6B3A" stroke="#6C4E2C" stroke-width="1"/><path d="M2-2C10-12 20-16 28-16" stroke="#A65B3F" stroke-width="2" fill="none"/></g></g>`;
}
export function SakuraBranch() {
  const bark = [
    ['M24 36C50 66 78 92 110 108',22],['M110 108C150 130 180 165 215 205',17],['M215 205C245 238 280 262 318 292',15],['M318 292C345 312 372 330 405 342',13],
    ['M405 342C440 356 470 378 500 405',11],['M500 405C525 428 545 452 560 480',8],['M560 480C566 492 572 502 578 514',5.5],
    ['M118 116C140 150 165 180 200 214',13],['M200 214C225 238 240 262 262 290',10],['M262 290C285 315 315 330 352 338',8],
    ['M112 106C135 96 152 98 172 108',6],['M146 118C180 122 212 128 250 136',5.5],['M234 262C228 284 226 300 230 318',5.5],
    ['M398 336C420 318 440 304 462 292',5],['M440 360C432 380 422 394 414 404',4],['M478 392C472 410 468 424 462 440',4],
    ['M515 418C528 404 538 394 548 386',4],['M240 214C246 202 250 196 252 186',4],['M556 470C566 462 574 456 582 450',3.2],
  ];
  // Fine twig nodes and leaf scars that make the bark read as cherry wood.
  const nodes = [[110,108],[200,214],[262,290],[318,292],[405,342],[500,405],[234,262],[440,360],[478,392],[146,118]];
  const flowers = [[282,128,58,-8,1],[242,345,55,20,1],[385,345,55,-15,.95],[362,250,70,10,1],[558,378,50,25,.86],[458,452,48,-12,.62]];
  const buds = [[170,108,-8,40,8],[250,186,62,38,4],[292,196,30,22,6],[462,290,-28,38,6],[470,322,-6,34,14],[454,350,14,34,10],[414,404,96,38,2],[572,500,92,34,4],[580,452,-48,24,4],[440,302,-62,20,6],[588,520,70,22,6]];
  const defs = `<defs><radialGradient id="sb-petal" cx="0" cy="0" r="100" gradientUnits="userSpaceOnUse"><stop stop-color="#E592A3"/><stop offset=".32" stop-color="#F2C3CA"/><stop offset=".75" stop-color="#F8DADD"/><stop offset="1" stop-color="#FBE8E8"/></radialGradient><radialGradient id="sb-heart" cx="0" cy="0" r="15" gradientUnits="userSpaceOnUse"><stop stop-color="#A93F5C"/><stop offset="1" stop-color="#DB8396"/></radialGradient><linearGradient id="sb-bud" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#F4B9C4"/><stop offset=".55" stop-color="#E7899D"/><stop offset="1" stop-color="#D0607A"/></linearGradient><linearGradient id="sb-bark" x1="20" y1="30" x2="580" y2="520" gradientUnits="userSpaceOnUse"><stop style="stop-color:var(--bark-1)"/><stop offset=".35" style="stop-color:var(--bark-2)"/><stop offset="1" style="stop-color:var(--bark-3)"/></linearGradient><linearGradient id="sb-fade" x1="20" y1="28" x2="120" y2="118" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".75" stop-color="#fff"/></linearGradient><mask id="sb-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="660" height="600"><rect width="660" height="600" fill="url(#sb-fade)"/></mask><filter id="sb-rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="4" result="warp"/><feDisplacementMap in="SourceGraphic" in2="warp" scale="4" result="bark"/><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .62  0 0 0 0 .54  0 0 0 0 .45  0 0 0 1.8 -1.15"/><feComposite in2="bark" operator="in" result="grain"/><feMerge><feMergeNode in="bark"/><feMergeNode in="grain"/></feMerge></filter></defs>`;
  return `<div class="sakura-art"><svg class="sakura-bark" viewBox="0 0 660 600" aria-hidden="true">${defs}<g><path d="M18 30C40 52 62 74 92 96" stroke="#8E8580" stroke-width="22" stroke-linecap="round" opacity=".18" fill="none" filter="url(#sb-rough)"/><g mask="url(#sb-mask)" filter="url(#sb-rough)" fill="none" stroke="url(#sb-bark)" stroke-linecap="round">${bark.map(([d,w])=>`<path d="${d}" stroke-width="${w}"/>`).join('')}</g><g mask="url(#sb-mask)" fill="none" stroke="#8F7B66" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="14 9 4 11" opacity=".7"><path d="M40 52C62 74 86 94 112 104M120 108C156 128 184 160 214 198M222 210C250 238 284 260 316 284M330 296C356 314 380 328 404 336M420 350C450 364 474 384 498 400M128 128C150 160 172 186 198 208M212 228C232 252 246 272 262 286"/></g><g fill="#6E5B37">${nodes.map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="3.5" transform="rotate(40 ${x} ${y})"/>`).join('')}</g><g fill="none" stroke="#7E7740" stroke-width="2.2" stroke-linecap="round"><path d="M250 136C262 132 270 130 276 132M352 338C362 324 368 304 368 292M226 318C230 326 236 334 240 338M548 386C552 382 554 380 556 378M462 440C460 446 458 450 458 452M405 342C396 346 390 346 384 348"/></g></g></svg><svg class="sakura-bloom" viewBox="0 0 660 600" aria-hidden="true">${buds.map(sakuraBud).join('')}${flowers.map(sakuraFlower).join('')}</svg></div>`;
}

// OTTOYAMI logo, redrawn as SVG in three formats. textLength pins every word to the original layout.
const MONO = `font-family="ui-monospace,'Cascadia Mono','SF Mono',Menlo,Consolas,monospace"`;
const JP = `font-family="'Yu Gothic','Hiragino Sans','Noto Sans JP','Meiryo',sans-serif" font-weight="700"`;
const SANS_BOLD = `font-family="'DM Sans',Arial,sans-serif" font-weight="600"`;
const SLAB = `font-family="'Courier New',Courier,monospace" font-weight="700"`;
const sushi = (x,y,s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#fff" stroke-linecap="round"><circle r="40" stroke-width="5"/><path d="M-36 4C-34-24-10-38 14-34C34-28 40-6 34 14C26 34 2 40-16 34C-30 28-36 18-35 6M-28 2C-27-18-10-28 8-27C24-24 30-8 27 8C22 24 4 30-10 26" stroke-width="2.5"/><rect x="-11" y="-11" width="22" height="22" rx="7" stroke-width="5"/><circle r="4" fill="#fff" stroke="none"/><path d="M-78 82L86 40M-80 92L90 76" stroke-width="5"/></g>`;
export function LogoWide(className='') {
  return `<svg class="logo logo--wide ${className}" viewBox="0 0 1500 462" aria-hidden="true"><rect width="1500" height="462" fill="#0B0B0B"/><rect x="36" y="36" width="1428" height="390" fill="#fff"/><g fill="#0B0B0B"><rect x="54" y="54" width="1162" height="230"/><rect x="1234" y="54" width="216" height="230"/><rect x="54" y="302" width="424" height="108"/><rect x="496" y="302" width="954" height="108"/></g><g fill="#fff"><text x="96" y="228" font-size="172" ${MONO} textLength="1064" lengthAdjust="spacingAndGlyphs">OTTOYAMI</text><text x="146" y="380" font-size="66" ${JP} textLength="232" lengthAdjust="spacingAndGlyphs">フレッシュ</text><text x="572" y="370" font-size="38" ${SANS_BOLD} letter-spacing="3" textLength="304" lengthAdjust="spacingAndGlyphs">ASIA CUISINE</text><rect x="906" y="354" width="216" height="5"/><text x="1154" y="370" font-size="40" ${SANS_BOLD} textLength="232" lengthAdjust="spacingAndGlyphs">cook fresh</text></g>${sushi(1342,140,.95)}</svg>`;
}
export function LogoTall(className='') {
  return `<svg class="logo logo--tall ${className}" viewBox="0 0 226 365" aria-hidden="true"><rect width="226" height="365" fill="#0B0B0B"/><rect x="52" y="8" width="166" height="349" fill="#fff"/><g fill="#0B0B0B"><rect x="60" y="16" width="150" height="164"/><rect x="60" y="188" width="150" height="161"/></g><g fill="#fff"><text x="72" y="84" font-size="46" ${MONO} textLength="124" lengthAdjust="spacingAndGlyphs">OTTO</text><text x="72" y="146" font-size="46" ${MONO} textLength="124" lengthAdjust="spacingAndGlyphs">YAMI</text><text x="80" y="240" font-size="24" ${JP} textLength="112" lengthAdjust="spacingAndGlyphs">フレッシュ</text><text x="86" y="282" font-size="19" ${SLAB} textLength="62" lengthAdjust="spacingAndGlyphs">SUSHI</text><text x="86" y="306" font-size="19" ${SLAB} textLength="92" lengthAdjust="spacingAndGlyphs">&amp; GRILL</text><g transform="translate(20 14) rotate(90)"><text x="0" y="0" font-size="13" ${SLAB} textLength="140" lengthAdjust="spacingAndGlyphs">ASIA CUISINE</text><rect x="156" y="-6" width="80" height="1.5"/><text x="252" y="0" font-size="13" ${SLAB} textLength="88" lengthAdjust="spacingAndGlyphs">cook fresh</text></g></g></svg>`;
}
export function LogoSquare(className='') {
  return `<svg class="logo logo--square ${className}" viewBox="0 0 300 186" aria-hidden="true"><rect width="300" height="186" fill="#0B0B0B"/><rect x="14" y="14" width="272" height="138" fill="#fff"/><g fill="#0B0B0B"><rect x="19" y="19" width="129" height="128"/><rect x="153" y="19" width="128" height="128"/></g><g fill="#fff"><text x="30" y="74" font-size="42" ${MONO} textLength="106" lengthAdjust="spacingAndGlyphs">OTTO</text><text x="30" y="126" font-size="42" ${MONO} textLength="106" lengthAdjust="spacingAndGlyphs">YAMI</text><text x="166" y="62" font-size="22" ${JP} textLength="104" lengthAdjust="spacingAndGlyphs">フレッシュ</text><text x="172" y="98" font-size="17" ${SLAB} textLength="56" lengthAdjust="spacingAndGlyphs">SUSHI</text><text x="172" y="121" font-size="17" ${SLAB} textLength="84" lengthAdjust="spacingAndGlyphs">&amp; GRILL</text><text x="14" y="174" font-size="11" ${SLAB} textLength="106" lengthAdjust="spacingAndGlyphs">ASIA CUISINE</text><rect x="130" y="169" width="64" height="1.3"/><text x="212" y="174" font-size="11" ${SLAB} textLength="74" lengthAdjust="spacingAndGlyphs">cook fresh</text></g></svg>`;
}

// Blossoming cherry tree for the footer edge: a gnarled trunk on the right and a long, branching limb reaching left.
export function SakuraTree() {
  const rnd = rand(2024);
  const between = (a,b) => a+(b-a)*rnd();
  // Catmull-Rom points → cubic segments so every limb bends smoothly.
  const smooth = pts => pts.slice(0,-1).map((p,i)=>{const a=pts[i-1]||p,b=pts[i+1],c=pts[i+2]||b;return [p,[p[0]+(b[0]-a[0])/6,p[1]+(b[1]-a[1])/6],[b[0]-(c[0]-p[0])/6,b[1]-(c[1]-p[1])/6],b];});
  const limbs=[], blooms=[], leaves=[], buds=[];
  const limb = (pts,w0,w1) => smooth(pts).forEach((seg,i,all)=>limbs.push(`<path d="M${seg[0].map(f)}C${seg.slice(1).map(p=>p.map(f).join(' ')).join(' ')}" stroke-width="${f(lerp(w0,w1,i/Math.max(1,all.length-1)))}"/>`));
  const cluster = (x,y,n,spread,size=1) => {
    for(let i=0;i<n;i++){const a=rnd()*Math.PI*2,d=Math.sqrt(rnd())*spread*1.35;blooms.push([x+Math.cos(a)*d,y+Math.sin(a)*d*.8,size*between(.55,.9),rnd()*72,rnd()<.3?between(.5,.75):1,rnd()<.45]);}
    for(let i=0;i<Math.ceil(n/3);i++){const a=rnd()*Math.PI*2,d=spread*between(.6,1.2);buds.push([x+Math.cos(a)*d,y+Math.sin(a)*d,a*180/Math.PI,between(.7,1.1)]);}
    for(let i=0;i<Math.ceil(n/4);i++){const a=rnd()*Math.PI*2,d=spread*between(.5,1.1);leaves.push([x+Math.cos(a)*d,y+Math.sin(a)*d,a*180/Math.PI,between(.7,1.2),rnd()<.5]);}
  };
  // Twigs fork off a limb, bend a little at every joint and end in blossom clusters.
  const twig = (x,y,angle,len,w,depth) => {
    const pts=[[x,y]];let a=angle;
    for(let i=1;i<=4;i++){a+=between(-18,18);const p=pts.at(-1);pts.push([p[0]+Math.cos(a*Math.PI/180)*len/4,p[1]+Math.sin(a*Math.PI/180)*len/4]);}
    limb(pts,w,Math.max(1,w*.35));
    const end=pts.at(-1);cluster(end[0],end[1],Math.round(between(3,6)*(depth+1)/2+1),10+depth*5,.9);
    if(depth>0) pts.slice(1,4).forEach(p=>{if(rnd()<.6) twig(p[0],p[1],angle+between(25,50)*(rnd()<.5?-1:1),len*between(.4,.6),w*.55,depth-1);});
    pts.slice(1,-1).forEach(p=>{if(rnd()<.5) cluster(p[0],p[1],2,8,.8);});
  };
  const main=[[958,120],[900,96],[830,98],[760,82],[690,88],[620,104],[550,108],[480,122],[410,128],[340,148],[270,166],[200,186],[130,204],[70,222],[40,232]];
  limb(main,30,2.4);
  limb([[892,104],[860,150],[828,200],[800,246],[786,300],[780,346]],13,2);
  [[760,82,-110,90,6,2],[690,88,-140,70,5,1],[620,104,120,80,5,2],[550,108,-120,70,4.5,1],[480,122,-150,60,4,1],[410,128,110,70,4,2],[340,148,-130,60,3.5,1],[270,166,120,60,3,1],[200,186,-140,50,3,1],[130,204,140,40,2.5,0],[860,150,170,80,5,2],[828,200,140,70,4,1],[800,246,190,60,3.5,1],[900,96,-100,60,6,1]]
    .forEach(([x,y,a,l,w,d])=>twig(x,y,a,l,w,d));
  // Dense canopy close to the trunk, thinning out toward the tip of the limb.
  [[900,84,11,34],[860,66,9,30],[830,122,8,28],[800,76,7,26],[884,144,6,24],[760,66,5,22],[720,100,3,18],[650,92,3,14],[60,226,2,10]].forEach(([x,y,n,sp])=>cluster(x,y,n,sp));
  const trunk = `<path d="M1000 0V420H936C946 384 928 350 942 304C954 262 930 228 944 188C956 150 930 128 948 96C962 70 944 40 964 0Z" fill="url(#st-trunk)" filter="url(#st-rough)" mask="url(#st-fade)"/><g fill="none" stroke="#2E241D" stroke-linecap="round" opacity=".5"><path d="M962 60c6-3 14-2 20 1M955 162c8-4 17-3 24 2M964 246c5-2 11-1 16 2M951 330c7-3 15-2 21 1" stroke-width="1.6"/><ellipse cx="972" cy="122" rx="9" ry="13" stroke-width="2.4"/><path d="M968 116c3 4 3 9 0 13M980 196c-6 22-4 44 4 62M958 20c-4 18-2 34 4 46" stroke-width="2"/></g><path d="M948 96C932 128 952 150 944 188C936 222 952 262 944 304" fill="none" stroke="#2E241D" stroke-width="3" opacity=".45"/>`;
  const petal = 'M0 0C-2.6-1.2-6-4.4-5.8-7.2C-5.6-9.2-3.6-10.2-1.4-10.1L0-9.4L1.4-10.1C3.6-10.2 5.6-9.2 5.8-7.2C6-4.4 2.6-1.2 0 0Z';
  const defs = `<defs><radialGradient id="st-petal2" cx="0" cy="0" r="10" gradientUnits="userSpaceOnUse"><stop stop-color="#E7A4B2"/><stop offset=".35" stop-color="#F8E0E4"/><stop offset="1" stop-color="#FEF5F5"/></radialGradient><linearGradient id="st-fadeg" x1="0" y1="0" x2="0" y2="420" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="st-fade" maskUnits="userSpaceOnUse" x="900" y="0" width="100" height="420"><rect x="900" width="100" height="420" fill="url(#st-fadeg)"/></mask><radialGradient id="st-petal" cx="0" cy="0" r="10" gradientUnits="userSpaceOnUse"><stop stop-color="#E8A1B1"/><stop offset=".45" stop-color="#F5CFD6"/><stop offset="1" stop-color="#FBE8EA"/></radialGradient><linearGradient id="st-trunk" x1="930" x2="1000" gradientUnits="userSpaceOnUse"><stop style="stop-color:var(--trunk-1)"/><stop offset=".5" style="stop-color:var(--trunk-2)"/><stop offset="1" style="stop-color:var(--trunk-3)"/></linearGradient><linearGradient id="st-bark" x1="980" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse"><stop style="stop-color:var(--limb-1)"/><stop offset="1" style="stop-color:var(--limb-2)"/></linearGradient><filter id="st-rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="7" result="warp"/><feDisplacementMap in="SourceGraphic" in2="warp" scale="3.5" result="bark"/><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .48  0 0 0 0 .4  0 0 0 1.7 -1.1"/><feComposite in2="bark" operator="in" result="grain"/><feMerge><feMergeNode in="bark"/><feMergeNode in="grain"/></feMerge></filter>${['','2'].map(k=>`<g id="st-flower${k}">${Array.from({length:5},(_,i)=>`<path transform="rotate(${i*72})" d="${petal}" fill="url(#st-petal${k})" stroke="#D9A2AA" stroke-width=".35"/>`).join('')}<circle r="1.3" fill="#C25B78"/><g fill="#C99A2E">${Array.from({length:8},(_,i)=>`<circle cx="${f(Math.cos(i*.785)*3.4)}" cy="${f(Math.sin(i*.785)*3.4)}" r=".45"/>`).join('')}</g></g>`).join('')}<path id="st-bud" d="M0 0C2-3 7-4 10 0C7 4 2 3 0 0Z" fill="#E48A9F" stroke="#C2607A" stroke-width=".4"/><path id="st-leaf" d="M0 0C4-4 11-5 16-2C11 2 4 3 0 0Z"/></defs>`;
  const use = (id,[x,y,s,r,sy=1],extra='') => `<use href="#${id}" transform="translate(${f(x)} ${f(y)}) rotate(${f(r)}) scale(${f(s*100)/100} ${f(s*sy*100)/100})"${extra}/>`;
  return `<svg class="sakura-tree" viewBox="0 0 1000 420" aria-hidden="true">${defs}<g fill="none" stroke="url(#st-bark)" stroke-linecap="round" filter="url(#st-rough)">${limbs.join('')}</g>${trunk}${leaves.map(([x,y,r,s,red])=>use('st-leaf',[x,y,s,r],` fill="${red?'#9A5B3B':'#8C9150'}"`)).join('')}${buds.map(([x,y,r,s])=>use('st-bud',[x,y,s,r])).join('')}${blooms.map(b=>use(b[5]?'st-flower2':'st-flower',b)).join('')}</svg>`;
}

// Koi seen from above, head toward +x. One body silhouette, four classic varieties painted inside it.
const KOI_BODY = 'M60 0C60-12 48-20 30-21C5-22-25-14-48-5C-56-2-56 2-48 5C-25 14 5 22 30 21C48 20 60 12 60 0Z';
const KOI_FIN = 'M27-16C18-38-2-52-20-50C-8-40 6-29 18-17Z';
const KOI_TAIL = 'M-44 0C-62-6-82-26-106-34C-98-18-93-7-86 0C-93 7-98 18-106 34C-82 26-62 6-44 0Z';
const koiVarieties = {
  // Kohaku: white with red patches.
  kohaku: {base:'#F7F1E8', marks:'<ellipse cx="38" cy="-3" rx="17" ry="13" fill="#D8432B"/><path d="M14 10C6-8 22-18 6-20C-8-14-4 4-14 14C-2 20 10 18 14 10Z" fill="#D8432B"/><ellipse cx="-30" cy="-3" rx="13" ry="7" fill="#D8432B"/>', fin:'#FBF7F1'},
  // Tancho: white with a single red crown, the most Japanese of all koi.
  tancho: {base:'#F8F4EE', marks:'<circle cx="40" cy="0" r="9.5" fill="#D23A2A"/>', fin:'#FBF8F3'},
  // Yamabuki ogon: solid gold with a lighter back.
  yamabuki: {base:'#F0A13A', marks:'<path d="M58 0C40-6 0-8-46 0C0 8 40 6 58 0Z" fill="#F8C66A" opacity=".8"/><g fill="#F9D58E" opacity=".55">'+Array.from({length:14},(_,i)=>`<circle cx="${40-i*6}" cy="${(i%2?4:-4)}" r="1.4"/>`).join('')+'</g>', fin:'#F6C978'},
  // Showa: black body with red and white.
  showa: {base:'#211D1F', marks:'<path d="M54 0C50-14 34-18 22-12C30-2 26 10 40 14C50 12 56 8 54 0Z" fill="#D8432B"/><path d="M12-20C2-10 0 6-8 20C4 20 14 14 18 4C20-6 18-14 12-20Z" fill="#F4EDE3"/><ellipse cx="-24" cy="2" rx="12" ry="7" fill="#D8432B"/>', fin:'#E9E2D8'},
};
function koi(variety,[x,y,angle,scale]) {
  const v=koiVarieties[variety];
  const fin=(side)=>`<path class="koi-fin" d="${KOI_FIN}" transform="scale(1 ${side})" fill="${v.fin}" fill-opacity=".7" stroke="#ffffff55" stroke-width=".6"/><path d="M24-17L-14-46M22-17L-4-44M20-17L4-38" transform="scale(1 ${side})" stroke="#ffffff70" stroke-width=".6" class="koi-fin-rays"/>`;
  return `<g class="koi" data-variety="${variety}" transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><ellipse cx="0" cy="6" rx="62" ry="20" fill="#000" opacity=".16" class="koi-shadow"/><g class="koi-tail"><path d="${KOI_TAIL}" fill="${v.fin}" fill-opacity=".72"/><path d="M-50 0L-100-28M-50 0L-96-16M-50 0L-90-5M-50 0L-90 5M-50 0L-96 16M-50 0L-100 28" stroke="#ffffff70" stroke-width=".7"/></g>${fin(1)}${fin(-1)}<path d="M-14 13C-22 22-30 24-36 22C-30 18-24 14-20 11ZM-14-13C-22-22-30-24-36-22C-30-18-24-14-20-11Z" fill="${v.fin}" fill-opacity=".6"/><g clip-path="url(#koi-clip)"><path d="${KOI_BODY}" fill="${v.base}"/>${v.marks}<path d="M50 0C30-2 0-2-46 0" stroke="#fff" stroke-opacity=".28" stroke-width="3" fill="none"/></g><path d="${KOI_BODY}" fill="none" stroke="#00000022" stroke-width=".8"/><circle cx="48" cy="-9.5" r="1.6" fill="#1b1b1b"/><circle cx="48" cy="9.5" r="1.6" fill="#1b1b1b"/></g>`;
}
// A quiet pond under the sakura branch; app.js lets the koi wander and ripples bloom where petals land.
export function KoiPond() {
  const fish=[['kohaku',[130,150,-20,.62]],['tancho',[270,100,160,.54]]];
  const rings=[[90,120,26],[290,160,18],[200,200,34]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.45}"/>`).join('');
  return `<div class="koi-pond" aria-hidden="true"><svg viewBox="0 0 400 250"><defs><clipPath id="koi-clip"><path d="${KOI_BODY}"/></clipPath></defs><g class="pond-rings" fill="none">${rings}</g>${fish.map(([v,p])=>koi(v,p)).join('')}</svg></div>`;
}

// Stamp-style line ornaments in the brand red: chopsticks, peony, water and a koi.
const ornament = (name,viewBox,body) => `<svg class="ornament ornament--${name}" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
export const Chopsticks = () => ornament('chopsticks','0 0 64 64','<path d="M6 12L10 8L58 50L56 53ZM6 22L10 18L58 58L56 61Z"/><path d="M15 13L19 9M15 23L19 19"/>');
export function Peony() {
  const scallop=(r,n,amp,rot)=>{const pts=Array.from({length:97},(_,i)=>{const t=i/96*Math.PI*2;const rr=r+amp*Math.abs(Math.sin(n*t/2+rot));return `${(32+Math.cos(t)*rr).toFixed(1)} ${(32+Math.sin(t)*rr).toFixed(1)}`;});return `M${pts.join('L')}Z`;};
  const leaves=[45,135,225,315].map(a=>`<g transform="rotate(${a} 32 32)"><path d="M32 8C26 4 26-4 32-8C38-4 38 4 32 8Z" transform="translate(0 -6)"/><path d="M32 2V-12"/></g>`).join('');
  return ornament('peony','-6 -6 76 76',`${leaves}<path d="${scallop(17,7,4,0)}" fill="var(--color-background)"/><path d="${scallop(11,5,3,.6)}"/><path d="M32 26C38 26 40 32 36 36C32 40 26 36 27 31C28 27 33 27 34 31"/>`);
}
export const WaterLines = () => ornament('water','0 0 64 64',Array.from({length:4},(_,i)=>`<path d="M${17+i*9} 2C${11+i*9} 8 ${23+i*9} 14 ${17+i*9} 20C${11+i*9} 26 ${23+i*9} 32 ${17+i*9} 38C${11+i*9} 44 ${23+i*9} 50 ${17+i*9} 56"/>`).join(''));
export const KoiLine = () => ornament('koi','-100 -50 170 100',`<g transform="rotate(-35)"><path d="${KOI_BODY}"/><path d="${KOI_TAIL}"/><path d="${KOI_FIN}"/><path d="${KOI_FIN}" transform="scale(1 -1)"/><path d="M-50 0L-86-14M-50 0L-86 14" stroke-width="1.4"/>${Array.from({length:5},(_,i)=>`<path d="M${24-i*13} -14C${18-i*13} -6 ${18-i*13} 6 ${24-i*13} 14" stroke-width="1.4"/>`).join('')}<circle cx="48" cy="-9" r="1.5" fill="currentColor"/><circle cx="48" cy="9" r="1.5" fill="currentColor"/></g>`);
// One quiet band of stamps, used once as the opening divider instead of scattering them around the page.
export const OrnamentDivider = () => `<div class="ornament-divider" aria-hidden="true"><span></span>${Chopsticks()}${Peony()}${WaterLines()}${KoiLine()}<span></span></div>`;
