// 번역
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

// 전역 변수
let currentLang = "en";
let ambientAudio = null;
let currentAnimal = null;
let currentAnimalIcon = null;
let wanderInterval = null;
let sparkleInterval = null;
let particleInterval = null;
let currentWaterType = null;

// 동물 데이터 (각자 다른 소리)
const icons = [
  {
    name: "Lion", 
    emoji: "🦁", 
    sound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3",
    moveSound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3"
  },
  {
    name: "Elephant", 
    emoji: "🐘", 
    sound: "https://cdn.pixabay.com/audio/2022/10/16/audio_12b7f9f3c6.mp3",
    moveSound: "https://cdn.pixabay.com/audio/2022/10/16/audio_12b7f9f3c6.mp3"
  },
  {
    name: "Monkey", 
    emoji: "🐵", 
    sound: "https://cdn.pixabay.com/audio/2023/02/14/audio_12b6395b49.mp3",
    moveSound: "https://cdn.pixabay.com/audio/2023/02/14/audio_12b6395b49.mp3"
  },
  {
    name: "Panda", 
    emoji: "🐼", 
    sound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3",
    moveSound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3"
  }
];

// 물 소리 (분수/폭포)
const waterSounds = {
  fountain: "https://cdn.pixabay.com/audio/2021/07/12/audio_8b44096148.mp3",
  cascade: "https://cdn.pixabay.com/audio/2022/03/10/audio_c2c6d7d61c.mp3"
};

// 물에 닿았을 때 소리 (이-----~~~~하!!!!)
const splashSound = "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3";

// 텍스트 업데이트
function updateTexts() {
  document.getElementById("title-main").innerText = translations[currentLang].mainTitle;
  document.getElementById("fountain-btn").innerHTML = translations[currentLang].fountainBtn;
  document.getElementById("cascade-btn").innerHTML = translations[currentLang].cascadeBtn;
  document.getElementById("pick-title").innerText = translations[currentLang].pickTitle;
  document.getElementById("back-btn").innerHTML = translations[currentLang].backBtn;
}

// 언어 선택
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("lang-select").addEventListener("change", function() {
    currentLang = this.value;
    updateTexts();
  });
  updateTexts();
});

// 물 장면 표시
function showWater(type) {
  currentWaterType = type;
  document.getElementById('main-choice').style.display = 'none';
  document.getElementById('water-stage').style.display = 'block';
  
  const waterAnim = document.getElementById('water-animation');
  
  if (type === 'fountain') {
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

// 분수 물줄기 생성 (더 많이, 더 화려하게)
function createFountainStreams() {
  let streams = '';
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) - 180;
    const delay = i * 0.1;
    streams += `<div class="fountain-stream" style="
      left: 50%;
      transform: translateX(-50%) rotate(${angle}deg);
      transform-origin: bottom center;
      animation-delay: ${delay}s;
    "></div>`;
  }
  return streams;
}

// 물 소리 재생
function playWaterSound(type) {
  if (ambientAudio) {
    ambientAudio.pause();
  }
  ambientAudio = new Audio(waterSounds[type]);
  ambientAudio.loop = true;
  ambientAudio.volume = 0.2;
  ambientAudio.play().catch(e => console.log('물 소리 재생 실패:', e));
}

// 반짝임 효과 (더 화려하게)
function startSparkles() {
  if (sparkleInterval) clearInterval(sparkleInterval);
  
  sparkleInterval = setInterval(() => {
    createSparkle();
  }, 150);
}

function createSparkle() {
  const container = document.getElementById('water-animation');
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  
  const size = Math.random() * 12 + 6;
  sparkle.style.width = size + 'px';
  sparkle.style.height = size + 'px';
  sparkle.style.left = (Math.random() * 80 + 10) + '%';
  sparkle.style.top = (Math.random() * 70 + 15) + '%';
  sparkle.style.setProperty('--x', (Math.random() * 120 - 60) + 'px');
  sparkle.style.setProperty('--y', -(Math.random() * 100 + 50) + 'px');
  
  container.appendChild(sparkle);
  
  setTimeout(() => sparkle.remove(), 1200);
}

// 물방울 효과 추가
function startWaterParticles() {
  if (particleInterval) clearInterval(particleInterval);
  
  particleInterval = setInterval(() => {
    createWaterParticle();
  }, 100);
}

function createWaterParticle() {
  const container = document.getElementById('water-animation');
  const particle = document.createElement('div');
  particle.className = 'water-particle';
  
  particle.style.left = (Math.random() * 80 + 10) + '%';
  particle.style.top = (Math.random() * 60 + 20) + '%';
  particle.style.setProperty('--px', (Math.random() * 80 - 40) + 'px');
  particle.style.setProperty('--py', (Math.random() * 80 - 40) + 'px');
  
  container.appendChild(particle);
  
  setTimeout(() => particle.remove(), 2000);
}

// 아이콘 선택기 설정
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

// 동물 생성
function spawnAnimal(icon) {
  if (currentAnimal) {
    currentAnimal.remove();
  }
  if (wanderInterval) {
    clearInterval(wanderInterval);
  }
  
  currentAnimalIcon = icon;
  
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

// 동물 소리 재생
function playAnimalSound(icon) {
  const audio = new Audio(icon.sound);
  audio.volume = 0.5;
  audio.play().catch(e => console.log('동물 소리 재생 실패:', e));
}

// 축하 애니메이션
function celebrateAnimal(animal) {
  animal.classList.add('celebrating');
  setTimeout(() => animal.classList.remove('celebrating'), 800);
}

// 배회 시작 (움직일 때마다 소리)
function startWandering(animal, container) {
  wanderInterval = setInterval(() => {
    moveAnimalRandomly(animal, container);
    // 움직일 때 동물 소리
    if (currentAnimalIcon) {
      playAnimalMoveSound(currentAnimalIcon);
    }
  }, 3000);
}

// 동물 이동 소리
function playAnimalMoveSound(icon) {
  const audio = new Audio(icon.moveSound);
  audio.volume = 0.3;
  audio.play().catch(e => console.log('이동 소리 재생 실패:', e));
}

// 랜덤 이동
function moveAnimalRandomly(animal, container) {
  const rect = container.getBoundingClientRect();
  const maxX = rect.width - 80;
  const maxY = rect.height - 80;
  
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;
  
  // 부드러운 이동
  animal.style.transition = 'left 2s ease-in-out, top 2s ease-in-out';
  animal.style.left = newX + 'px';
  animal.style.top = newY + 'px';
  
  setTimeout(() => {
    checkIfUnderWater(animal, container);
  }, 2000);
}

// 물 아래 확인
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
  
  if (distance < 120) {
    celebrateAnimal(animal);
    // 물에 닿았을 때: "이-----~~~~하!!!!" 소리
    playSplashSound();
  }
}

// 물 닿았을 때 소리
function playSplashSound() {
  const audio = new Audio(splashSound);
  audio.volume = 0.5;
  audio.play().catch(e => console.log('물소리 재생 실패:', e));
}

// 컨테이너 클릭 처리 (순간이동)
function handleContainerClick(event) {
  if (!currentAnimal) return;
  
  const container = document.getElementById('game-container');
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left - 40;
  const y = event.clientY - rect.top - 40;
  
  // 순간이동 (transition 없음)
  currentAnimal.style.transition = 'none';
  currentAnimal.style.left = Math.max(0, Math.min(x, rect.width - 80)) + 'px';
  currentAnimal.style.top = Math.max(0, Math.min(y, rect.height - 80)) + 'px';
  
  // 동물 소리 재생
  if (currentAnimalIcon) {
    playAnimalMoveSound(currentAnimalIcon);
  }
  
  checkIfUnderWater(currentAnimal, container);
  
  // transition 복원
  setTimeout(() => {
    currentAnimal.style.transition = 'left 2s ease-in-out, top 2s ease-in-out';
  }, 50);
}

// 뒤로가기
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
  if (particleInterval) {
    clearInterval(particleInterval);
  }
  if (currentAnimal) {
    currentAnimal.remove();
    currentAnimal = null;
  }
  currentAnimalIcon = null;
}
