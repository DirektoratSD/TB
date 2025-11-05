// ============================================================
// ====================== state & config ======================
// ============================================================
let lang = 'en';
let currentScreen = 1;
let divisions = 1;
let waterLevel = 0;
let currentQuestion = 0;
let nextButtonUnlocked = false;
let handIconElement = null;

// Questions configuration
const questions = [
  { numerator: 1, denominator: 4 },
  { numerator: 1, denominator: 5 },
  { numerator: 3, denominator: 4 },
  { numerator: 5, denominator: 5 }
];
// ====================== i18n strings ======================
const langText = {
  en: {
    welcome: {
      description: "Hi, I'm Deete! Ready to explore fractions? Click Start to begin.",
      button: "Start"
    },
    screen2: {
      dialogue: "Use + and − to split the container into equal parts. Try making at least 5 parts.",
      nextButton: "Next"
    },
    screen3: {
      dialogue: "Can you split the container into exactly 3 equal parts?",
      success: "Nice work! You made exactly 3 equal parts.",
      error: "Not quite. We need exactly 3 equal parts — try again.",
      nextButton: "Next"
    },
    screen4: {
      dialogue: "Fill the container so that **one** of those 3 parts is filled.",
      checkButton: "Check",
      tooMuch: "Too much water! Try lowering it closer to 1 out of 3.",
      notEnough: "Not enough water. Raise it to about 1 out of 3."
    },
    screen5: {
      dialogue: "Which fraction matches the filled part?",
      nextButton: "Next",
      incorrect1_2: "That’s 1/2 — but our container is split into 3 parts.",
      correct1_3: "Correct! The filled amount is 1/3.",
      incorrect3_1: "3/1 means more than a whole — that doesn’t match here."
    },
    screen6: {
      nextButton: "Next",
      partsFilled: "Parts filled",
      partsSplit: "Parts the whole is split into"
    },
    practice: {
      title: "Practice time! Build the shown fraction by choosing the denominator, then filling the right amount.",
      button: "Start Practice"
    },
    question: {
      greatJob: "Great job choosing the correct denominator!",
      createFraction: "Can you create the fraction",
      setNumerator: "Now set the numerator using the slider.",
      setDenominator: "First, set the denominator with + and −.",
      invalidDenominator: "Denominator can’t be 0. Choose at least 1.",
      notQuiteRight: "Not quite. We need",
      outOf: "out of",
      equalParts: "equal parts.",
      nextButton: "Next Question",
      wellDone: "Well done!",
      youHaveCreated: "You have created",
      byFilling: "by filling"
    },
    summary: {
      nextButton: "Continue",
      partsFilled: "Parts filled",
      partsSplit: "Parts the whole is split into",
      oneWhole: "Remember: a fraction is parts filled over total equal parts."
    },
    end: {
      description: "You’ve completed this activity! Want to try again or move on?",
      button: "Finish"
    }
  },

  id: {
    welcome: {
      description: "Hai! Siap menjelajahi pecahan? Klik Mulai untuk memulai.",
      button: "Mulai"
    },
    screen2: {
      dialogue: "Gunakan + dan − untuk membagi bejana menjadi bagian yang sama. Cobalah membuat minimal 5 bagian.",
      nextButton: "Berikutnya"
    },
    screen3: {
      dialogue: "Bisakah kalian membagi bejana menjadi tepat 3 bagian yang sama?",
      success: "Keren! Kalian membuat tepat 3 bagian yang sama.",
      error: "Belum pas. Kita butuh tepat 3 bagian yang sama — coba lagi.",
      nextButton: "Berikutnya"
    },
    screen4: {
      dialogue: "Isi bejana sehingga **satu** dari 3 bagian itu terisi.",
      checkButton: "Periksa",
      tooMuch: "Terlalu banyak air! Turunkan hingga mendekati 1 dari 3.",
      notEnough: "Airnya kurang. Naikkan hingga sekitar 1 dari 3."
    },
    screen5: {
      dialogue: "Pecahan mana yang sesuai dengan bagian yang terisi?",
      nextButton: "Berikutnya",
      incorrect1_2: "Itu 1/2 — tetapi bejana kita dibagi menjadi 3 bagian.",
      correct1_3: "Benar! Jumlah yang terisi adalah 1/3.",
      incorrect3_1: "3/1 artinya lebih dari satu utuh — tidak cocok di sini."
    },
    screen6: {
      nextButton: "Berikutnya",
      partsFilled: "Bagian terisi",
      partsSplit: "Banyak bagian pembagi satu utuh"
    },
    practice: {
      title: "Saatnya latihan! Bentuk pecahan yang ditampilkan: pilih penyebutnya, lalu isi jumlah yang tepat.",
      button: "Mulai Latihan"
    },
    question: {
      greatJob: "Mantap! Kalian memilih penyebut yang benar!",
      createFraction: "Bisakah kalian membuat pecahan",
      setNumerator: "Sekarang atur pembilang dengan penggeser.",
      setDenominator: "Pertama, atur penyebut dengan tombol + dan −.",
      invalidDenominator: "Penyebut tidak boleh 0. Pilih minimal 1.",
      notQuiteRight: "Belum tepat. Kita butuh",
      outOf: "dari",
      equalParts: "bagian yang sama.",
      nextButton: "Soal Berikutnya",
      wellDone: "Kerja bagus!",
      youHaveCreated: "Kalian telah membuat",
      byFilling: "dengan mengisi"
    },
    summary: {
      nextButton: "Lanjut",
      partsFilled: "Bagian terisi",
      partsSplit: "Banyak bagian pembagi satu utuh",
      oneWhole: "Ingat: pecahan = bagian terisi per total bagian yang sama."
    },
    end: {
      description: "Kalian sudah menyelesaikan aktivitas ini! Ingin mengulang atau lanjut?",
      button: "Selesai"
    }
  }
};

// ============================================================
// ====================== audio functions ======================
// ============================================================
// Global audio context - initialized on first user interaction
let globalAudioContext = null;
let audioInitialized = false;

// Initialize audio context on first user interaction
function initializeAudio() {
  if (audioInitialized) return true;
  
  try {
    globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Resume context if it's suspended (required by some browsers)
    if (globalAudioContext.state === 'suspended') {
      globalAudioContext.resume();
    }
    
    audioInitialized = true;
    console.log('Audio initialized successfully');
    return true;
  } catch (e) {
    console.error('Failed to initialize audio:', e);
    return false;
  }
}

// Enhanced audio function with better error handling
function playSound(frequency, duration = 200, type = 'sine', volume = 0.1) {
  try {
    // Initialize audio if not already done
    if (!initializeAudio()) {
      console.log('Audio initialization failed');
      return;
    }

    // Check if context is available and not closed
    if (!globalAudioContext || globalAudioContext.state === 'closed') {
      console.log('Audio context not available');
      return;
    }

    // Resume context if suspended
    if (globalAudioContext.state === 'suspended') {
      globalAudioContext.resume();
    }

    const oscillator = globalAudioContext.createOscillator();
    const gainNode = globalAudioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(globalAudioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, globalAudioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, globalAudioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, globalAudioContext.currentTime + duration / 1000);
    
    oscillator.start(globalAudioContext.currentTime);
    oscillator.stop(globalAudioContext.currentTime + duration / 1000);
  } catch (e) {
    console.error('Error playing sound:', e);
  }
}

function playClickSound() {
  playSound(600, 40, 'sine', 0.15);
  setTimeout(() => playSound(800, 20, 'sine', 0.1), 40);
}

function playCorrectSound() {
  playSound(784, 80, 'triangle', 0.2);
  setTimeout(() => playSound(988, 80, 'triangle', 0.2), 80);
  setTimeout(() => playSound(1319, 200, 'triangle', 0.25), 160);
  
  setTimeout(() => {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        playSound(1500 + (i * 200), 60, 'triangle', 0.15);
      }, i * 60);
    }
  }, 360);
}

function playIncorrectSound() {
  playSound(392, 100, 'sine', 0.2);
  setTimeout(() => playSound(330, 300, 'sine', 0.25), 100);
  setTimeout(() => playSound(349, 80, 'sine', 0.15), 400);
}

function playWaterSound() {
  playSound(300, 300, 'sine', 0.1);
  setTimeout(() => playSound(400, 200, 'sine', 0.1), 100);
  setTimeout(() => playSound(350, 250, 'sine', 0.1), 200);
}

function playDivisionSound() {
  playSound(800, 50, 'triangle', 0.15);
  setTimeout(() => playSound(1000, 30, 'triangle', 0.1), 50);
}

// ============================================================
// ====================== initialization ======================
// ============================================================
function initializeApplet() {
  console.log('Initializing Applet...');
  calculateScale();
  setupEventListeners();
  updateUI();
  updateText();
}

function calculateScale() {
  const container = document.querySelector('.scale-container');
  const wrapper = document.querySelector('.scale-wrapper');
  const scaleX = container.clientWidth / 1920;
  const scaleY = container.clientHeight / 1080;
  const scale = Math.min(scaleX, scaleY);
  wrapper.style.transform = `scale(${scale})`;
}

function setupEventListeners() {
  window.addEventListener('resize', calculateScale);

  document.getElementById('langToggle').addEventListener('click', () => {
    lang = lang === 'en' ? 'id' : 'en';
    document.getElementById('langToggle').textContent = lang === 'en' ? 'ID' : 'EN';
    updateText();
  });

  // Start screen
  document.getElementById('startButton').addEventListener('click', () => {
    playClickSound();
    switchToScreen(2);
  });

  // Screen 2 - Introduction to Container
  document.getElementById('add-btn').addEventListener('click', () => {
    playClickSound();
    playDivisionSound();
    if (divisions < 10) {
      divisions++;
      updateDivisionMarkers('division-markers', divisions, 'division-numbers');
      document.getElementById('number-display').textContent = divisions;
      
      // Show Next button after user selects 5 or more divisions
      if (divisions >= 5 && !nextButtonUnlocked) {
        nextButtonUnlocked = true;
        document.getElementById('nextButton').style.display = 'inline-block';
        showHandIcon('nextButton');
      }
    }
  });

  document.getElementById('subtract-btn').addEventListener('click', () => {
    playClickSound();
    if (divisions > 1) {
      divisions--;
      updateDivisionMarkers('division-markers', divisions, 'division-numbers');
      document.getElementById('number-display').textContent = divisions;
    }
  });

  document.getElementById('nextButton').addEventListener('click', () => {
    playClickSound();
    if (handIconElement) {
      handIconElement.remove();
      handIconElement = null;
    }
    switchToScreen(3);
    // Reset divisions for screen 3
    divisions = 1;
    updateDivisionMarkers('division-markers3', divisions, 'division-numbers3');
    document.getElementById('number-display3').textContent = divisions;
  });

  // Screen 3 - Divide into 3 Equal Parts
  document.getElementById('add-btn3').addEventListener('click', () => {
    playClickSound();
    playDivisionSound();
    if (divisions < 10) {
      divisions++;
      updateDivisionMarkers('division-markers3', divisions, 'division-numbers3');
      document.getElementById('number-display3').textContent = divisions;
      
      // Check if user selected 3 divisions
      if (divisions === 3) {
        // Show success message
        document.getElementById('dialogue-box3').classList.remove('incorrect');
        document.getElementById('dialogue-box3').classList.add('correct');
        document.getElementById('dialogue-text3').innerHTML = langText[lang].screen3.success;
        document.getElementById('nextButton3').style.display = 'inline-block';
        document.getElementById('character-img3').src = 'assets/Deete_Happy.png';
        document.getElementById('number-display3').classList.remove('red');
        document.getElementById('number-display3').classList.add('green');
        playCorrectSound();
        // Disable buttons
        document.getElementById('add-btn3').disabled = true;
        document.getElementById('subtract-btn3').disabled = true;
      } else {
        // Show error message
        document.getElementById('dialogue-box3').classList.add('incorrect');
        document.getElementById('dialogue-text3').innerHTML = langText[lang].screen3.error;
        document.getElementById('character-img3').src = 'assets/Deete_Sad.png';
        document.getElementById('number-display3').classList.add('red');
        playIncorrectSound();
      }
    }
  });

  document.getElementById('subtract-btn3').addEventListener('click', () => {
    playClickSound();
    if (divisions > 1) {
      divisions--;
      updateDivisionMarkers('division-markers3', divisions, 'division-numbers3');
      document.getElementById('number-display3').textContent = divisions;
      
      // Reset error/success state
      document.getElementById('dialogue-box3').classList.remove('correct', 'incorrect');
      document.getElementById('dialogue-text3').innerHTML = langText[lang].screen3.dialogue;
      document.getElementById('nextButton3').style.display = 'none';
      document.getElementById('character-img3').src = 'assets/Deete_Neutral.png';
      document.getElementById('number-display3').classList.remove('green', 'red');
      // Enable buttons
      document.getElementById('add-btn3').disabled = false;
    }
  });

  document.getElementById('nextButton3').addEventListener('click', () => {
    playClickSound();
    switchToScreen(4);
    // Set up screen 4 with 3 divisions
    divisions = 3;
    updateDivisionMarkers('division-markers4', divisions, 'division-numbers4');
    document.getElementById('water4').style.height = '0%';
  });

  // Screen 4 - Fill One Part
  const sliderTrack4 = document.getElementById('slider-track4');
  const sliderThumb4 = document.getElementById('slider-thumb4');
  setupCustomSlider(sliderTrack4, sliderThumb4, 'water4');

  document.getElementById('check-btn4').addEventListener('click', () => {
    playClickSound();
    const targetHeight = 100 / 3; // 33.33% for 1/3
    const tolerance = 5; // Allow 5% tolerance
    
    if (Math.abs(waterLevel - targetHeight) <= tolerance) {
      // Correct - filled 1/3
      switchToScreen(5);
      // Set up screen 5
      document.getElementById('water5').style.height = targetHeight + '%';
      // document.getElementById('slider-thumb5').style.bottom = `calc(${targetHeight}% - ${document.getElementById('slider-thumb5').offsetHeight / 2}px)`;
    } else if (waterLevel > targetHeight + tolerance) {
      // Too much water
      document.getElementById('dialogue-box4').classList.add('incorrect');
      document.getElementById('dialogue-text4').innerHTML = langText[lang].screen4.tooMuch;
      document.getElementById('character-img4').src = 'assets/Deete_Sad.png';
      playIncorrectSound();
    } else {
      // Not enough water
      document.getElementById('dialogue-box4').classList.add('incorrect');
      document.getElementById('dialogue-text4').innerHTML = langText[lang].screen4.notEnough;
      document.getElementById('character-img4').src = 'assets/Deete_Sad.png';
      playIncorrectSound();
    }
  });

  // Screen 5 - Choose Fraction
  document.getElementById('fraction-btn1').addEventListener('click', () => {
    playClickSound();
    // Incorrect - 1/2
    document.getElementById('fraction-btn1').classList.add('incorrect');
    document.getElementById('dialogue-box5').classList.add('incorrect');
    document.getElementById('dialogue-text5').innerHTML = langText[lang].screen5.incorrect1_2;
    document.getElementById('character-img5').src = 'assets/Deete_Sad.png';
    playIncorrectSound();
  });

  document.getElementById('fraction-btn2').addEventListener('click', () => {
    playClickSound();
    // Correct - 1/3
    document.getElementById('fraction-btn2').classList.add('correct');
    document.getElementById('dialogue-box5').classList.add('correct');
    document.getElementById('dialogue-text5').innerHTML = langText[lang].screen5.correct1_3;
    document.getElementById('character-img5').src = 'assets/Deete_Happy.png';
    document.getElementById('nextButton5').style.display = 'inline-block';
    playCorrectSound();
  });

  document.getElementById('fraction-btn3').addEventListener('click', () => {
    playClickSound();
    // Incorrect - 3/1
    document.getElementById('fraction-btn3').classList.add('incorrect');
    document.getElementById('dialogue-box5').classList.add('incorrect');
    document.getElementById('dialogue-text5').innerHTML = langText[lang].screen5.incorrect3_1;
    document.getElementById('character-img5').src = 'assets/Deete_Sad.png';
    playIncorrectSound();
  });

  document.getElementById('nextButton5').addEventListener('click', () => {
    playClickSound();
    switchToScreen(6);
    // Set up screen 6
    divisions = 3; // Ensure divisions is set to 3
    waterLevel = (100 / 3);
    document.getElementById('water6').style.height = (100 / 3) + '%';
    updateDivisionMarkers('division-markers6', 3, 'division-numbers6');
    document.getElementById('number-display6').textContent = '3';
  });

  // Screen 6 - Fraction Form
  document.getElementById('nextButton6').addEventListener('click', () => {
    playClickSound();
    switchToScreen(7);
  });

  // Screen 7 - Introduction to Practice
  document.getElementById('practiceButton').addEventListener('click', () => {
    playClickSound();
    currentQuestion = 0;
    setupQuestion(currentQuestion);
    switchToScreen(8);
  });

  // Question Screen
  document.getElementById('question-add-btn').addEventListener('click', () => {
    playClickSound();
    playDivisionSound();
    const currentValue = parseInt(document.getElementById('question-number-display').textContent);
    if (currentValue < 10) {
      const newValue = currentValue + 1;
      document.getElementById('question-number-display').textContent = newValue;
      updateDivisionMarkers('question-division-markers', newValue, 'question-division-numbers');
      
      // Check if correct denominator is selected
      const targetDenominator = questions[currentQuestion].denominator;
      if (newValue === targetDenominator) {
        // Correct denominator
        document.getElementById('question-dialogue-box').classList.add('correct');
        document.getElementById('question-dialogue-text').innerHTML = 
          `${langText[lang].question.greatJob}<br><br>${langText[lang].question.createFraction} <span id="target-fraction">${questions[currentQuestion].numerator}/${questions[currentQuestion].denominator}</span>?<br><br>${langText[lang].question.setNumerator}`;
        document.getElementById('question-character').src = 'assets/Deete_Happy.png';
        document.getElementById('question-number-display').classList.add('green');
        
        // Disable number selector and enable slider
        document.getElementById('question-add-btn').disabled = true;
        document.getElementById('question-subtract-btn').disabled = true;
        document.getElementById('question-slider-container').style.display = 'flex';
        
        playCorrectSound();
      } else if (newValue === 0 || newValue < 0) {
        // Invalid denominator (0 or negative)
        document.getElementById('question-dialogue-box').classList.add('incorrect');
        document.getElementById('question-dialogue-text').innerHTML = langText[lang].question.invalidDenominator;
        document.getElementById('question-character').src = 'assets/Deete_Sad.png';
        document.getElementById('question-number-display').classList.add('red');
        
        playIncorrectSound();
      }
    }
  });

  document.getElementById('question-subtract-btn').addEventListener('click', () => {
    playClickSound();
    const currentValue = parseInt(document.getElementById('question-number-display').textContent);
    if (currentValue > 1) {
      const newValue = currentValue - 1;
      document.getElementById('question-number-display').textContent = newValue;
      updateDivisionMarkers('question-division-markers', newValue, 'question-division-numbers');
      
      // Reset error/success state
      document.getElementById('question-dialogue-box').classList.remove('correct', 'incorrect');
      document.getElementById('question-dialogue-text').innerHTML = 
        `${langText[lang].question.createFraction} <span id="target-fraction">${questions[currentQuestion].numerator}/${questions[currentQuestion].denominator}</span>?<br>${langText[lang].question.setDenominator}`;
      document.getElementById('question-character').src = 'assets/Deete_Neutral.png';
      document.getElementById('question-number-display').classList.remove('green', 'red');
    }
  });

  // Question Screen Slider
  const questionSliderTrack = document.getElementById('question-slider-track');
  const questionSliderThumb = document.getElementById('question-slider-thumb');
  setupCustomSlider(questionSliderTrack, questionSliderThumb, 'question-water');

  document.getElementById('question-check-btn').addEventListener('click', () => {
    playClickSound();
    const denominator = parseInt(document.getElementById('question-number-display').textContent);
    const targetNumerator = questions[currentQuestion].numerator;
    const targetHeight = (targetNumerator / denominator) * 100;
    const tolerance = 5; // Allow 5% tolerance
    
    if (Math.abs(waterLevel - targetHeight) <= tolerance) {
      // Correct
      document.getElementById('question-dialogue-box').classList.add('correct');
      
      // Hide question, show feedback
      document.getElementById('question-dialogue-text').style.display = 'none';
      document.getElementById('correct-feedback').style.display = 'block';
      
      // Update feedback text
      document.getElementById('correct-fraction').textContent = `${targetNumerator}/${denominator}`;
      document.getElementById('correct-numerator').textContent = targetNumerator;
      document.getElementById('correct-denominator').textContent = denominator;
      
      document.getElementById('question-character').src = 'assets/Deete_Happy.png';
      document.getElementById('question-next-btn').style.display = 'inline-block';
      
      playCorrectSound();
    } else {
      // Incorrect
      document.getElementById('question-dialogue-box').classList.add('incorrect');
          document.getElementById('question-dialogue-text').innerHTML = 
        `${langText[lang].question.notQuiteRight} ${targetNumerator} ${langText[lang].question.outOf} ${denominator} ${langText[lang].question.equalParts} <span id="target-fraction" style="display: none;"></span>`;
      document.getElementById('question-character').src = 'assets/Deete_Sad.png';
      
      playIncorrectSound();
    }
  });

  document.getElementById('question-next-btn').addEventListener('click', () => {
    playClickSound();
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
      // Move to next question
      setupQuestion(currentQuestion);
    } else {
      // All questions completed, move to summary screen
      switchToScreen(9);
      // Set up summary screen
      updateDivisionMarkers('summary-division-markers1', 5, 'summary-division-numbers1');
      updateDivisionMarkers('summary-division-markers2', 1, 'summary-division-numbers2');
    }
  });

  // Summary Screen
  document.getElementById('summary-next-btn').addEventListener('click', () => {
    playClickSound();
    switchToScreen(10);
  });

  // End Screen
  document.getElementById('endButton').addEventListener('click', () => {
    playClickSound();
    // End button does nothing as per requirements
  });
}

// ============================================================
// ====================== helper functions ======================
// ============================================================
function switchToScreen(screenNumber) {
  // Hide all screens
  const screens = document.querySelectorAll('.content-screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
  });

  // Show the target screen
  let screenId;
  switch (screenNumber) {
    case 8:
      screenId = 'question-screen';
      break;
    case 9:
      screenId = 'summary-screen';
      break;
    case 10:
      screenId = 'end-screen';
      break;
    default:
      screenId = 'screen' + screenNumber;
      break;
  }

  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }

  currentScreen = screenNumber;
  console.log('Switched to screen', screenNumber);
}

function updateDivisionMarkers(markerContainerId, divs = divisions, numberContainerId) {
  const markersContainer = document.getElementById(markerContainerId);
  const numbersContainer = document.getElementById(numberContainerId);

  // Clear existing markers and numbers
  markersContainer.innerHTML = '';
  if (numbersContainer) {
    numbersContainer.innerHTML = '';
  }

  // Add new markers based on current divisions
  for (let i = 1; i < divs; i++) {
    const marker = document.createElement('div');
    marker.className = 'division-marker';

    // For screen 3, add color based on whether divisions is correct
    if (markerContainerId === 'division-markers3') {
      if (divs === 3) {
        marker.classList.add('green');
      } else {
        marker.classList.add('red');
      }
    }

    marker.style.bottom = `${(i / divs) * 100}%`;
    markersContainer.appendChild(marker);
  }

  // Add numbers to each division
  if (numbersContainer) {
    for (let i = 0; i < divs; i++) {
      const number = document.createElement('div');
      number.className = 'division-number';
      number.textContent = i + 1;
      numbersContainer.appendChild(number);
    }
  }
}

function setupCustomSlider(track, thumb, waterId) {
  let isDragging = false;

  const handleDragStart = () => {
    isDragging = true;
    thumb.style.cursor = 'grabbing';
  };

  const handleDragEnd = () => {
    isDragging = false;
    thumb.style.cursor = 'grab';
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;

    const clientY = e.clientY || e.touches[0].clientY;
    const trackRect = track.getBoundingClientRect();
    const offsetY = clientY - trackRect.top;
    let newY = Math.max(0, Math.min(trackRect.height, offsetY));
    
    // Invert the value
    newY = trackRect.height - newY;

    const percentage = (newY / trackRect.height) * 100;
    
    thumb.style.bottom = `calc(${percentage}% - ${thumb.offsetHeight / 2}px)`;
    document.getElementById(waterId).style.height = percentage + '%';
    waterLevel = percentage;
    playWaterSound();
  };

  thumb.addEventListener('mousedown', handleDragStart);
  document.addEventListener('mouseup', handleDragEnd);
  document.addEventListener('mousemove', handleDragMove);

  thumb.addEventListener('touchstart', handleDragStart);
  document.addEventListener('touchend', handleDragEnd);
  document.addEventListener('touchmove', handleDragMove);
}

function setupQuestion(questionIndex) {
  const question = questions[questionIndex];
  
  // Reset UI elements
  document.getElementById('question-dialogue-box').classList.remove('correct', 'incorrect');
  document.getElementById('question-character').src = 'assets/Deete_Neutral.png';
  document.getElementById('question-number-display').classList.remove('green', 'red');
  document.getElementById('question-next-btn').style.display = 'none';
  
  // Show question, hide feedback
  document.getElementById('question-dialogue-text').style.display = 'block';
  document.getElementById('correct-feedback').style.display = 'none';
  
  // Set question text
  document.getElementById('question-dialogue-text').innerHTML = 
  `${langText[lang].question.createFraction} <span id="target-fraction">${question.numerator}/${question.denominator}</span>?<br>${langText[lang].question.setDenominator}`;
  
  // Reset container
  document.getElementById('question-number-display').textContent = '1';
  document.getElementById('question-water').style.height = '0%';
  document.getElementById('question-slider-thumb').style.bottom = '0%';
  
  // Reset controls
  document.getElementById('question-add-btn').disabled = false;
  document.getElementById('question-subtract-btn').disabled = false;
  document.getElementById('question-slider-container').style.display = 'none';
  
  // Update division markers
  updateDivisionMarkers('question-division-markers', 1, 'question-division-numbers');
}

function showHandIcon(buttonId) {
  const button = document.getElementById(buttonId);
  handIconElement = document.createElement('div');
  handIconElement.className = 'hand-icon';
  handIconElement.style.top = button.offsetTop + 'px';
  handIconElement.style.left = (button.offsetLeft - 70) + 'px';
  button.parentNode.appendChild(handIconElement);
}

function updateUI() {
  // Initial setup for screen 2
  updateDivisionMarkers('division-markers', 1, 'division-numbers');
  
  // Initial setup for screen 5
  document.getElementById('water5').style.height = (100 / 3) + '%';
  updateDivisionMarkers('division-markers5', 3, 'division-numbers5');
  
  // Initial setup for screen 6
  document.getElementById('water6').style.height = (100 / 3) + '%';
  updateDivisionMarkers('division-markers6', 3, 'division-numbers6');

  // Initial setup for screen 9 (summary screen)
  updateDivisionMarkers('summary-division-markers1', 5, 'summary-division-numbers1');
  updateDivisionMarkers('summary-division-markers2', 1, 'summary-division-numbers2');
}

function updateText() {
  document.getElementById('start-dialogue-text').innerHTML = langText[lang].welcome.description;
  document.getElementById('startButton').textContent = langText[lang].welcome.button;
  document.getElementById('dialogue-text').innerHTML = langText[lang].screen2.dialogue;
  document.getElementById('nextButton').textContent = langText[lang].screen2.nextButton;
  document.getElementById('dialogue-text3').innerHTML = langText[lang].screen3.dialogue;
  document.getElementById('nextButton3').textContent = langText[lang].screen3.nextButton;
  document.getElementById('dialogue-text4').innerHTML = langText[lang].screen4.dialogue;
  document.getElementById('check-btn4').textContent = langText[lang].screen4.checkButton;
  document.getElementById('dialogue-text5').innerHTML = langText[lang].screen5.dialogue;
  document.getElementById('nextButton5').textContent = langText[lang].screen5.nextButton;
  document.getElementById('nextButton6').textContent = langText[lang].screen6.nextButton;
  document.getElementById('practice-dialogue-text').innerHTML = langText[lang].practice.title;
  document.getElementById('practiceButton').textContent = langText[lang].practice.button;
  document.getElementById('question-next-btn').textContent = langText[lang].question.nextButton;
  document.getElementById('summary-next-btn').textContent = langText[lang].summary.nextButton;
  document.getElementById('end-dialogue-text').innerHTML = langText[lang].end.description;
  document.getElementById('endButton').textContent = langText[lang].end.button;

  // Update dynamic text
  document.querySelector('.formula-text span:first-child').innerHTML = langText[lang].screen6.partsFilled;
  document.querySelector('.formula-text span:last-child').innerHTML = langText[lang].screen6.partsSplit;
  document.querySelector('#summary-dialogue-box .formula-text span:first-child').innerHTML = langText[lang].summary.partsFilled;
  document.querySelector('#summary-dialogue-box .formula-text span:last-child').innerHTML = langText[lang].summary.partsSplit;
  document.querySelector('.summary-text').innerHTML = langText[lang].summary.oneWhole;
  
  if (currentScreen === 8) {
    setupQuestion(currentQuestion);
    const feedback = document.getElementById('correct-feedback');
    if(feedback.style.display === 'block') {
        const question = questions[currentQuestion-1];
        feedback.innerHTML = `${langText[lang].question.wellDone}<br><br>${langText[lang].question.youHaveCreated} <span id="correct-fraction">${question.numerator}/${question.denominator}</span> ${langText[lang].question.byFilling} <span id="correct-numerator">${question.numerator}</span> ${langText[lang].question.outOf} <span id="correct-denominator">${question.denominator}</span> ${langText[lang].question.equalParts}`;
    }
  }
}

// Initialize the applet when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApplet);
