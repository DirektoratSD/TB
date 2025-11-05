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
      html_title: "Fun with Fractions",
      main_title_text: "Fun with Fractions",
      subtitle_text: "Let's learn by cutting and coloring!",
      character_images: {
        normal: "./assets/Cavy.png",
        thinking: "./assets/CavyThink.png",
        wrong: "./assets/CavySad.png",
        correct: "./assets/CavyHappy.png",
        speaking_head: "./assets/CavyHead.png",
      },
      item_images: {
        scissor: "./assets/Scissor2.png",
        glue_gun: "./assets/gluegun.png",
        ftue_cursor: "./assets/Tap.png",
        paper_texture: "./assets/paper-texture.png",
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
        cut: "assets/sfx/swoosh.mp3",
        glue: "assets/sfx/glue.mp3",
        paint: "assets/sfx/paint.mp3",
      },
      button_texts: {
        prev: "Previous",
        next: "Next",
        start_over: "Start Over",
        start: "Start!",
      },
      instructions: {
        step_0: {
          title: "Hi!",
          text: "We’re going to play with paper, scissors, and colors to learn what fractions are!<br><br> Ready to explore how a whole becomes parts?",
        },
        step_1: {
          title: "A Whole",
          text: "This is one whole square sheet of paper. We will use this to learn about fractions.",
        },
        step_2: {
          title: "The Magic Scissor",
          text: "This scissor will make 2 equal parts when we use it.",
        },
        step_3_cut1: {
          title: "Let's Cut!",
          text: "Let’s use the scissor! First, click on the scissor, then click on the paper to cut it into 2 equal parts.",
        },
        step_3_cut2: {
          title: "Great Job!",
          text: "Now, let’s split one of these parts again. Click the scissor, then click on any rectangle to cut it again into 2 equal parts.",
        },
        step_3_glue_intro: {
          title: "Nice work cutting the parts!",
          text: "Now, here is a special glue gun. You can use it to stick pieces back together.",
        },
        step_4_glue: {
          title: "Time to Glue!",
          text: "Click the glue gun, then click on one of the small squares you just made to join them back together.",
        },
        step_4_mcq: {
          title: "Great Job!",
          text: "Now tell me, how many Blue rectangles do you see?",
          options: ["1", "2", "0"],
          correctAnswer: "2",
        },
        step_4_success: {
          title: "That is right!",
          text: "The two equal parts have combined to form the whole square.",
        },
        step_5_palette_intro: {
          title: "One More Tool!",
          text: "Time to try one more tool! This is the coloring palette. With this, you can change the color of any part you like. This helps us show different parts of the whole!",
        },
        step_6_color: {
          title: "Let's Color!",
          text: (params) =>
            `You can click on one of the colors and then click on a shape to change its color. Try <b>${params.colorName}</b>!`,
        },
        step_6_mcq: {
          title: "Nice!",
          text: (params) =>
            `How many parts are colored <b>${params.colorName}</b>?`,
          options: ["1 out of 2 parts", "2 out of 2 parts", "1 out of 1 part"],
          correctAnswer: "1 out of 2 parts",
        },
        step_6_success: {
          title: "That is correct!",
          text: "One part is colored out of the two parts the whole is divided into. This is where we use <b style='color:#35a7ff'>FRACTIONS</b> - they show which <b style='color:#eb910bff'>part of the whole</b> we are thinking about!",
        },
        step_7_final_intro: {
          title: "Whole Square",
          text: "Now let’s understand how to represent a part of the whole. What you see here is one whole square.",
        },
        step_8_final_split: {
          title: "Splitting the Whole",
          text: (params) =>
            `Now I have used the <img src="${params.scissorImg}" style="height:1.5em; vertical-align:middle; filter: hue-rotate(310deg) contrast(1.1);"> to split the square.`,
        },
        step_9_denominator: {
          title: "Counting the Parts",
          text: "How many parts is the whole Square divided into? Click on the right option.",
          label: "Number of parts the whole is divided into",
          options: ["1", "2", "0"],
          correctAnswer: "2",
        },
        step_10_color_part: {
          title: "Coloring a Part",
          text: (params) =>
            `Now I have used <b style="color:${params.color};">${params.colorName}</b> to fill one part.`,
        },
        step_11_numerator: {
          title: "The Part We Want",
          text: (params) =>
            `Now, can you tell me how many parts of the whole are colored <b style="color:${params.color};">${params.colorName}</b>? This is the part we are interested in.`,
          label: "Number of parts we colored",
          options: ["1", "2", "0"],
          correctAnswer: "1",
        },
        step_11_success: {
          title: "Perfect!",
          text: "Click next to express each of these as a FRACTION.",
        },
        step_12_fraction_form: {
          title: "Making a Fraction",
          text: "Each representation here is a fraction – showing parts of the whole that we are interested in.",
        },
        step_13_final: {
          title: "You're a Fraction Pro!",
          text: (params) =>
            `Mathematically, fractions are represented this way! <b style="color:${params.numColor}">PART</b> of a <b style="color:${params.denColor}">WHOLE</b>`,
        },
        feedback_glue_fail: {
          title: "Oops!",
          text: "Please select one of the smaller squares to join. This rectangular piece has not been cut into two squares.",
        },
        fraction_intro: {
          text: "Writing fractions",
        },
      },
      // App-specific configuration
      gameConfig: {
        colors: [
          { name: "Yellow", value: "#ece13bff" },
          { name: "Red", value: "#ff684dff" },
          { name: "Pink", value: "#ff76d6ff" },
          { name: "Purple", value: "#9064f6ff" },
        ],
        paperColor: "rgb(57, 173, 255)", // Pink
        paperStroke: "#eb910bff",
      },
    },
  },
  id: {
    appTexts: {
      html_title: "Asyiknya Pecahan",
      main_title_text: "Asyiknya Pecahan",
      subtitle_text: "Ayo belajar dengan menggunting dan mewarnai!",
      character_images: {
        normal: "./assets/Cavy.png",
        thinking: "./assets/CavyThink.png",
        wrong: "./assets/CavySad.png",
        correct: "./assets/CavyHappy.png",
        speaking_head: "./assets/CavyHead.png",
      },
      item_images: {
        scissor: "./assets/Scissor2.png",
        glue_gun: "./assets/GlueGun.png",
        ftue_cursor: "./assets/Tap.png",
        paper_texture: "./assets/paper-texture.png",
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
        cut: "assets/sfx/swoosh.mp3",
        glue: "assets/sfx/glue.mp3",
        paint: "assets/sfx/paint.mp3",
      },
      button_texts: {
        prev: "Sebelumnya",
        next: "Lanjut",
        start_over: "Mulai Lagi",
        start: "Mulai!",
      },
      instructions: {
        step_0: {
          title: "Hai!",
          text: "Kita akan bermain dengan kertas, gunting dan warna untuk belajar tentang pecahan. Ayo belajar bagaimana sesuatu yang utuh menjadi beberapa bagian!",
        },
        step_1: {
          title: "Keseluruhan",
          text: "Ini adalah satu lembar kertas persegi yang utuh. Kita akan menggunakan ini untuk belajar tentang pecahan.",
        },
        step_2: {
          title: "Gunting Ajaib",
          text: "Gunting ini akan membuat 2 bagian yang sama besar saat kita menggunakannya.",
        },
        step_3_cut1: {
          title: "Ayo Menggunting!",
          text: "Ayo gunakan gunting! Pertama, klik gunting, lalu klik kertas untuk memotongnya menjadi 2 bagian yang sama besar.",
        },
        step_3_cut2: {
          title: "Kerja Bagus!",
          text: "Sekarang, ayo kita potong salah satu bagian ini lagi. Klik gunting, lalu klik salah satu persegi panjang untuk memotongnya lagi menjadi 2 bagian yang sama besar.",
        },
        step_3_glue_intro: {
          title: "Bagus sekali hasil guntingannya!",
          text: "Sekarang, ini ada lem tembak spesial. Kamu bisa menggunakannya untuk menempelkan potongan-potongan kembali.",
        },
        step_4_glue: {
          title: "Waktunya Mengelem!",
          text: "Klik lem tembak, lalu klik salah satu kotak kecil yang baru saja kamu buat untuk menyatukannya kembali.",
        },
        step_4_mcq: {
          title: "Kerja Bagus!",
          text: "Sekarang beri tahu aku, berapa banyak persegi panjang berwarna Biru yang kamu lihat?",
          options: ["1", "2", "0"],
          correctAnswer: "2",
        },
        step_4_success: {
          title: "Benar Sekali!",
          text: "Dua bagian yang sama besar telah digabungkan untuk membentuk seluruh persegi.",
        },
        step_5_palette_intro: {
          title: "Satu Alat Lagi!",
          text: "Waktunya mencoba satu alat lagi! Ini adalah palet warna. Dengan ini, kamu bisa mengubah warna bagian mana pun yang kamu suka. Ini membantu kita menunjukkan berbagai bagian dari keseluruhan!",
        },
        step_6_color: {
          title: "Ayo Mewarnai!",
          text: (params) =>
            `Kamu bisa klik salah satu warna lalu klik sebuah bentuk untuk mengubah warnanya. Coba warna <b>${params.colorName}</b>!`,
        },
        step_6_mcq: {
          title: "Bagus!",
          text: (params) =>
            `Berapa banyak bagian yang diwarnai <b>${params.colorName}</b>?`,
          options: ["1 dari 2 bagian", "2 dari 2 bagian", "1 dari 1 bagian"],
          correctAnswer: "1 dari 2 bagian",
        },
        step_6_success: {
          title: "Itu Benar!",
          text: "Satu bagian diwarnai dari dua bagian yang ada. Disinilah kita menggunakan Fraksi atau Pecahan. Pecahan menunjukkan bagian-bagian dari total keseluruhan.",
        },
        step_7_final_intro: {
          title: "Seluruh Lapangan",
          text: "Sekarang mari kita pahami cara merepresentasikan bagian dari keseluruhan. Yang kamu lihat di sini adalah satu persegi utuh.",
        },
        step_8_final_split: {
          title: "Membagi Keseluruhan",
          text: (params) =>
            `Sekarang aku telah menggunakan <img src="${params.scissorImg}" style="height:1.2em; vertical-align:middle;"> untuk membagi persegi.`,
        },
        step_9_denominator: {
          title: "Menghitung Bagian",
          text: "Menjadi berapa bagian persegi utuh tersebut dibagi? Klik pada pilihan yang benar.",
          label: "Jumlah bagian keseluruhan",
          options: ["1", "2", "0"],
          correctAnswer: "2",
        },
        step_10_color_part: {
          title: "Mewarnai Satu Bagian",
          text: (params) =>
            `Sekarang aku telah menggunakan warna <b style="color:${params.color};">${params.colorName}</b> untuk mengisi satu bagian`,
        },
        step_11_numerator: {
          title: "Bagian yang kita warnai",
          text: (params) =>
            `Sekarang, bisakah kalian beri tahu aku berapa banyak bagian dari keseluruhan yang diwarnai <b style="color:${params.color};">${params.colorName}</b>? Ini adalah bagian yang kalian warnai.`,
          label: "Jumlah bagian yang kalian warnai",
          options: ["1", "2", "0"],
          correctAnswer: "1",
        },
        step_11_success: {
          title: "Sempurna!",
          text: "Klik lanjut untuk menyatakan masing-masing ini sebagai PECAHAN.",
        },
        step_12_fraction_form: {
          title: "Membuat Pecahan",
          text: "Apa yang kalian lihat adalah sebuah pecahan, ini mewakili satu dari dua bagian yang sama.",
        },
        step_13_final: {
          title: "Kamu Jagoan Pecahan!",
          text: (params) =>
            `Secara matematis, pecahan direpresentasikan seperti ini! <b style="color:${params.numColor}">BAGIAN</b> dari <b style="color:${params.denColor}">KESELURUHAN</b>`,
        },
        feedback_glue_fail: {
          title: "Ups!",
          text: "Pilih salah satu kotak yang lebih kecil untuk digabungkan. Potongan persegi panjang ini belum dipotong menjadi dua kotak.",
        },
        fraction_intro: {
          text: "Menulis pecahan",
        },
      },
      // App-specific configuration
      gameConfig: {
        colors: [
          { name: "Kuning", value: "#ece13bff" },
          { name: "Merah", value: "#ff684d" },
          { name: "Merah muda", value: "#ff76d6" },
          { name: "Ungu", value: "#9064f6" },
        ],
        paperColor: "rgb(57, 173, 255)",
        paperStroke: "#eb910bff", // Orange
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
