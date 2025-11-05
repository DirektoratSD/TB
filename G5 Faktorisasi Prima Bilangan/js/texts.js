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
      html_title: "Factorization by Division",
      main_title_text: "Prime Factorization",
      subtitle_text: "Break down numbers with the Step Diagram method.",
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
        strike_gif: "./assets/strike.gif",
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
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
          text: "Let’s use my magic hammer to learn prime factorisation using the Step Diagram method.",
        },
        step_1: {
          title: "My Magical Hammer",
          text: "Here is my magical hammer. It helps break down a number.",
        },
        step_2: {
          title: "Special Power",
          text: "Each hammer has a special number. This one can break out a '2' from a number.",
        },
        step_3: {
          title: "Let's Try!",
          text: "Tap the hammer with '2' and see what happens to '12'.",
        },
        step_3_success: {
          title: "Great!",
          text: () =>
            `The <div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Hammer"></div> broke 12 into a 2 and 6. Click Next to try the hammer on number 9.`,
        },
        step_4: {
          title: "What about this?",
          text: () =>
            `Tap <div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Hammer"></div> and see what happens to 9.`,
        },
        step_4_fail: {
          title: "Oops!",
          text: () =>
            `The <div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Hammer"></div> didn’t work because 9 is not evenly divisible by 2. Click 'Next' to start the activity!`,
        },
        activity_start: {
          title: "Let's Practice!",
          text: (params) =>
            `Use the hammers to break <b>${params.num}</b> into smaller parts. Keep going until the number becomes 1.`,
        },
        activity_success: {
          title: "Nice!",
          text: (params) =>
            `The <div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Hammer"></div>  worked! Since the number isn't 1 yet, choose a hammer to break <b>${params.newNum}</b>.`,
        },
        activity_fail: {
          title: "Oops!",
          text: (params) =>
            `<div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Hammer"></div> didn't work. The ${params.num} is not divisible by ${params.hammerNum}. Try a different hammer!`,
        },
        activity_last_strike: {
          title: "Well Done!",
          text: (params) =>
            `Yay! The <div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Hammer"></div>worked. And, we are done! Because the number became 1.`,
        },
        summary_1: {
          title: "All Prime Factors",
          text: (params) =>
            `We have found all the building blocks of <b>${params.num}</b> 2, 2, 2 and 3.`,
        },
        summary_2: {
          title: "Find the Answer",
          text: (params) =>
            `Tap the option that shows the correct prime factorization of <b>${params.num}</b>.`,
        },
        summary_2_fail: {
          title: "Think Again!",
          text: "Remember, prime factorization is the product of all the prime numbers you found on the left.",
        },
        summary_2_success: {
          title: "Yay!",
          text: "You're right! Click Next to see the final result.",
        },
        summary_3: {
          title: "Step Diagram Method",
          text: "This is called prime factorization using the Step Diagram method.",
        },
        final_screen: {
          title: "Great Job!",
          text: "My magic hammer helped you learn prime factorisation using the Step Diagram.",
        },
      },
      gameConfig: {
        questions: [
          {
            numberToFactor: 24,
            hammers: [2, 3, 5, 7],
            mcq: {
              options: ["2 × 2 × 2 × 3", "2 × 3 × 4", "2 × 2 × 6", "2 × 12"],
              correctAnswer: "2 × 2 × 2 × 3",
            },
          },
        ],
      },
    },
  },
  id: {
    appTexts: {
      html_title: "Faktorisasi dengan Pembagian",
      main_title_text: "Faktorisasi Prima",
      subtitle_text: "Pecah angka dengan metode Diagram Langkah.",
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
        strike_gif: "./assets/strike.gif",
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
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
          text: "Ayo gunakan palu ajaibku untuk belajar faktorisasi prima menggunakan Metode Tabel.",
        },
        step_1: {
          title: "Palu Ajaibku",
          text: "Ini adalah palu ajaib. Palu ini membantu kita memecah sebuah bilangan.",
        },
        step_2: {
          title: "Kekuatan Spesial",
          text: "Setiap palu memiliki nomor khusus. Yang ini bisa membagi '2' sebuah bilangan.",
        },
        step_3: {
          title: "Ayo Coba!",
          text: "Ketuk palu dengan ‘2’ dan lihat apa yang terjadi pada ‘12’.",
        },
        step_3_success: {
          title: "Bagus Sekali!",
          text: () =>
            `Palu <div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Palu"></div> itu membagi 12 menjadi 2  6. Klik Berikutnya untuk mencoba palu pada bilangan 9.`,
        },
        step_4: {
          title: "Bagaimana dengan ini?",
          text: () =>
            `Ketuk <div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number=“2” class="inline-hammer" alt="Hammer"></div> dan lihat apa yang terjadi pada 9.`,
        },
        step_4_fail: {
          title: "Oops!",
          text: () =>
            `Palu <div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="2" class="inline-hammer" alt="Palu"></div> tidak berfungsi karena 9 tidak habis dibagi 2. Klik Berikutnya untuk mulai aktivitasnya!`,
        },
        activity_start: {
          title: "Ayo Latihan!",
          text: (params) =>
            `Gunakan palu untuk memecah <b>${params.num}</b> menjadi bagian yang lebih kecil. Teruskan hingga angkanya menjadi 1.`,
        },
        activity_success: {
          title: "Bagus!",
          text: (params) =>
            `The <div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number = "${params.hammerNum}" class="inline-hammer" alt="Hammer"></div> berhasil! Tapi, karena hasilnya belum 1, pilih palu lagi untuk memecahkan bilangan<b>${params.newNum}</b>.`,
        },
        activity_fail: {
          title: "Ups!",
          text: (params) =>
            `<div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number = "${params.hammerNum}" class="inline-hammer" alt="Hammer"></div> tidak berhasil. ${params.num} tidak dapat dibagi dengan ${params.hammerNum}. Coba palu yang berbeda!`,
        },
        activity_last_strike: {
          title: "Kerja Bagus!",
          text: (params) =>
            `Hore! Palu <div class="inline-hammer-wrapper"><img src="${ALL_TEXTS.en.appTexts.item_images.hammer_active}" data-number="${params.hammerNum}" class="inline-hammer" alt="Palu"></div> berhasil. Dan, kita sudah selesai! Karena angkanya menjadi 1. Klik Berikutnya untuk melanjutkan.`,
        },
        summary_1: {
          title: "Semua Faktor Prima",
          text: (params) =>
            `Kita sudah menemukan semua faktor prima dari <b>${params.num}</b> yaitu 2, 2, 2, 2 dan 3.`,
        },
        summary_2: {
          title: "Temukan Jawabannya",
          text: (params) =>
            `Ketuk opsi yang menunjukkan faktorisasi prima yang benar dari <b>${params.num}</b>.`,
        },
        summary_2_fail: {
          title: "Pikirkan Lagi!",
          text: "Ingat, faktorisasi prima adalah hasil perkalian semua bilangan prima yang kamu temukan di sebelah kiri.",
        },
        summary_2_success: {
          title: "Hore!",
          text: "Kamu benar! Klik Berikutnya untuk melihat hasil akhir.",
        },
        summary_3: {
          title: "Metode Tabel.",
          text: "Ini disebut faktorisasi prima dengan menggunakan Metode Tabel.",
        },
        final_screen: {
          title: "Kerja Bagus!",
          text: "Palu ajaibku membantu kita belajar faktorisasi prima dengan Metode Tabel.",
        },
      },
      gameConfig: {
        questions: [
          {
            numberToFactor: 24,
            hammers: [2, 3, 5, 7],
            mcq: {
              options: ["2 × 2 × 2 × 3", "2 × 3 × 4", "2 × 2 × 6", "2 × 12"],
              correctAnswer: "2 × 2 × 2 × 3",
            },
          },
        ],
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
