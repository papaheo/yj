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

let currentLang = "en";
let ambientAudio = null;
let animalAudio = null;
let splashAudio = null;
let currentAnimal = null;
let currentAnimalIcon = null;
let wanderInterval = null;
let sparkleInterval = null;
let particleInterval = null;
let currentWaterType = null;

const icons = [
  {name:"Lion", emoji:"🦁", sound:"https://freeanimalsounds.org/wp-content/uploads/2017/07/Löwe.mp3", moveSound:"https://freeanimalsounds.org/wp-content/uploads/2017/07/Löwe.mp3"},
  {name:"Elephant", emoji:"🐘", sound:"https://freeanimalsounds.org/wp-content/uploads/2017/07/Elefant.mp3", moveSound:"https://freeanimalsounds.org/wp-content/uploads/2017/07/Elefant.mp3"},
  {name:"Monkey", emoji:"🐵", sound:"https://freeanimalsounds.org/wp-content/uploads/2017/07/Schimpanse.mp3", moveSound:"https://freeanimalsounds.org/wp-content/uploads/2017/07/Schimpanse.mp3"},
  {name:"Panda", emoji:"🐼", sound:"https://freeanimalsounds.org/wp-content/uploads/2017/07/Gorilla.mp3", moveSound:"https://freeanimalsounds.org/wp-content/uploads/2017/07/Gorilla.mp3"}
];

const waterSounds = {
  fountain:"https://cdn.freesound.org/previews/171/171756_2437358-lq.mp3",
  cascade:"https://cdn.freesound.org/previews/396/396197_5121236-lq.mp3"
};

// 우후~ 환호 소리만
const wooHooSound = "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b14f2c69.mp3?filename=woo-hoo-sound-effect-4.mp3";

function updateTexts() {
  document.getElementById("title-main").innerText = translations[currentLang].mainTitle;
  document.getElementById("fountain-btn").innerHTML = translations[currentLang].fountainBtn;
  document.getElementById("cascade-btn").innerHTML = translations[currentLang].cascadeBtn;
  document.getElementById("pick-title").innerText = translations[currentLang].pickTitle;
  document.getElementById("back-btn").innerHTML = translations[currentLang].backBtn;
}

function showWater(type) {
  currentWaterType = type;
  document.getElementById('main-choice').style.display = 'none';
  document.getElementById('water-stage').style.display = 'block';

  const waterAnim = document.getElementById('water-animation');
  if(type === 'fountain') {
    waterAnim.innerHTML = `
      <div class="fountain-water">
        <div class="fountain-base"></div>
        ${createFountainStreams()}
      </div>
    `;
  } else {
    waterAnim.innerHTML = `
      <div class="cascade-water">
        <div class="cascade-top"></div>
        <div class="cascade-stream"></div>
        <div class="cascade-pool"></div>
      </div>
    `;
  }

  playWaterSound(type);
  startSparkles();
  startWaterParticles();
  setupIconPicker();
}

function createFountainStreams() {
  let streams = '';
  for(let i=0; i<12; i++) {
    const angle = (i*30) - 180;
    const delay = i*0.1;
    streams += `<div class="fountain-stream" style="
      left: 50%;
      transform: translateX(-50%) rotate(${angle}deg);
      transform-origin: bottom center;
      animation-delay: ${delay}s;
    "></div>`;
  }
  return streams;
}

function playWaterSound(type) {
  // 물 소리는 항상 배경으로 재생
  if(ambientAudio) {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
  }
  ambientAudio = new Audio(waterSounds[type]);
  ambientAudio.loop = true;
  ambientAudio.volume = 0.3;
  ambientAudio.play().then(() => {
    console.log('✅ 물 소리 배경 재생 중...');
  }).catch(err => {
    console.log('⚠️ 물 소리 차단됨:', err.message);
    console.log('💡 화면을 터치하면 소리가 재생됩니다');
  });
}

function startSparkles() {
  if(sparkleInterval) clearInterval(sparkleInterval);
  sparkleInterval = setInterval(createSparkle, 150);
}

function createSparkle() {
  const container = document.getElementById('water-animation');
  if(!container) return;

  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';

  const size = Math.random()*12+6;
  sparkle.style.width = size+'px';
  sparkle.style.height = size+'px';
  sparkle.style.left = (Math.random()*80+10)+'%';
  sparkle.style.top = (Math.random()*70+15)+'%';
  sparkle.style.setProperty('--x', (Math.random()*120-60)+'px');
  sparkle.style.setProperty('--y', -(Math.random()*100+50)+'px');

  container.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 1200);
}

function startWaterParticles() {
  if(particleInterval) clearInterval(particleInterval);
  particleInterval = setInterval(createWaterParticle, 100);
}

function createWaterParticle() {
  const container = document.getElementById('water-animation');
  if(!container) return;

  const particle = document.createElement('div');
  particle.className = 'water-particle';

  particle.style.left = (Math.random()*80+10)+'%';
  particle.style.top = (Math.random()*60+20)+'%';
  particle.style.setProperty('--px', (Math.random()*80-40)+'px');
  particle.style.setProperty('--py', (Math.random()*80-40)+'px');

  container.appendChild(particle);

  setTimeout(() => particle.remove(), 2000);
}

function setupIconPicker() {
  const picker = document.getElementById('icon-picker');
  picker.innerHTML = '';

  icons.forEach(icon => {
    const btn = document.createElement('button');
    btn.className = 'icon-btn';
    btn.innerHTML = `<img src="data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='80' font-size='80'>${icon.emoji}</text></svg>`)}" alt="${icon.name}">`;
    btn.addEventListener('click', () => spawnAnimal(icon));
    picker.appendChild(btn);
  });
}

function spawnAnimal(icon) {
  if(currentAnimal) currentAnimal.remove();
  if(wanderInterval) clearInterval(wanderInterval);

  currentAnimalIcon = icon;

  const container = document.getElementById('game-container');
  const animal = document.createElement('div');
  animal.className = 'animal';
  animal.innerHTML = `<img src="data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='80' font-size='80'>${icon.emoji}</text></svg>`)}" alt="${icon.name}">`;

  const rect = container.getBoundingClientRect();
  animal.style.left = (rect.width/2 - 40) + 'px';
  animal.style.top = (rect.height/2 - 40) + 'px';

  container.appendChild(animal);
  currentAnimal = animal;

  playAnimalSound(icon);
  celebrateAnimal(animal);

  startWandering(animal, container);
}

function playAnimalSound(icon) {
  // 동물 소리는 겹치지 않게 - 이전 소리 중지
  if(animalAudio) {
    animalAudio.pause();
    animalAudio.currentTime = 0;
  }
  
  animalAudio = new Audio(icon.sound);
  animalAudio.volume = 0.6;
  animalAudio.play().then(() => {
    console.log(`✅ ${icon.name} 소리 재생!`);
  }).catch(err => {
    console.log(`⚠️ ${icon.name} 소리 차단:`, err.message);
  });
}

function celebrateAnimal(animal) {
  animal.classList.add('celebrating');
  setTimeout(() => animal.classList.remove('celebrating'), 800);
}

function startWandering(animal, container) {
  wanderInterval = setInterval(() => {
    moveAnimalRandomly(animal, container);
    if(currentAnimalIcon) {
      playAnimalMoveSound(currentAnimalIcon);
    }
  }, 3000);
}

function playAnimalMoveSound(icon) {
  // 동물 소리는 겹치지 않게 - 이전 소리 중지
  if(animalAudio) {
    animalAudio.pause();
    animalAudio.currentTime = 0;
  }
  
  animalAudio = new Audio(icon.moveSound);
  animalAudio.volume = 0.4;
  animalAudio.play().then(() => {
    console.log(`🚶 ${icon.name} 이동!`);
  }).catch(err => {
    console.log(`⚠️ 이동 소리 차단:`, err.message);
  });
}

function moveAnimalRandomly(animal, container) {
  const rect = container.getBoundingClientRect();
  const maxX = rect.width - 80;
  const maxY = rect.height - 80;

  const newX = Math.random()*maxX;
  const newY = Math.random()*maxY;

  animal.style.transition = 'left 2s ease-in-out, top 2s ease-in-out';
  animal.style.left = newX + 'px';
  animal.style.top = newY + 'px';

  setTimeout(() => {
    checkIfUnderWater(animal, container);
  }, 2000);
}

function checkIfUnderWater(animal, container) {
  const rect = container.getBoundingClientRect();
  const animalRect = animal.getBoundingClientRect();

  const centerX = animalRect.left + animalRect.width/2 - rect.left;
  const centerY = animalRect.top + animalRect.height/2 - rect.top;

  const waterCenterX = rect.width/2;
  const waterCenterY = rect.height/2;

  const distance = Math.sqrt(
    Math.pow(centerX - waterCenterX, 2) +
    Math.pow(centerY - waterCenterY, 2)
  );

  if(distance < 120) {
    console.log('💦 동물이 물에 닿았어요!');
    celebrateAnimal(animal);
    playSplashSound();
  }
}

function playSplashSound() {
  // 이전 우후~ 소리가 재생 중이면 중지
  if(splashAudio) {
    splashAudio.pause();
    splashAudio.currentTime = 0;
  }
  
  // 우후~ 환호 소리만 재생
  splashAudio = new Audio(wooHooSound);
  splashAudio.volume = 0.8;
  splashAudio.play().then(() => {
    console.log('🎉 우후~! 물에 닿았어요!');
  }).catch(err => {
    console.log('⚠️ 우후 소리 차단:', err.message);
    console.log('💡 화면을 터치해보세요!');
  });
}

function handleContainerClick(event) {
  if(!currentAnimal) return;
  if(event.target.closest('.animal')) return;

  const container = document.getElementById('game-container');
  const rect = container.getBoundingClientRect();

  const x = event.clientX - rect.left - 40;
  const y = event.clientY - rect.top - 40;

  currentAnimal.style.transition = 'none';
  currentAnimal.style.left = Math.min(Math.max(0, x), rect.width-80) + 'px';
  currentAnimal.style.top = Math.min(Math.max(0, y), rect.height-80) + 'px';

  if(currentAnimalIcon) {
    playAnimalMoveSound(currentAnimalIcon);
  }

  checkIfUnderWater(currentAnimal, container);

  setTimeout(() => {
    currentAnimal.style.transition = 'left 2s ease-in-out, top 2s ease-in-out';
  }, 50);
}

function goBack() {
  document.getElementById('main-choice').style.display = 'block';
  document.getElementById('water-stage').style.display = 'none';

  if(ambientAudio) {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
    ambientAudio = null;
  }
  if(animalAudio) {
    animalAudio.pause();
    animalAudio.currentTime = 0;
    animalAudio = null;
  }
  if(splashAudio) {
    splashAudio.pause();
    splashAudio.currentTime = 0;
    splashAudio = null;
  }
  if(wanderInterval) clearInterval(wanderInterval);
  if(sparkleInterval) clearInterval(sparkleInterval);
  if(particleInterval) clearInterval(particleInterval);
  if(currentAnimal) {
    currentAnimal.remove();
    currentAnimal = null;
  }
  currentAnimalIcon = null;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("lang-select").addEventListener('change', function() {
    currentLang = this.value;
    updateTexts();
  });
  document.getElementById('fountain-btn').addEventListener('click', () => showWater('fountain'));
  document.getElementById('cascade-btn').addEventListener('click', () => showWater('cascade'));
  document.getElementById('back-btn').addEventListener('click', goBack);
  document.getElementById('game-container').addEventListener('click', handleContainerClick);
  updateTexts();
});
