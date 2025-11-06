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
let audioContext = null;
let audioUnlocked = false;

// 동물 데이터 - 다양한 동물 소리
const icons = [
  {
    name: "Lion", 
    emoji: "🦁", 
    sound: "https://cdn.pixabay.com/audio/2022/03/10/audio_4dedf2bf94.mp3",
    moveSound: "https://cdn.pixabay.com/audio/2022/03/10/audio_4dedf2bf94.mp3"
  },
  {
    name: "Elephant", 
    emoji: "🐘", 
    sound: "https://cdn.pixabay.com/audio/2021/08/09/audio_8c36fb677e.mp3",
    moveSound: "https://cdn.pixabay.com/audio/2021/08/09/audio_8c36fb677e.mp3"
  },
  {
    name: "Monkey", 
    emoji: "🐵", 
    sound: "https://cdn.pixabay.com/audio/2022/03/10/audio_7cbc0735b3.mp3",
    moveSound: "https://cdn.pixabay.com/audio/2022/03/10/audio_7cbc0735b3.mp3"
  },
  {
    name: "Panda", 
    emoji: "🐼", 
    sound: "https://cdn.pixabay.com/audio/2022/03/10/audio_0625c1539c.mp3",
    moveSound: "https://cdn.pixabay.com/audio/2022/03/10/audio_0625c1539c.mp3"
  }
];

// 물 소리 (분수/폭포)
const waterSounds = {
  fountain: "https://cdn.pixabay.com/audio/2022/03/24/audio_7c0bb3bcee.mp3",
  cascade: "https://cdn.pixabay.com/audio/2022/05/13/audio_03b97c1453.mp3"
};

// 물에 닿았을 때 소리
const splashSound = "https://cdn.pixabay.com/audio/2023/07/19/audio_fcbc5e28c5.mp3";

// 오디오 컨텍스트 초기화 (모바일 대응)
function initAudioContext() {
  if (!audioContext) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      console.log('오디오 컨텍스트 생성됨');
    } catch (e) {
      console.log('오디오 컨텍스트 생성 실패:', e);
    }
  }
}

// 오디오 잠금 해제 (모바일 필수)
function unlockAudio() {
  if (audioUnlocked) return;
  
  initAudioContext();
  
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      console.log('오디오 컨텍스트 재개됨');
      audioUnlocked = true;
    });
  } else {
    audioUnlocked = true;
  }
}

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
  
  // 첫 터치/클릭으로 오디오 잠금 해제
  document.addEventListener('touchstart', unlockAudio, { once: true });
  document.addEventListener('click', unlockAudio, { once: true });
});

// 물 장면 표시
function showWater(type) {
  // 오디오 잠금 해제
  unlockAudio();
  
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
  
  // 약간 지연 후 물 소리 재생
  setTimeout(() => {
    playWaterSound(type);
  }, 100);
  
  startSparkles();
  startWaterParticles();
  setupIconPicker();
}

// 분수 물줄기 생성
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

// 물 소리 재생 (개선된 버전)
function playWaterSound(type) {
  // 기존 물소리 정지
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
    ambientAudio = null;
  }
  
  try {
    // 새로운 오디오 생성
    ambientAudio = new Audio();
    ambientAudio.src = waterSounds[type];
    ambientAudio.loop = true;
    ambientAudio.volume = 0.4;
    
    // preload 설정
    ambientAudio.load();
    
    // 재생 시도
    const playPromise = ambientAudio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('✅ 물 소리 재생 성공!');
        })
        .catch(error => {
          console.log('⚠️ 물 소리 자동재생 차단:', error.message);
          // 재시도를 위해 대기
          setTimeout(() => {
            ambientAudio.play()
              .then(() => console.log('✅ 재시도 성공!'))
              .catch(e => console.log('❌ 재시도 실패:', e.message));
          }, 500);
        });
    }
  } catch (e) {
    console.log('❌ 물 소리 생성 오류:', e);
  }
}

// 반짝임 효과
function startSparkles() {
  if (sparkleInterval) clearInterval(sparkleInterval);
  
  sparkleInterval = setInterval(() => {
    createSparkle();
  }, 150);
}

function createSparkle() {
  const container = document.getElementById('water-animation');
  if (!container) return;
  
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

// 물방울 효과
function startWaterParticles() {
  if (particleInterval) clearInterval(particleInterval);
  
  particleInterval = setInterval(() => {
    createWaterParticle();
  }, 100);
}

function createWaterParticle() {
  const container = document.getElementById('water-animation');
  if (!container) return;
  
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
  // 오디오 잠금 해제
  unlockAudio();
  
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

// 동물 소리 재생 (개선된 버전)
function playAnimalSound(icon) {
  try {
    const audio = new Audio();
    audio.src = icon.sound;
    audio.volume = 0.7;
    audio.load();
    
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log(`✅ ${icon.name} 소리 재생!`);
        })
        .catch(error => {
          console.log(`⚠️ ${icon.name} 소리 재생 실패:`, error.message);
        });
    }
  } catch (e) {
    console.log('❌ 동물 소리 생성 오류:', e);
  }
}

// 축하 애니메이션
function celebrateAnimal(animal) {
  animal.classList.add('celebrating');
  setTimeout(() => animal.classList.remove('celebrating'), 800);
}

// 배회 시작
function startWandering(animal, container) {
  wanderInterval = setInterval(() => {
    moveAnimalRandomly(animal, container);
    if (currentAnimalIcon) {
      playAnimalMoveSound(currentAnimalIcon);
    }
  }, 3000);
}

// 동물 이동 소리
function playAnimalMoveSound(icon) {
  try {
    const audio = new Audio();
    audio.src = icon.moveSound;
    audio.volume = 0.5;
    audio.load();
    
    audio.play()
      .then(() => console.log(`🚶 ${icon.name} 이동 소리!`))
      .catch(e => console.log(`⚠️ 이동 소리 실패:`, e.message));
  } catch (e) {
    console.log('❌ 이동 소리 생성 오류:', e);
  }
}

// 랜덤 이동
function moveAnimalRandomly(animal, container) {
  const rect = container.getBoundingClientRect();
  const maxX = rect.width - 80;
  const maxY = rect.height - 80;
  
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;
  
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
    playSplashSound();
  }
}

// 물 닿았을 때 소리
function playSplashSound() {
  try {
    const audio = new Audio();
    audio.src = splashSound;
    audio.volume = 0.8;
    audio.load();
    
    audio.play()
      .then(() => console.log('💦 물 첨벙 소리!'))
      .catch(e => console.log('⚠️ 물 첨벙 소리 실패:', e.message));
  } catch (e) {
    console.log('❌ 물 첨벙 소리 생성 오류:', e);
  }
}

// 컨테이너 클릭 처리 (순간이동)
function handleContainerClick(event) {
  if (!currentAnimal) return;
  
  if (event.target.closest('.animal')) {
    return;
  }
  
  const container = document.getElementById('game-container');
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left - 40;
  const y = event.clientY - rect.top - 40;
  
  currentAnimal.style.transition = 'none';
  currentAnimal.style.left = Math.max(0, Math.min(x, rect.width - 80)) + 'px';
  currentAnimal.style.top = Math.max(0, Math.min(y, rect.height - 80)) + 'px';
  
  if (currentAnimalIcon) {
    playAnimalMoveSound(currentAnimalIcon);
  }
  
  checkIfUnderWater(currentAnimal, container);
  
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
    ambientAudio.currentTime = 0;
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
