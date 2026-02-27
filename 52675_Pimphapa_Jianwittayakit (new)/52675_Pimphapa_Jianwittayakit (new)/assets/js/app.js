// Teachable Machine image classification
const URL = 'model/';
let model, maxPredictions, labels = ['Fish','Eel','Stingray'];

const statusEl = () => document.getElementById('status');
const predIconEl = () => document.getElementById('predIcon');
const predLabelEl = () => document.getElementById('predLabel');
const predScoreEl = () => document.getElementById('predScore');
const barsEl = () => document.getElementById('bars');

function iconFor(label){
  switch(label){
    case 'Fish': return '🐟';
    case 'Eel': return '🦭'.replace('🦭','🫠') || '🪱'; // fallback fun icon if eel emoji not ideal
    case 'Stingray': return '🛸'; // playful cartoon-like metaphor
    default: return '🪼';
  }
}

async function init(){
  try {
    statusEl().textContent = 'Loading model…';
    const tmImage = window.tmImage;
    model = await tmImage.load(URL + 'model.json', URL + 'metadata.json');
    maxPredictions = model.getTotalClasses();
    // If model has an extra 'Other' class, we will still display only our primary 3
    statusEl().textContent = 'Model is ready. Upload an image to start.';
    setupBars();
  } catch (e){
    console.error(e);
    statusEl().innerHTML = '⚠️ Failed to load the model. If you are opening this page directly from your file system, <strong>please run a local HTTP server</strong>. See README.';
  }
}

function setupBars(){
  const container = barsEl();
  if (!container) return;
  container.innerHTML = '';
  labels.forEach(name => {
    const row = document.createElement('div');
    row.className = 'bar';
    row.innerHTML = `
      <div class="name">${name}</div>
      <div class="track"><div class="fill" id="bar-${name}"></div></div>
      <div class="pct" id="pct-${name}">0%</div>
    `;
    container.appendChild(row);
  });
}

async function predictFrom(img){
  if (!model) return;
  const prediction = await model.predict(img);
  // Map to our 3 target labels if present; otherwise ignore
  const map = { Fish:0, Eel:0, Stingray:0 };
  prediction.forEach(p => {
    if (map.hasOwnProperty(p.className)) map[p.className] = p.probability;
  });
  const entries = Object.entries(map).sort((a,b)=>b[1]-a[1]);
  const [bestLabel, bestScore] = entries[0];
  predLabelEl().textContent = bestLabel;
  predScoreEl().textContent = (bestScore*100).toFixed(1) + '% confidence';
  predIconEl().textContent = iconFor(bestLabel);
  // Update bars
  entries.forEach(([name,score])=>{
    const fill = document.getElementById('bar-'+name);
    const pct = document.getElementById('pct-'+name);
    if (fill){ fill.style.width = Math.round(score*100)+'%'; }
    if (pct){ pct.textContent = Math.round(score*100)+'%'; }
  });
}

function handleFile(){
  const input = document.getElementById('imageInput');
  const imgEl = document.getElementById('previewImg');
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    imgEl.src = e.target.result;
    imgEl.onload = ()=> predictFrom(imgEl);
  };
  reader.readAsDataURL(file);
}

window.addEventListener('DOMContentLoaded', ()=>{
  const input = document.getElementById('imageInput');
  if (input){ input.addEventListener('change', handleFile); }
  init();
});
