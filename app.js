let expenses = JSON.parse(localStorage.getItem('expenses')||'[]');

const map = L.map('map').setView([50,10],4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let markers=[],routeLine,chart;

// ===== SAVE =====
async function save(){
 const amountVal=parseFloat(amount.value);
 if(!amountVal) return alert('Введите сумму');

 const pos=await getLocation();
 const city=await getCity(pos.lat,pos.lng);
 const eur=await fx(amountVal,currency.value);

 const item={
  amount:amountVal,
  currency:currency.value,
  eur,
  category:category.value,
  comment:comment.value,
  lat:pos.lat,
  lng:pos.lng,
  city,
  date:Date.now()
 };

 expenses.push(item);
 localStorage.setItem('expenses',JSON.stringify(expenses));

 render();
 clear();
}

// ===== GEO =====
function getLocation(){
 return new Promise(r=>{
  navigator.geolocation.getCurrentPosition(p=>{
   r({lat:p.coords.latitude,lng:p.coords.longitude});
  },()=>r({lat:50,lng:10}));
 });
}

// ===== CITY =====
async function getCity(lat,lng){
 try{
  const res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
  const d=await res.json();
  return d.address.city||d.address.town||d.address.village||'Unknown';
 }catch{return 'Unknown'}
}

// ===== FX =====
async function fx(a,c){
 if(c==='EUR') return a;
 try{
  const r=await fetch('https://api.exchangerate.host/latest?base=EUR');
  const d=await r.json();
  return a/(d.rates[c]||1);
 }catch{return a}
}

// ===== VOICE =====
function voice(){
 const r=new(window.SpeechRecognition||window.webkitSpeechRecognition)();
 r.lang='ru-RU';

 r.onresult=e=>{
  const t=e.results[0][0].transcript.toLowerCase();
  comment.value=t;

  const num=t.match(/\d+/);
  if(num) amount.value=num[0];

  if(t.includes('евро')) currency.value='EUR';
  if(t.includes('лир')) currency.value='TRY';
  if(t.includes('доллар')) currency.value='USD';

  if(t.includes('бензин')) category.value='fuel';
  else if(t.includes('еда')) category.value='food';
  else if(t.includes('отель')) category.value='hotel';
 };

 r.start();
}

// ===== EXPORT =====
function exportData(){
 const dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(expenses));
 const a=document.createElement('a');
 a.href=dataStr;
 a.download="expenses.json";
 a.click();
}

// ===== UI =====
function render(){
 list.innerHTML='';
 markers.forEach(m=>map.removeLayer(m));
 markers=[];
 if(routeLine) map.removeLayer(routeLine);

 let total=0,points=[],cat={};

 expenses.forEach((e,i)=>{
  total+=e.eur;
  cat[e.category]=(cat[e.category]||0)+e.eur;

  const div=document.createElement('div');
  div.className='item';
  div.innerHTML=`
   <div>${e.city}<br><small>${e.comment||''}</small></div>
   <div>${e.amount} ${e.currency}<br><small>€${e.eur.toFixed(2)}</small></div>
  `;

  // свайп удалить
  div.ondblclick=()=>{
    expenses.splice(i,1);
    localStorage.setItem('expenses',JSON.stringify(expenses));
    render();
  };

  list.appendChild(div);

  const m=L.marker([e.lat,e.lng]).addTo(map);
  markers.push(m);
  points.push([e.lat,e.lng]);
 });

 if(points.length>1) routeLine=L.polyline(points).addTo(map);

 totalEl.innerText='€'+total.toFixed(2);

 drawChart(cat);
}

// ===== CHART =====
function drawChart(data){
 if(chart) chart.destroy();
 chart=new Chart(chartEl,{
  type:'doughnut',
  data:{
   labels:Object.keys(data),
   datasets:[{data:Object.values(data)}]
  }
 });
}

// ===== HELPERS =====
function clear(){
 amount.value='';
 comment.value='';
}

const totalEl=document.getElementById('total');
const chartEl=document.getElementById('chart');

render();
