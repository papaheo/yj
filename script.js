const translations = {
  en: {
    mainTitle: "Choose! Fountain or Cascade",
    fountainBtn: "Fountain",
    cascadeBtn: "Cascade",
    pickTitle: "Pick an animal or fruit!",
    backBtn: "↩ Back"
  },
  ko: {
    mainTitle: "골라보아요! 분수 또는 폭포",
    fountainBtn: "분수",
    cascadeBtn: "폭포",
    pickTitle: "동물 또는 과일을 고르세요!",
    backBtn: "↩ 뒤로가기"
  }
};
let currentLang = "en";

function updateTexts() {
  document.getElementById("title-main").innerText = translations[currentLang].mainTitle;
  document.getElementById("fountain-btn").innerText = translations[currentLang].fountainBtn;
  document.getElementById("cascade-btn").innerText = translations[currentLang].cascadeBtn;
  document.getElementById("pick-title").innerText = translations[currentLang].pickTitle;
  document.getElementById("back-btn").innerText = translations[currentLang].backBtn;
}

// Change language
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lang-select").addEventListener("change", function() {
    currentLang = this.value;
    updateTexts();
  });
  updateTexts();
});

// SVGs and icon data
const fountainSVG = `<svg width="320" height="240">
  <ellipse cx="160" cy="200" rx="80" ry="22" fill="#b7f1fa"/>
  <rect x="140" y="180" width="40" height="40" fill="#95d0f7" rx="18"/>
  <rect x="155" y="50" width="10" height="130" fill="#36a3e6" rx="6"/>
  <ellipse cx="160" cy="48" rx="18" ry="14" fill="#a4e5f4"/>
  <ellipse cx="160" cy="70" rx="8" ry="17" fill="#43b2e5" opacity="0.4">
    <animate attributeName="cy" values="70;130;70" dur="1.7s" repeatCount="indefinite"/>
  </ellipse>
</svg>`;
const cascadeSVG = `<svg width="320" height="240">
  <rect x="0" y="80" width="320" height="90" fill="#90cdf7"/>
  <rect x="120" y="0" width="80" height="200" fill="#2796e3" rx="22"/>
  <ellipse cx="160" cy="200" rx="80" ry="22" fill="#b7f1fa"/>
  <ellipse cx="160" cy="120" rx="24" ry="34" fill="#60cdfc" opacity="0.3">
    <animate attributeName="cy" values="120;170;120" dur="1.1s" repeatCount="indefinite"/>
  </ellipse>
</svg>`;
const icons = [
  {name: "Lion", img: "https://openmoji.org/data/color/svg/1F981.svg", sound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3"},
  {name: "Elephant", img: "https://openmoji.org/data/color/svg/1F418.svg", sound: "https://cdn.pixabay.com/audio/2022/10/16/audio_12b7f9f3c6.mp3"},
  {name: "Monkey", img: "https://openmoji.org/data/color/svg/1F412.svg", sound: "https://cdn.pixabay.com/audio/2023/02/14/audio_12b6395b49.mp3"},
  {name: "Apple", img: "https://openmoji.org/data/color/svg/1F34E.svg", sound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3"},
  {name: "Banana", img: "https://openmoji.org/data/color/svg/1F34C.svg", sound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3"},
  {name: "Orange", img: "https://openmoji.org/data/color/svg/1F34A.svg", sound: "https://cdn.pixabay.com/audio/2022/07/26/audio_124b0c49e4.mp3"}
];
function showFountain() { showWater("fountain"); }
function showCascade() { showWater("cascade"); }
// Add lightning div when showing water animation
function showWater(type) {
  document.getElementById('main-choice').style.display = 'none';
  document.getElementById('water-stage').style.display = 'block';
  const wa = document.getElementById('water-animation');
  wa.innerHTML = (type === "fountain" ? fountainSVG : cascadeSVG);
  
  // Add lightning overlay
  const lightningDiv = document.createElement('div');
  lightningDiv.className = 'lightning-flash';
  wa.appendChild(lightningDiv);

  // Play ambient sound for water
  playWaterSound(type);

  const picker = document.getElementById('icon-picker');
  picker.innerHTML = "";
  // Animals only (no fruits)
  const animalIcons = icons.slice(0,3); // Lion, Elephant, Monkey (assumed first 3)
  animalIcons.forEach(icon => {
    const btn = document.createElement("button");
    btn.className = "icon-btn";
    btn.onclick = () => playAnimalInteraction(icon, type);
    btn.innerHTML = `<img src="${icon.img}" alt="${icon.name}" title="${icon.name}">`;
    picker.appendChild(btn);
  });
}
function playInteraction(icon, type) {
  const wa = document.getElementById('water-animation');
  wa.innerHTML = (type === "fountain" ? fountainSVG : cascadeSVG)
    + `<img src="${icon.img}" alt="${icon.name}" style="position:absolute;top:100px;left:50%;transform:translateX(-50%) scale(2);pointer-events:none;width:60px;">`;
  const audio = document.getElementById('sound-player');
  audio.src = icon.sound;
  audio.play();
  setTimeout(() => {
    wa.innerHTML = type === "fountain" ? fountainSVG : cascadeSVG;
  }, 1200);
}
function restart() {
  stopWaterSound();
  document.getElementById('water-stage').style.display = 'none';
  document.getElementById('main-choice').style.display = 'block';
}


const waterSounds = {
  fountain: "https://cdn.pixabay.com/audio/2021/07/12/audio_8b44096148.mp3", // example water fountain sound 
  cascade: "https://cdn.pixabay.com/audio/2017/08/12/audio_6238b07954.mp3"   // example cascade sound
};

let ambientAudio = null;

function playWaterSound(type) {
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio = null;
  }
  ambientAudio = new Audio(waterSounds[type]);
  ambientAudio.loop = true;
  ambientAudio.volume = 0.25; // soft volume to not disturb baby
  ambientAudio.play();
}

function stopWaterSound() {
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio = null;
  }
}

function playAnimalInteraction(icon, type) {
  const wa = document.getElementById('water-animation');
  wa.innerHTML = (type === "fountain" ? fountainSVG : cascadeSVG);
  
  // Create wandering animal img
  const animalImg = document.createElement('img');
  animalImg.src = icon.img;
  animalImg.alt = icon.name;
  animalImg.style.position = 'absolute';
  animalImg.style.width = '60px';
  animalImg.style.height = '60px';
  animalImg.style.top = '100px';
  animalImg.style.left = '0';
  animalImg.style.transition = 'left 10s linear';
  wa.appendChild(animalImg);

  // Play animal sound
  const audio = document.getElementById('sound-player');
  audio.src = icon.sound;
  audio.play();

  // Start wandering animation (moving left to right)
  setTimeout(() => {
    animalImg.style.left = '260px'; // Move to right side over 10 seconds
  }, 100);

  // Remove image after animation to reset
  setTimeout(() => {
    wa.innerHTML = (type === "fountain" ? fountainSVG : cascadeSVG);
  }, 11000);
}

