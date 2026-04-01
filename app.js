let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

// ===== MAP =====
const map = L.map('map').setView([50, 10], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let markers = [];
let routeLine;

// ===== SAVE =====
async function save(){
  const amountVal = parseFloat(amount.value);
  if(!amountVal) return alert('Введите сумму');

  const currencyVal = currency.value;
  const categoryVal = category.value;
  const commentVal = comment.value;

  const position = await getLocation();
  const city = await getCity(position.lat, position.lng);
  const eur = await convertToEUR(amountVal, currencyVal);

  const item = {
    amount: amountVal,
    currency: currencyVal,
    eur,
    category: categoryVal,
    comment: commentVal,
    lat: position.lat,
    lng: position.lng,
    city,
    date: new Date().toISOString()
  };

  expenses.push(item);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  render();
  clearInputs();
}

// ===== GEO =====
function getLocation(){
  return new Promise(resolve=>{
    navigator.geolocation.getCurrentPosition(pos=>{
      resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    },()=>{
      resolve({lat:50,lng:10});
    });
  });
}

// ===== CITY =====
async function getCity(lat,lng){
  try{
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    return data.address.city || data.address.town || data.address.village || 'Unknown';
  }catch{
    return 'Unknown';
  }
}

// ===== FX =====
async function convertToEUR(amount, currency){
  if(currency === 'EUR') return amount;

  try{
    const res = await fetch('https://api.exchangerate.host/latest?base=EUR');
    const data = await res.json();
    return amount / (data.rates[currency] || 1);
  }catch{
    return amount;
  }
}

// ===== VOICE SMART =====
function voice(){
  const r=new(window.SpeechRecognition||window.webkitSpeechRecognition)();
  r.lang='ru-RU';

  r.onresult=e=>{
    const text = e.results[0][0].transcript.toLowerCase();
    comment.value = text;

    // сумма
    const num = text.match(/\d+/);
    if(num) amount.value = num[0];

    // валюта
    if(text.includes('евро')) currency.value='EUR';
    if(text.includes('лир')) currency.value='TRY';
    if(text.includes('доллар')) currency.value='USD';
    if(text.includes('фунт')) currency.value='GBP';

    // категория
    if(text.includes('бензин')) category.value='fuel';
    else if(text.includes('еда')) category.value='food';
    else if(text.includes('отель') || text.includes('жилье')) category.value='hotel';
    else category.value='other';
  };

  r.start();
}

// ===== UI =====
function render(){
  list.innerHTML='';
  markers.forEach(m=>map.removeLayer(m));
  markers=[];

  if(routeLine){
    map.removeLayer(routeLine);
  }

  let total=0;
  let points=[];

  expenses.forEach(e=>{
    total+=e.eur;

    const div=document.createElement('div');
    div.className='item';
    div.innerHTML=`
      <div>
        ${emoji(e.category)} ${e.city}<br>
        <small>${e.comment || ''}</small>
      </div>
      <div>
        ${e.amount} ${e.currency}<br>
        <small>€${e.eur.toFixed(2)}</small>
      </div>
    `;
    list.appendChild(div);

    const marker = L.marker([e.lat, e.lng]).addTo(map)
      .bindPopup(`${e.city}<br>${e.amount} ${e.currency}`);
    markers.push(marker);

    points.push([e.lat, e.lng]);
  });

  // маршрут
  if(points.length > 1){
    routeLine = L.polyline(points).addTo(map);
  }

  if(expenses.length){
    const last = expenses[expenses.length-1];
    map.setView([last.lat, last.lng], 6);
  }

  totalEl.innerText = '€' + total.toFixed(2);
}

// ===== HELPERS =====
function emoji(cat){
  return {
    food:'🍔',
    fuel:'⛽',
    hotel:'🏨',
    other:'📦'
  }[cat] || '📦';
}

function clearInputs(){
  amount.value='';
  comment.value='';
}

const totalEl = document.getElementById('total');

render();
