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
        scissor: "./assets/Scissor2.png", // Scissor-2
        scissor_3: "./assets/Scissor3.png",
        scissor_5: "./assets/Scissor5.png",
        glue_gun: "./assets/GlueGun.png",
        ftue_cursor: "./assets/Tap.png",
        paper_texture: "./assets/paper.png",
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
        cut: "assets/sfx/cut.mp3",
        glue: "assets/sfx/glue.mp3",
        paint: "assets/sfx/paint.mp3",
      },
      button_texts: {
        prev: "Previous",
        next: "Next",
        start_over: "Start Over",
        start: "Start!",
        reset: "Reset",
      },
      instructions: {
        step_0_intro: {
          title: "Let's Begin!",
          text: "We used 2-Scissors to make <span class='vertical-fraction' data-numerator='1' data-denominator='2'></span>. Now, let’s use the same idea to explore more fractions.",
        },
        step_1_intro_s3: {
          title: "A New Tool",
          text: "Time for me to introduce the next scissors. It works exactly like the 2-scissors, but cuts into 3 equal parts!",
        },
        step_2_use_s3: {
          title: "Let's Cut!",
          text: "Time to use the scissors! Click on the 3-scissor first, then click the square to cut it into 3 equal parts.",
        },
        step_3_cut_again: {
          title: "Great Job!",
          text: "Now, let’s split one of these parts again. Click the 3-scissor, then click on any rectangle to cut it again into 3 equal parts.",
        },
        step_4_glue_intro: {
          title: "Great Cutting!",
          text: "Now, let’s put the same pieces back together. Click the glue gun, then click on the small pieces to join them.",
        },
        step_5_count_mcq: {
          title: "Awesome Work!",
          text: "Can you count how many rectangles are on the screen?",
          options: ["5", "2", "3"],
          correctAnswer: "3",
        },
        step_6_palette_intro: {
          title: "Time to Color",
          text: "Now it’s time to color any one of the three equal rectangles. Each one shows a part of the whole square!",
        },
        step_7_color_action: {
          title: "Pick a Color",
          text: (params) =>
            `Now, pick a color, then click on a part of the shape to fill it in. Try <b style="color:${params.colorValue};">${params.colorName}</b>!`,
        },
        step_8_color_mcq: {
          title: "Nice!",
          text: (params) =>
            `Now, can you count the <b style="color:${params.colorValue};">${params.colorName}</b> parts? Click to show your answer!`,
          options: ["1 out of 3 parts", "2 out of 3 parts", "1 out of 2 parts"],
          correctAnswer: "1 out of 3 parts",
        },
        step_9_mid_transition: {
          title: "You're Right!",
          text: (params) =>
            `Yes, you're right! One out of the three equal parts is <b style="color:${params.colorValue};">${params.colorName}</b>. Let’s discover the fraction that shows this!`,
        },
        step_10_final_intro: {
          title: "Whole Square",
          text: "Now let’s understand how to represent a part of the whole. The square is now split into three equal parts.",
        },
        step_11_denominator_3: {
          title: "Counting the Parts",
          text: "How many parts is the whole Square divided into? Click on the right option.",
          label: "Number of parts the whole is divided into",
          options: ["1", "2", "3"],
          correctAnswer: "3",
        },
        step_11_denominator_5: {
          label: "Number of parts the whole is divided into",
        },
        step_12_color_part_3: {
          title: "Coloring a Part",
          text: (params) =>
            `Now one part has been colored <b style="color:${params.colorValue};">${params.colorName}</b>.`,
        },
        step_13_numerator_3: {
          title: "The Part We Want",
          text: (params) =>
            `Now, can you tell me how many parts of the whole are colored <b style="color:${params.colorValue};">${params.colorName}</b>? This is the part we are interested in.`,
          label: "Number of parts we colored",
          options: ["1", "2", "3"],
          correctAnswer: "1",
        },
        step_13_numerator_5: {
          label: "Number of parts we colored",
        },
        step_14_perfect: {
          title: "Perfect!",
          text: "Click next to write this as a fraction.",
        },
        step_15_fraction_form_3: {
          title: "Making a Fraction",
          text: "What you see is a fraction - it represents one out of three equal parts.",
        },
        step_15_intro_s5: {
          title: "One More Challenge!",
          text: (params) =>
            `Now it’s time to use the <img src="${params.scissorImg}" style="height:2.5vw; vertical-align:middle; filter: hue-rotate(310deg) contrast(1.1);"> to divide the whole square into 5 equal parts. Remember to select the correct scissors!`,
        },
        step_15_cut_wrong: {
          title: "Oops!",
          text: (params) =>
            `You used the wrong scissors. This one gives us ${params.count} rectangles. Please click Reset and try again.`,
        },
        step_16_color_prompt: {
          title: "Great Cut!",
          text: "Now use the color-palette to color one of the new rectangles.",
        },
        step_17_final_display_5: {
          title: "Amazing!",
          text: "This is a fraction — showing one out of five equal parts. You're a fraction pro!",
        },
        feedback_glue_fail: {
          title: "Oops!",
          text: "Please select one of the smaller squares to join. This rectangular piece has not been cut into two squares",
        },
        fraction_intro: {
          text: "Writing fractions",
        },
      },
      gameConfig: {
        colors: [
          { name: "Yellow", value: "#ece13bff" },
          { name: "Red", value: "#ff684dff" },
          { name: "Pink", value: "#ff76d6ff" },
          { name: "Purple", value: "#9064f6ff" },
        ],
        paperColor: "#35a7ff",
        paperStroke: "#eb910bff",
      },
    },
  },
  // Indonesian (Bahasa Indonesia) Translations
  id: {
    appTexts: {
      html_title: "Bersenang-senang dengan Pecahan",
      main_title_text: "Bersenang-senang dengan Pecahan",
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
        scissor_3: "./assets/Scissor3.png",
        scissor_5: "./assets/Scissor5.png",
        glue_gun: "./assets/GlueGun.png",
        ftue_cursor: "./assets/Tap.png",
        paper_texture: "./assets/paper.png",
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
        cut: "assets/sfx/cut.mp3",
        glue: "assets/sfx/glue.mp3",
        paint: "assets/sfx/paint.mp3",
      },
      button_texts: {
        prev: "Sebelumnya",
        next: "Lanjut",
        start_over: "Mulai Lagi",
        start: "Mulai!",
        reset: "Atur Ulang",
      },
      instructions: {
        step_0_intro: {
          title: "Ayo Mulai!",
          text: "Mari belajar tentang Pecahan menggunakan alat-alat tulis seperti lem, kertas dan gunting!<br>Kita sudah menggunakan Gunting-2 untuk membuat <span class='vertical-fraction' data-numerator='1' data-denominator='2'></span>. Sekarang, mari kita gunakan ide yang sama untuk menjelajahi pecahan lainnya.",
        },
        step_1_intro_s3: {
          title: "Alat Baru",
          text: "Saatnya aku memperkenalkan gunting berikutnya. Cara kerjanya sama persis seperti Gunting-2, tetapi memotong menjadi 3 bagian yang sama!",
        },
        step_2_use_s3: {
          title: "Ayo Menggunting!",
          text: "Saatnya menggunakan gunting! Klik Gunting-3 terlebih dahulu, lalu klik kotak untuk memotongnya menjadi 3 bagian yang sama.",
        },
        step_3_cut_again: {
          title: "Kerja Bagus!",
          text: "Sekarang, ayo kita potong lagi salah satu bagian ini. Klik Gunting-3, lalu klik salah satu persegi panjang untuk memotongnya lagi menjadi 3 bagian yang sama.",
        },
        step_4_glue_intro: {
          title: "Guntingan yang Hebat!",
          text: "Sekarang, ayo kita satukan kembali potongan-potongan yang sama. Klik pistol lem, lalu klik potongan-potongan kecil untuk menyambungkannya.",
        },
        step_5_count_mcq: {
          title: "Luar Biasa!",
          text: "Bisakah kamu menghitung ada berapa persegi panjang di layar?",
          options: ["5", "2", "3"],
          correctAnswer: "3",
        },
        step_6_palette_intro: {
          title: "Waktunya Mewarnai",
          text: "Sekarang saatnya mewarnai salah satu dari tiga persegi panjang yang sama. Masing-masing menunjukkan satu bagian dari keseluruhan persegi!",
        },
        step_7_color_action: {
          title: "Pilih Warna",
          text: (params) =>
            `Sekarang, pilih sebuah warna, lalu klik pada salah satu bagian bentuk untuk mengisinya. Coba <b style="color:${params.colorValue};">${params.colorName}</b>!`,
        },
        step_8_color_mcq: {
          title: "Bagus!",
          text: (params) =>
            `Sekarang, bisakah kamu menghitung bagian yang berwarna <b style="color:${params.colorValue};">${params.colorName}</b>? Klik untuk menunjukkan jawabanmu!`,
          options: ["1 dari 3 bagian", "2 dari 3 bagian", "1 dari 2 bagian"],
          correctAnswer: "1 dari 3 bagian",
        },
        step_9_mid_transition: {
          title: "Kamu Benar!",
          text: (params) =>
            `Ya, kamu benar! Satu dari tiga bagian yang sama berwarna <b style="color:${params.colorValue};">${params.colorName}</b>. Ayo kita temukan pecahan yang menunjukkan ini!`,
        },
        step_10_final_intro: {
          title: "Seluruh Lapangan",
          text: "Sekarang mari kita pahami cara merepresentasikan bagian dari keseluruhan. Persegi ini sekarang dibagi menjadi tiga bagian yang sama.",
        },
        step_11_denominator_3: {
          title: "Menghitung Bagian",
          text: "Menjadi berapa bagian keseluruhan Persegi ini dibagi? Klik pada pilihan yang benar.",
          label: "Jumlah bagian keseluruhan",
          options: ["1", "2", "3"],
          correctAnswer: "3",
        },
        step_11_denominator_5: {
          label: "Jumlah bagian keseluruhan",
        },
        step_12_color_part_3: {
          title: "Mewarnai Bagian",
          text: (params) =>
            `Sekarang satu bagian telah diwarnai <b style="color:${params.colorValue};">${params.colorName}</b>.`,
        },
        step_13_numerator_3: {
          title: "Bagian yang kita warnai",
          text: (params) =>
            `Sekarang, bisakah kalian beri tahu aku berapa banyak bagian dari keseluruhan yang diwarnai <b style="color:${params.colorValue};">${params.colorName}</b>? Ini adalah bagian yang kalian warnai.`,
          label: "Jumlah bagian yang kalian warnai",
          options: ["1", "2", "3"],
          correctAnswer: "1",
        },
        step_13_numerator_5: {
          label: "Jumlah bagian yang kalian warnai",
        },
        step_14_perfect: {
          title: "Sempurna!",
          text: "Klik di sebelah untuk menuliskannya sebagai pecahan.",
        },
        step_15_fraction_form_3: {
          title: "Membuat Pecahan",
          text: "Apa yang kalian lihat adalah sebuah pecahan, ini mewakili satu dari tiga bagian yang sama.",
        },
        step_15_intro_s5: {
          title: "Satu Tantangan Lagi!",
          text: (params) =>
            `Sekarang saatnya menggunakan <img src="${params.scissorImg}" style="height:2.5vw; vertical-align:middle; filter: hue-rotate(310deg) contrast(1.1);"> untuk membagi seluruh persegi menjadi 5 bagian yang sama. Ingatlah untuk memilih gunting yang benar!`,
        },
        step_15_cut_wrong: {
          title: "Ups!",
          text: (params) =>
            `Kamu menggunakan gunting yang salah. Gunting ini menghasilkan ${params.count} persegi panjang. Silakan klik Atur Ulang dan coba lagi.`,
        },
        step_16_color_prompt: {
          title: "Potongan yang Bagus!",
          text: "Sekarang gunakan palet warna untuk mewarnai salah satu persegi panjang yang baru.",
        },
        step_17_final_display_5: {
          title: "Luar Biasa!",
          text: "Ini adalah pecahan — menunjukkan satu dari lima bagian yang sama. Kamu adalah seorang ahli pecahan!",
        },
        feedback_glue_fail: {
          title: "Ups!",
          text: "Pilih salah satu kotak yang lebih kecil untuk digabungkan. Bagian persegi panjang ini belum dipotong menjadi dua kotak",
        },
        fraction_intro: {
          text: "Menulis pecahan",
        },
      },
      gameConfig: {
        colors: [
          { name: "Kuning", value: "#ece13bff" },
          { name: "Merah", value: "#ff684dff" },
          { name: "Merah Muda", value: "#ff76d6ff" },
          { name: "Ungu", value: "#9064f6ff" },
        ],
        paperColor: "#35a7ff",
        paperStroke: "#eb910bff",
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