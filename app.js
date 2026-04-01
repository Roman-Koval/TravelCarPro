// 🔥 Firebase config вставь свой
const firebaseConfig = {
 apiKey: "YOUR_KEY",
 authDomain: "YOUR_DOMAIN",
 projectId: "YOUR_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

firebase.auth().signInAnonymously();

let expenses=[];

// ===== MAP =====
const map = L.map('map').setView([50,10],4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// ===== LISTEN =====
firebase.auth().onAuthStateChanged(()=>{
 db.collection('expenses').orderBy('date')
 .onSnapshot(s=>{
  expenses=s.docs.map(d=>d.data());
  render();
 });
});

// ===== VOICE =====
function voice(){
 const r=new(window.SpeechRecognition||window.webkitSpeechRecognition)();
 r.lang='ru-RU';
 r.onresult=e=>{
  const t=e.results[0][0].transcript;
  amount.value=(t.match(/\d+/)||[0])[0];
  comment.value=t;
 };
 r.start();
}

// ===== FX =====
async function fx(a,c){
 const r=await fetch('https://api.exchangerate.host/latest?base=EUR');
 const d=await r.json();
 return c==='EUR'?a:a/(d.rates[c]||1);
}

// ===== SAVE =====
async function save(){
 const eur = await fx(+amount.value,currency.value);

 await db.collection('expenses').add({
  amount:+amount.value,
  currency:currency.value,
  eur,
  category:category.value,
  comment:comment.value,
  date:new Date()
 });
}

// ===== UI =====
function render(){
 list.innerHTML='';
 let total=0;

 expenses.forEach(e=>{
  total+=e.eur;

  const div=document.createElement('div');
  div.className='item';
  div.innerHTML=`
   <div>${e.category}</div>
   <div>${e.amount} ${e.currency}</div>
  `;
  list.appendChild(div);
 });

 document.getElementById('total').innerText='€'+total.toFixed(2);
}
