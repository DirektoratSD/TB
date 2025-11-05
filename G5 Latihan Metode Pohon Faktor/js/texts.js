// ==================================================================
// === LANGUAGE SELECTOR - ONLY EDIT THE VALUE IN THIS LINE ===
// ==================================================================
// Change this value to 'id' for Indonesian Bahasa or 'en' for English.
const CURRENT_LANGUAGE = "id";
// ==================================================================

const ALL_TEXTS = {
  // English Text (Default)
  en: {
    appTexts: {
      html_title: "Factorisation Challenge",
      main_title_text: "Prime Factorisation",
      subtitle_text: "Break down numbers with the Factor Tree method.",
      character_images: {
        normal: "./assets/Nexus.png",
        thinking: "./assets/NexusThink.png",
        wrong: "./assets/NexusSad.png",
        correct: "./assets/NexusHappy.png",
      },
      item_images: {
          hammer_active: "./assets/hammer_active.png",
          ftue_cursor: "./assets/Tap.png",
          strike_gif: "./assets/strike.gif"
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
        confetti: "assets/sfx/confetti.mp3",
        strike_success: "assets/sfx/strike_success.mp3",
        strike_fail: "assets/sfx/strike_fail.mp3",
      },
      button_texts: {
        prev: "Previous",
        next: "Next",
        start_over: "Start Over",
        start: "Start",
      },
      instructions: {
        step_0: {
          title: "Hello!",
          text: "Let’s solve a few challenges on finding prime factorisation using the Factor Tree method.",
        },
        activity_start: {
            title: (params) => `Question ${params.qNum}`,
            text: (params) => `Tap a hammer to break the number <b>${params.num}</b> into smaller parts. Keep doing this until all parts are prime.`
        },
        activity_success: {
            title: "Great!",
            text: (params) => `The <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Hammer with ${params.hammerNum}"> worked. Go ahead and break <b>${params.newNum}</b> now.`,
        },
        activity_fail: {
            title: "Not Quite!",
            text: (params) => `Oops! The <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Hammer with ${params.hammerNum}"> didn’t work. ${params.num} is not divisible by ${params.hammerNum}. Try a different hammer!`,
        },
        activity_last_strike: {
            title: "Well Done!",
            text: (params) => `Yay! The <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Hammer with ${params.hammerNum}"> worked. And, we are done! Because every part is now a prime number.`,
        },
        summary_mcq: {
            title: (params) => `Question ${params.qNum}`,
            text: (params) => `Tap the option that represents the prime factorisation of <b>${params.num}</b>.`
        },
        summary_mcq_fail: {
            title: "Think Again!",
            text: "Remember, prime factorisation means writing the number as a product of its prime numbers.",
        },
        summary_mcq_success: {
            title: "Correct!",
            text: "Excellent! You've found the right prime factorisation."
        },
        final_screen: {
            title: "Congratulations!",
            text: "You have successfully solved all the challenges. Great job!"
        }
      },
      gameConfig: {
        questions: [
          { numberToFactor: 16, hammers: [2, 3, 5, 7], mcq: { options: ['2 × 8', '4 × 4', '2 × 2 × 2 × 2', '2 × 2 × 4'], correctAnswer: '2 × 2 × 2 × 2' } },
          { numberToFactor: 24, hammers: [2, 3, 5, 7], mcq: { options: ['2 × 2 × 2 × 3', '4 × 6', '2 × 12', '2 × 3 × 4'], correctAnswer: '2 × 2 × 2 × 3' } },
          { numberToFactor: 48, hammers: [2, 3, 5, 7], mcq: { options: ['6 × 8', '2 × 2 × 12', '2 × 2 × 2 × 2 × 3', '2 × 2 × 2 × 6'], correctAnswer: '2 × 2 × 2 × 2 × 3' } },
          { numberToFactor: 56, hammers: [2, 3, 5, 7], mcq: { options: ['7 × 8', '2 × 2 × 14', '2 × 28', '2 × 2 × 2 × 7'], correctAnswer: '2 × 2 × 2 × 7' } },
          { numberToFactor: 72, hammers: [2, 3, 5, 7], mcq: { options: ['8 × 9', '2 × 2 × 2 × 3 × 3', '2 × 36', '2 × 3 × 12'], correctAnswer: '2 × 2 × 2 × 3 × 3' } },
          { numberToFactor: 84, hammers: [2, 3, 5, 7], mcq: { options: ['2 × 2 × 3 × 7', '4 × 21', '7 × 12', '2 × 42'], correctAnswer: '2 × 2 × 3 × 7' } },
          { numberToFactor: 90, hammers: [2, 3, 5, 7], mcq: { options: ['9 × 10', '2 × 45', '2 × 3 × 15', '2 × 3 × 3 × 5'], correctAnswer: '2 × 3 × 3 × 5' } },
          { numberToFactor: 135, hammers: [2, 3, 5, 7], mcq: { options: ['5 × 27', '3 × 3 × 3 × 5', '3 × 45', '9 × 15'], correctAnswer: '3 × 3 × 3 × 5' } },
          { numberToFactor: 196, hammers: [2, 3, 5, 7], mcq: { options: ['14 × 14', '2 × 98', '2 × 2 × 7 × 7', '4 × 49'], correctAnswer: '2 × 2 × 7 × 7' } },
          { numberToFactor: 250, hammers: [2, 3, 5, 7], mcq: { options: ['10 × 25', '2 × 5 × 25', '2 × 5 × 5 × 5', '5 × 50'], correctAnswer: '2 × 5 × 5 × 5' } }
        ]
      },
    },
  },
  id: { // Indonesian translation
    appTexts: {
      html_title: "Tantangan Faktorisasi",
      main_title_text: "Faktorisasi Prima",
      subtitle_text: "Pecahkan bilangan dengan metode Pohon Faktor.",
      character_images: {
        normal: "./assets/Nexus.png",
        thinking: "./assets/NexusThink.png",
        wrong: "./assets/NexusSad.png",
        correct: "./assets/NexusHappy.png",
      },
      item_images: {
          hammer_active: "./assets/hammer_active.png",
          ftue_cursor: "./assets/Tap.png",
          strike_gif: "./assets/strike.gif"
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
        confetti: "assets/sfx/confetti.mp3",
        strike_success: "assets/sfx/strike_success.mp3",
        strike_fail: "assets/sfx/strike_fail.mp3",
      },
      button_texts: {
        prev: "Sebelumnya",
        next: "Berikutnya",
        start_over: "Ulangi dari Awal",
        start: "Mulai",
      },
      instructions: {
        step_0: {
          title: "Halo!",
          text: "Ayo selesaikan beberapa tantangan mencari faktorisasi prima menggunakan metode Pohon Faktor.",
        },
        activity_start: {
            title: (params) => `Pertanyaan ${params.qNum}`,
            text: (params) => `Ketuk palu untuk memecah bilangan <b>${params.num}</b> menjadi bagian yang lebih kecil. Lakukan terus sampai semua bagian menjadi bilangan prima.`
        },
        activity_success: {
            title: "Bagus!",
            text: (params) => `Palu <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Palu dengan ${params.hammerNum}"> berhasil. Lanjutkan dan pecahkan <b>${params.newNum}</b> sekarang.`,
        },
        activity_fail: {
            title: "Belum Tepat!",
            text: (params) => `Ups! Palu <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Palu dengan ${params.hammerNum}"> tidak berhasil. <b>${params.num}</b> tidak habis dibagi ${params.hammerNum}. Coba palu yang lain!`,
        },
        activity_last_strike: {
            title: "Kerja Bagus!",
            text: (params) => `Hore! Palu <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Palu dengan ${params.hammerNum}"> berhasil. Dan, kita sudah selesai! Karena setiap bagian sekarang menjadi bilangan prima.`,
        },
        summary_mcq: {
            title: (params) => `Pertanyaan ${params.qNum}`,
            text: (params) => `Ketuk opsi yang mewakili faktorisasi prima dari <b>${params.num}</b>.`
        },
        summary_mcq_fail: {
            title: "Pikirkan Lagi!",
            text: "Ingat, faktorisasi prima adalah menuliskan bilangan sebagai hasil perkalian dari bilangan-bilangan primanya.",
        },
        summary_mcq_success: {
            title: "Benar!",
            text: "Luar biasa! Kamu berhasil menemukan faktorisasi prima yang tepat."
        },
        final_screen: {
            title: "Selamat!",
            text: "Kamu telah berhasil menyelesaikan semua tantangan. Kerja bagus!"
        }
      },
      gameConfig: { // Game data is not translated
        questions: [
          { numberToFactor: 16, hammers: [2, 3, 5, 7], mcq: { options: ['2 × 8', '4 × 4', '2 × 2 × 2 × 2', '2 × 2 × 4'], correctAnswer: '2 × 2 × 2 × 2' } },
          { numberToFactor: 24, hammers: [2, 3, 5, 7], mcq: { options: ['2 × 2 × 2 × 3', '4 × 6', '2 × 12', '2 × 3 × 4'], correctAnswer: '2 × 2 × 2 × 3' } },
          { numberToFactor: 48, hammers: [2, 3, 5, 7], mcq: { options: ['6 × 8', '2 × 2 × 12', '2 × 2 × 2 × 2 × 3', '2 × 2 × 2 × 6'], correctAnswer: '2 × 2 × 2 × 2 × 3' } },
          { numberToFactor: 56, hammers: [2, 3, 5, 7], mcq: { options: ['7 × 8', '2 × 2 × 14', '2 × 28', '2 × 2 × 2 × 7'], correctAnswer: '2 × 2 × 2 × 7' } },
          { numberToFactor: 72, hammers: [2, 3, 5, 7], mcq: { options: ['8 × 9', '2 × 2 × 2 × 3 × 3', '2 × 36', '2 × 3 × 12'], correctAnswer: '2 × 2 × 2 × 3 × 3' } },
          { numberToFactor: 84, hammers: [2, 3, 5, 7], mcq: { options: ['2 × 2 × 3 × 7', '4 × 21', '7 × 12', '2 × 42'], correctAnswer: '2 × 2 × 3 × 7' } },
          { numberToFactor: 90, hammers: [2, 3, 5, 7], mcq: { options: ['9 × 10', '2 × 45', '2 × 3 × 15', '2 × 3 × 3 × 5'], correctAnswer: '2 × 3 × 3 × 5' } },
          { numberToFactor: 135, hammers: [2, 3, 5, 7], mcq: { options: ['5 × 27', '3 × 3 × 3 × 5', '3 × 45', '9 × 15'], correctAnswer: '3 × 3 × 3 × 5' } },
          { numberToFactor: 196, hammers: [2, 3, 5, 7], mcq: { options: ['14 × 14', '2 × 98', '2 × 2 × 7 × 7', '4 × 49'], correctAnswer: '2 × 2 × 7 × 7' } },
          { numberToFactor: 250, hammers: [2, 3, 5, 7], mcq: { options: ['10 × 25', '2 × 5 × 25', '2 × 5 × 5 × 5', '5 × 50'], correctAnswer: '2 × 5 × 5 × 5' } }
        ]
      },
    }
  }
};

// --- DO NOT EDIT BELOW THIS LINE ---
try {
  const selectedLang = ALL_TEXTS[CURRENT_LANGUAGE] || ALL_TEXTS["en"];
  window.APP_TEXTS = selectedLang.appTexts;
} catch (error) {
  console.error("Error setting up language texts.", error);
  // Fallback to English
  window.APP_TEXTS = ALL_TEXTS.en.appTexts;
}