/* Sehat12 — program berat badan sehat 12 minggu.
   Semua data tersimpan di perangkat pengguna (localStorage + IndexedDB untuk foto). Tanpa server. */
(function(){
"use strict";

/* =========================================================
   1. DATA GIZI (perkiraan per porsi rumah tangga)
   Angka adalah perkiraan umum untuk membantu pencatatan, bukan nilai pasti.
   ========================================================= */
const FOODS = {
  // Makanan pokok
  nasi:{n:"Nasi putih",u:"centong (100 g)",k:130,p:2.4,c:"rice",g:"pokok"},
  nasimerah:{n:"Nasi merah",u:"centong (100 g)",k:110,p:2.6,c:"rice",g:"pokok"},
  nasigoreng:{n:"Nasi goreng",u:"piring",k:330,p:9,c:"rice",g:"pokok"},
  miegoreng:{n:"Mie goreng",u:"piring",k:400,p:10,c:"rice",g:"pokok"},
  mieinstan:{n:"Mie instan kuah",u:"bungkus",k:350,p:8,c:"rice",g:"pokok"},
  bubur:{n:"Bubur ayam",u:"mangkok",k:300,p:12,c:"rice",g:"pokok"},
  lontong:{n:"Lontong",u:"potong (50 g)",k:70,p:1,c:"rice",g:"pokok"},
  roti:{n:"Roti tawar",u:"lembar",k:70,p:2.5,c:"rice",g:"pokok"},
  kentang:{n:"Kentang rebus",u:"buah sedang",k:90,p:2,c:"rice",g:"pokok"},
  ubi:{n:"Ubi rebus",u:"buah sedang",k:110,p:1,c:"rice",g:"pokok"},
  jagung:{n:"Jagung rebus",u:"tongkol",k:100,p:3,c:"rice",g:"pokok"},
  // Lauk
  ayamgoreng:{n:"Ayam goreng",u:"potong paha",k:220,p:18,fried:true,c:"meat",g:"lauk"},
  ayambakar:{n:"Ayam bakar",u:"potong paha",k:165,p:19,c:"meat",g:"lauk"},
  dadaayam:{n:"Dada ayam rebus/panggang",u:"100 g",k:165,p:31,c:"meat",g:"lauk"},
  ayamgeprek:{n:"Ayam geprek",u:"porsi lauk",k:350,p:20,c:"meat",g:"lauk"},
  ikangoreng:{n:"Ikan goreng (lele/nila)",u:"ekor sedang",k:180,p:18,fried:true,c:"meat",g:"lauk"},
  ikanbakar:{n:"Ikan bakar",u:"potong",k:130,p:20,c:"meat",g:"lauk"},
  pepes:{n:"Pepes ikan",u:"bungkus",k:120,p:18,c:"meat",g:"lauk"},
  rendang:{n:"Rendang sapi",u:"potong",k:195,p:15,santan:true,c:"meat",g:"lauk"},
  sate:{n:"Sate ayam + bumbu",u:"5 tusuk",k:250,p:18,c:"meat",g:"lauk"},
  telur:{n:"Telur rebus",u:"butir",k:75,p:6,c:"egg",g:"lauk"},
  telurdadar:{n:"Telur dadar",u:"butir",k:120,p:7,c:"egg",g:"lauk"},
  telurceplok:{n:"Telur ceplok",u:"butir",k:110,p:6,c:"egg",g:"lauk"},
  tempe:{n:"Tempe goreng",u:"potong sedang",k:85,p:5,fried:true,c:"tempe",g:"lauk"},
  tempebacem:{n:"Tempe bacem",u:"potong",k:90,p:5,c:"tempe",g:"lauk"},
  tahugoreng:{n:"Tahu goreng",u:"potong",k:70,p:4,fried:true,c:"tempe",g:"lauk"},
  tahu:{n:"Tahu bacem",u:"potong",k:80,p:5,c:"tempe",g:"lauk"},
  // Hidangan berkuah / campur
  bakso:{n:"Bakso",u:"mangkok",k:300,p:15,c:"meat",g:"lauk"},
  soto:{n:"Soto ayam",u:"mangkok (tanpa nasi)",k:200,p:14,c:"meat",g:"lauk"},
  gado:{n:"Gado-gado",u:"porsi",k:300,p:12,c:"veg",g:"sayur"},
  pecel:{n:"Pecel sayur",u:"porsi",k:250,p:9,c:"veg",g:"sayur"},
  // Sayur
  sayurasem:{n:"Sayur asem",u:"mangkok",k:40,p:1.5,c:"veg",g:"sayur"},
  sayurbening:{n:"Sayur bening bayam",u:"mangkok",k:30,p:2,c:"veg",g:"sayur"},
  capcay:{n:"Cap cay",u:"porsi",k:100,p:5,c:"veg",g:"sayur"},
  kangkung:{n:"Tumis kangkung",u:"porsi",k:80,p:3,c:"veg",g:"sayur"},
  lodeh:{n:"Sayur lodeh",u:"mangkok",k:120,p:3,santan:true,c:"veg",g:"sayur"},
  daunsingkong:{n:"Gulai daun singkong",u:"sendok sayur",k:70,p:2,santan:true,c:"veg",g:"sayur"},
  lalapan:{n:"Lalapan",u:"porsi",k:15,p:1,c:"veg",g:"sayur"},
  // Buah
  pisang:{n:"Pisang",u:"buah",k:90,p:1,c:"fruit",g:"buah"},
  pepaya:{n:"Pepaya",u:"potong",k:40,p:0.5,c:"fruit",g:"buah"},
  apel:{n:"Apel",u:"buah",k:80,p:0.4,c:"fruit",g:"buah"},
  jeruk:{n:"Jeruk",u:"buah",k:50,p:1,c:"fruit",g:"buah"},
  semangka:{n:"Semangka",u:"potong",k:30,p:0.6,c:"fruit",g:"buah"},
  // Camilan
  sambal:{n:"Sambal",u:"sdm",k:20,p:0.3,c:"chili",g:"lain"},
  kerupuk:{n:"Kerupuk",u:"keping besar",k:50,p:0.5,c:"chili",g:"lain"},
  gorengan:{n:"Gorengan (bakwan/tahu isi)",u:"buah",k:120,p:2,c:"tempe",g:"lain"},
  martabak:{n:"Martabak manis",u:"potong",k:250,p:5,c:"tempe",g:"lain"},
  // Minuman
  air:{n:"Air putih",u:"gelas 250 ml",k:0,p:0,drink:true,water:250,c:"water",g:"minum"},
  esteh:{n:"Es teh",u:"gelas",k:0,p:0,drink:true,sugar:3,c:"tea",g:"minum"},
  tehtawar:{n:"Teh tawar",u:"gelas",k:0,p:0,drink:true,c:"tea",g:"minum"},
  kopi:{n:"Kopi hitam",u:"cangkir",k:5,p:0.3,drink:true,sugar:2,c:"coffee",g:"minum"},
  kopisusu:{n:"Kopi susu gula aren",u:"cup",k:120,p:5,drink:true,sugar:3,c:"coffee",g:"minum"},
  susu:{n:"Susu UHT",u:"kotak 200 ml",k:130,p:6,drink:true,c:"water",g:"minum"},
  jus:{n:"Jus jeruk",u:"gelas",k:110,p:1,drink:true,c:"tea",g:"minum"},
  soda:{n:"Minuman bersoda",u:"kaleng 330 ml",k:140,p:0,drink:true,c:"tea",g:"minum"},
  boba:{n:"Boba milk tea",u:"cup",k:350,p:3,drink:true,c:"coffee",g:"minum"}
};
const CATS = [["semua","Semua"],["pokok","Pokok"],["lauk","Lauk"],["sayur","Sayur"],["buah","Buah"],["minum","Minum"],["lain","Camilan"]];
const SUGAR_KCAL = 16; // 1 sdt gula ≈ 4 g ≈ 16 kkal

/* =========================================================
   2. PROGRAM 12 MINGGU
   ========================================================= */
const PHASES = {"Fondasi":"var(--green)","Bangun":"var(--sky)","Akselerasi":"var(--coral)","Kunci hasil":"var(--plum)"};
const PHASE_SOFT = {"Fondasi":"var(--green-soft)","Bangun":"var(--sky-soft)","Akselerasi":"var(--coral-soft)","Kunci hasil":"var(--plum-soft)"};
const PROGRAM = [
  ["Fondasi","Catat semua makan & minum","Belum defisit ketat; kenali pola, ganti minuman manis","Jalan 20–30 menit, 5 hari; tambah 1.000 langkah dari biasanya"],
  ["Fondasi","Isi Piringku di 1 kali makan sehari","Defisit sekitar 300 kkal","Jalan 30 menit, 5 hari; latihan beban badan 2×"],
  ["Fondasi","Tidur 7–9 jam & jadwal makan teratur","Protein di setiap makan","Kardio 120 menit/minggu; beban 2×"],
  ["Bangun","Isi Piringku di 2 kali makan sehari","Defisit 300–500 kkal","Kardio 150 menit/minggu; beban 2–3×, 2 set"],
  ["Bangun","Minum air sesuai target","Kurangi gorengan & santan kental","Kardio 150 menit/minggu; beban 3×, tambah repetisi"],
  ["Bangun","Strategi makan di luar & kondangan","Pilih menu warung/restoran yang lebih ringan","Kardio 150 menit/minggu; beban 3×, 3 set"],
  ["Akselerasi","Hadapi godaan & lapar emosional","Siapkan camilan sehat terencana","Kardio 150–200 menit/minggu; tambah beban (botol air/dumbel)"],
  ["Akselerasi","Kelola stres (napas, jalan santai)","Evaluasi porsi nasi","Kardio 180–200 menit/minggu; beban 3× progresi"],
  ["Akselerasi","Atasi plateau dengan tenang","Cek ulang kebutuhan kalori dengan berat baru","Variasi latihan; beban 3×"],
  ["Kunci hasil","Siapkan menu mingguan","Latih perkiraan porsi tanpa menimbang","Kardio 150–200 menit/minggu; beban 3×"],
  ["Kunci hasil","Susun rencana olahraga mandiri","Coba pola makan pemeliharaan 1–2 hari","Latihan pilihanmu sendiri"],
  ["Kunci hasil","Evaluasi akhir & rencana lanjut","Tentukan kalori pemeliharaan","Ulangi tes kebugaran minggu 1"]
];
const WORKOUTS = {
  pemula:[
    {n:"Pemanasan: jalan di tempat + putar sendi",d:"5 menit",f:"warm"},
    {n:"Squat ke kursi",d:"2 set × 10",f:"squat"},
    {n:"Push-up dinding",d:"2 set × 8",f:"push"},
    {n:"Glute bridge",d:"2 set × 12",f:"bridge"},
    {n:"Plank lutut",d:"2 set × 20 detik",f:"plank"},
    {n:"Jalan cepat",d:"20 menit, masih bisa bicara",f:"walk"},
    {n:"Pendinginan + peregangan",d:"5 menit",f:"stretch"}],
  menengah:[
    {n:"Pemanasan dinamis",d:"7 menit",f:"warm"},
    {n:"Squat",d:"3 set × 12",f:"squat"},
    {n:"Push-up lutut atau push-up",d:"3 set × 10",f:"push"},
    {n:"Glute bridge satu kaki",d:"3 set × 10 per kaki",f:"bridge"},
    {n:"Plank",d:"3 set × 30 detik",f:"plank"},
    {n:"Jalan cepat / jogging ringan",d:"25 menit",f:"walk"},
    {n:"Pendinginan + peregangan",d:"5 menit",f:"stretch"}],
  lanjut:[
    {n:"Pemanasan dinamis",d:"8 menit",f:"warm"},
    {n:"Squat dengan beban (botol/dumbel)",d:"3 set × 12",f:"squat"},
    {n:"Push-up",d:"3 set × 12",f:"push"},
    {n:"Hip thrust dengan beban",d:"3 set × 12",f:"bridge"},
    {n:"Plank",d:"3 set × 45 detik",f:"plank"},
    {n:"Jogging atau interval ringan",d:"25–30 menit",f:"walk"},
    {n:"Pendinginan + peregangan",d:"5 menit",f:"stretch"}]
};
const QUOTES = ["Disiplin kecil tiap hari mengalahkan semangat besar seminggu sekali.","Bukan soal sempurna, tapi soal konsisten.","Badan yang kamu bangun pelan-pelan, bertahan lebih lama.","Satu piring seimbang hari ini lebih berarti daripada rencana sempurna besok.","Lelah itu wajar. Berhenti total jangan."];

/* =========================================================
   3. PENYIMPANAN
   ========================================================= */
const KEY = "sehat12-data";
const blank = () => ({v:1, profile:null, startDate:null, xp:0, pot:"terracotta", pots:["terracotta"], days:{}, weights:[], favorites:[], chat:[]});
let S;
try{ S = JSON.parse(localStorage.getItem(KEY)) || blank() }catch(e){ S = blank() }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)) }catch(e){ toast("Penyimpanan HP penuh. Hapus beberapa foto lama.") } }

// Foto disimpan di IndexedDB (lebih besar dari localStorage)
let dbp = null;
function db(){ if(dbp) return dbp; dbp = new Promise((res,rej)=>{ try{ const r = indexedDB.open("sehat12-photos",1); r.onupgradeneeded=()=>r.result.createObjectStore("p"); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error) }catch(e){ rej(e) } }); return dbp }
async function putPhoto(id, data){ try{ const d=await db(); await new Promise((res,rej)=>{ const t=d.transaction("p","readwrite"); t.objectStore("p").put(data,id); t.oncomplete=res; t.onerror=()=>rej(t.error) }) }catch(e){} }
async function getPhoto(id){ try{ const d=await db(); return await new Promise(res=>{ const r=d.transaction("p").objectStore("p").get(id); r.onsuccess=()=>res(r.result||null); r.onerror=()=>res(null) }) }catch(e){ return null } }
async function delAllPhotos(){ try{ const d=await db(); await new Promise(res=>{ const t=d.transaction("p","readwrite"); t.objectStore("p").clear(); t.oncomplete=res; t.onerror=res }) }catch(e){} }
const photoCache = {};
function loadPhotos(){ document.querySelectorAll("img[data-photo]").forEach(async img=>{ const id=img.dataset.photo; if(!photoCache[id]) photoCache[id]=await getPhoto(id); if(photoCache[id]) img.src=photoCache[id]; else img.hidden=true }) }
function compress(file){ return new Promise((res,rej)=>{ const fr=new FileReader(); fr.onerror=rej; fr.onload=()=>{ const im=new Image(); im.onerror=rej; im.onload=()=>{ const m=640, sc=Math.min(1, m/Math.max(im.width,im.height)); const c=document.createElement("canvas"); c.width=Math.round(im.width*sc); c.height=Math.round(im.height*sc); c.getContext("2d").drawImage(im,0,0,c.width,c.height); res(c.toDataURL("image/jpeg",0.72)) }; im.src=fr.result }; fr.readAsDataURL(file) }) }

/* =========================================================
   4. TANGGAL
   ========================================================= */
const pad = n => String(n).padStart(2,"0");
const dkey = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse = k => { const [y,m,d]=k.split("-").map(Number); return new Date(y,m-1,d) };
const addDays = (k,n) => { const d=parse(k); d.setDate(d.getDate()+n); return dkey(d) };
const diffDays = (a,b) => Math.round((parse(b)-parse(a))/864e5);
const today = () => dkey(new Date());
const DAYN = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const MON = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const pretty = k => { const d=parse(k); return `${DAYN[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}` };
function dayNo(k){ return S.startDate ? diffDays(S.startDate, k||today())+1 : 1 }
function weekNo(k){ return Math.max(1, Math.min(12, Math.ceil(dayNo(k)/7))) }
function day(k){ k = k||today(); if(!S.days[k]) S.days[k] = {meals:[], water:0, steps:0, habit:false, sets:{}, claimed:{}, chest:null}; return S.days[k] }
function isActive(k){ const d=S.days[k]; return !!d && (d.meals.length>0 || d.habit || Object.keys(d.claimed).length>0) }
// Streak pemaaf: satu hari terlewat dimaafkan (perisai), maksimal sekali tiap 7 hari.
function streakInfo(){
  const t = today(); let n = 0, lastShield = -99, k = isActive(t) ? t : addDays(t,-1), i = 0, shieldsUsed = 0;
  if(!S.startDate) return {n:0, shieldLeft:1};
  while(diffDays(S.startDate,k) >= 0){
    if(isActive(k)){ n++ }
    else if(i - lastShield >= 7 && isActive(addDays(k,-1))){ lastShield = i; shieldsUsed++ }
    else break;
    k = addDays(k,-1); i++;
  }
  const shieldLeft = lastShield > -99 && lastShield < 7 ? 0 : 1;
  return {n, shieldLeft, shieldDays: shieldsUsed};
}
function shieldedDay(k){ // apakah hari k adalah hari yang dijaga perisai
  if(isActive(k) || !S.startDate || diffDays(S.startDate,k)<1 || diffDays(k,today())<1) return false;
  return isActive(addDays(k,-1)) && isActive(addDays(k,1));
}

/* =========================================================
   5. PERHITUNGAN GIZI
   ========================================================= */
function calc(p, kgNow){
  const w = kgNow || p.weight;
  const imt = w / Math.pow(p.height/100, 2);
  const bmr = 10*w + 6.25*p.height - 5*p.age + (p.sex==="pria" ? 5 : -161);
  const tdee = bmr * p.act;
  const floor = p.sex==="pria" ? 1500 : 1200;
  let deficit = 500; const wk = weekNo(); if(wk===1) deficit = 200; else if(wk===2 || wk===3) deficit = 300;
  if(p.goal==="pertahankan") deficit = 0;
  let target = Math.max(floor, Math.round((tdee - deficit)/10)*10);
  const cat = imt<18.5?"Berat kurang":imt<23?"Normal":imt<25?"Berisiko (pra-obesitas)":imt<30?"Obesitas I":"Obesitas II";
  const waistRisk = p.waist >= (p.sex==="pria" ? 90 : 80);
  const refer = [];
  if(imt>=35) refer.push("IMT 35 atau lebih");
  if(imt<17) refer.push("IMT di bawah 17");
  if(p.age<18) refer.push("usia di bawah 18 tahun");
  if(p.age>=60) refer.push("usia 60 tahun ke atas");
  (p.screen||[]).forEach(s => refer.push(s.toLowerCase()));
  const guided = refer.length>0;
  const noDeficit = imt<18.5 || p.age<18 || (p.screen||[]).includes("Hamil atau menyusui") || (p.screen||[]).some(s=>/muntah|takut gemuk/i.test(s));
  if(guided) target = Math.max(target, Math.round((tdee-300)/10)*10);
  if(noDeficit) target = Math.round(tdee/10)*10;
  if(p.adjust) target = Math.max(floor, target + p.adjust);
  return {imt, bmr, tdee, target, floor, cat, waistRisk, refer, guided, noDeficit,
    protein: Math.round(w*(p.level==="pemula"?1.2:1.4)), water: Math.max(1500, Math.round(w*30/250)*250)};
}
function itemKcal(it){
  const f = FOODS[it.f]; if(!f) return 0; let k = f.k * it.q;
  if(f.fried && it.fried===false) k -= 45*it.q;
  if(f.santan && it.santan===false) k -= 40*it.q;
  if(f.sugar!==undefined){ const s = it.sugar!==undefined?it.sugar:f.sugar; k += s*SUGAR_KCAL*it.q }
  return Math.max(0,k);
}
const itemProt = it => FOODS[it.f] ? FOODS[it.f].p * it.q : 0;
const itemSugar = it => { const f=FOODS[it.f]; return f && f.sugar!==undefined ? (it.sugar!==undefined?it.sugar:f.sugar)*4*it.q : 0 };
function totals(k){ const d=day(k); let kc=0,p=0,sugar=0; d.meals.forEach(m=>m.items.forEach(it=>{ kc+=itemKcal(it); p+=itemProt(it); sugar+=itemSugar(it) })); return {k:kc,p,sugar} }
function plateParts(k){
  const g = {pokok:0,lauk:0,sayur:0,buah:0};
  day(k).meals.forEach(m=>m.items.forEach(it=>{ const f=FOODS[it.f]; if(!f) return; if(f.g==="pokok") g.pokok+=it.q; else if(f.g==="lauk") g.lauk+=it.q; else if(f.g==="sayur") g.sayur+=it.q*1.5; else if(f.g==="buah") g.buah+=it.q*1.5 }));
  return g;
}
function plateScore(k){ const g=plateParts(k), tot=g.pokok+g.lauk+g.sayur+g.buah; if(!tot) return "Belum ada"; const v=(g.sayur+g.buah)/tot; return v>=.45?"Seimbang":v>=.25?"Hampir":"Kurang sayur" }

/* =========================================================
   6. GAME: level, misi, peti
   ========================================================= */
const LEVELS = [[0,"Benih"],[100,"Tunas"],[250,"Bibit"],[450,"Pohon muda"],[700,"Pohon rindang"],[1000,"Pohon berbuah"],[1400,"Pohon teduh"],[1900,"Hutan kecil"]];
const POTS = {terracotta:"#c9733a", biru:"#2f8fd8", ungu:"#8a5cc7", hijau:"#2f9e57", emas:"#e9a91f"};
function levelOf(xp){ let i=0; LEVELS.forEach((l,k)=>{ if(xp>=l[0]) i=k }); const next=LEVELS[i+1]; return {i, name:LEVELS[i][1], from:LEVELS[i][0], to: next?next[0]:LEVELS[i][0], next: next?next[1]:null} }
function workout(){ return WORKOUTS[(S.profile&&S.profile.level)||"pemula"] }
const QUESTS = [
  {id:"foto", t:"Catat 2 kali makan", sub:"Catat jujur, berapa pun kalorinya", xp:20, col:"var(--coral)", ic:"cam", done:()=>day().meals.filter(m=>!m.drinkOnly).length>=2, go:"catat"},
  {id:"habit", t:"Kebiasaan minggu ini", sub:()=>PROGRAM[weekNo()-1][1], xp:20, col:"var(--green)", ic:"leaf", done:()=>day().habit},
  {id:"latih", t:"Bergerak hari ini", sub:"Selesaikan sesi latihan atau minimal 4 gerakan", xp:30, col:"var(--sky)", ic:"dumbbell", done:()=>Object.values(day().sets).filter(Boolean).length>=4, go:"program"},
  {id:"air", t:"Minum sesuai target", sub:()=>`${dec(calc(S.profile).water/1000)} L hari ini`, xp:15, col:"var(--sky)", ic:"drop", done:()=>day().water>=calc(S.profile).water},
  {id:"langkah", t:"Jalan 7.000 langkah", sub:"Isi dari aplikasi langkah di HP-mu", xp:15, col:"var(--plum)", ic:"shoe", done:()=>day().steps>=7000}
];
const CHEST = [
  {t:"+25 XP bonus", xp:25},{t:"+15 XP bonus", xp:15},{t:"+10 XP bonus", xp:10},
  {t:"Pot baru: biru langit", pot:"biru"},{t:"Pot baru: ungu", pot:"ungu"},{t:"Pot baru: hijau daun", pot:"hijau"},
  {t:"Tips: protein di sarapan bikin kenyang lebih lama, jadi camilan sore berkurang.", xp:5},
  {t:"Tips: tidur kurang dari 6 jam bikin lapar naik. Malam ini coba tidur 30 menit lebih awal.", xp:5},
  {t:"Tips: ganti es teh manis dengan teh tawar dingin bisa hemat sekitar 50 kkal per gelas.", xp:5},
  {t:"Tips: makan pelan-pelan. Rasa kenyang butuh sekitar 20 menit untuk terasa.", xp:5},
  {t:"Tips: di kondangan, ambil sayur dan lauk dulu, nasi belakangan.", xp:5}
];
function challengeCount(){ const w=weekNo(), start=addDays(S.startDate,(w-1)*7); let n=0; for(let i=0;i<7;i++){ const k=addDays(start,i); if(diffDays(k,today())<0) break; if(S.days[k] && plateScore(k)==="Seimbang") n++ } return Math.min(5,n) }

/* =========================================================
   7. UTIL UI
   ========================================================= */
let tab = "beranda", draft = null, sub = null, logDay = null, catFilter = "semua", query = "", onbStep = 0, confirmReset = false;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = n => Math.round(n).toLocaleString("id-ID");
const dec = (n,d=1) => Number(n).toLocaleString("id-ID",{maximumFractionDigits:d});
function toast(t){ const el=$("#toast"); el.textContent=t; el.hidden=false; clearTimeout(toast.t); toast.t=setTimeout(()=>el.hidden=true,2800) }
function burst(x,y){
  if(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cols=["#f0663f","#f5b631","#0f8a5f","#2f8fd8","#8a5cc7"];
  for(let i=0;i<18;i++){ const d=document.createElement("i"); d.className="burst"; d.style.left=x+"px"; d.style.top=y+"px"; d.style.background=cols[i%5];
    const a=Math.random()*Math.PI*2, r=40+Math.random()*60; d.style.setProperty("--dx",Math.cos(a)*r+"px"); d.style.setProperty("--dy",Math.sin(a)*r-30+"px");
    document.body.appendChild(d); setTimeout(()=>d.remove(),950) }
}
function showModal(html){ let m=$("#modal"); if(!m){ document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal" role="dialog" aria-modal="true"></div>'); m=$("#modal") } m.innerHTML=`<div class="box">${html}</div>`; m.hidden=false }
function addXP(n, el){
  const before = levelOf(S.xp).i; S.xp += n;
  if(el){ const r=el.getBoundingClientRect(); burst(r.left+r.width/2, r.top) }
  const L = levelOf(S.xp);
  if(L.i>before) showModal(`<div class="eyebrow">Naik level!</div>${plantSvg(L.i,S.pot)}<h2>Level ${L.i+1}: ${L.name}</h2><p class="muted small">Tanamanmu tumbuh karena kebiasaanmu, bukan karena angka timbangan. Terus rawat ya!</p><button class="btn block" data-act="closemodal">Lanjut</button>`);
}

/* =========================================================
   8. IKON & ILUSTRASI
   ========================================================= */
const st = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const I = {
  home:`<svg viewBox="0 0 24 24" ${st}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>`,
  prog:`<svg viewBox="0 0 24 24" ${st}><path d="M4 19c3 0 3-6 8-6s5-6 8-6"/><circle cx="4" cy="19" r="2"/><circle cx="20" cy="7" r="2"/></svg>`,
  cam:`<svg viewBox="0 0 24 24" ${st}><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/></svg>`,
  chart:`<svg viewBox="0 0 24 24" ${st}><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/></svg>`,
  chat:`<svg viewBox="0 0 24 24" ${st}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>`,
  img:`<svg viewBox="0 0 24 24" ${st}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/></svg>`,
  search:`<svg viewBox="0 0 24 24" ${st}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  star:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>`,
  flame:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.3-5 .2 1.6.9 2.6 1.9 3C11 8.5 11.3 5 12 2z"/></svg>`,
  bolt:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>`,
  drop:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.5-7-12.5z"/></svg>`,
  shoe:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 16.5c0-2 .5-6 2-8.5l3 1.5c1 .5 2 .4 2.7-.3L11 8l2 3c1.5 2 4 2.5 6.5 3 1.5.3 2.5 1.2 2.5 2.5V18H2z"/></svg>`,
  check:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`,
  leaf:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4C9 4 4 9 4 16c0 1.3.2 2.5.6 3.6C6 13 10 9.5 15 8c-4 2.5-7 6-8.2 11.5C8 20 9.4 20 11 20c6 0 9-6 9-16z"/></svg>`,
  dumbbell:`<svg viewBox="0 0 24 24" fill="currentColor"><rect x="1.5" y="9" width="3" height="6" rx="1"/><rect x="4.5" y="6.5" width="3.5" height="11" rx="1"/><rect x="8" y="11" width="8" height="2"/><rect x="16" y="6.5" width="3.5" height="11" rx="1"/><rect x="19.5" y="9" width="3" height="6" rx="1"/></svg>`,
  plate:`<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" opacity=".35"/><path d="M12 3a9 9 0 0 1 9 9h-9z"/><path d="M12 12h9a9 9 0 0 1-9 9z" opacity=".7"/></svg>`,
  shield:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/></svg>`,
  gear:`<svg viewBox="0 0 24 24" ${st}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`
};
const sm = (svg, s=14) => svg.replace("<svg", `<svg width="${s}" height="${s}"`);
const FI = {
  rice:{bg:"#f6efe0",s:'<svg viewBox="0 0 32 32"><path d="M4 15h24a12 12 0 0 1-24 0z" fill="#c9733a"/><path d="M6 15c0-5 4.5-8 10-8s10 3 10 8z" fill="#fff" stroke="#e7dcc8"/><circle cx="12" cy="11" r="1" fill="#e7dcc8"/><circle cx="17" cy="10" r="1" fill="#e7dcc8"/><circle cx="20" cy="13" r="1" fill="#e7dcc8"/></svg>'},
  meat:{bg:"#fde5dc",s:'<svg viewBox="0 0 32 32"><path d="M19 5c5 0 8 3.5 8 7.5 0 5-5 8.5-10 7.5l-4 4-3-3 4-4c-1-5 1-12 5-12z" fill="#c9733a"/><path d="M20 8c3 0 4.5 2 4.5 4" stroke="#e8a06a" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="8" cy="25" r="3" fill="#f4e6d4"/><circle cx="6" cy="22" r="2.4" fill="#f4e6d4"/></svg>'},
  tempe:{bg:"#fdf0cf",s:'<svg viewBox="0 0 32 32"><rect x="5" y="9" width="22" height="14" rx="3" fill="#d9a441"/><circle cx="10" cy="14" r="1.6" fill="#f3d48a"/><circle cx="16" cy="17" r="1.6" fill="#f3d48a"/><circle cx="21" cy="13" r="1.6" fill="#f3d48a"/><circle cx="12" cy="19" r="1.3" fill="#f3d48a"/></svg>'},
  veg:{bg:"#dcf1e6",s:'<svg viewBox="0 0 32 32"><path d="M4 16h24a12 12 0 0 1-24 0z" fill="#2f9e6e"/><path d="M9 16c-1-4 1-7 4-8 0 3-1 5-4 8zM15 16c0-5 3-8 7-8-1 4-3 6-7 8zM20 16c2-2 4-3 6-3-1 2-3 3-6 3z" fill="#7cc95a"/></svg>'},
  egg:{bg:"#fdf0cf",s:'<svg viewBox="0 0 32 32"><ellipse cx="16" cy="17" rx="9" ry="11" fill="#fff" stroke="#eadfc9"/><circle cx="16" cy="19" r="4.5" fill="#f5b631"/></svg>'},
  chili:{bg:"#fde5dc",s:'<svg viewBox="0 0 32 32"><path d="M22 7c2 4 0 13-11 18-3 1-5-1-3-2 7-4 9-10 9-14z" fill="#e2412b"/><path d="M17 9c1-2 3-3 5-2l2-3" stroke="#2f9e6e" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>'},
  fruit:{bg:"#fdf0cf",s:'<svg viewBox="0 0 32 32"><path d="M7 9c-2 8 4 17 16 16 2 0 3-2 1-2.5C14 21 10 15 10 8z" fill="#f5c842"/><path d="M8 6l2 3" stroke="#8a6a2a" stroke-width="2.4" stroke-linecap="round"/></svg>'},
  tea:{bg:"#fde9d4",s:'<svg viewBox="0 0 32 32"><path d="M8 7h16l-2 20H10z" fill="#e3e9ef"/><path d="M9 12h14l-1.5 14h-11z" fill="#c4772e"/><rect x="12" y="13" width="3.5" height="3.5" rx=".8" fill="#fff" opacity=".7"/><rect x="16" y="17" width="3.5" height="3.5" rx=".8" fill="#fff" opacity=".7"/><path d="M19 3l-2 9" stroke="#2f9e6e" stroke-width="2" stroke-linecap="round"/></svg>'},
  coffee:{bg:"#efe3d6",s:'<svg viewBox="0 0 32 32"><path d="M9 9h14l-2 18H11z" fill="#e8d3b8"/><path d="M9.6 14h12.8l-1.4 13H11z" fill="#9a6338"/><rect x="8" y="6" width="16" height="4" rx="1.5" fill="#5b3b25"/></svg>'},
  water:{bg:"#dcecfa",s:'<svg viewBox="0 0 32 32"><path d="M8 6h16l-2 21H10z" fill="#e8f3fc" stroke="#b9d7f0"/><path d="M9 13h14l-1.4 13H10.4z" fill="#5fb0ef"/></svg>'}
};
const fico = (c,extra="") => `<span class="fico" style="background:${FI[c].bg}${extra}">${FI[c].s}</span>`;
const FIG = (()=>{ const P='stroke="var(--fg)" stroke-width="2.6" stroke-linecap="round" fill="none"', H='fill="var(--coral)"';
 return {
  warm:`<svg viewBox="0 0 40 40"><circle cx="20" cy="7" r="4" ${H}/><path d="M20 12v13M20 16l-7 4M20 16l7-5M20 25l-5 9M20 25l5 9" ${P}/></svg>`,
  squat:`<svg viewBox="0 0 40 40"><circle cx="17" cy="9" r="4" ${H}/><path d="M18 14l3 11M19 17l9 2M21 25l-8 2 1 9M21 25l4 9" ${P}/><path d="M6 27h10v9" stroke="var(--muted)" stroke-width="2" fill="none"/></svg>`,
  push:`<svg viewBox="0 0 40 40"><path d="M34 4v32" stroke="var(--muted)" stroke-width="2.5"/><circle cx="25" cy="10" r="4" ${H}/><path d="M23 14l-12 20M20 19l13-4M11 34l-2 2" ${P}/></svg>`,
  bridge:`<svg viewBox="0 0 40 40"><circle cx="6" cy="30" r="4" ${H}/><path d="M10 30l11-8 7 0M28 22l4 12M10 32h-2" ${P}/><path d="M2 35h36" stroke="var(--muted)" stroke-width="2"/></svg>`,
  plank:`<svg viewBox="0 0 40 40"><circle cx="8" cy="20" r="4" ${H}/><path d="M12 22l22 6M14 23l-2 8h5M34 28v4" ${P}/><path d="M2 33h36" stroke="var(--muted)" stroke-width="2"/></svg>`,
  walk:`<svg viewBox="0 0 40 40"><circle cx="21" cy="6" r="4" ${H}/><path d="M20 11l-2 12M19 14l-6 6M19 14l7 4M18 23l-5 12M18 23l7 5 1 7" ${P}/></svg>`,
  stretch:`<svg viewBox="0 0 40 40"><circle cx="20" cy="9" r="4" ${H}/><path d="M20 14v12M20 16l-8-12M20 16l8-12M20 26l-6 9M20 26l6 9" ${P}/></svg>`
 }})();
function plantSvg(stage, pot){
  const pc = POTS[pot]||POTS.terracotta, lf="#4cbb6c", lf2="#2f9e57", tr="#8a5a32";
  const leaf=(x,y,r,f)=>`<path d="M${x} ${y} q${10*f} -14 ${22*f} -6 q-${8*f} 12 -${22*f} 6z" fill="${r||lf}"/>`;
  let pl="";
  if(stage===0) pl=`<ellipse cx="60" cy="90" rx="7" ry="5" fill="#8a5a32"/><path d="M60 86 q2 -6 6 -7" stroke="${lf}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  else if(stage===1) pl=`<path d="M60 92 V62" stroke="${lf2}" stroke-width="4" stroke-linecap="round"/>${leaf(60,66,lf,1.3)}${leaf(60,72,lf2,-1.3)}`;
  else if(stage===2) pl=`<path d="M60 92 V44" stroke="${lf2}" stroke-width="4.5" stroke-linecap="round"/>${leaf(60,50,lf,1.2)}${leaf(60,58,lf2,-1.2)}${leaf(60,70,lf,1.3)}${leaf(60,78,lf2,-1.3)}<circle cx="60" cy="42" r="7" fill="${lf}"/>`;
  else { const R = [0,0,0,24,30,32,34,36][stage];
    pl=`<path d="M60 92 V${58-R/3}" stroke="${tr}" stroke-width="7" stroke-linecap="round"/><path d="M60 74 l-10 -8M60 68 l9 -7" stroke="${tr}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="60" cy="${52-R/4}" r="${R}" fill="${lf2}"/><circle cx="${60-R*.45}" cy="${50-R/4}" r="${R*.6}" fill="${lf}"/><circle cx="${60+R*.4}" cy="${44-R/4}" r="${R*.55}" fill="${lf}"/>
    ${stage>=5?[[-14,-6],[10,-14],[16,6],[-4,8],[-20,10]].map(([dx,dy])=>`<circle cx="${60+dx}" cy="${48-R/4+dy}" r="4.5" fill="#f0663f"/>`).join(""):""}
    ${stage>=6?`<circle cx="${60-R}" cy="70" r="3" fill="#ffd66b"/><circle cx="${60+R}" cy="62" r="3" fill="#ffd66b"/>`:""}
    ${stage>=7?`<path d="M18 92 q4 -16 10 0z M92 92 q5 -18 10 0z" fill="${lf}"/>`:""}`; }
  return `<svg viewBox="0 0 120 120" role="img" aria-label="Tanaman level ${stage+1}"><ellipse cx="60" cy="114" rx="34" ry="4" fill="rgba(0,0,0,.12)"/><g class="sway">${pl}</g><path d="M36 92 h48 l-6 22 h-36z" fill="${pc}"/><rect x="33" y="88" width="54" height="8" rx="3" fill="${pc}"/><rect x="33" y="88" width="54" height="8" rx="3" fill="#fff" opacity=".18"/><ellipse cx="60" cy="90" rx="22" ry="2.5" fill="#5b3b25"/></svg>`;
}
const chestSvg = open => `<svg viewBox="0 0 72 72" aria-hidden="true"><ellipse cx="36" cy="66" rx="26" ry="3.5" fill="rgba(0,0,0,.12)"/>${open?'<path d="M14 30 L22 8 h28 l8 22z" fill="#a8622c"/><circle cx="36" cy="30" r="14" fill="#ffd66b" opacity=".55"/>':'<path d="M12 32 q0 -18 24 -18 q24 0 24 18z" fill="#c9733a"/>'}<rect x="12" y="30" width="48" height="32" rx="4" fill="#d9883f"/><rect x="12" y="30" width="48" height="6" fill="#a8622c"/><rect x="31" y="34" width="10" height="12" rx="2" fill="#ffd66b"/><path d="M20 30v32M52 30v32" stroke="#a8622c" stroke-width="3"/></svg>`;
function coachFace(sz){
  return `<svg viewBox="0 0 56 56" width="${sz}" height="${sz}" style="flex:none" aria-hidden="true"><circle cx="28" cy="28" r="27" fill="#ffd66b"/><circle cx="28" cy="31" r="15" fill="#c98a5a"/><path d="M13 26c0-10 7-15 15-15s15 5 15 15c-4-4-9-6-15-6s-11 2-15 6z" fill="#2b2b2b"/><rect x="12" y="22" width="32" height="5" rx="2.5" fill="#f0663f"/><circle cx="23" cy="31" r="1.8" fill="#2b2b2b"/><circle cx="33" cy="31" r="1.8" fill="#2b2b2b"/><path d="M23 37c3 2.5 7 2.5 10 0" stroke="#2b2b2b" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M28 46v6" stroke="#0f8a5f" stroke-width="2"/><circle cx="28" cy="52" r="2.5" fill="#0f8a5f"/></svg>`;
}

/* =========================================================
   9. TAB BAR
   ========================================================= */
function renderTabs(){
  const nav = $("#nav"); nav.hidden = !S.profile || !S.startDate;
  const t = [["beranda","Beranda",I.home],["program","Program",I.prog],["catat","Catat",I.cam],["progres","Progres",I.chart],["pelatih","Pelatih",I.chat]];
  $("#tabs").innerHTML = t.map(([id,l,ic]) => `<button class="tab ${id==="catat"?"cam":""}" data-tab="${id}" ${tab===id||(tab==="akun"&&id==="beranda")?'aria-current="page"':""}>${id==="catat"?`<span class="dot">${ic}</span>`:ic}<span>${l}</span></button>`).join("");
}

/* =========================================================
   10. ONBOARDING
   ========================================================= */
const SCREEN = ["Diabetes","Hipertensi","Penyakit jantung","Penyakit ginjal","Minum obat rutin","Hamil atau menyusui","Pernah pingsan atau nyeri dada saat aktivitas","Sering makan berlebihan lalu memuntahkan, atau sangat takut gemuk"];
let ob = {sex:"pria",age:"",height:"",weight:"",waist:"",act:1.375,goal:"turun",level:"pemula",screen:[],consent:false};
function vWelcome(){
  return `<div class="welcome enter">
    <section class="hero"><div class="eyebrow">Program 12 minggu</div><h1>Sehat12</h1><p style="opacity:.92;margin-top:6px">Turun berat badan pelan tapi pasti, sambil merawat tanamanmu sendiri.</p>
      <div class="bigplant">${plantSvg(4,"terracotta")}</div></section>
    <div class="card">
      <div class="feat">${fico("rice")}<div><b>Catat makan lewat foto</b><p class="small muted">Foto piringmu, pilih menunya dari daftar makanan Indonesia.</p></div></div>
      <div class="feat"><span class="fico" style="background:var(--sun-soft)">${chestSvg(false).replace('aria-hidden="true"','width="28" height="28" aria-hidden="true"')}</span><div><b>Misi harian, level, dan peti hadiah</b><p class="small muted">Kebiasaan sehat jadi permainan yang seru.</p></div></div>
      <div class="feat"><span class="fico" style="background:var(--sky)"><span style="color:#fff;display:grid">${sm(I.dumbbell,22)}</span></span><div><b>Latihan & evaluasi mingguan</b><p class="small muted">Program menyesuaikan perkembanganmu tiap minggu.</p></div></div>
      <div class="feat"><span class="fico" style="background:var(--green-soft)"><span style="color:var(--green);display:grid">${sm(I.shield,22)}</span></span><div><b>Gratis dan privat</b><p class="small muted">Data tersimpan di HP-mu sendiri, tidak dikirim ke server mana pun.</p></div></div>
    </div>
    <button class="btn block" data-act="obstart">Mulai asesmen (3 menit)</button>
    <p class="small muted" style="text-align:center">Sudah punya cadangan data? <button class="btn ghost small" data-act="import">Pulihkan</button></p>
  </div>`;
}
function vOnboard(){
  const steps = ["Data tubuh","Kesehatan","Gaya hidup","Hasil"];
  const head = `<div class="row between"><div><div class="eyebrow">Asesmen · ${onbStep+1} dari 4</div><h1>${steps[onbStep]}</h1></div>${onbStep>0?`<button class="btn ghost small" data-act="obback">Kembali</button>`:`<button class="btn ghost small" data-act="obcancel">Batal</button>`}</div>
    <div class="row" style="gap:6px">${steps.map((_,i)=>`<span style="flex:1;height:6px;border-radius:4px;background:${i<=onbStep?"var(--green)":"var(--line)"}"></span>`).join("")}</div>`;
  let body = "";
  if(onbStep===0) body = `<div class="card"><div class="grid2">
      <label>Jenis kelamin<select id="ob-sex"><option value="pria" ${ob.sex==="pria"?"selected":""}>Pria</option><option value="wanita" ${ob.sex==="wanita"?"selected":""}>Wanita</option></select></label>
      <label>Usia (tahun)<input type="number" inputmode="numeric" id="ob-age" value="${ob.age}" placeholder="mis. 30"></label>
      <label>Tinggi (cm)<input type="number" inputmode="decimal" id="ob-height" value="${ob.height}" placeholder="mis. 165"></label>
      <label>Berat (kg)<input type="number" inputmode="decimal" step="0.1" id="ob-weight" value="${ob.weight}" placeholder="mis. 70"></label>
      <label>Lingkar perut (cm)<input type="number" inputmode="decimal" id="ob-waist" value="${ob.waist}" placeholder="mis. 88"></label>
      <label>Tujuan<select id="ob-goal"><option value="turun" ${ob.goal==="turun"?"selected":""}>Turunkan berat</option><option value="pertahankan" ${ob.goal==="pertahankan"?"selected":""}>Pertahankan & bentuk badan</option></select></label>
    </div><p class="small muted">Ukur lingkar perut sejajar pusar, setelah membuang napas, pita tidak menekan kulit.</p></div>
    <button class="btn block" data-act="obnext">Lanjut</button>`;
  if(onbStep===1) body = `<div class="card"><p class="small muted">Centang yang sesuai. Ini menentukan apakah program perlu didampingi tenaga kesehatan.</p>
      ${SCREEN.map(s=>`<label class="check"><input type="checkbox" data-obscr="${esc(s)}" ${ob.screen.includes(s)?"checked":""}><span>${esc(s)}</span></label>`).join("")}</div>
    <button class="btn block" data-act="obnext">Lanjut</button>`;
  if(onbStep===2) body = `<div class="card">
      <label>Aktivitas harian<select id="ob-act">${[[1.2,"Banyak duduk (kerja kantor, jarang jalan)"],[1.375,"Ringan (jalan sesekali, olahraga 1–3×/minggu)"],[1.55,"Sedang (aktif, olahraga 3–5×/minggu)"],[1.725,"Berat (kerja fisik atau olahraga hampir tiap hari)"]].map(([v,l])=>`<option value="${v}" ${ob.act==v?"selected":""}>${l}</option>`).join("")}</select></label>
      <label>Pengalaman olahraga<select id="ob-level"><option value="pemula" ${ob.level==="pemula"?"selected":""}>Pemula (jarang olahraga)</option><option value="menengah" ${ob.level==="menengah"?"selected":""}>Menengah (rutin 1–3 bulan terakhir)</option><option value="lanjut" ${ob.level==="lanjut"?"selected":""}>Lanjut (rutin lebih dari 6 bulan)</option></select></label>
    </div>
    <div class="card" style="background:var(--sun-soft);border-color:transparent"><label class="check"><input type="checkbox" id="ob-consent" ${ob.consent?"checked":""}><span class="small">Saya paham Sehat12 adalah alat bantu, bukan pengganti pemeriksaan dokter. Data saya tersimpan di HP ini saja.</span></label></div>
    <button class="btn block" data-act="obnext">Lihat hasil</button>`;
  if(onbStep===3){ const p = obProfile(), c = calc(p); body = `<div class="card">${resultHtml(c,p)}</div><button class="btn block" data-act="obfinish">Mulai program hari ini</button>`; }
  return `<div class="stack enter">${head}${body}</div>`;
}
function obProfile(){ return {sex:ob.sex, age:+ob.age, height:+ob.height, weight:+ob.weight, waist:+ob.waist||0, act:+ob.act, goal:ob.goal, level:ob.level, screen:ob.screen.slice(), adjust:0} }
function obValidate(){
  if(onbStep===0){
    const a=+ob.age, h=+ob.height, w=+ob.weight, wa=+ob.waist;
    if(!(a>=10&&a<=100)) return "Isi usia antara 10 dan 100 tahun.";
    if(!(h>=120&&h<=220)) return "Isi tinggi antara 120 dan 220 cm.";
    if(!(w>=30&&w<=250)) return "Isi berat antara 30 dan 250 kg.";
    if(!(wa>=40&&wa<=200)) return "Isi lingkar perut antara 40 dan 200 cm.";
  }
  if(onbStep===2 && !ob.consent) return "Centang pernyataan di bawah dulu ya.";
  return "";
}
function resultHtml(c,p){
  const pos = Math.max(0, Math.min(100, (c.imt-15)/(35-15)*100));
  return `<h3>Titik mulaimu</h3>
    <div><div class="row between"><b style="font-family:var(--display);font-size:28px">IMT ${dec(c.imt)}</b><span class="pill ${c.imt>=25?"coral":c.imt>=23?"sun":""}">${c.cat}</span></div>
      <div style="position:relative;margin-top:8px"><div style="display:flex;height:10px;border-radius:6px;overflow:hidden"><i style="flex:3.5;background:var(--sky)"></i><i style="flex:4.5;background:var(--green)"></i><i style="flex:2;background:var(--sun)"></i><i style="flex:5;background:#f59a3e"></i><i style="flex:5;background:var(--coral)"></i></div>
      <span style="position:absolute;top:-4px;left:calc(${pos}% - 9px);width:18px;height:18px;border-radius:50%;background:var(--surface);border:4px solid var(--fg)"></span></div>
      <div class="row between small muted" style="margin-top:4px"><span>18,5</span><span>23</span><span>25</span><span>30</span><span>35</span></div>
      <p class="small muted" style="margin-top:4px">Kriteria IMT Asia-Pasifik.</p></div>
    <div class="grid2">
      <div class="stat k" style="padding:12px"><div class="of">Target kalori awal</div><div class="num">${fmt(c.target)}</div><div class="of">kkal/hari (min. ${fmt(c.floor)})</div></div>
      <div class="stat p" style="padding:12px"><div class="of">Protein</div><div class="num">${c.protein} g</div><div class="of">per hari</div></div>
      <div class="stat w" style="padding:12px"><div class="of">Air</div><div class="num">${dec(c.water/1000)} L</div><div class="of">per hari</div></div>
      <div class="stat s" style="padding:12px"><div class="of">Kebutuhan harian</div><div class="num" style="font-size:18px">${fmt(c.tdee)}</div><div class="of">kkal (BMR ${fmt(c.bmr)})</div></div>
    </div>
    <div class="row between"><span class="small muted">Lingkar perut ${p.waist} cm</span>${c.waistRisk?'<span class="pill coral">Risiko tinggi</span>':'<span class="pill">Normal</span>'}</div>
    ${c.guided?`<div class="banner crit"><b>Sebaiknya konsultasi dulu.</b> Ada kondisi yang perlu diperiksa dokter atau puskesmas: ${esc(c.refer.join(", "))}. Kamu tetap bisa memakai Sehat12, tapi target dibuat lebih aman.${c.noDeficit?" Untuk kondisimu, aplikasi tidak memberi target defisit kalori.":""}</div>`:`<p class="small muted">Target dibuat bertahap: minggu 1 lebih ringan, lalu defisit 300–500 kkal. Target penurunan 0,5–1 kg per minggu, tidak ada pilihan lebih cepat.</p>`}`;
}

/* =========================================================
   11. BERANDA
   ========================================================= */
function vBeranda(){
  const t = today(), d = day(t), c = calc(S.profile, currentWeight()), tt = totals(t), wk = PROGRAM[weekNo()-1];
  const dn = dayNo(t), sisa = c.target - tt.k, pct = (v,m) => Math.min(100, m? v/m*100 : 0);
  const L = levelOf(S.xp), pctXP = L.next? (S.xp-L.from)/(L.to-L.from)*100 : 100, sk = streakInfo();
  const progDone = Math.min(84, dn);
  const after = dn>84;
  return `<div class="stack enter">
    <section class="hero game">
      <div class="top"><div><div class="eyebrow">${after?"Program selesai":`Minggu ${weekNo()} · ${wk[0]} · hari ${dn}/84`}</div><h1><span class="lvl">Lv ${L.i+1}</span> ${L.name}</h1></div>
        <button class="btn ghost small" data-tab="akun" aria-label="Profil dan pengaturan">${sm(I.gear,18)}</button></div>
      <div class="gamerow"><div class="plantbox">${plantSvg(L.i,S.pot)}</div>
        <div><div class="row between small" style="font-weight:800"><span>${fmt(S.xp)} XP</span><span style="opacity:.85">${L.next?`${fmt(L.to-S.xp)} lagi ke ${L.next}`:"Level maksimal"}</span></div>
          <div class="xpbar"><i style="width:${pctXP}%"></i></div>
          <div class="chips"><span class="chip">${I.flame} ${sk.n} hari beruntun</span><span class="chip">${I.shield} ${sk.shieldLeft} perisai</span></div>
          <div class="potpick" style="justify-content:flex-start;margin-top:10px">${Object.entries(POTS).map(([k,col])=>`<button style="background:${col}" data-act="pot" data-p="${k}" aria-label="Pot ${k}" aria-pressed="${S.pot===k}" ${S.pots.includes(k)?"":"disabled"}></button>`).join("")}</div></div></div>
      <div class="journey"><div class="jbar"><i style="width:${progDone/84*100}%;background:linear-gradient(90deg,#ffd66b,#8fd3ff,#ffb08f,#d3b8ff)"></i></div><div class="jlab"><span>Fondasi</span><span>Bangun</span><span>Akselerasi</span><span>Kunci</span></div></div>
    </section>
    ${c.guided?`<div class="banner"><b>Mode didampingi.</b> Ada kondisi yang perlu dicek tenaga kesehatan (${esc(c.refer.join(", "))}). Target dibuat di level aman.</div>`:""}
    ${evalDue()?`<div class="banner" style="display:flex;gap:10px;align-items:center"><span style="flex:1"><b>Waktunya evaluasi mingguan.</b> Timbang dan ukur lingkar perut, program akan menyesuaikan.</span><button class="btn small" data-tab="progres">Isi</button></div>`:""}
    ${questsCard()}
    ${chestCard()}
    <div class="stats">
      <div class="stat k"><span class="ico">${I.flame}</span><div><div class="num">${fmt(tt.k)}</div><div class="of">dari ${fmt(c.target)} kkal</div></div><div class="bar"><i style="width:${pct(tt.k,c.target)}%"></i></div><div class="small" style="font-weight:700">${sisa>=0?`Sisa ${fmt(sisa)} kkal`:`Lebih ${fmt(-sisa)} kkal, tidak apa-apa`}</div></div>
      <div class="stat p"><span class="ico">${I.bolt}</span><div><div class="num">${fmt(tt.p)} g</div><div class="of">dari ${c.protein} g protein</div></div><div class="bar"><i style="width:${pct(tt.p,c.protein)}%"></i></div><div class="small" style="font-weight:700">Bantu jaga otot</div></div>
      <div class="stat w"><span class="ico">${I.drop}</span><button class="add" data-act="water" aria-label="Tambah 250 ml air">+250</button><div><div class="num">${dec(d.water/1000)} L</div><div class="of">dari ${dec(c.water/1000)} L air</div></div><div class="bar"><i style="width:${pct(d.water,c.water)}%"></i></div><div class="small" style="font-weight:700">${d.water>=c.water?"Target tercapai!":`${Math.ceil((c.water-d.water)/250)} gelas lagi`}</div></div>
      <div class="stat s"><span class="ico">${I.shoe}</span><button class="add" data-act="stepsedit" aria-label="Isi jumlah langkah">Isi</button><div><div class="num">${fmt(d.steps)}</div><div class="of">dari 7.000 langkah</div></div><div class="bar"><i style="width:${pct(d.steps,7000)}%"></i></div><div class="small" style="font-weight:700">${d.steps>=7000?"Target tercapai!":"Jalan sore 15 menit"}</div></div>
    </div>
    ${tt.sugar>25?`<p class="small muted">Gula dari minuman hari ini sekitar ${fmt(tt.sugar)} g. Batas anjuran Kemenkes 50 g/hari dari semua sumber.</p>`:""}
    <div class="card">
      <div class="row between"><h3>7 hari terakhir</h3><span class="pill coral">${sm(I.flame,13)} ${sk.n} hari beruntun</span></div>
      <div class="streak">${[6,5,4,3,2,1,0].map(i=>{ const k=addDays(t,-i), before = S.startDate && diffDays(S.startDate,k)<0; const v = before?0:isActive(k)?1:shieldedDay(k)?2:0; return `<div class="day ${v===1?"on":""} ${i===0?"today":""}" style="${before?"opacity:.35":""}"><b ${v===2?'style="background:var(--sky);border:0;color:#fff"':""}>${v===2?sm(I.shield,16):v?I.check:""}</b>${DAYN[parse(k).getDay()]}</div>` }).join("")}</div>
      <label class="check" style="background:var(--surface-2);padding:12px;border-radius:14px"><input type="checkbox" id="habit" ${d.habit?"checked":""}><span><b>${esc(wk[1])}</b><br><span class="small muted">Kebiasaan minggu ini. Centang kalau hari ini sudah kamu lakukan.</span></span></label>
      <p class="small muted">${sm(I.shield,13).replace("<svg",'<svg style="vertical-align:-2px;color:var(--sky)"')} Terlewat sehari? Perisai menjaga streak otomatis, sekali per 7 hari. Tidak ada hukuman, cukup kembali besok.</p>
    </div>
    <div class="card" style="background:linear-gradient(135deg,var(--sky-soft),var(--surface))">
      <div class="row"><span class="fico" style="background:var(--sky)"><span style="color:#fff;display:grid">${sm(I.dumbbell,22)}</span></span>
        <div style="flex:1;min-width:0"><h3>Latihan hari ini</h3><p class="small muted">${Object.values(d.sets).filter(Boolean).length} dari ${workout().length} gerakan selesai</p></div></div>
      <div class="row" style="gap:6px">${workout().map((w,i)=>`<span style="flex:1;height:6px;border-radius:4px;background:${d.sets[i]?"var(--sky)":"var(--line)"}"></span>`).join("")}</div>
      <button class="btn" data-tab="program" style="background:var(--sky)">Buka sesi latihan</button>
    </div>
    <div class="card">
      <div class="row between"><h3>Isi Piringku hari ini</h3><span class="pill">${plateScore(t)}</span></div>
      ${plateChart(t)}
    </div>
    <div class="card">
      <div class="row between"><h3>Catatan makan hari ini</h3><button class="btn small" data-tab="catat" style="background:var(--coral)">${I.cam} Catat</button></div>
      ${mealList(t)}
    </div>
    <div class="card" style="background:var(--green-soft);border-color:transparent">
      <div class="row">${coachFace(44)}<p style="font-weight:600">"${QUOTES[dn%QUOTES.length]}"</p></div>
    </div>
  </div>`;
}
function mealList(k){
  const d = day(k);
  if(!d.meals.length) return `<p class="muted small">Belum ada catatan. Ketuk Catat untuk memotret makanan pertamamu.</p>`;
  return `<div>${d.meals.map((m,mi)=>`<div class="meal">${m.photoId?`<img class="thumb" data-photo="${m.photoId}" alt="Foto ${esc(m.meal)}">`:`<div class="ics">${m.items.slice(0,3).map(it=>FOODS[it.f]?fico(FOODS[it.f].c):"").join("")}</div>`}
    <div class="txt"><b class="small">${esc(m.meal)}${m.time?` <span class="muted" style="font-weight:500">${m.time}</span>`:""}</b><p class="small muted">${m.items.map(it=>FOODS[it.f]?esc(FOODS[it.f].n):"").join(", ")}</p></div>
    <span class="kcal small">${fmt(m.items.reduce((a,it)=>a+itemKcal(it),0))} kkal</span>
    <button class="btn ghost small" data-act="delmeal" data-d="${k}" data-i="${mi}" aria-label="Hapus catatan ${esc(m.meal)}">×</button></div>`).join("")}</div>`;
}
function plateChart(k){
  const g = plateParts(k), tot = g.pokok+g.lauk+g.sayur+g.buah;
  const segs = [["Makanan pokok",g.pokok,"#e3c27a","1/3"],["Lauk pauk",g.lauk,"#c9733a","1/6"],["Sayur",g.sayur,"#2f9e6e","1/3"],["Buah",g.buah,"#f5b631","1/6"]];
  let a = -Math.PI/2; const R=48, C=60;
  const arcs = tot? segs.map(([l,v,col])=>{ if(!v) return ""; const da = v/tot*Math.PI*2, a2=a+da; const large = da>Math.PI?1:0;
    const p = da>=Math.PI*2-0.001 ? `<circle cx="${C}" cy="${C}" r="${R}" fill="${col}"/>` : `<path d="M${C} ${C} L${C+R*Math.cos(a)} ${C+R*Math.sin(a)} A${R} ${R} 0 ${large} 1 ${C+R*Math.cos(a2)} ${C+R*Math.sin(a2)}Z" fill="${col}"/>`; a=a2; return p }).join("") : "";
  const tip = !tot ? "Catat makananmu untuk melihat komposisi piring hari ini." : g.sayur+g.buah < tot*.45 ? (g.buah? "Tambah setengah piring sayur di makan berikutnya." : "Belum ada buah. Pisang atau pepaya cocok untuk camilan.") : "Komposisi sudah seimbang. Pertahankan!";
  return `<div class="plate-wrap"><svg viewBox="0 0 120 120" role="img" aria-label="Komposisi piring hari ini"><circle cx="60" cy="60" r="58" fill="var(--surface-2)" stroke="var(--line)"/>${arcs}<circle cx="60" cy="60" r="20" fill="var(--surface)"/></svg>
    <div class="legend">${segs.map(([l,v,col,ideal])=>`<span><i style="background:${col}"></i><b style="font-weight:600">${l}</b><span class="muted" style="margin-left:auto;font-size:12px">ideal ${ideal}</span></span>`).join("")}</div></div>
    <p class="small" style="background:var(--green-soft);padding:10px 12px;border-radius:12px">${tip}</p>`;
}
function questsCard(){
  const d = day(), done = QUESTS.filter(q=>d.claimed[q.id]).length;
  return `<div class="card">
    <div class="row between"><h3>Misi hari ini</h3><span class="xp">${done}/${QUESTS.length} selesai</span></div>
    ${QUESTS.map(q=>{ const ok=q.done(), cl=d.claimed[q.id], s=typeof q.sub==="function"?q.sub():q.sub;
      return `<div class="quest ${cl?"claimed":""}"><span class="qi" style="background:${q.col}">${I[q.ic]}</span><div class="qt"><b>${esc(q.t)}</b><div class="small muted">${esc(s)}</div></div>
      ${cl?`<span class="xp">${sm(I.check)}</span>`:ok?`<button class="btn claim" data-act="claim" data-q="${q.id}">Ambil +${q.xp}</button>`:q.go?`<button class="btn ghost small" data-tab="${q.go}">+${q.xp} XP</button>`:`<span class="xp">+${q.xp} XP</span>`}</div>` }).join("")}
    <p class="small muted">XP didapat dari kebiasaan sehat. Tidak ada XP untuk makan sangat sedikit atau turun berat cepat.</p>
  </div>`;
}
function chestCard(){
  const d = day(), open = d.chest!==null && d.chest!==undefined, ch = challengeCount();
  return `<div class="card" style="background:linear-gradient(135deg,var(--sun-soft),var(--surface))">
    <div class="chest ${open?"":"closed"}">${chestSvg(open)}<div style="flex:1;min-width:0">
      <h3>${open?"Isi peti hari ini":"Peti hadiah harian"}</h3>
      <p class="small ${open?"":"muted"}">${open?esc(CHEST[d.chest].t):"Satu peti tiap hari. Isinya kejutan: XP, pot baru, atau tips. Kembali besok untuk peti berikutnya."}</p>
      ${open?"":`<button class="btn small" data-act="chest" style="margin-top:8px;background:var(--sun);color:#3b2a00">Buka peti</button>`}</div></div>
    <div><div class="row between small"><b>Tantangan minggu ini: 5 hari Isi Piringku seimbang</b><span class="xp">+100</span></div>
      <div class="qprog" style="margin-top:6px"><i style="width:${ch/5*100}%"></i></div><p class="small muted" style="margin-top:4px">${ch} dari 5 hari · hadiah: pot emas${S.claimedChallenge===weekNo()?" · sudah diambil":""}</p>
      ${ch>=5 && S.claimedChallenge!==weekNo()?`<button class="btn claim" data-act="challenge" style="margin-top:6px">Ambil hadiah tantangan</button>`:""}</div>
  </div>`;
}
function currentWeight(){ return S.weights.length ? S.weights[S.weights.length-1].kg : S.profile.weight }
function evalDue(){ if(!S.startDate) return false; const wk = Math.floor((dayNo()-1)/7); if(wk<1 || wk>12) return false; return !S.weights.some(w=>w.week===wk) }

/* =========================================================
   12. CATAT MAKAN
   ========================================================= */
function mealNow(){ const h = new Date().getHours(); return h<10?"Sarapan":h<15?"Makan siang":h<18?"Camilan":"Makan malam" }
function vCatat(){
  if(!draft) return `<div class="stack enter">
    <section class="cam-hero">
      <div><div class="eyebrow" style="color:#fff;opacity:.9">Catat makan & minum</div><h1>Foto, pilih, simpan</h1></div>
      <div class="frame">${I.cam.replace(st,'fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"')}
        <p style="font-weight:600">Foto piringmu sebagai catatan, lalu pilih menunya. Foto tersimpan di HP-mu saja.</p>
        <div class="row" style="width:100%"><button class="btn" style="flex:1" data-act="camera">${I.cam} Kamera</button><button class="btn" style="flex:1" data-act="gallery">${I.img} Galeri</button></div>
        <button class="btn ghost small" data-act="nophoto" style="background:rgba(255,255,255,.18);color:#fff;border-color:rgba(255,255,255,.4)">Catat tanpa foto</button></div>
    </section>
    <div class="tips">
      <div class="tip"><svg viewBox="0 0 24 24" ${st}><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><circle cx="12" cy="12" r="4"/></svg>Foto dari atas</div>
      <div class="tip"><svg viewBox="0 0 24 24" ${st}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>Seluruh piring terlihat</div>
      <div class="tip"><svg viewBox="0 0 24 24" ${st}><path d="M7 3v8a3 3 0 0 0 3 3v7M7 3c-2 0-3 3-3 5s1 3 3 3"/><path d="M17 3v18"/></svg>Sendok sebagai pembanding</div>
    </div>
    <div class="card"><h3>Cepat tanpa foto</h3>
      <div class="row wrap"><button class="btn ghost small" data-act="quick" data-f="air">Air putih 250 ml</button><button class="btn ghost small" data-act="quick" data-f="pisang">Pisang</button><button class="btn ghost small" data-act="quick" data-f="tehtawar">Teh tawar</button></div>
      ${S.favorites.length?`<div class="small muted" style="margin-top:4px">Menu favorit</div><div class="stack" style="gap:6px">${S.favorites.slice(0,6).map((f,i)=>`<button class="res" data-act="fav" data-i="${i}"><span style="display:flex">${f.items.slice(0,3).map(it=>FOODS[it.f]?fico(FOODS[it.f].c,";width:28px;height:28px;border-radius:9px"):"").join("")}</span><span><b>${esc(f.name)}</b></span><span class="k">${fmt(f.items.reduce((a,it)=>a+itemKcal(it),0))} kkal</span></button>`).join("")}</div>`:`<p class="small muted">Menu yang sering kamu simpan akan muncul di sini sebagai favorit.</p>`}
      ${lastDayWithMeals()?`<button class="btn ghost small" data-act="copyyesterday">Salin semua makan dari ${pretty(lastDayWithMeals())}</button>`:""}
    </div></div>`;
  const tot = draft.items.reduce((a,it)=>a+itemKcal(it),0), prot = draft.items.reduce((a,it)=>a+itemProt(it),0);
  return `<div class="stack enter">
    ${draft.photo?`<img class="photo" src="${draft.photo}" alt="Foto makanan">`:""}
    <label class="small">Waktu makan<select id="mealsel">${["Sarapan","Makan siang","Camilan","Makan malam","Minuman"].map(m=>`<option ${draft.meal===m?"selected":""}>${m}</option>`).join("")}</select></label>
    <div class="total"><div><div class="small" style="opacity:.85;font-weight:700">${draft.items.length} item</div><div class="big">${draft.items.length?`${fmt(tot*0.85)}–${fmt(tot*1.15)}`:"0"} kkal</div></div><div style="text-align:right"><div class="big">${dec(prot,0)} g</div><div class="small" style="opacity:.85;font-weight:700">protein</div></div></div>
    ${draft.items.map((it,i)=>itemCard(it,i)).join("")}
    <div class="card"><h3>${draft.items.length?"Tambah item lain":"Apa saja yang kamu makan atau minum?"}</h3>
      <div class="search"><input type="text" id="q" placeholder="Cari: nasi, ayam, es teh…" value="${esc(query)}" aria-label="Cari makanan" autocomplete="off"></div>
      <div class="cats seg">${CATS.map(([k,l])=>`<button data-act="cat" data-c="${k}" aria-pressed="${catFilter===k}">${l}</button>`).join("")}</div>
      <div class="results" id="results">${resultsHtml()}</div>
      <p class="small muted">Tidak ada di daftar? Pilih yang paling mirip. Angka kalori adalah perkiraan.</p>
    </div>
    <div class="row"><button class="btn ghost" data-act="cancel">Batal</button><button class="btn" style="flex:1" data-act="savemeal">${sm(I.check,18)} Simpan</button></div>
  </div>`;
}
function resultsHtml(){
  const q = query.trim().toLowerCase();
  const list = Object.entries(FOODS).filter(([k,f])=> (catFilter==="semua"||f.g===catFilter) && (!q || f.n.toLowerCase().includes(q))).slice(0,40);
  if(!list.length) return `<p class="small muted">Tidak ditemukan. Coba kata lain.</p>`;
  return list.map(([k,f])=>`<button class="res" data-act="add" data-f="${k}">${fico(f.c)}<span><b>${esc(f.n)}</b><br><span class="small muted">${esc(f.u)}</span></span><span class="k">${fmt(itemKcal({f:k,q:1}))} kkal</span></button>`).join("");
}
function itemCard(it,i){
  const f = FOODS[it.f];
  return `<div class="card">
    <div class="row">${fico(f.c)}<div style="flex:1;min-width:0"><b>${esc(f.n)}</b><div class="small muted">${fmt(itemKcal(it))} kkal · ${dec(itemProt(it))} g protein</div></div>
      <button class="btn ghost small" data-act="del" data-i="${i}" aria-label="Hapus ${esc(f.n)}">Hapus</button></div>
    <div class="row between"><span class="small muted">Porsi (${esc(f.u)})</span>
      <span class="stepper"><button data-act="q" data-i="${i}" data-d="-0.5" aria-label="Kurangi porsi">−</button><span>${dec(it.q)}×</span><button data-act="q" data-i="${i}" data-d="0.5" aria-label="Tambah porsi">+</button></span></div>
    ${f.fried?`<div class="seg" role="group" aria-label="Cara masak"><button data-act="opt" data-k="fried" data-v="1" data-i="${i}" aria-pressed="${it.fried!==false}">Digoreng</button><button data-act="opt" data-k="fried" data-v="0" data-i="${i}" aria-pressed="${it.fried===false}">Dibakar/rebus</button></div>`:""}
    ${f.santan?`<div class="seg" role="group" aria-label="Santan"><button data-act="opt" data-k="santan" data-v="1" data-i="${i}" aria-pressed="${it.santan!==false}">Santan kental</button><button data-act="opt" data-k="santan" data-v="0" data-i="${i}" aria-pressed="${it.santan===false}">Sedikit santan</button></div>`:""}
    ${f.sugar!==undefined?`<div><div class="small muted" style="margin-bottom:6px">Gula berapa sendok teh?</div><div class="seg">${[0,1,2,3,4].map(s=>`<button data-act="sugar" data-i="${i}" data-v="${s}" aria-pressed="${(it.sugar!==undefined?it.sugar:f.sugar)===s}">${s===0?"Tanpa gula":s+" sdt"}</button>`).join("")}</div></div>`:""}
  </div>`;
}
function lastDayWithMeals(){ const t=today(); for(let i=1;i<=7;i++){ const k=addDays(t,-i); if(S.days[k] && S.days[k].meals.length) return k } return null }
function saveMeal(btn){
  if(!draft.items.length){ toast("Pilih minimal satu makanan atau minuman"); return }
  const d = day(); const items = draft.items.map(({f,q,fried,santan,sugar})=>({f,q,fried,santan,sugar}));
  const now = new Date(), meal = {meal:draft.meal, time:`${pad(now.getHours())}.${pad(now.getMinutes())}`, items, drinkOnly: items.every(it=>FOODS[it.f].drink)};
  if(draft.photo){ meal.photoId = "p"+Date.now(); putPhoto(meal.photoId, draft.photo); photoCache[meal.photoId]=draft.photo }
  d.meals.push(meal); d.water += items.filter(x=>x.f==="air").reduce((a,x)=>a+250*x.q,0);
  // favorit: simpan kombinasi yang dipakai
  const sig = items.map(it=>it.f+":"+it.q).sort().join(",");
  const fav = S.favorites.find(f=>f.sig===sig);
  if(fav){ fav.n++; } else if(items.length>=1) S.favorites.push({sig, name: items.map(it=>FOODS[it.f].n).slice(0,3).join(" + "), items, n:1});
  S.favorites.sort((a,b)=>b.n-a.n); S.favorites = S.favorites.slice(0,20);
  S.xp += 5; const r=btn.getBoundingClientRect(); burst(r.left+r.width/2, r.top);
  draft=null; query=""; save(); toast("Tersimpan (+5 XP)."); go("beranda");
}

/* =========================================================
   13. PROGRAM
   ========================================================= */
function journeyMap(sel){
  const pts = [[40,40],[110,40],[180,40],[250,40],[320,40],[340,100],[270,110],[200,110],[130,110],[60,110],[60,170],[150,175]];
  const d = "M" + pts.map(([x,y])=>`${x} ${y}`).join(" L"), cw = weekNo();
  return `<svg class="jmap" viewBox="0 0 380 210" role="img" aria-label="Peta perjalanan 12 minggu">
    <path d="${d}" stroke="var(--line)" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${d}" stroke="var(--green)" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="11" stroke-dasharray="${cw-1} 20"/>
    ${pts.map(([x,y],i)=>{ const w=i+1, ph=PROGRAM[i][0], col=PHASES[ph], done=w<cw, cur=w===cw;
      return `<g class="node" data-act="wk" data-w="${w}" role="button" tabindex="0" aria-label="Minggu ${w}">
        ${cur?`<circle cx="${x}" cy="${y}" r="16" fill="${col}" class="pulse"/>`:""}
        <circle cx="${x}" cy="${y}" r="${sel===w?19:16}" fill="${done||cur?col:"var(--surface)"}" stroke="${col}" stroke-width="3"/>
        ${done?`<path d="M${x-6} ${y} l4 4 8-8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`:`<text x="${x}" y="${y+5}" text-anchor="middle" font-size="14" font-weight="800" font-family="Fredoka, sans-serif" fill="${cur?"#fff":col}">${w}</text>`}
      </g>` }).join("")}
    <g transform="translate(205 160)"><path d="M0 0v-30" stroke="var(--fg)" stroke-width="2.5"/><path d="M0 -30l18 7-18 7z" fill="var(--sun)"/><text x="10" y="18" font-size="12" font-weight="700" fill="var(--muted)" text-anchor="middle">Finis</text></g>
  </svg>`;
}
function vProgram(){
  const cw = weekNo(), sel = sub || cw, wk = PROGRAM[sel-1], col = PHASES[wk[0]], d = day();
  const lvl = {pemula:"Pemula",menengah:"Menengah",lanjut:"Lanjut"}[S.profile.level||"pemula"];
  return `<div class="stack enter">
    <div><div class="eyebrow">Perjalanan 12 minggu</div><h1>Minggu ${sel}: fase ${wk[0]}</h1></div>
    <div class="card">${journeyMap(sel)}
      <div class="row wrap" style="gap:6px">${Object.keys(PHASES).map(p=>`<span class="pill" style="background:${PHASE_SOFT[p]};color:var(--fg)"><i style="width:9px;height:9px;border-radius:50%;background:${PHASES[p]};display:inline-block"></i>${p}</span>`).join("")}</div></div>
    <div class="phase" style="background:${PHASE_SOFT[wk[0]]}">
      <div class="facts">
        <div class="fact"><span class="fico" style="background:${col}">${I.leaf}</span><div><div class="small muted">Fokus kebiasaan</div><b>${esc(wk[1])}</b></div></div>
        <div class="fact"><span class="fico" style="background:${col}">${I.plate}</span><div><div class="small muted">Gizi</div><b>${esc(wk[2])}</b></div></div>
        <div class="fact"><span class="fico" style="background:${col}">${I.dumbbell}</span><div><div class="small muted">Latihan</div><b>${esc(wk[3])}</b></div></div>
      </div>
    </div>
    ${sel===cw?`<div class="card">
      <div class="row between"><h3>Sesi hari ini</h3><span class="pill sky">${lvl}</span></div>
      ${workout().map((w,i)=>`<label class="ex"><input type="checkbox" data-set="${i}" ${d.sets[i]?"checked":""}><span class="fig">${FIG[w.f]}</span><span class="tx"><b>${esc(w.n)}</b><br><span class="small muted">${esc(w.d)}</span></span><span class="ck">${I.check}</span></label>`).join("")}
      <p class="small muted">Intensitas sedang: masih bisa bicara, tapi tidak bisa bernyanyi (RPE 5–6 dari 10). Naikkan beban hanya jika semua set selesai dengan teknik baik 2 sesi berturut-turut. Latihan beban 2–3× seminggu, hari lain cukup jalan.</p>
      <button class="btn ghost danger" data-act="unwell">Saya merasa tidak enak</button>
    </div>`:`<div class="card" style="align-items:center;text-align:center"><p class="muted">${sel<cw?"Minggu ini sudah kamu lewati. Mantap!":"Detail sesi terbuka saat minggu ini dimulai."}</p></div>`}
  </div>`;
}

/* =========================================================
   14. PROGRES & EVALUASI
   ========================================================= */
function badge(lbl, ok, color, icon){
  return `<div class="badge ${ok?"":"lock"}"><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 3l23 13v28L30 57 7 44V16z" fill="${color}"/><path d="M30 9l18 10v22L30 51 12 41V19z" fill="#fff" opacity=".22"/><g transform="translate(18 18)" fill="#fff" color="#fff">${sm(icon,24)}</g></svg>${lbl}</div>`;
}
function vProgres(){
  const W = [{week:0, kg:S.profile.weight, waist:S.profile.waist}, ...S.weights];
  const xs = i => 44 + i*(296/12), lo = Math.min(...W.map(w=>w.kg), W[0].kg*0.95), hi = Math.max(...W.map(w=>w.kg));
  const min = Math.floor(lo-1), max = Math.ceil(hi+1), y = v => 18 + (max-v)/(max-min)*142;
  const tgt = W[0].kg*0.95, last = W[W.length-1], lost = W[0].kg-last.kg;
  const pts = W.map(w=>`${xs(w.week)},${y(w.kg)}`).join(" ");
  const area = `M${xs(0)},${y(W[0].kg)} ${W.map(w=>`L${xs(w.week)},${y(w.kg)}`).join(" ")} L${xs(last.week)},160 L${xs(0)},160Z`;
  const ticks = []; const step = Math.max(1,Math.round((max-min)/4)); for(let v=min; v<=max; v+=step) ticks.push(v);
  const pctGoal = Math.max(0, Math.min(100, lost/(W[0].kg*0.05)*100));
  const activeDays = Object.keys(S.days).filter(isActive).length, sk = streakInfo();
  const due = evalDue(), wkEval = Math.floor((dayNo()-1)/7);
  return `<div class="stack enter">
    <div><div class="eyebrow">Progres</div><h1>${S.weights.length?(lost>=0?`Turun ${dec(lost)} kg dalam ${last.week} minggu`:`Naik ${dec(-lost)} kg, ayo evaluasi bersama`):"Evaluasi pertamamu di akhir minggu 1"}</h1></div>
    <div class="stats">
      <div class="stat s"><span class="ico">${I.chart}</span><div class="num">${dec(last.kg)} kg</div><div class="of">berat terakhir</div><div class="bar"><i style="width:${pctGoal}%"></i></div><div class="small" style="font-weight:700">${Math.round(pctGoal)}% menuju target −5%</div></div>
      <div class="stat w"><span class="ico"><svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="3"/></svg></span><div class="num">${dec(last.waist)} cm</div><div class="of">lingkar perut</div><div class="bar"><i style="width:${Math.max(0,Math.min(100,(W[0].waist-last.waist)/4*100))}%"></i></div><div class="small" style="font-weight:700">${W[0].waist-last.waist>=0?"−":"+"}${dec(Math.abs(W[0].waist-last.waist))} cm dari awal</div></div>
    </div>
    <div class="card"><svg class="chart" viewBox="0 0 360 196" role="img" aria-label="Grafik berat badan per minggu">
      <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--coral)" stop-opacity=".35"/><stop offset="1" stop-color="var(--coral)" stop-opacity="0"/></linearGradient></defs>
      ${ticks.map(v=>`<line x1="44" x2="348" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="36" y="${y(v)+4}" text-anchor="end" font-size="10" fill="var(--muted)">${v}</text>`).join("")}
      <line x1="44" x2="348" y1="${y(tgt)}" y2="${y(tgt)}" stroke="var(--green)" stroke-width="1.5" stroke-dasharray="5 5"/><text x="348" y="${y(tgt)-6}" text-anchor="end" font-size="10.5" font-weight="700" fill="var(--green)">target ${dec(tgt)} kg</text>
      ${W.length>1?`<path d="${area}" fill="url(#ar)"/><polyline points="${pts}" fill="none" stroke="var(--coral)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`:""}
      ${W.map(w=>`<circle cx="${xs(w.week)}" cy="${y(w.kg)}" r="${w===last?6:4}" fill="${w===last?"var(--coral)":"var(--surface)"}" stroke="var(--coral)" stroke-width="2.5"/>`).join("")}
      <text x="${xs(last.week)}" y="${y(last.kg)-12}" text-anchor="middle" font-size="11" font-weight="800" fill="var(--fg)">${dec(last.kg)}</text>
      ${[0,4,8,12].map(n=>`<text x="${xs(n)}" y="184" text-anchor="middle" font-size="10" fill="var(--muted)">${n===0?"Awal":"M"+n}</text>`).join("")}
    </svg><p class="small muted">Berat (kg) tiap akhir minggu. Lihat trennya, bukan angka harian yang naik turun karena air.</p></div>
    <div class="card"><div class="row"><span class="fico" style="background:var(--sun-soft)">${FI.egg.s}</span><div><h3>Evaluasi minggu ${due?wkEval:Math.max(1,wkEval)}</h3><p class="small muted">${due?"Timbang pagi setelah buang air kecil, sebelum makan.":wkEval<1?"Terbuka di hari ke-8 program.":"Sudah diisi. Evaluasi berikutnya terbuka minggu depan."}</p></div></div>
      ${due?`<div class="grid2"><label>Berat (kg)<input type="number" inputmode="decimal" id="ev-kg" step="0.1" placeholder="${dec(last.kg)}"></label><label>Lingkar perut (cm)<input type="number" inputmode="decimal" id="ev-waist" step="0.5" placeholder="${dec(last.waist)}"></label></div>
      <label>Energi minggu ini (1–10)<input type="number" inputmode="numeric" id="ev-en" min="1" max="10" placeholder="7"></label>
      <p class="small muted">Kepatuhan minggu ini dihitung otomatis: ${adherence(wkEval)}% hari aktif.</p>
      <button class="btn" data-act="eval">Simpan evaluasi</button>`:""}
    </div>
    <div class="card"><h3>Lencana</h3>
      <div class="badges">
        ${badge("Hari aktif pertama",activeDays>=1,"#f0663f",I.cam)}${badge("7 hari aktif",activeDays>=7,"#f5b631",I.flame)}${badge("Streak 14 hari",sk.n>=14,"#2f8fd8",I.shield)}${badge("Turun 1 kg",lost>=1,"#0f8a5f",I.chart)}
        ${badge("Fase Fondasi",weekNo()>3,"#2f9e57",I.leaf)}${badge("Fase Bangun",weekNo()>6,"#2f8fd8",I.dumbbell)}${badge("Fase Akselerasi",weekNo()>9,"#f0663f",I.bolt)}${badge("Lulus 12 minggu",dayNo()>84,"#8a5cc7",I.star)}
      </div></div>
  </div>`;
}
function adherence(wk){ if(!S.startDate || wk<1) return 0; const start=addDays(S.startDate,(wk-1)*7); let n=0; for(let i=0;i<7;i++) if(isActive(addDays(start,i))) n++; return Math.round(n/7*100) }
function doEval(btn){
  const kg = parseFloat($("#ev-kg").value), waist = parseFloat($("#ev-waist").value), en = parseFloat($("#ev-en").value)||null;
  if(!(kg>30&&kg<300)){ toast("Isi berat antara 30 dan 300 kg"); return }
  const wk = Math.floor((dayNo()-1)/7), adh = adherence(wk);
  const prevList = [{kg:S.profile.weight}, ...S.weights], prev = prevList[prevList.length-1], d = prev.kg-kg;
  const d2 = prevList.length>=2 ? prevList[prevList.length-2].kg - prev.kg : 0;
  S.weights.push({week:wk, date:today(), kg, waist: waist||(S.weights.length?S.weights[S.weights.length-1].waist:S.profile.waist), adh, energy:en});
  const p = S.profile; let msg;
  if(d>1.5 && d2>1.5){ p.adjust=(p.adjust||0)+150; msg="Turun terlalu cepat 2 minggu berturut-turut. Target kalori dinaikkan 150 kkal. Kalau terasa lemas atau pusing, periksa ke tenaga kesehatan." }
  else if(d>1){ msg="Turun lebih dari 1 kg. Bagus, tapi perhatikan tanda lelah. Program tetap." }
  else if(d>=0.5){ msg="Turun 0,5–1 kg: sesuai rencana. Lanjutkan!" }
  else if(adh<60){ msg="Kepatuhan di bawah 60%. Kalori tidak diubah dulu; fokus catat makan dan kebiasaan minggu ini." }
  else if(S.weights.length>=2 && S.weights.slice(-2).every((w,i,a)=> (i===0? (prevList[prevList.length-2]||{kg:w.kg}).kg : a[0].kg) - w.kg < 0.3)){ p.adjust=(p.adjust||0)-100; msg="Dua minggu belum turun padahal cukup patuh. Target kalori dikurangi 100 kkal (tetap di atas batas aman). Tambah juga 2.000 langkah per hari." }
  else msg="Belum turun minggu ini. Itu wajar. Tetap konsisten, minggu depan kita lihat lagi.";
  const floorAdj = calc(p).target; void floorAdj;
  addXP(30, btn); save(); render(); toast(msg);
}

/* =========================================================
   15. PELATIH (jawaban dasar)
   ========================================================= */
const QA = [
  [/pelangsing|obat diet|suplemen|steroid|detoks|pembakar lemak/i,"Tegas ya: aku tidak menyarankan obat pelangsing, steroid, atau suplemen \"pembakar lemak\". Banyak yang tidak terbukti, sebagian berbahaya untuk jantung dan hati. Jalan yang aman: defisit 300–500 kkal, protein cukup, latihan beban, tidur 7–9 jam."],
  [/nyeri dada|pingsan|sesak|pusing|berdebar/i,"Hentikan aktivitas sekarang dan duduk. Kalau nyeri dada, sesak berat, atau pingsan, segera hubungi 119 atau ke IGD terdekat. Setelah itu periksa ke dokter sebelum lanjut latihan."],
  [/muntah|memuntahkan|takut gemuk|benci (badan|tubuh)|jijik/i,"Terima kasih sudah cerita. Perasaan seperti itu berat, dan kamu tidak sendirian. Sebaiknya bicarakan dengan tenaga kesehatan atau psikolog di puskesmas terdekat. Untuk sementara, fokus pada makan teratur, bukan angka kalori."],
  [/naik|plateau|stuck|tidak turun|nggak turun|gak turun/i,"Berat naik turun 1–2 kg itu wajar karena air, garam, dan siklus. Lihat tren mingguan. Kalau 2–3 minggu tidak turun padahal kepatuhan di atas 80%, aplikasi akan mengurangi target 100 kkal atau kamu bisa tambah 2.000 langkah per hari."],
  [/malam/i,"Boleh makan malam. Yang menentukan berat adalah total kalori sehari, bukan jamnya. Tips: makan malam 2–3 jam sebelum tidur, porsi Isi Piringku, kurangi gorengan."],
  [/puasa|ga makan|tidak makan|skip|diet ketat/i,"Jangan sampai di bawah 1.200 kkal (wanita) atau 1.500 kkal (pria) tanpa pengawasan. Melewatkan makan sering bikin kalap di malam hari. Lebih baik 3 kali makan teratur plus camilan terencana."],
  [/nasi|karbo/i,"Nasi tidak harus dihapus. Atur porsinya: sekitar sepertiga piring (1 centong), sisanya sayur, lauk protein, dan buah. Nasi merah atau campur jagung bikin kenyang lebih lama."],
  [/gorengan|goreng/i,"Gorengan boleh sesekali. Batasi 1 buah per hari, dan pilih lauk dibakar, dikukus, atau direbus di hari lain. Satu sendok makan minyak bisa menambah sekitar 100 kkal."],
  [/malas|males|bosan|capek|motivasi/i,"Wajar kok. Turunkan targetnya hari ini: cukup jalan 10 menit dan catat satu kali makan. Yang penting rantai kebiasaanmu tidak putus. Disiplin itu dibangun dari langkah kecil."],
  [/protein/i,"Sumber protein murah: telur, tempe, tahu, ikan, ayam tanpa kulit, kacang-kacangan. Usahakan ada protein di setiap makan."],
  [/minum|air|haus/i,"Targetkan air sesuai angka di Beranda (sekitar 30 ml per kg berat badan). Bawa botol ke mana-mana dan minum segelas sebelum makan."],
  [/tidur|begadang/i,"Usahakan tidur 7–9 jam. Kurang tidur menaikkan hormon lapar dan bikin ngemil. Jauhkan HP 30 menit sebelum tidur."]
];
function botReply(q){ const hit = QA.find(([re])=>re.test(q)); return hit ? hit[1] : "Aku belum punya jawaban untuk itu. Coba tanyakan soal makan, latihan, tidur, motivasi, atau berat yang tidak turun. Untuk masalah kesehatan, konsultasikan ke dokter atau puskesmas." }
function vPelatih(){
  if(!S.chat.length) S.chat = [{b:1,t:"Halo! Aku Coach. Tanya soal makan, latihan, atau motivasi. Aku bukan pengganti dokter, ya."}];
  return `<div class="stack enter">
    <div class="coach">${coachFace(56)}<div><div class="eyebrow" style="color:var(--hero-ink);opacity:.85">Pelatih</div><h2 style="color:var(--hero-ink)">Coach siap bantu</h2><p class="small" style="opacity:.9">Tegas soal disiplin, hangat soal proses.</p></div></div>
    <div class="chat" aria-live="polite">${S.chat.slice(-30).map(m=>`<div class="msg ${m.b?"bot":"me"}">${esc(m.t)}</div>`).join("")}</div>
    <div class="seg">${["Boleh makan malam?","Kok berat naik?","Lagi malas olahraga","Obat pelangsing aman?","Harus stop nasi?"].map(q=>`<button data-act="ask" data-q="${q}">${q}</button>`).join("")}</div>
    <form id="askf" class="row"><input type="text" id="askin" placeholder="Tulis pertanyaan…" aria-label="Pertanyaan" autocomplete="off"><button class="btn" type="submit">Kirim</button></form>
    <p class="small muted">Jawaban Coach adalah panduan umum dari pedoman kesehatan, bukan diagnosis.</p>
  </div>`;
}
function ask(q){ if(!q.trim()) return; S.chat.push({t:q}); S.chat.push({b:1,t:botReply(q)}); S.chat=S.chat.slice(-60); save(); render(); window.scrollTo(0, document.body.scrollHeight) }

/* =========================================================
   16. AKUN & PENGATURAN
   ========================================================= */
function vAkun(){
  const p = S.profile, c = calc(p, currentWeight());
  return `<div class="stack enter">
    <div class="row between"><div><div class="eyebrow">Profil</div><h1>Data & pengaturan</h1></div><button class="btn ghost small" data-tab="beranda">Tutup</button></div>
    <div class="card">${resultHtml(c,{...p, waist: S.weights.length?S.weights[S.weights.length-1].waist:p.waist})}</div>
    <div class="card"><h3>Ubah data</h3>
      <div class="grid2">
        <label>Usia (tahun)<input type="number" id="pf-age" value="${p.age}"></label>
        <label>Tinggi (cm)<input type="number" id="pf-height" value="${p.height}"></label>
        <label>Aktivitas<select id="pf-act">${[[1.2,"Banyak duduk"],[1.375,"Ringan"],[1.55,"Sedang"],[1.725,"Berat"]].map(([v,l])=>`<option value="${v}" ${p.act==v?"selected":""}>${l}</option>`).join("")}</select></label>
        <label>Level latihan<select id="pf-level">${["pemula","menengah","lanjut"].map(l=>`<option value="${l}" ${p.level===l?"selected":""}>${l[0].toUpperCase()+l.slice(1)}</option>`).join("")}</select></label>
      </div>
      <div><div class="small muted" style="margin-bottom:6px">Kondisi kesehatan</div>${SCREEN.map(s=>`<label class="check" style="margin-bottom:6px"><input type="checkbox" data-pfscr="${esc(s)}" ${(p.screen||[]).includes(s)?"checked":""}><span class="small">${esc(s)}</span></label>`).join("")}</div>
    </div>
    <div class="card"><h3>Cadangan data</h3><p class="small muted">Data hanya ada di HP ini. Simpan cadangan secara berkala (misalnya kirim ke Google Drive atau WhatsApp sendiri) supaya tidak hilang saat ganti HP atau aplikasi dihapus. Foto tidak ikut dicadangkan.</p>
      <div class="row wrap"><button class="btn ghost small" data-act="export">Unduh cadangan</button><button class="btn ghost small" data-act="import">Pulihkan dari cadangan</button></div></div>
    <div class="card"><h3>Tentang</h3><p class="small muted">Sehat12 adalah alat bantu gaya hidup berbasis pedoman Kemenkes (Isi Piringku), WHO, dan ACSM. Bukan pengganti pemeriksaan dokter. Angka kalori adalah perkiraan. Rujuk ke tenaga kesehatan bila IMT ≥35 atau <17, punya penyakit kronis, hamil/menyusui, usia <18 atau lansia, atau mengalami nyeri dada, pingsan, sesak, atau tanda gangguan makan.</p></div>
    <div class="card"><h3>Hapus semua data</h3>
      ${confirmReset?`<p class="small">Yakin? Semua catatan, foto, dan XP di HP ini akan terhapus permanen.</p><div class="row"><button class="btn ghost" data-act="resetno">Batal</button><button class="btn" style="background:var(--crit);flex:1" data-act="resetyes">Ya, hapus semua</button></div>`:`<button class="btn ghost danger" data-act="reset">Hapus semua data</button>`}</div>
  </div>`;
}
const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
async function exportData(){
  if(NATIVE){
    try{
      const {Filesystem, Share} = window.Capacitor.Plugins, path = `sehat12-cadangan-${today()}.json`;
      await Filesystem.writeFile({path, data: JSON.stringify(S), directory:"CACHE", encoding:"utf8"});
      const {uri} = await Filesystem.getUri({path, directory:"CACHE"});
      await Share.share({title:"Cadangan Sehat12", text:"File cadangan data Sehat12", url:uri, dialogTitle:"Simpan cadangan ke…"});
    }catch(e){ if(!/cancel/i.test(String(e && e.message))) toast("Cadangan gagal dibuat. Coba lagi.") }
    return;
  }
  const blob = new Blob([JSON.stringify(S,null,1)],{type:"application/json"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `sehat12-cadangan-${today()}.json`; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove() }, 500);
  toast("Cadangan diunduh");
}
function importData(file){
  const fr = new FileReader(); fr.onload = () => { try{ const d = JSON.parse(fr.result); if(!d || d.v!==1 || !d.days) throw 0; S = Object.assign(blank(), d); save(); tab="beranda"; render(); toast("Data dipulihkan") }catch(e){ toast("File cadangan tidak dikenali") } }; fr.readAsText(file);
}

/* =========================================================
   17. RENDER & EVENT
   ========================================================= */
let welcomeSeen = false;
function render(){
  let v;
  if(!S.profile || !S.startDate) v = welcomeSeen ? vOnboard() : vWelcome();
  else v = {beranda:vBeranda, catat:vCatat, program:vProgram, progres:vProgres, pelatih:vPelatih, akun:vAkun}[tab]();
  $("#view").innerHTML = v; renderTabs(); loadPhotos();
}
function go(t){ tab=t; sub=null; confirmReset=false; render(); window.scrollTo(0,0) }
async function onPhoto(file){
  if(!file) return;
  try{ const data = await compress(file); draft = {photo:data, meal:mealNow(), items:[]}; catFilter="semua"; query=""; tab="catat"; render(); window.scrollTo(0,0) }
  catch(e){ toast("Foto tidak bisa dibaca. Coba foto lain.") }
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-tab],[data-act]"); if(!b) return;
  if(b.dataset.tab){ if(b.dataset.tab!=="catat") draft=null; go(b.dataset.tab); return }
  const a = b.dataset.act, i = +b.dataset.i;
  const d = S.profile ? day() : null;
  switch(a){
    case "obstart": welcomeSeen=true; onbStep=0; render(); window.scrollTo(0,0); break;
    case "obcancel": welcomeSeen=false; render(); break;
    case "obback": onbStep=Math.max(0,onbStep-1); render(); break;
    case "obnext": { const err=obValidate(); if(err){ toast(err); return } onbStep++; render(); window.scrollTo(0,0); break }
    case "obfinish": S.profile=obProfile(); S.startDate=today(); S.xp=20; save(); tab="beranda"; render(); window.scrollTo(0,0); toast("Program dimulai! +20 XP untuk langkah pertama."); break;
    case "water": d.water+=250; save(); render(); toast("Air +250 ml"); break;
    case "stepsedit": showModal(`<h2>Langkah hari ini</h2><p class="small muted">Lihat angkanya di aplikasi kesehatan atau jam pintar di HP-mu, lalu isi di sini.</p><input type="number" inputmode="numeric" id="stepsin" value="${d.steps||""}" placeholder="mis. 6500" style="text-align:center;font-size:20px"><div class="row" style="width:100%"><button class="btn ghost" data-act="closemodal">Batal</button><button class="btn" style="flex:1" data-act="stepssave">Simpan</button></div>`); setTimeout(()=>{ const x=$("#stepsin"); if(x) x.focus() },50); break;
    case "stepssave": { const v=parseInt($("#stepsin").value,10); if(!(v>=0&&v<100000)){ toast("Isi angka langkah yang wajar"); return } d.steps=v; save(); $("#modal").hidden=true; render(); break }
    case "camera": $("#file").click(); break;
    case "gallery": $("#gallery").click(); break;
    case "nophoto": draft={photo:null, meal:mealNow(), items:[]}; catFilter="semua"; query=""; render(); break;
    case "quick": { const f=b.dataset.f; d.meals.push({meal: FOODS[f].drink?"Minuman":"Camilan", time:"", items:[{f,q:1}], drinkOnly:!!FOODS[f].drink}); if(f==="air") d.water+=250; save(); toast(FOODS[f].n+" dicatat"); go("beranda"); break }
    case "fav": { const f=S.favorites[i]; draft={photo:null, meal:mealNow(), items:JSON.parse(JSON.stringify(f.items))}; render(); break }
    case "copyyesterday": { const k=lastDayWithMeals(); if(k){ S.days[k].meals.forEach(m=>d.meals.push({...JSON.parse(JSON.stringify(m)), photoId:undefined})); save(); toast("Disalin dari "+pretty(k)); go("beranda") } break }
    case "cat": catFilter=b.dataset.c; render(); break;
    case "add": draft.items.push({f:b.dataset.f, q:1}); query=""; render(); toast(FOODS[b.dataset.f].n+" ditambahkan"); break;
    case "cancel": draft=null; query=""; render(); break;
    case "del": draft.items.splice(i,1); render(); break;
    case "q": draft.items[i].q = Math.max(0.5, Math.min(5, draft.items[i].q + +b.dataset.d)); render(); break;
    case "opt": draft.items[i][b.dataset.k] = b.dataset.v==="1"; render(); break;
    case "sugar": draft.items[i].sugar = +b.dataset.v; render(); break;
    case "savemeal": saveMeal(b); break;
    case "delmeal": { const dd=S.days[b.dataset.d]; if(dd){ const m=dd.meals[i]; dd.meals.splice(i,1); if(m) dd.water=Math.max(0, dd.water - m.items.filter(x=>x.f==="air").reduce((s,x)=>s+250*x.q,0)); save(); render(); toast("Catatan dihapus") } break }
    case "wk": sub=+b.dataset.w; render(); break;
    case "unwell": showModal(`<h2>Hentikan latihan dulu</h2><p>Duduk dan atur napas. Kalau ada <b>nyeri dada, sesak berat, pingsan, atau pusing hebat</b>, segera hubungi <b>119</b> atau ke IGD terdekat.</p><p class="small muted">Sebelum latihan lagi, periksakan diri ke dokter atau puskesmas.</p><button class="btn block" data-act="closemodal">Mengerti</button>`); break;
    case "eval": doEval(b); break;
    case "ask": ask(b.dataset.q); break;
    case "claim": { const q=QUESTS.find(q=>q.id===b.dataset.q); if(q&&q.done()&&!d.claimed[q.id]){ d.claimed[q.id]=1; addXP(q.xp,b); save(); render(); toast(Object.keys(d.claimed).length===QUESTS.length?"Semua misi beres! Hari yang sempurna.":`+${q.xp} XP`) } break }
    case "chest": { if(d.chest!==null && d.chest!==undefined) return; const k=Math.floor(Math.random()*CHEST.length); d.chest=k; const c=CHEST[k]; if(c.pot){ if(!S.pots.includes(c.pot)) S.pots.push(c.pot); else S.xp+=15 } const r=b.getBoundingClientRect(); burst(r.left+r.width/2,r.top); if(c.xp) addXP(c.xp); save(); render(); break }
    case "challenge": if(challengeCount()>=5 && S.claimedChallenge!==weekNo()){ S.claimedChallenge=weekNo(); if(!S.pots.includes("emas")) S.pots.push("emas"); addXP(100,b); save(); render(); toast("Tantangan selesai! Pot emas terbuka.") } break;
    case "pot": S.pot=b.dataset.p; save(); render(); break;
    case "closemodal": $("#modal").hidden=true; render(); break;
    case "export": exportData(); break;
    case "import": $("#importfile").click(); break;
    case "reset": confirmReset=true; render(); break;
    case "resetno": confirmReset=false; render(); break;
    case "resetyes": S=blank(); save(); delAllPhotos(); confirmReset=false; welcomeSeen=false; tab="beranda"; render(); window.scrollTo(0,0); toast("Semua data dihapus"); break;
  }
});
document.addEventListener("keydown", e => { if((e.key==="Enter"||e.key===" ") && e.target.classList && e.target.classList.contains("node")){ e.preventDefault(); sub=+e.target.dataset.w; render() } });
document.addEventListener("change", e => {
  const t = e.target;
  if(t.id==="habit"){ day().habit=t.checked; save(); if(t.checked){ const r=t.getBoundingClientRect(); burst(r.left+10,r.top+10); toast("Mantap, satu kebiasaan beres hari ini!") } render() }
  else if(t.dataset.set!==undefined){ day().sets[t.dataset.set]=t.checked; save(); const n=Object.values(day().sets).filter(Boolean).length; if(t.checked && n===workout().length){ const r=t.getBoundingClientRect(); burst(r.left+r.width/2,r.top); toast("Sesi selesai. Kerja bagus!") } }
  else if(t.id==="file" || t.id==="gallery"){ onPhoto(t.files[0]); t.value="" }
  else if(t.id==="importfile"){ if(t.files[0]) importData(t.files[0]); t.value="" }
  else if(t.id==="mealsel"){ draft.meal=t.value }
  else if(t.dataset.obscr!==undefined){ ob.screen = t.checked ? [...ob.screen, t.dataset.obscr] : ob.screen.filter(s=>s!==t.dataset.obscr) }
  else if(t.id==="ob-consent"){ ob.consent=t.checked }
  else if(t.id && t.id.startsWith("ob-")){ ob[t.id.slice(3)] = t.value }
  else if(t.dataset.pfscr!==undefined){ const p=S.profile; p.screen = t.checked ? [...(p.screen||[]), t.dataset.pfscr] : (p.screen||[]).filter(s=>s!==t.dataset.pfscr); save(); render() }
  else if(t.id && t.id.startsWith("pf-")){ const k=t.id.slice(3), v = k==="level"? t.value : parseFloat(t.value); if(k==="level" || (v>0)){ S.profile[k]=v; save(); render() } }
});
document.addEventListener("input", e => {
  const t = e.target;
  if(t.id==="q"){ query=t.value; const r=$("#results"); if(r) r.innerHTML=resultsHtml() }
  else if(t.id && t.id.startsWith("ob-") && t.type!=="checkbox"){ ob[t.id.slice(3)] = t.value }
});
document.addEventListener("submit", e => { if(e.target.id==="askf"){ e.preventDefault(); ask($("#askin").value) } });
// Saat aplikasi dibuka lagi (mis. hari berganti), segarkan tampilan
document.addEventListener("visibilitychange", () => { if(!document.hidden && !draft) render() });

render();
if(NATIVE){
  // Tombol kembali Android: tutup jendela, kembali ke Beranda, baru keluar aplikasi
  try{ window.Capacitor.Plugins.App.addListener("backButton", () => {
    const m = $("#modal");
    if(m && !m.hidden){ m.hidden = true; render(); }
    else if(draft){ draft = null; query = ""; render(); }
    else if(S.profile && S.startDate && tab !== "beranda"){ go("beranda"); }
    else if(!S.profile && welcomeSeen){ if(onbStep>0){ onbStep--; } else { welcomeSeen=false; } render(); }
    else window.Capacitor.Plugins.App.exitApp();
  }); }catch(e){}
} else if("serviceWorker" in navigator && location.protocol==="https:") navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
