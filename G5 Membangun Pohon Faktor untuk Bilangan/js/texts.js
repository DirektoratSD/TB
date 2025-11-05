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
      html_title: "Factorization",
      main_title_text: "Prime Factorization",
      subtitle_text: "Break down numbers with a magical hammer.",
      character_images: {
        normal: "./assets/Nexus.png",
        thinking: "./assets/NexusThink.png",
        wrong: "./assets/NexusSad.png",
        correct: "./assets/NexusHappy.png",
      },
      item_images: {
          hammer_passive: "./assets/hammer_passive.png",
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
          text: "This time, I have brought a magical hammer.",
        },
        step_1: {
          title: "My Magical Hammer",
          text: "Here is my magical hammer. It helps break a number.",
        },
        step_2: {
          title: "Special Power",
          text: "This can break out ‘2’ from a number.",
        },
        step_3: {
          title: "Let's Try!",
          text: () => `Tap the <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Hammer with 2"> and see what happens to 8.`,
        },
        step_3_success: {
          title: "Yay!",
          text: () => `2 divides 8 evenly. <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Hammer with 2"> broke 8 into 2 and 4.`,
        },
        step_4: {
          title: "What about this?",
          text: () => `Tap the <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Hammer with 2"> and see what happens to 9.`,
        },
        step_4_fail: {
          title: "Oops!",
          text: () => `The <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Hammer with 2"> didn’t work. 9 is not evenly divisible by 2. Click 'Next' to try different hammers.`,
        },
        step_5: {
            title: "Your Turn!",
            text: "Tap a hammer that breaks 12 into smaller numbers."
        },
        step_5_success: {
            title: "Yay!",
            text: (params) => `The <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Hammer with ${params.hammerNum}"> broke the number 12 into ${params.hammerNum} and ${12 / params.hammerNum}.`,
        },
        activity_start: {
            title: "Let's Practice!",
            text: (params) => `Here is the activity. Use the given 4 hammers. Tap a hammer to break <b>${params.num}</b> into smaller parts. Keep going until every part is a prime number.`
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
            text: (params) => `Yay! The <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Hammer with ${params.hammerNum}"> worked. And, we are done! Because all the parts are prime numbers.`
        },
        summary_1: {
            title: "All Building Blocks",
            text: (params) => `Well done! We have found all the building blocks of <b>${params.num}</b>: ${params.factors}.`
        },
        summary_2: {
            title: "Find the Answer",
            text: (params) => `Tap the option that represents the prime factorization of <b>${params.num}</b>.`
        },
        summary_2_fail: {
            title: "Think Again!",
            text: "Remember, prime factorization means writing the number as a product of prime numbers (its building blocks)."
        },
        summary_2_success: {
            title: "Excellent!",
            text: "That’s the right prime factorisation!."
        },
        summary_3: {
            title: "Factorization Method",
            text: "This is the <br>Factor-tree method."
        },
        final_screen: {
            title: "Great Job!",
            text: "My magical hammer helped you understand the prime factorization of a number using the Factor-Tree method."
        }
      },
      gameConfig: {
        questions: [
          {
            numberToFactor: 18,
            hammers: [2, 3, 5, 7],
            mcq: {
              options: ['2 × 3 × 3', '3 × 3', '2 × 9 × 3', '2 × 9'],
              correctAnswer: '2 × 3 × 3'
            }
          }
        ]
      },
    },
  },
  id: { // Full Indonesian translation remains for completeness
    appTexts: {
      html_title: "Faktorisasi",
      main_title_text: "Faktorisasi Prima",
      subtitle_text: "Pecah angka dengan palu ajaib.",
      character_images: {
        normal: "./assets/Nexus.png",
        thinking: "./assets/NexusThink.png",
        wrong: "./assets/NexusSad.png",
        correct: "./assets/NexusHappy.png",
      },
      item_images: {
          hammer_passive: "./assets/hammer_passive.png",
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
        start_over: "Mulai Lagi",
        start: "Mulai",
      },
      instructions: {
        step_0: {
          title: "Halo!",
          text: "Mari kita pelajari metode pohon faktor dengan menggunakan palu khusus!",
        },
        step_1: {
          title: "Palu Ajaibku",
          text: "Ini adalah palu ajaibku. Palu ini membantu memecah sebuah bilangan.",
        },
        step_2: {
          title: "Kekuatan Spesial",
          text: "Palu ini bisa membagi '2' sebuah bilangan.",
        },
        step_3: {
          title: "Ayo Coba!",
          text: () => `Ketuk <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Palu dengan 2"> dan lihat apa yang terjadi pada 8.`,
        },
        step_3_success: {
          title: "Hore!",
          text: () => `2 habis membagi 8. <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Palu dengan 2"> berhasil memecah 8 menjadi 2 dan 4.`,
        },
        step_4: {
          title: "Bagaimana dengan Ini?",
          text: () => `Ketuk <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Palu dengan 2"> dan lihat apa yang terjadi pada 9.`,
        },
        step_4_fail: {
          title: "Oops!",
          text: () => `<img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Palu dengan 2"> tidak berhasil. 9 tidak habis dibagi 2. Klik ‘Berikutnya’ untuk mencoba palu yang berbeda.`,
        },
        step_5: {
            title: "Giliranmu!",
            text: "Ketuk palu yang bisa memecah 12 menjadi angka yang lebih kecil."
        },
        step_5_success: {
            title: "Hore!",
            text: (params) => `<img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Palu dengan ${params.hammerNum}"> berhasil memecah angka 12 menjadi ${params.hammerNum} dan ${12 / params.hammerNum}.`,
        },
        activity_start: {
            title: "Ayo Latihan!",
            text: (params) => `Lihat soal latihan berikut. Gunakan palu 4. Ketuk palu untuk memecah <b>${params.num}</b> menjadi bagian yang lebih kecil. Lanjutkan sampai setiap bagian adalah bilangan prima.`
        },
        activity_success: {
            title: "Bagus!",
            text: (params) => `<img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Palu dengan ${params.hammerNum}"> bekerja. Lanjutkan dan pecah <b>${params.newNum}</b> sekarang.`,
        },
        activity_fail: {
            title: "Belum Tepat!",
            text: (params) => `Oops! <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Palu dengan ${params.hammerNum}"> tidak berhasil. ${params.num} tidak habis dibagi ${params.hammerNum}. Coba palu yang lain!`,
        },
        activity_last_strike: {
            title: "Kerja Bagus!",
            text: (params) => `Hore! <img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Palu dengan ${params.hammerNum}"> bekerja. Dan, kita selesai! Karena semua bagiannya adalah bilangan prima.`
        },
        summary_1: {
            title: "Semua Bilangan Prima",
            text: (params) => `Kerja bagus! Kita telah menemukan semua bilangan prima dari <b>${params.num}</b>, yaitu ${params.factors}.`
        },
        summary_2: {
            title: "Cari Jawabannya",
            text: (params) => `Ketuk opsi yang mewakili faktorisasi prima dari <b>${params.num}</b>.`
        },
        summary_2_fail: {
            title: "Pikirkan Lagi!",
            text: "Ingat, faktorisasi prima berarti menulis angka sebagai hasil perkalian bilangan prima (blok pembangunnya)."
        },
        summary_2_success: {
            title: "Bagus sekali!",
            text: "Itu adalah faktorisasi prima yang tepat!"
        },
        summary_3: {
            title: "Metode Pohon Faktor",
            text: "Ini adalah <br>Metode-pohon faktor."
        },
        final_screen: {
            title: "Kerja Bagus!",
            text: "Palu ajaibku telah membantukita memahami faktorisasi prima sebuah bilangan menggunakan metode Pohon Faktor."
        }
      },
      gameConfig: {
        questions: [
          {
            numberToFactor: 18,
            hammers: [2, 3, 5, 7],
            mcq: {
              options: ['2 × 3 × 3', '3 × 3', '2 × 9 × 3', '2 × 9'],
              correctAnswer: '2 × 3 × 3'
            }
          }
        ]
      },
    },
  },
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