const nameInput = document.getElementById('nameInput');
const addNameButton = document.getElementById('addName');
const namesList = document.getElementById('namesList');
const wheelCanvas = document.getElementById('wheelCanvas');
const spinButton = document.getElementById('spinButton');
const winnerPopup = document.getElementById('winnerPopup');
const winnerName = document.getElementById('winnerName');
const closePopup = document.getElementById('closePopup');

let names = [];
let colors = [];
let isSpinning = false;
let currentRotation = 0;
let selectedIndex = -1;

const ctx = wheelCanvas.getContext('2d');
const centerX = wheelCanvas.width / 2;
const centerY = wheelCanvas.height / 2;
const radius = 180;

const baseColors = ['#4f38d1', '#00f2fe', '#e443e9', '#f93838', '#2ece43'];

addNameButton.addEventListener('click', addName);
nameInput.addEventListener('keypress', e => { if(e.key==='Enter') addName(); });
spinButton.addEventListener('click', spinWheel);
closePopup.addEventListener('click', ()=> winnerPopup.classList.remove('show'));

function addName(){
  const name = nameInput.value.trim();
  if(name && !names.includes(name)){
    names.push(name);
    colors.push(baseColors[names.length % baseColors.length]);
    nameInput.value = '';
    updateNamesList();
    drawWheel();
    updateSpinButton();
  }
}

function updateNamesList(){
  namesList.innerHTML = '';
  names.forEach((n, i) => {
    const li = document.createElement('li');
    li.textContent = n;
    const btn = document.createElement('button');
    btn.textContent = '✕';
    btn.onclick = () => { removeName(i); };
    li.appendChild(btn);
    namesList.appendChild(li);
  });
}

function removeName(i){
  names.splice(i, 1);
  colors.splice(i, 1);
  updateNamesList();
  drawWheel();
  updateSpinButton();
}

function updateSpinButton(){
  spinButton.disabled = names.length < 2;
}

function drawWheel(highlight = -1){
  ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
  if(names.length === 0) return;
  const angle = 2 * Math.PI / names.length;
  names.forEach((n, i) => {
    const start = i * angle;
    const end = start + angle;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = 'rgb(163, 163, 163)';
    ctx.lineWidth = 0;
    ctx.stroke();
    // text
    const mid = start + angle / 2;
    ctx.save();
    ctx.translate(centerX + Math.cos(mid) * radius * 0.7, centerY + Math.sin(mid) * radius * 0.7);
    ctx.rotate(mid + Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(n, 0, 0);
    ctx.restore();
  });
}

function spinWheel(){
  if(isSpinning || names.length < 2) return;
  isSpinning = true;
  spinButton.disabled = true;
  const duration = 3000;
  const start = Date.now();
  const startRot = currentRotation;
  const total = 2 * Math.PI * 5 + Math.random() * 2 * Math.PI;
  function animate(){
    const t = Date.now() - start;
    const p = Math.min(t / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    currentRotation = startRot + total * ease;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);
    ctx.translate(-centerX, -centerY);
    drawWheel();
    ctx.restore();
    if(p < 1) requestAnimationFrame(animate);
    else { isSpinning = false; updateSpinButton(); showWinner(); }
  }
  animate();
}

function showWinner(){
  const angle = 2 * Math.PI / names.length;
  const norm = currentRotation % (2 * Math.PI);
  const pointer = 1.5 * Math.PI;
  const sel = (pointer - norm + 2 * Math.PI) % (2 * Math.PI);
  selectedIndex = Math.floor(sel / angle);
  winnerName.textContent = names[selectedIndex] || '';
  winnerPopup.classList.add('show');
}

drawWheel();
updateSpinButton();
