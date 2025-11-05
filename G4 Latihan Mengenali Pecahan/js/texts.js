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
      html_title: "Fraction Builder",
      main_title_text: "Fraction Builder",
      subtitle_text: "Set up the numerator and denominator!",
      character_images: {
        normal: "./assets/Cavy.png",
        thinking: "./assets/CavyThink.png",
        wrong: "./assets/CavySad.png",
        correct: "./assets/CavyHappy.png",
        speaking_head: "./assets/CavyHead.png",
      },
      item_images: {
        ftue_cursor: "./assets/Tap.png",
        triangles: "./assets/triangles.png",
        umbrellas: "./assets/umbrellas.png",
        pie_chart: "./assets/pie_chart.png",
        chocolate_bar: "./assets/chocolate_bar.png"
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
      },
      button_texts: {
        start: "Start",
        check: "Check",
        next: "Next",
        start_over: "Start Over",
      },
      questions: [
        { 
          name: "triangles", 
          numerator: 5, 
          denominator: 9, 
          object: "yellow triangles",
          description: "yellow triangles out of total triangles"
        },
        { 
          name: "umbrellas", 
          numerator: 3, 
          denominator: 6, 
          object: "blue umbrellas",
          description: "open umbrellas out of total umbrellas"
        },
        { 
          name: "pie_chart", 
          numerator: 5, 
          denominator: 14, 
          object: "blue parts",
          description: "blue parts out of total parts"
        },
        { 
          name: "chocolate_bar", 
          numerator: 4, 
          denominator: 8, 
          object: "white pieces in chocolate bar",
          description: "white pieces out of total pieces"
        },
      ],
      instructions: {
        step_0_intro: {
          title: "Hey there!",
          text: "Way to go, Fraction Finder! You have identified the right numerators while representing fractions.<br><br> Now, set up both the numerator and denominator!",
        },
        question_prompt: {
            title: "Build the Fraction!",
            text: (params) => `Click on the "+" and "-" symbols in both the numerator and denominator to set the correct fraction for the ${params.object}. Click check when done.`
        },
        feedback_empty: {
            text: "Please build the fraction first by clicking the '+' or '-' buttons."
        },
        feedback_both_wrong: {
            text: "Remember, Fraction represents Parts of a Whole. 'Parts we are interested in' over 'total parts the whole contains'."
        },
        feedback_numerator_wrong: {
            text: "Not quite right, Count the number of objects we are interested in."
        },
        feedback_denominator_wrong: {
            text: "Not quite right, observe the total number of objects the whole group is made of."
        },
        feedback_correct: {
            text: "Awesome! You got this right, click next to proceed."
        },
        step_final: {
          title: "Woohoo! You did it!",
          text: "You now know how to build fractions by setting both the numerator and denominator correctly!",
        },
      },
    },
  },
  // Indonesian (Bahasa Indonesia) Translations
  id: {
    appTexts: {
      html_title: "Pembuat Pecahan",
      main_title_text: "Pembuat Pecahan",
      subtitle_text: "Atur pembilang dan penyebut!",
      character_images: {
        normal: "./assets/Cavy.png",
        thinking: "./assets/CavyThink.png",
        wrong: "./assets/CavySad.png",
        correct: "./assets/CavyHappy.png",
        speaking_head: "./assets/CavyHead.png",
      },
      item_images: {
        ftue_cursor: "./assets/Tap.png",
        triangles: "./assets/triangles.png",
        umbrellas: "./assets/umbrellas.png",
        pie_chart: "./assets/pie_chart.png",
        chocolate_bar: "./assets/chocolate_bar.png"
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
      },
      button_texts: {
        start: "Mulai",
        check: "Periksa",
        next: "Lanjut",
        start_over: "Mulai Lagi",
      },
      questions: [
        { 
          name: "triangles", 
          numerator: 5, 
          denominator: 9, 
          object: "segitiga kuning",
          description: "segitiga kuning dari total segitiga"
        },
        { 
          name: "umbrellas", 
          numerator: 3, 
          denominator: 6, 
          object: "payung berwarna merah muda",
          description: "payung yang terbuka dari total payung"
        },
        { 
          name: "pie_chart", 
          numerator: 5, 
          denominator: 14, 
          object: "bagian biru",
          description: "bagian biru dari total bagian"
        },
        { 
          name: "chocolate_bar", 
          numerator: 4, 
          denominator: 8, 
          object: "bagian coklat berwarna putih",
          description: "potongan putih dari total potongan"
        },
      ],
      instructions: {
        step_0_intro: {
          title: "Halo!",
          text: "Pembilang dan Penyebut adalah bagian yang sangat penting dalam pecahan! Ayo kita lanjut belajar tentang pembilang dan penyebut.",
        },
        question_prompt: {
            title: "Bangun Pecahan!",
            text: (params) => `Klik simbol "+" dan "-" pada pembilang dan penyebut untuk mengatur pecahan yang benar untuk ${params.object}. Klik periksa jika sudah selesai.`
        },
        feedback_empty: {
            text: "Silakan buat pecahan terlebih dahulu dengan mengklik tombol '+' atau '-'."
        },
        feedback_both_wrong: {
            text: "Ingat, Pecahan mewakili Bagian dari Keseluruhan. 'Bagian yang kita minati' dibagi 'total bagian yang membentuk keseluruhan'."
        },
        feedback_numerator_wrong: {
            text: "Belum tepat, hitung jumlah objek yang kita minati."
        },
        feedback_denominator_wrong: {
            text: "Belum tepat, amati total jumlah objek yang membentuk keseluruhan grup."
        },
        feedback_correct: {
            text: "Luar biasa! Kamu berhasil, klik lanjut untuk melanjutkan."
        },
        step_final: {
          title: "Hore! Kamu berhasil!",
          text: "Sekarang kamu tahu cara membangun pecahan dengan mengatur pembilang dan penyebut dengan benar!",
        },
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