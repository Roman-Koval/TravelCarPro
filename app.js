// ===== STORAGE =====
let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

// ===== MAP =====
const map = L.map('map').setView([50, 10], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let markers = [];

// ===== SAVE =====
async function save(){
  const amountVal = parseFloat(amount.value);
  if(!amountVal) return alert('Введите сумму');

  const currencyVal = currency.value;
  const categoryVal = category.value;
  const commentVal = comment.value;

  const position = await getLocation();

  const eur = await convertToEUR(amountVal, currencyVal);

  const item = {
    amount: amountVal,
    currency: currencyVal,
    eur,
    category: categoryVal,
    comment: commentVal,
    lat: position.lat,
    lng: position.lng,
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

// ===== UI =====
function render(){
  list.innerHTML='';
  markers.forEach(m=>map.removeLayer(m));
  markers=[];

  let total=0;

  expenses.forEach(e=>{
    total+=e.eur;

    const div=document.createElement('div');
    div.className='item';
    div.innerHTML=`
      <div>
        ${emoji(e.category)} ${e.category}<br>
        <small>${e.comment || ''}</small>
      </div>
      <div>
        ${e.amount} ${e.currency}<br>
        <small>€${e.eur.toFixed(2)}</small>
      </div>
    `;
    list.appendChild(div);

    const marker = L.marker([e.lat, e.lng]).addTo(map);
    markers.push(marker);
  });

  if(expenses.length){
    const last = expenses[expenses.length-1];
    map.setView([last.lat, last.lng], 6);
  }

  totalEl.innerText = '€' + total.toFixed(2);
}

// ===== EMOJI =====
function emoji(cat){
  return {
    food:'🍔',
    fuel:'⛽',
    hotel:'🏨',
    other:'📦'
  }[cat] || '📦';
}

// ===== CLEAR =====
function clearInputs(){
  amount.value='';
  comment.value='';
}

// ===== VOICE =====
function voice(){
  const r=new(window.SpeechRecognition||window.webkitSpeechRecognition)();
  r.lang='ru-RU';

  r.onresult=e=>{
    const text = e.results[0][0].transcript;
    comment.value = text;

    const num = text.match(/\d+/);
    if(num) amount.value = num[0];
  };

  r.start();
}

// ===== INIT =====
const totalEl = document.getElementById('total');
render();
