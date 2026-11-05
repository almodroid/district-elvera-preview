/* District Elvera · conceptual palace. Standalone SVG renderer, no dependencies. */
(() => {
  'use strict';
  const viewBox = '0 0 1100 760';
  const roomCopy = Object.freeze({
    hall: 'The grand hall: a soaring ceremonial heart, framed by twin colonnades and an imperial stair.',
    suites: 'The private wings: paired suites, dressing rooms and baths, set apart from the ceremonial rooms.',
    library: 'The library: walls of books, a generous reading table and a quieter rhythm in the west wing.',
    dining: 'The dining room: a long banquet table, connected to the hall and the east-wing salons.',
    gardens: 'The gardens: formal parterres, open terraces and a conservatory draw the palace into the landscape.'
  });
  const defaultCopy = 'A complete conceptual palace unfolds around the grand hall. Select a space to explore the whole.';
  const C = { paper: '#f5f0e5', stone: '#ded2bd', pale: '#f5efdf', wall: '#e7dcc7',
    edge: '#a3967c', gold: '#a58b5a', darkGold: '#85714d', shade: '#b9aa8f',
    ink: '#72664f', olive: '#929c7b', leaf: '#7e8967', green: '#c6c9b4', cream: '#fffaf0' };
  const rooms = [
    { id: 'hall', name: 'GRAND HALL', group: 'hall', x: 300, z: 122, w: 240, d: 270, color: '#eee3ce' },
    { id: 'gallery', name: 'GRAND GALLERY', group: 'hall', x: 300, z: 28, w: 240, d: 82, color: '#e8ddc8' },
    { id: 'foyer', name: 'CEREMONIAL FOYER', group: 'hall', x: 300, z: 404, w: 240, d: 92, color: '#e8ddc8' },
    { id: 'west-suite', name: 'WEST SUITE', group: 'suites', x: 40, z: 28, w: 118, d: 158, color: '#ded1bb' },
    { id: 'west-dressing', name: 'DRESSING', group: 'suites', x: 170, z: 28, w: 118, d: 70, color: '#e4d9c7' },
    { id: 'west-bath', name: 'BATH', group: 'suites', x: 170, z: 110, w: 118, d: 76, color: '#d9d5c7' },
    { id: 'library', name: 'LIBRARY', group: 'library', x: 40, z: 198, w: 248, d: 126, color: '#d9c8ac' },
    { id: 'music', name: 'MUSIC SALON', x: 40, z: 336, w: 118, d: 160, color: '#e1d6c1' },
    { id: 'drawing', name: 'DRAWING ROOM', x: 170, z: 336, w: 118, d: 160, color: '#e9dfcd' },
    { id: 'east-suite', name: 'EAST SUITE', group: 'suites', x: 552, z: 28, w: 118, d: 158, color: '#ded1bb' },
    { id: 'east-dressing', name: 'DRESSING', group: 'suites', x: 682, z: 28, w: 118, d: 70, color: '#e4d9c7' },
    { id: 'east-bath', name: 'BATH', group: 'suites', x: 682, z: 110, w: 118, d: 76, color: '#d9d5c7' },
    { id: 'dining', name: 'DINING ROOM', group: 'dining', x: 552, z: 198, w: 248, d: 126, color: '#e5d7be' },
    { id: 'morning', name: 'MORNING SALON', x: 552, z: 336, w: 118, d: 160, color: '#e5dbc9' },
    { id: 'conservatory', name: 'CONSERVATORY', group: 'gardens', x: 682, z: 336, w: 118, d: 160, color: '#d2d5c0' },
    { id: 'west-terrace', name: 'WEST TERRACE', group: 'gardens', x: 40, z: 516, w: 248, d: 34, color: '#ddd5c3' },
    { id: 'portico', name: 'ARRIVAL PORTICO', group: 'hall', x: 300, z: 508, w: 240, d: 42, color: '#ece2ce' },
    { id: 'east-terrace', name: 'EAST TERRACE', group: 'gardens', x: 552, z: 516, w: 248, d: 34, color: '#ddd5c3' }
  ];
  const fixed = n => Number(n.toFixed(2));
  const clamp = n => Math.max(0, Math.min(1, Number.isFinite(Number(n)) ? Number(n) : 0));

  function render(amount, selectedRoom = '') {
    const t = clamp(amount), selected = Object.prototype.hasOwnProperty.call(roomCopy, selectedRoom) ? selectedRoom : '';
    const a = .96 - .15 * t, b = .29 * t, c = -.47 * t, d = .95 - .48 * t;
    const ox = 550 - 420 * a - 305 * c, oy = 380 + 50 * t - 420 * b - 305 * d;
    const P = (x, z, h = 0) => [fixed(ox + x * a + z * c), fixed(oy + x * b + z * d - h * t)];
    const pair = p => p.join(' ');
    const pts = vertices => vertices.map(v => pair(P(v[0], v[1], v[2] || 0))).join(' ');
    const poly = (v, fill, stroke = C.edge, sw = .6, extra = '') => `<polygon points="${pts(v)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`;
    const line = (v, color = C.edge, sw = .65, extra = '') => `<polyline points="${pts(v)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
    const rect = (x, z, w, depth, h, fill, stroke = C.edge, sw = .6, extra = '') => poly([[x,z,h],[x+w,z,h],[x+w,z+depth,h],[x,z+depth,h]],fill,stroke,sw,extra);
    const circle = (x,z,r,h,fill,stroke=C.edge,sw=.5) => poly(Array.from({length:24},(_,i)=>[x+Math.cos(i*Math.PI/12)*r,z+Math.sin(i*Math.PI/12)*r,h]),fill,stroke,sw);
    const box = (x,z,w,depth,h,fill=C.pale,base=2) => {
      let s = '';
      if (t > .005 && h > base) {
        s += poly([[x,z+depth,base],[x+w,z+depth,base],[x+w,z+depth,h],[x,z+depth,h]], C.shade, C.edge,.45);
        s += poly([[x+w,z,base],[x+w,z+depth,base],[x+w,z+depth,h],[x+w,z,h]], '#c8b99e', C.edge,.45);
      }
      return s + rect(x,z,w,depth,h,fill,C.edge,.5);
    };
    const objects = [];
    const put = (x,z,draw,offset=0) => objects.push({depth:x*.29+z*.47+offset,draw});
    const floorGrid = (r,step=28) => {
      let s = '';
      for(let x=r.x+step;x<r.x+r.w;x+=step) s+=line([[x,r.z,2.1],[x,r.z+r.d,2.1]],'#f7f1e5',.65);
      for(let z=r.z+step;z<r.z+r.d;z+=step) s+=line([[r.x,z,2.1],[r.x+r.w,z,2.1]],'#f7f1e5',.65);
      return s;
    };
    const octagon = (x,z,r,h,fill,stroke=C.gold,sw=.8) => poly(Array.from({length:8},(_,i)=>[x+Math.cos(Math.PI/8+i*Math.PI/4)*r,z+Math.sin(Math.PI/8+i*Math.PI/4)*r,h]),fill,stroke,sw);
    const rosette = (x,z,r,h=3) => {
      let s = circle(x,z,r,h,'#e1d1b1',C.gold,.75)+circle(x,z,r-5,h+.05,'#f1e6ce',C.gold,.65);
      for(let i=0;i<8;i++){const angle=i*Math.PI/4; s+=poly([[x,z,h+.1],[x+Math.cos(angle-.16)*r*.7,z+Math.sin(angle-.16)*r*.7,h+.1],[x+Math.cos(angle)*r*.89,z+Math.sin(angle)*r*.89,h+.1],[x+Math.cos(angle+.16)*r*.7,z+Math.sin(angle+.16)*r*.7,h+.1]],i%2?'#c1ab7d':'#ab9260','none');}
      return s+circle(x,z,r*.22,h+.2,C.pale,C.gold,.6);
    };
    const seat = (x,z,w=42,depth=22,rotation=false) => {
      let s=box(x,z,w,depth,13,'#f5eddd');
      s+=box(x,z,rotation?7:w,rotation?depth:7,23,'#d7c8ae');
      s+=rect(x+7,z+9,Math.max(5,w-14),Math.max(5,depth-12),14,'#eee5d4','#bdac8c',.4);
      return s;
    };
    const plant = (x,z,r=9) => {
      const q=P(x,z,15),rx=r*(1-.07*t),ry=r*(1-.4*t);
      return box(x-r*.67,z-r*.67,r*1.34,r*1.34,8,'#c7bda6')+`<ellipse cx="${q[0]}" cy="${q[1]}" rx="${fixed(rx)}" ry="${fixed(ry)}" fill="${C.olive}" stroke="#6f7c59" stroke-width=".65"/><path d="M${fixed(q[0]-rx*.45)} ${fixed(q[1]-ry*.22)}Q${q[0]} ${fixed(q[1]-ry*.6)} ${fixed(q[0]+rx*.38)} ${fixed(q[1]-ry*.18)}" fill="none" stroke="#b5bd9e" stroke-width=".75"/>`;
    };
    const column = (x,z,h=94,r=4.5) => {
      let s=box(x-r-2,z-r-2,(r+2)*2,(r+2)*2,5,'#e9dec7');
      if(t<.015) return s+circle(x,z,r,5,C.cream,C.gold,.65);
      const bottom=P(x,z,6),top=P(x,z,h-8),rr=r*(1-.08*t),ry=r*(1-.56*t);
      s+=`<path d="M${fixed(top[0]-rr)} ${top[1]}Q${top[0]} ${fixed(top[1]+ry)} ${fixed(top[0]+rr)} ${top[1]}L${fixed(bottom[0]+rr)} ${bottom[1]}Q${bottom[0]} ${fixed(bottom[1]+ry)} ${fixed(bottom[0]-rr)} ${bottom[1]}Z" fill="#f4ebd8" stroke="${C.edge}" stroke-width=".55"/>`;
      for(const f of [-.38,.24]) s+=`<path d="M${fixed(top[0]+rr*f)} ${fixed(top[1]+1)}L${fixed(bottom[0]+rr*f)} ${fixed(bottom[1]-1)}" stroke="${f<0?'#fffaf0':'#c8b898'}" stroke-width=".5"/>`;
      s+=box(x-r-1,z-r-1,(r+1)*2,(r+1)*2,h-3,'#efe3c9',h-8);
      s+=box(x-r-2,z-r-2,(r+2)*2,(r+2)*2,h,'#faf3e2',h-3);
      return s;
    };
    const arch = (x1,z1,x2,z2,h=104,spring=68,rise=23,fill=C.wall) => {
      if(t<.012) return line([[x1,z1,2],[x2,z2,2]],'#c3b28e',1.3);
      const A=P(x1,z1,h),B=P(x2,z2,h),R=P(x2,z2,spring),L=P(x1,z1,spring),M=P((x1+x2)/2,(z1+z2)/2,spring+2*rise);
      let s=`<path d="M${pair(A)}L${pair(B)}L${pair(R)}Q${pair(M)} ${pair(L)}Z" fill="${fill}" stroke="${C.edge}" stroke-width=".6"/>`;
      s+=line([[x1,z1,h+2],[x2,z2,h+2]],C.cream,3.8);
      s+=line([[x1,z1,h+2],[x2,z2,h+2]],C.gold,.5);
      return s;
    };
    const windowArch = (x1,z1,x2,z2,bottom=17,top=58) => {
      if(t<.025)return '';
      const spring=top-9,A=P(x1,z1,bottom),B=P(x2,z2,bottom),R=P(x2,z2,spring),L=P(x1,z1,spring),M=P((x1+x2)/2,(z1+z2)/2,top+9),mid=(x1+x2)/2,midz=(z1+z2)/2;
      return `<path d="M${pair(A)}L${pair(B)}L${pair(R)}Q${pair(M)} ${pair(L)}Z" fill="#9f9b86" fill-opacity=".48" stroke="#fbf4e3" stroke-width="2.2"/>`+line([[mid,midz,bottom],[mid,midz,top-3]],'#e7dcc4',.75)+line([[x1,z1,32],[x2,z2,32]],'#e7dcc4',.75);
    };
    const wall = (x1,z1,x2,z2,h=56,windows=0) => {
      let s='';
      if(t>.005)s+=poly([[x1,z1,3],[x2,z2,3],[x2,z2,h],[x1,z1,h]],x1===x2?'#d8c9ae':'#e6dac3',C.edge,.55);
      const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),nx=-dz/len*3, nz=dx/len*3;
      s+=poly([[x1-nx,z1-nz,h],[x2-nx,z2-nz,h],[x2+nx,z2+nz,h],[x1+nx,z1+nz,h]],'#f9f2e1',C.edge,.5);
      if(t>.025){s+=line([[x1,z1,h-6],[x2,z2,h-6]],'#b8a585',.8);s+=line([[x1,z1,9],[x2,z2,9]],'#efe6d5',2.5);}
      for(let i=0;i<windows;i++){const center=(i+.5)/windows,half=Math.min(.13,9/len);s+=windowArch(x1+dx*(center-half),z1+dz*(center-half),x1+dx*(center+half),z1+dz*(center+half),17,Math.min(h-12,58));}
      return s;
    };
    const wallDoor = (x1,z1,x2,z2,h=56,gap=28) => {
      const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),f=(len-gap)/2/len;
      const A=[x1+dx*f,z1+dz*f], B=[x2-dx*f,z2-dz*f];
      let s=wall(x1,z1,...A,h)+wall(...B,x2,z2,h);
      if(t>.025)s+=arch(...A,...B,h,Math.max(20,h-23),13);
      else {const hinge=P(...A,2),end=P(...B,2),q=P(A[0]-dz/len*gap,A[1]+dx/len*gap,2);s+=`<path d="M${pair(end)}Q${pair(q)} ${pair(hinge)}" fill="none" stroke="#ab9a79" stroke-width=".6" stroke-dasharray="2 2"/>`;}
      return s;
    };

    let out='<title id="plan-title">From line to life: a complete conceptual palace</title><desc id="plan-description">An illustrative palace with a grand hall, imperial stair, colonnades, two private wings, library, dining room, salons, terraces and formal gardens. Move from the architectural plan to an open-roof isometric palace. Conceptual design, not to scale.</desc><defs><filter id="elvera-palace-shadow" x="-20%" y="-30%" width="140%" height="170%"><feGaussianBlur stdDeviation="9"/></filter></defs>';
    out+=poly([[18,9,-15],[822,9,-15],[822,563,-15],[18,563,-15]],'#7c70542c','none',0,'filter="url(#elvera-palace-shadow)"');
    out+=box(24,12,792,548,0,'#ece5d6',-10);
    out+=rect(32,20,776,488,1,'#f4eddf',C.edge,.9);
    // Formal forecourt and clipped garden parterres continue the palace's central axis.
    out+=rect(20,560,800,54,-2,'#e0d9c8','#bcaf97',.7);
    for(const x of [40,552]){
      out+=rect(x,568,248,36,0,selected==='gardens'?'#b3bb91':'#c9cdb7','#8f9b79',.8);
      out+=rect(x+7,575,234,22,1,'#e7deca','#a2aa88',.65);
      for(const dx of [14,143]){out+=rect(x+dx,578,91,16,2,'#94a180','#6f805e',.6);out+=line([[x+dx+8,586,3],[x+dx+83,586,3]],'#bbc5a6',1.6);}
      for(const dx of [5,124,243])put(x+dx,586,()=>plant(x+dx,586,8));
    }
    out+=rect(302,560,236,54,0,'#e8dfcd','#baac91',.6);
    for(let i=0;i<4;i++)out+=rect(294+i*3,550+i*4.5,252-i*6,4.5,-i*2,'#f3ead8','#b7aa8d',.5);
    for(const r of rooms){
      const active=selected && selected===r.group;
      out+=rect(r.x,r.z,r.w,r.d,2,active?'#ceb986':r.color,'#f9f3e6',.85);
      if(['hall','gallery','foyer','west-bath','east-bath','portico'].includes(r.id))out+=floorGrid(r,r.id==='hall'?30:24);
      else if(r.id==='library'||r.id==='dining'){
        for(let z=r.z+12;z<r.z+r.d;z+=12)out+=line([[r.x,z,2.1],[r.x+r.w,z,2.1]],'#e9ddc6',.5);
        for(let x=r.x+24;x<r.x+r.w;x+=48)out+=line([[x,r.z,2.1],[x,r.z+r.d,2.1]],'#e9ddc6',.45);
      }
      if(active)out+=rect(r.x+3,r.z+3,r.w-6,r.d-6,2.2,'none','#987b42',1.4);
    }
    // A marble carpet, compass rose and fine double inlay give the great room its scale.
    out+=rect(326,180,188,194,2.3,'#e4d6b7',C.gold,1);
    out+=rect(331,185,178,184,2.4,'#eee4cf',C.gold,.6);
    out+=rect(341,195,158,164,2.5,'none','#b19a6f',.65);
    out+=octagon(420,277,57,2.6,'#d4c09a',C.gold,.7)+octagon(420,277,50,2.7,'#f2e8d4',C.gold,.6)+rosette(420,277,40,2.8);
    for(const x of [345,495])for(const z of [199,355])out+=poly([[x,z-5,3],[x+5,z,3],[x,z+5,3],[x-5,z,3]],'#ad9566','none');
    out+=rosette(420,449,31,3);
    out+=rect(325,42,190,52,2.5,'none',C.gold,.8)+rect(330,47,180,42,2.6,'none','#c0ac84',.6);

    // Twin suites, with matching dressing rooms and freestanding baths.
    for(const x of [40,552]){
      put(x+59,99,()=>{
        let s=rect(x+11,55,96,108,3,'#c8b897','#a58f68',.65);
        s+=box(x+20,54,78,92,17,'#f8f1e3');s+=box(x+16,48,86,9,33,'#bbaa88');
        s+=box(x+25,59,30,18,20,C.cream)+box(x+63,59,30,18,20,C.cream);
        s+=rect(x+22,115,74,28,18,'#c0a77e','#a88d60',.4);
        s+=box(x+4,57,12,20,19,'#bb9e69')+box(x+102,57,12,20,19,'#bb9e69');
        return s+box(x+29,153,60,14,13,'#e3d7be');
      });
      const dressing=x+130;
      put(dressing+58,48,()=>{let s=box(dressing+8,34,102,15,31,'#dac9a9');for(let j=1;j<6;j++)s+=line([[dressing+8+j*17,34,31],[dressing+8+j*17,49,31]],'#ad9770',.6);return s+box(dressing+42,65,36,14,14,'#f1e7d4');});
      put(dressing+57,144,()=>{let s=box(dressing+24,124,74,32,15,'#faf6e9');s+=rect(dressing+30,129,62,22,16,'#c7c5b5','#b3ab94',.6);s+=box(dressing+8,165,102,14,23,'#c1ad87');s+=circle(dressing+37,171,6,24,'#f9f3e6')+circle(dressing+80,171,6,24,'#f9f3e6');return s;});
    }
    // Library shelves and reading furniture, rendered as volume rather than icons.
    put(167,212,()=>{let s=box(49,204,228,13,36,'#b29b74');for(let i=0;i<38;i++)s+=line([[53+i*5.8,217,9],[53+i*5.8,217,31]],i%3?'#d9c9a7':'#8d7855',1.4);s+=line([[49,217,19],[277,217,19]],'#e7d7b6',1.3);return s;});
    put(53,263,()=>{let s=box(45,226,14,76,32,'#b9a27a');for(let i=0;i<12;i++)s+=line([[59,230+i*5.8,9],[59,230+i*5.8,27]],'#e0cfaa',1);return s;});
    put(165,265,()=>{let s=rect(91,233,159,63,3,'#d7c7a7','#a48c61',.7);s+=box(115,247,113,34,17,'#bca37a');s+=rect(120,252,103,24,18,'#e8dabe','#997e53',.6);for(const x of [122,161,200]){s+=seat(x,226,21,15);s+=seat(x,287,21,15);}return s+rect(143,257,20,12,19,'#fbf3e1','#aa9977',.5)+rect(181,260,19,10,19,'#d2bea0','#aa9977',.5);});
    // Long ceremonial dining table, individual places and chairs.
    put(680,267,()=>{let s=rect(577,228,195,75,3,'#d6c3a1','#ac9162',.8);for(const x of [591,628,665,702,739]){s+=seat(x,229,19,15);s+=seat(x,288,19,15);}s+=seat(565,255,14,23,true)+seat(773,255,14,23,true);s+=box(585,249,182,33,19,'#f2ead8');s+=rect(594,260,164,11,20,'#bca77e','none');for(const x of [600,636,672,708,744]){s+=circle(x,254,5,20,'#fffaf0','#b3a180',.4)+circle(x,277,5,20,'#fffaf0','#b3a180',.4);}for(const x of [620,675,730])s+=circle(x,266,2.7,25,'#a8905d','#907341',.45);return s;});
    put(677,212,()=>box(582,204,190,13,26,'#bba37d'));
    // The imperial stair splits gracefully around its upper landing.
    put(420,150,()=>{let s=box(368,127,104,24,34,'#e7dcc5');for(let i=0;i<8;i++){s+=box(322,179-i*5,46,5,5+i*4,'#f5edda');s+=box(472,179-i*5,46,5,5+i*4,'#f5edda');}s+=line([[322,184,17],[322,140,48],[368,140,48]],C.gold,1.25)+line([[518,184,17],[518,140,48],[472,140,48]],C.gold,1.25);return s;});
    put(340,73,()=>seat(321,61,47,17));put(501,73,()=>seat(473,61,47,17));
    // Four distinct salons and the glazed garden room.
    put(99,413,()=>{let s=rect(55,359,89,102,3,'#cfc09f','#ac9771',.7);s+=poly([[67,372,20],[104,372,20],[120,382,20],[124,405,20],[110,420,20],[90,415,20],[67,411,20]],'#8b7961','#685f4d',.7);s+=rect(67,410,37,9,21,'#f8f0dc','#7e6a50',.6);for(let j=1;j<12;j++)s+=line([[67+j*3,410,21],[67+j*3,419,21]],'#8d806a',.5);return s+box(74,431,28,13,12,'#b6a07d');});
    put(229,418,()=>{let s=rect(182,363,94,102,3,'#d0c19f','#b09b75',.65);s+=seat(188,372,78,22)+seat(188,437,78,22);s+=box(208,408,38,22,12,'#b79c6e');return s+circle(227,419,8,13,'#e9ddc5',C.gold,.5);});
    put(611,414,()=>{let s=rect(568,360,85,110,3,'#d8c9ac','#b6a17b',.65);s+=seat(576,367,67,21)+seat(576,442,67,21);s+=circle(611,418,24,17,'#ede2ca','#aa9165',.8);s+=circle(611,418,7,18,'#c4ae80',C.gold,.5);return s;});
    for(const [x,z] of [[698,355],[785,355],[698,470],[785,470]])put(x,z,()=>plant(x,z,12));
    put(742,417,()=>{let s=rect(703,381,78,70,3,'#e8e1cd','#a7ac8f',.65);s+=seat(709,386,63,18)+seat(709,431,63,18);return s+circle(741,419,16,15,'#f4ebd8',C.gold,.6);});
    for(const x of [320,497])put(x,451,()=>box(x,426,23,44,14,'#e2d5bc'));
    for(const x of [91,215,603,727])put(x,534,()=>seat(x-24,522,48,16));

    // Articulated perimeter: arched windows, cornices and a low cutaway front.
    for(let i=0;i<8;i++){const x=32+i*97;put(x+48.5,20,()=>wall(x,20,x+97,20,76,2));}
    for(const [z,len,h] of [[20,172,70],[192,138,66],[330,178,54]]){
      put(32,z+len/2,()=>wall(32,z,32,z+len,h,Math.round(len/43)));
      put(808,z+len/2,()=>wall(808,z,808,z+len,44,Math.round(len/44)));
    }
    for(const x of [32,546]){
      put(x+131,192,()=>wallDoor(x,192,x+262,192,55,31));
      put(x+131,330,()=>wallDoor(x,330,x+262,330,43,31));
      put(x+131,508,()=>wall(x,508,x+262,508,22));
      // Cutaway front wall retains a sequence of pale stone pilasters.
      for(let j=0;j<6;j++)put(x+j*50+6,508,()=>box(x+j*50+2,502,8,12,29,'#f6edd8'));
    }
    for(const x of [164,676]){
      put(x,106,()=>wallDoor(x,20,x,192,53,26));
      put(x,419,()=>wallDoor(x,330,x,508,28,28));
      put(x+65,104,()=>wallDoor(x,104,x+130,104,47,25));
    }
    for(const x of [294,546]){
      put(x,68,()=>wallDoor(x,20,x,116,69,28));
      put(x,451,()=>wallDoor(x,398,x,508,42,34));
    }
    // Two tall arcades frame an unobstructed hall. Their open arches are true cut-outs.
    for(const x of [303,537]){
      const zs=[128,181,234,287,340,393];
      for(let i=0;i<zs.length;i++)put(x,zs[i],()=>column(x,zs[i],106,5));
      for(let i=0;i<zs.length-1;i++)put(x,(zs[i]+zs[i+1])/2,()=>arch(x,zs[i]+6,x,zs[i+1]-6,108,71,25),-1);
    }
    // Ceremonial gateways at either end of the axis.
    for(const z of [116,398]){
      for(const x of [305,365,475,535])put(x,z,()=>column(x,z,z===116?96:85,4.5));
      put(335,z,()=>arch(311,z,359,z,z===116?99:88,z===116?67:58,20));
      put(420,z,()=>arch(371,z,469,z,z===116?108:98,z===116?68:59,31));
      put(505,z,()=>arch(481,z,529,z,z===116?99:88,z===116?67:58,20));
    }
    // Six-column entrance portico with an entablature and sculpted pediment.
    for(const x of [310,354,398,442,486,530])put(x,550,()=>column(x,550,75,4.9));
    put(420,553,()=>{
      if(t<.02)return line([[299,553,3],[541,553,3]],C.gold,1.1);
      let s=box(297,501,246,56,84,'#efe4ce',78);
      s+=poly([[297,557,84],[543,557,84],[420,557,119]],'#e4d6b8',C.gold,.8);
      s+=poly([[313,557.1,87],[527,557.1,87],[420,557.1,112]],'#f4ead6','#b39a6e',.65);
      s+=line([[294,557,83],[420,557,121],[546,557,83]],C.cream,3);
      s+=line([[294,557,83],[420,557,121],[546,557,83]],C.gold,.55);
      const emblem=P(420,557.2,98);s+=`<ellipse cx="${emblem[0]}" cy="${emblem[1]}" rx="6" ry="${fixed(7*t)}" fill="#c2ab7e" stroke="#a58c5e" stroke-width=".6"/>`;
      return s;
    },3);

    objects.sort((x,y)=>x.depth-y.depth);
    out+=objects.map(o=>o.draw()).join('');
    // Labels stay legible in plan and quietly recede as the architecture rises.
    for(const r of rooms){
      const active=selected===r.group, yOffset=r.id==='hall'?242:r.d-9;
      const p=P(r.x+r.w/2,r.z+yOffset,3.6);
      const opacity=active?.95:(r.id==='hall'?.86:1-.66*t);
      out+=`<text x="${p[0]}" y="${p[1]}" text-anchor="middle" fill="${active?'#70582e':C.ink}" opacity="${fixed(opacity)}" font-size="${r.id==='hall'?10:r.w>180?8:6.6}" font-family="Arial, Helvetica, sans-serif" font-weight="${r.id==='hall'||active?600:400}" letter-spacing="${r.id==='hall'?2.5:1.05}">${r.name}</text>`;
    }
    // Discreet plan notation. This is a concept drawing, not a scaled sales plan.
    const north=P(842,33,0);
    out+=`<g transform="translate(${north[0]} ${north[1]})" stroke="${C.gold}" fill="none" opacity=".72"><path d="M0 25V-3M-4 4L0-3 4 4" stroke-width=".9"/><text x="0" y="-11" text-anchor="middle" fill="${C.ink}" stroke="none" font-family="Arial, Helvetica, sans-serif" font-size="7" letter-spacing="1">N</text></g>`;
    return out;
  }
  const target = typeof window === 'undefined' ? globalThis : window;
  target.ElveraPalace = Object.freeze({ render, roomCopy, defaultCopy, viewBox });
})();
