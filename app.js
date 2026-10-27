const DBKEY="garuda_clan_matches_v2";
let matches=JSON.parse(localStorage.getItem(DBKEY)||"[]"), days=7, view="individual";

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function num(x){return Number(String(x||0).replace(/,/g,""))||0}
function save(){localStorage.setItem(DBKEY,JSON.stringify(matches));document.getElementById("matchCount").textContent=`${matches.length} MATCH${matches.length===1?"":"ES"}`}
function allData(){return matches}
function selected(){const end=new Date();end.setHours(23,59,59,999);const start=new Date(end);start.setDate(start.getDate()-(days-1));return allData().filter(m=>new Date(m.date)>=start)}
function aggregate(ms){const a={};for(const m of ms)for(const p of m.players){const n=p.name.trim();if(!n)continue;const x=a[n]||{name:n,matches:0,damage:0,assists:0,finishes:0,time:0};x.matches++;x.damage+=num(p.damage);x.assists+=num(p.assists);x.finishes+=num(p.finishes);x.time+=num(p.time);a[n]=x}return Object.values(a).sort((a,b)=>b.damage-a.damage)}
function total(ps,k){return ps.reduce((s,p)=>s+p[k],0)}
function avg(p,k){return p.matches?p[k]/p.matches:0}
function render(){
 save();const ms=selected(),ps=aggregate(ms),d=total(ps,"damage"),f=total(ps,"finishes"),a=total(ps,"assists"),t=total(ps,"time");
 document.getElementById("rangeText").textContent=days===1?"Today":`Last ${days} days`;
 document.getElementById("stats").innerHTML=[
  ["Matches",ms.length],["Total Damage",d.toLocaleString("en-IN")],["Total Finishes",f],["Total Assists",a]
 ].map(x=>`<div class="stat"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("");
 document.getElementById("analytics").innerHTML=view==="individual"?individual(ps):team(ps,d,f,a,t);
 improve(ps);report(ps,ms,d,f,a,t);recent(ms);
}
function individual(ps){if(!ps.length)return `<div class="empty">Abhi koi match upload nahi hua. Match ke baad 1 screenshot upload karo.</div>`;
 return `<div class="tableWrap"><table class="table"><thead><tr><th># Player</th><th>Matches</th><th>Damage</th><th>Assists</th><th>Finishes</th><th>Play Time</th></tr></thead><tbody>${ps.map((p,i)=>`<tr><td><span class="rank">${i+1}</span><b>${esc(p.name)}</b>${i===0?'<span class="badge">TOP</span>':''}</td><td>${p.matches}</td><td>${p.damage.toLocaleString("en-IN")}</td><td>${p.assists}</td><td>${p.finishes}</td><td>${p.time.toFixed(1)}m</td></tr>`).join("")}</tbody></table></div>`}
function team(ps,d,f,a,t){if(!ps.length)return `<div class="empty">No team data yet.</div>`;return `<div class="report"><div class="reportGrid"><div class="mini"><small>Total Damage</small><b>${d.toLocaleString("en-IN")}</b></div><div class="mini"><small>Total Finishes</small><b>${f}</b></div><div class="mini"><small>Total Play Time</small><b>${t.toFixed(1)}m</b></div></div><div style="margin-top:18px">${ps.map(p=>{const pct=Math.round(p.damage/(d||1)*100);return `<div style="margin:12px 0"><div style="display:flex;justify-content:space-between;font-size:12px"><b>${esc(p.name)}</b><span>${pct}% • ${p.finishes} finishes</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`}).join("")}</div></div>`}
function improve(ps){let arr=[];for(const p of ps){if(avg(p,"damage")<300)arr.push([p.name,"Low Damage",`Only ${Math.round(avg(p,"damage"))} average damage. Improve crosshair placement, positioning and fight selection.`]);if(avg(p,"assists")<1)arr.push([p.name,"Low Assists",`Average ${avg(p,"assists").toFixed(1)} assists. Stay closer to teammates and trade fights.`]);if(avg(p,"finishes")<1)arr.push([p.name,"Low Finishes",`Average ${avg(p,"finishes").toFixed(1)} finishes. Improve knock-to-finish conversion.`]);if(avg(p,"time")<18)arr.push([p.name,"Low Play Time",`Average ${avg(p,"time").toFixed(1)} minutes. Improve survival, rotation and safe positioning.`])}
 document.getElementById("improve").innerHTML=arr.length?arr.map(x=>`<div class="improveItem"><div><h3>${esc(x[0])}</h3><p>${x[2]}</p></div><span class="pill">${x[1]}</span></div>`).join(""):`<div class="empty"><span class="pill good">No major weakness detected</span><p>Consistency achhi hai — ab team coordination aur advanced goals par focus karo.</p></div>`}
function report(ps,ms,d,f,a,t){if(!ps.length){document.getElementById("report").innerHTML='<div class="empty">Combined report upload ke baad yahan dikhegi.</div>';return}
 const dmgScore=Math.min(4,(d/Math.max(1,ps.length))/1000*4), finScore=Math.min(3,(f/Math.max(1,ms.length))/5*3), astScore=Math.min(2,(a/Math.max(1,ms.length))/3*2), timeScore=Math.min(1,(t/Math.max(1,ps.length))/25);const score=Math.min(10,dmgScore+finScore+astScore+timeScore);
 const top=ps[0], weak=[...ps].sort((x,y)=>(avg(x,"assists")+avg(x,"finishes"))-(avg(y,"assists")+avg(y,"finishes")))[0];
 document.getElementById("report").innerHTML=`<div class="report"><div class="score">${score.toFixed(1)}<small>/10</small></div><div style="color:#8192a9;font-size:11px">AI combined performance score • ${ms.length} match${ms.length===1?"":"es"}</div><div class="reportGrid"><div class="mini"><small>Top Performer</small><b>${esc(top.name)}</b><p>${Math.round(avg(top,"damage"))} avg damage • ${Math.round(avg(top,"finishes"))} avg finishes</p></div><div class="mini"><small>Biggest Focus</small><b>${esc(weak.name)}</b><p>Improve assists + finishing consistency.</p></div><div class="mini"><small>Squad Goal</small><b>More Team Support</b><p>Increase assists and coordinated fights without losing survival time.</p></div></div></div>`}
function recent(ms){document.getElementById("matches").innerHTML=ms.length?ms.slice().reverse().slice(0,12).map(m=>`<div class="match"><div><b>${esc(m.title||"MATCH")}</b><span>${esc(m.date)} • ${esc(m.map||"Unknown map")} • ${m.players.length} players</span></div><div class="result">${total(m.players.map(p=>({finishes:num(p.finishes)})),"finishes")} finishes</div></div>`).join(""):'<div class="empty">No uploaded matches yet.</div>'}

function parseOCR(text){
 const lines=text.split(/\n/).map(x=>x.replace(/\s+/g," ").trim()).filter(Boolean), out=[];
 // Handles common rows such as: PLAYER 1,033 3 5 27.6m
 for(const line of lines){
   const m=line.match(/^(.{2,28}?)\s+([0-9][0-9,.]*)\s+([0-9]+)\s+([0-9]+)(?:\s+([0-9]+(?:\.[0-9]+)?)\s*m)?$/i);
   if(m){
    let name=m[1].replace(/[^A-Za-z0-9_.•-]/g,"").toUpperCase();
    if(name && !/PLAYER|DAMAGE|ASSISTS|FINISHES|PLAYTIME|MATCH|TOTAL|MVP/.test(name))
      out.push({name,damage:num(m[2]),assists:num(m[3]),finishes:num(m[4]),time:num(m[5])||20});
   }
 }
 // Fallback: locate a name token and numeric sequence anywhere on the line.
 if(out.length<2)for(const line of lines){
   const nm=line.match(/\b[A-Z][A-Z0-9_.•-]{2,}\b/);const ns=line.match(/\b\d{1,5}(?:,\d{3})?\b/g);
   if(nm&&ns&&ns.length>=3&&!/PLAYER|DAMAGE|ASSISTS|FINISHES|MATCH|TOTAL/i.test(nm[0])){
    const name=nm[0];if(!out.some(x=>x.name===name))out.push({name,damage:num(ns[0]),assists:num(ns[1]),finishes:num(ns[2]),time:20});
   }
 }
 const unique=[];const seen=new Set();for(const p of out){if(!seen.has(p.name)){seen.add(p.name);unique.push(p)}}return unique.slice(0,15)
}
async function ocr(file){
 document.getElementById("processing").classList.remove("hidden");const status=document.getElementById("status"),progress=document.getElementById("progress"),raw=document.getElementById("raw");
 try{
  const result=await Tesseract.recognize(file,"eng",{logger:x=>{if(x.status==="recognizing text"){progress.textContent=Math.round(x.progress*100)+"%";status.textContent="AI OCR reading screenshot…"}}});
  raw.textContent=result.data.text||"";
  status.textContent="Extracting player stats…";
  const players=parseOCR(result.data.text||"");
  if(!players.length){status.textContent="Could not reliably detect player rows";return}
  const map=(result.data.text.match(/Bermuda|Kalahari|Alpine|Purgatory|NexTerra/i)||["Unknown"])[0];
  matches.push({date:new Date().toISOString().slice(0,10),title:"MATCH "+(matches.length+1),map,players,raw:result.data.text});
  save();status.textContent=`Match saved • ${players.length} players detected`;render();
 }catch(e){status.textContent="OCR failed — try a clearer screenshot";raw.textContent=e.message||String(e)}
}
document.querySelectorAll(".periods button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".periods button").forEach(x=>x.classList.remove("active"));b.classList.add("active");days=+b.dataset.days;render()});
document.getElementById("individual").onclick=()=>{view="individual";document.getElementById("individual").classList.add("active");document.getElementById("team").classList.remove("active");render()};
document.getElementById("team").onclick=()=>{view="team";document.getElementById("team").classList.add("active");document.getElementById("individual").classList.remove("active");render()};
function pick(){document.getElementById("file").click()}
document.getElementById("uploadTop").onclick=pick;document.getElementById("choose").onclick=pick;
document.getElementById("drop").onclick=e=>{if(e.target.tagName!=="BUTTON")pick()};
document.getElementById("file").onchange=e=>{if(e.target.files[0])ocr(e.target.files[0]);e.target.value=""};
document.getElementById("reset").onclick=()=>{if(confirm("Delete all uploaded matches?")){matches=[];save();render()}};
render();
