// Translations
const translations = {
  en: {
    mainTitle: "Choose! Fountain or Cascade",
    fountainBtn: "🌊 Fountain",
    cascadeBtn: "💦 Cascade",
    pickTitle: "Tap an animal to play and watch it wander!",
    backBtn: "↩ Back"
  },
  ko: {
    mainTitle: "골라보아요! 분수 또는 폭포",
    fountainBtn: "🌊 분수",
    cascadeBtn: "💦 폭포",
    pickTitle: "동물을 탭해서 소리를 듣고 움직여요!",
    backBtn: "↩ 뒤로가기"
  }
};

// Global variables
let currentLang = "en";
let ambientAudio = null;
let currentAnimal = null;
let wanderInterval = null;
let sparkleInterval = null;
let currentWaterType = null;

// Animal data
const icons = [
  {name: "Lion", emoji: "🦁", sound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3"},
  {name: "Elephant", emoji: "🐘", sound: "https://cdn.pixabay.com/audio/2022/10/16/audio_12b7f9f3c6.mp3"},
  {name: "Monkey", emoji: "🐵", sound: "https://cdn.pixabay.com/audio/2023/02/14/audio_12b6395b49.mp3"},
  {name: "Panda", emoji: "🐼", sound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3"}
];

// Water sound effects
const waterSounds = {
  fountain: "https://cdn.pixabay.com/audio/2021/07/12/audio_8b44096148.mp3",
  cascade: "https://cdn.pixabay.com/audio/2022/03/10/audio_c2c6d7d61c.mp3"
};

// Initialize
function updateTexts() {
  document.getElementById("title-main").innerText = translations[currentLang].mainTitle;
  document.getElementById("fountain-btn").innerHTML = translations[currentLang].fountainBtn;
  document.getElementById("cascade-btn").innerHTML = translations[currentLang].cascadeBtn;
  document.getElementById("pick-title").innerText = translations[currentLang].pickTitle;
  document.getElementById("back-btn").innerHTML = translations[currentLang].backBtn;
}

// Language selector
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("lang-select").addEventListener("change", function() {
    currentLang = this.value;
    updateTexts();
  });
  updateTexts();
});

// Show water scene
function showWater(type) {
  currentWaterType = type;
  document.getElementById('main-choice').style.display = 'none';
  document.getElementById('water-stage').style.display = 'block';
  
  const waterAnim = document.getElementById('water-animation');
  
  if (type === 'fountain') {
    waterAnim.innerHTML = `
      <div class="fountain-water">
        <div class="fountain-pool"></div>
        ${createFountainStreams()}
      </div>
    `;
  } else {
    waterAnim.innerHTML = `
      <div class="cascade-water">
        <div class="cascade-stream"></div>
      </div>
    `;
  }
  
  playWaterSound(type);
  startSparkles();
  setupIconPicker();
}

// Create fountain streams
function createFountainStreams() {
  let streams = '';
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45) - 180;
    const delay = i * 0.15;
    streams += `<div class="fountain-stream" style="
      left: 50%;
      transform: translateX(-50%) rotate(${angle}deg);
      transform-origin: bottom center;
      animation-delay: ${delay}s;
    "></div>`;
  }
  return streams;
}

// Play water sound
function playWaterSound(type) {
  if (ambientAudio) {
    ambientAudio.pause();
  }
  ambientAudio = new Audio(waterSounds[type]);
  ambientAudio.loop = true;
  ambientAudio.volume = 0.15;
  ambientAudio.play().catch(e => console.log('Audio play failed:', e));
}

// Sparkle effects
function startSparkles() {
  if (sparkleInterval) clearInterval(sparkleInterval);
  
  sparkleInterval = setInterval(() => {
    createSparkle();
  }, 200);
}

function createSparkle() {
  const container = document.getElementById('water-animation');
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  
  const size = Math.random() * 8 + 4;
  sparkle.style.width = size + 'px';
  sparkle.style.height = size + 'px';
  sparkle.style.left = (Math.random() * 80 + 10) + '%';
  sparkle.style.top = (Math.random() * 60 + 20) + '%';
  sparkle.style.setProperty('--x', (Math.random() * 100 - 50) + 'px');
  sparkle.style.setProperty('--y', -(Math.random() * 80 + 40) + 'px');
  
  container.appendChild(sparkle);
  
  setTimeout(() => sparkle.remove(), 1500);
}

// Setup animal icon picker
function setupIconPicker() {
  const picker = document.getElementById('icon-picker');
  picker.innerHTML = '';
  
  icons.forEach(icon => {
    const btn = document.createElement('button');
    btn.className = 'icon-btn';
    btn.innerHTML = `<img src="data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='80' font-size='80'>${icon.emoji}</text></svg>`)}" alt="${icon.name}">`;
    btn.onclick = () => spawnAnimal(icon);
    picker.appendChild(btn);
  });
}

// Spawn animal
function spawnAnimal(icon) {
  if (currentAnimal) {
    currentAnimal.remove();
  }
  if (wanderInterval) {
    clearInterval(wanderInterval);
  }
  
  const container = document.getElementById('game-container');
  const animal = document.createElement('div');
  animal.className = 'animal';
  animal.innerHTML = `<img src="data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='80' font-size='80'>${icon.emoji}</text></svg>`)}" alt="${icon.name}">`;
  
  const rect = container.getBoundingClientRect();
  animal.style.left = (rect.width / 2 - 40) + 'px';
  animal.style.top = (rect.height / 2 - 40) + 'px';
  
  container.appendChild(animal);
  currentAnimal = animal;
  
  playAnimalSound(icon);
  celebrateAnimal(animal);
  
  startWandering(animal, container);
}

// Play animal sound
function playAnimalSound(icon) {
  const audio = new Audio(icon.sound);
  audio.volume = 0.4;
  audio.play().catch(e => console.log('Animal sound failed:', e));
}

// Celebrate animation
function celebrateAnimal(animal) {
  animal.classList.add('celebrating');
  setTimeout(() => animal.classList.remove('celebrating'), 800);
}

// Start wandering
function startWandering(animal, container) {
  wanderInterval = setInterval(() => {
    moveAnimalRandomly(animal, container);
  }, 2000);
}

// Move animal randomly
function moveAnimalRandomly(animal, container) {
  const rect = container.getBoundingClientRect();
  const maxX = rect.width - 80;
  const maxY = rect.height - 80;
  
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;
  
  animal.style.transition = 'left 1.5s ease-in-out, top 1.5s ease-in-out';
  animal.style.left = newX + 'px';
  animal.style.top = newY + 'px';
  
  checkIfUnderWater(animal, container);
}

// Check if animal is under water
function checkIfUnderWater(animal, container) {
  const rect = container.getBoundingClientRect();
  const animalRect = animal.getBoundingClientRect();
  const centerX = animalRect.left + animalRect.width / 2 - rect.left;
  const centerY = animalRect.top + animalRect.height / 2 - rect.top;
  
  const waterCenterX = rect.width / 2;
  const waterCenterY = rect.height / 2;
  
  const distance = Math.sqrt(
    Math.pow(centerX - waterCenterX, 2) + 
    Math.pow(centerY - waterCenterY, 2)
  );
  
  if (distance < 100) {
    celebrateAnimal(animal);
    const audio = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Yay sound failed:', e));
  }
}

// Handle container click to move animal
function handleContainerClick(event) {
  if (!currentAnimal) return;
  
  const container = document.getElementById('game-container');
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left - 40;
  const y = event.clientY - rect.top - 40;
  
  currentAnimal.style.left = Math.max(0, Math.min(x, rect.width - 80)) + 'px';
  currentAnimal.style.top = Math.max(0, Math.min(y, rect.height - 80)) + 'px';
  
  checkIfUnderWater(currentAnimal, container);
}

// Go back to main menu
function goBack() {
  document.getElementById('main-choice').style.display = 'block';
  document.getElementById('water-stage').style.display = 'none';
  
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio = null;
  }
  if (wanderInterval) {
    clearInterval(wanderInterval);
  }
  if (sparkleInterval) {
    clearInterval(sparkleInterval);
  }
  if (currentAnimal) {
    currentAnimal.remove();
    currentAnimal = null;
  }
}
