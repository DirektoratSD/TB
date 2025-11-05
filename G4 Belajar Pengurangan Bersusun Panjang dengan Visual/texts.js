const flag = "INDONESIAN";

const textsEnglish = {
  // NEW: Image paths for overlays
  images: {
    char_normal: "assets/Jax.png",
    char_excited: "assets/JaxHappy.png",
    char_thinking: "assets/JaxThink.png",
    set_num_1: "assets/set_num_1.png", // Example path, replace with your image
    set_num_2: "assets/set_num_2.png", // Example path, replace with your image
    set_num_1_phase2: "assets/set_num_1_phase2.png", // Replace with your image path
    set_num_2_phase2: "assets/set_num_2_phase2.png",
  },
  headings: {
    hundreds: "Hundreds",
    tens: "Tens",
    ones: "Ones",
    H: "H",
    T: "T",
    O: "O",
  },
  buttons: {
    set1: "Set First Number",
    set2: "Set Second Number",
    next: "Next",
    check: "Check",
    okay: "Okay",
    take_away_ones: "Take Away Ones",
    collect_ones: "Collect Remaining Ones",
    take_away_tens: "Take Away Tens",
    collect_tens: "Collect Remaining Tens",
    take_away_hundreds: "Take Away Hundreds",
    collect_hundreds: "Collect Remaining Hundreds",
    check_answer: "Next",
    borrow_from_ten: "Borrow from Tens",
    borrow_from_hundred: "Borrow from Hundreds",
    start_over: "Start Over",
  },
  instructions: {
    start: "Click on the button at the bottom of your screen to proceed.",
    set1: "Use the '+' and '-' buttons to set the first number.",
    set2: "Use the '+' and '-' buttons to set the second number.",
    set1_correct:
      "Great job! You set the first number correctly. Let's set the second one.",
    borrow_tens_needed:
      "We need to take away {{u2}} cubes, but we only have {{u1_current}} cubes.",
    borrow_hundreds_needed:
      "We need to take away {{t2}} bars, but we only have {{t1_current}} bars.",
    units1: "First, take away the ones.",
    tens1: "Now, take away the tens.",
    hundreds1: "Finally, take away the hundreds.",
    collect_ones: "Now, collect the remaining ones.",
    collect_tens: "Now, collect the remaining tens.",
    click_next: "Click 'Next' to proceed.",
    collect_hundreds: "Now, collect the remaining hundreds.",
    result: "Subtracting {{num2}} from {{num1}}, we get {{answer}}.",
    activity_complete: "Activity Complete!",
    start_over_prompt:
      "If you want to try it again, click on the “Start Over” button.",
    finished: "Congratulations! You have subtracted two numbers successfully.",
  },
};

const mcqObjectEnglish = {
  questions: [
    {
      question: "Which place do we subtract first?",
      options: ["Ones", "Tens", "Hundreds"],
      correctAnswer: 0,
    },
    {
      question: "After the ones place, which place do we subtract next?",
      options: ["Hundreds", "Tens", "Ones"],
      correctAnswer: 1,
    },
    {
      question: "After the tens place, which place do we subtract next?",
      options: ["Hundreds", "Ones", "Tens"],
      correctAnswer: 0,
    },
    {
      question: "We cannot take {{u2}} from {{u1}}. What should we do?",
      options: [
        "Subtract the smaller number from the larger one anyway.",
        "Borrow 1 ten from the tens place.",
        "Just skip the ones place.",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "We cannot take {{t2}} from {{t1_after_borrow_u}}. What should we do?",
      options: [
        "Borrow 1 hundred from the hundreds place.",
        "Borrow from the ones place.",
        "Do nothing.",
      ],
      correctAnswer: 0,
    },
    {
      question: "What should be the final value in the ONES place?",
      options: ["{{u3}}", "{{u1}}", "{{h1}}"],
      correctAnswer: 0,
    },
    {
      question: "What should be the final value in the TENS place?",
      options: ["{{t2_val}}", "{{t3_val}}", "{{h3_val}}"],
      correctAnswer: 1,
    },
    {
      question: "What should be the final value in the HUNDREDS place?",
      options: ["{{h1_val}}", "{{h2_val}}", "{{h3_val}}"],
      correctAnswer: 2,
    },
    {
      question: "{{u1_current}} - {{u2}} = ?",
      options: [],
      correctAnswer: 0,
      dynamic: true,
      answerKey: "u3",
    },
    {
      question: "{{t1_current_val}} - {{t2_val}} = ?",
      options: [],
      correctAnswer: 0,
      dynamic: true,
      answerKey: "t3",
    },
    {
      question: "{{h1_current_val}} - {{h2_val}} = ?",
      options: [],
      correctAnswer: 0,
      dynamic: true,
      answerKey: "h3",
    },
  ],
  currentQuestionIndex: 0,
};

// --- Indonesian Translations ---

const textsIndonesian = {
  images: { ...textsEnglish.images }, // Keep same image paths
  headings: {
    hundreds: "Ratusan",
    tens: "Puluhan",
    ones: "Satuan",
    H: "R",
    T: "P",
    O: "S",
  },
  buttons: {
    set1: "Atur Bilangan Pertama",
    set2: "Atur Bilangan Kedua",
    next: "Lanjut",
    check: "Periksa",
    okay: "Oke",
    take_away_ones: "Ambil Satuan",
    collect_ones: "Kumpulkan Sisa Satuan",
    take_away_tens: "Ambil Puluhan",
    collect_tens: "Kumpulkan Sisa Puluhan",
    take_away_hundreds: "Ambil Ratusan",
    collect_hundreds: "Kumpulkan Sisa Ratusan",
    check_answer: "Lanjut",
    borrow_from_ten: "Pinjam dari Puluhan",
    borrow_from_hundred: "Pinjam dari Ratusan",
    start_over: "Ulangi Lagi",
  },
  instructions: {
    start: "Klik tombol di bagian bawah layar Anda untuk melanjutkan.",
    set1: "Gunakan tombol '+' dan '-' untuk mengatur nilai tempat bilangan pertama.",
    set2: "Gunakan tombol '+' dan '-' untuk mengatur bilangan kedua.",
    set1_correct:
      "Bagus! Kalian berhasil mengatur nilai tempat bilangan pertama. Sekarang, atur bilangan kedua.",
    borrow_tens_needed:
      "Kalian perlu mengurangi {{u2}} kotak, tapi kalian hanya punya {{u1_current}} kotak.",
    borrow_hundreds_needed:
      "Kita tidak bisa mengurangi {{t2}} dari {{t1_current}}. Apa yang harus kita lakukan?",
    units1: "Pertama, ambil satuan yang diperlukan untuk pengurangan.",
    tens1: "Sekarang, ambil puluhan yang diperlukan untuk pengurangan.",
    hundreds1: "Terakhir, ambil ratusan.",
    collect_ones: "Sekarang, kumpulkan sisa satuan.",
    collect_tens: "Sekarang, kumpulkan sisa puluhan.",
    collect_hundreds: "Sekarang, kumpulkan sisa ratusan.",
    click_next: "Klik ‘Lanjut’ untuk melanjutkan.",
    result: "Hasil pengurangan {{num1}} oleh {{num2}} adalah {{answer}}.",
    activity_complete: "Aktivitas Selesai!",
    start_over_prompt:
      "Jika kalian ingin mencoba lagi, ketuk tombol 'Ulangi lagi'",
    finished: "Selamat! Kalian telah berhasil mengurangkan dua bilangan.",
  },
};

const mcqObjectIndonesian = {
  questions: [
    {
      question: "Tempat mana yang kita kurangi terlebih dahulu?",
      options: ["Satuan", "Puluhan", "Ratusan"],
      correctAnswer: 0,
    },
    {
      question: "Setelah tempat satuan, tempat mana yang kita kurangi selanjutnya?",
      options: ["Ratusan", "Puluhan", "Satuan"],
      correctAnswer: 1,
    },
    {
      question: "Setelah tempat puluhan, tempat mana yang kita kurangi selanjutnya?",
      options: ["Ratusan", "Satuan", "Puluhan"],
      correctAnswer: 0,
    },
    {
      question:
        "Kita tidak bisa mengurangi {{u2}} dari {{u1}}. Apa yang harus kita lakukan?",
      options: [
        "Tetap kurangi bilangan yang lebih kecil dari yang lebih besar.",
        "Pinjam 1 puluhan dari tempat puluhan.",
        "Lewati saja tempat satuan.",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Kita tidak bisa mengurangi {{t2}} dari {{t1_after_borrow_u}}. Apa yang harus kita lakukan?",
      options: [
        "Pinjam 1 ratusan dari tempat ratusan.",
        "Pinjam dari tempat satuan.",
        "Tidak melakukan apa-apa.",
      ],
      correctAnswer: 0,
    },
    {
      question: "Berapakah nilai akhir di tempat SATUAN?",
      options: ["{{u3}}", "{{u1}}", "{{h1}}"],
      correctAnswer: 0,
    },
    {
      question: "Berapakah nilai akhir di tempat PULUHAN?",
      options: ["{{t2_val}}", "{{t3_val}}", "{{h3_val}}"],
      correctAnswer: 1,
    },
    {
      question: "Berapakah nilai akhir di tempat RATUSAN?",
      options: ["{{h1_val}}", "{{h2_val}}", "{{h3_val}}"],
      correctAnswer: 2,
    },
    {
      question: "{{u1_current}} - {{u2}} = ?",
      options: [],
      correctAnswer: 0,
      dynamic: true,
      answerKey: "u3",
    },
    {
      question: "{{t1_current_val}} - {{t2_val}} = ?",
      options: [],
      correctAnswer: 0,
      dynamic: true,
      answerKey: "t3",
    },
    {
      question: "{{h1_current_val}} - {{h2_val}} = ?",
      options: [],
      correctAnswer: 0,
      dynamic: true,
      answerKey: "h3",
    },
  ],
  currentQuestionIndex: 0,
};

// --- Language Selection ---
const texts = flag === "ENGLISH" ? textsEnglish : textsIndonesian;
const mcqObject = flag === "ENGLISH" ? mcqObjectEnglish : mcqObjectIndonesian;