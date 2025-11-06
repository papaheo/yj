const translations = {
  en: {
    mainTitle: "Choose! Fountain or Cascade",
    fountainBtn: "Fountain",
    cascadeBtn: "Cascade",
    pickTitle: "Tap an animal to play and watch it wander!",
    backBtn: "↩ Back"
  },
  ko: {
    mainTitle: "골라보아요! 분수 또는 폭포",
    fountainBtn: "분수",
    cascadeBtn: "폭포",
    pickTitle: "동물을 탭해서 소리를 듣고 움직여요!",
    backBtn: "↩ 뒤로가기"
  }
};

let currentLang = "en";
let ambientAudio = null;
let sparkleTimers = [];

function updateTexts() {
  document.getElementById("title-main").innerText = translations[currentLang].mainTitle;
  document.getElementById("fountain-btn").innerText = translations[currentLang].fountainBtn;
  document.getElementById("cascade-btn").innerText = translations[currentLang].cascadeBtn;
  document.getElementById("pick-title").innerText = translations[currentLang].pickTitle;
  document.getElementById("back-btn").innerText = translations[currentLang].backBtn;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lang-select").addEventListener("change", function() {
    currentLang = this.value;
    updateTexts();
  });
  updateTexts();
});

const fountainSVG = `<svg width="360" height="260" viewBox="0 0 360 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="180" cy="230" rx="110" ry="32" fill="#a0dbff"/>
  <path fill="url(#grad1)" d="M140 180 q40 -110 60 0 z" />
  <defs>
    <linearGradient id="grad1" x1="140" y1="180" x2="200" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4db8ff"/>
      <stop offset="100%" stop-color="#1a9eff" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>`;

const cascadeSVG = `<svg width="360" height="260" viewBox="0 0 360 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="80" width="360" height="110" fill="#99ccff"/>
  <rect x="140" y="10" width="80" height="190" fill="url(#bluegrad)" rx="22" />
  <defs>
    <linearGradient id="bluegrad" x1="140" y1="10" x2="220" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#66b3ff"/>
      <stop offset="100%" stop-color="#1a75ff" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>`;

const icons = [
  {name: "Lion", img: "https://openmoji.org/data/color/svg/1F981.svg", sound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3"},
  {name: "Elephant", img: "https://openmoji.org/data/color/svg/1F418.svg", sound: "https://cdn.pixabay.com/audio/2022/10/16/audio_12b7f9f3c6.mp3"},
  {name: "Monkey", img: "https://openmoji.org/data/color/svg/1F412.svg", sound: "https://cdn.pixabay.com/audio/2023/02/14/audio_12b6395b49.mp3"}
];

const waterSounds = {
  fountain: "https://cdn.pixabay.com/audio/2021/07/12/audio_8b44096148.mp3",
  cascade: "https://cdn.pixabay.com/audio/2017/08/12/audio_6238b07954.mp3"
};

function playWaterSound(type) {
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio = null;
  }
  ambientAudio = new Audio(waterSounds[type]);
  ambientAudio.loop = true;
  ambientAudio.volume = 0.2;
  ambientAudio.play();
}

function stopWaterSound() {
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio = null;
  }
}

function createSparkles(container) {
  clearSparkles();
  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.setProperty('--x', `${randomBetween(-120, 120)}px`);
    sparkle.style.setProperty('--y', `${randomBetween(-70, -120)}px`);
    sparkle.style.width = `${randomBetween(6, 14)}px`;
    sparkle.style.height = sparkle.style.width;
    sparkle.style.top = `${randomBetween(20, 40)}px`;
    sparkle.style.left = `${randomBetween(50, 80)}%`;
    container.appendChild(sparkle);
  }
  // Clear sparkles periodically
  sparkleTimers.push(setTimeout(() => {
    clearSparkles();
    createSparkles(container);
  }, 1600));
}

function clearSparkles() {
  sparkleTimers.forEach(t => clearTimeout(t));
  sparkleTimers = [];
  const container = document.querySelector(".fireworks");
  if (container) container.innerHTML = "";
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showWater(type) {
  document.getElementById('main-choice').style.display = 'none';
  document.getElementById('water-stage').style.display = 'block';
  const wa = document.getElementById('water-animation');
  wa.innerHTML = (type === "fountain" ? fountainSVG : cascadeSVG);

  // Add sparkles container
  let fireworks = document.querySelector('.fireworks');
  if (!fireworks) {
    fireworks = document.createElement('div');
    fireworks.className = 'fireworks';
    wa.appendChild(fireworks);
  }
  createSparkles(fireworks);

  // Play water sound
  playWaterSound(type);

  const picker = document.getElementById('icon-picker');
  picker.innerHTML = "";
  icons.forEach(icon => {
    const btn = document.createElement("button");
    btn.className = "icon-btn";
    btn.onclick = () => playAnimalInteraction(icon, type);
    btn.inner
