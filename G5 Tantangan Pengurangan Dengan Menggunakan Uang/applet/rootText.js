const firstStageQuestionsEnglish = [
  {
    question:
      "Rudi has Rp82,000. He buys a toy robot for Rp45,600 and a spinning top for Rp18,900. How much money is left with Rudi?",
    numbers: [45600, 18900],
    given: [
      "Rudi has Rp82,000",
      "toy robot for Rp45,600",
      "spinning top for Rp18,900",
    ],
    givenFacts: [
      "Given:",
      "Total money Rudi has: Rp82,000",
      "Cost of the toy robot: Rp45,600",
      "Cost of the spinning top: Rp18,900",
    ],
    toFind: ["How much money is left"],
    toFindFacts: ["To find:", "Money left with Rudi"],
    total: "82000",
    total_money_spent: "Total money spent",
  },
];
const dndDataEnglish = {
  mainTitle: "Money Left",
  cards: {
    moneyAtStart: "Money at Start",
    toyRobotCost: "Toy Robot Cost",
    spinningTopCost: "Spinning Top Cost",
  },
  combinedTitle: "Total money spent",
  values: {
    "money-at-start": 82000,
    "toy-robot-cost": 45600,
    "spinning-top-cost": 18900,
  },
};

const mcqDataEnglish = {
  add_or_subtract: {
    question: "Do you have to add or subtract to solve the question?",
    options: ["Add", "Subtract"],
    answer_index: 0,
  },
  ones_place: {
    question: "Which place do we add first?",
    options: ["Tens", "Hundreds", "Ones", "Thousands"],
    answer_index: 2,
    correct_feedback: "Absolutely correct! We go from right to left.",
    wrong_feedback:
      "Not quite. Remember, we always start from the rightmost place.",
  },
  add_ones: {
    question: "{{o1x}} + {{o2x}} =",
    options: ["10", "{{osumx_plus}}", "{{osumx}}"],
    answer_index: 2,
    correct_feedback: "Great job!",
    wrong_feedback: "Not quite. Give it another try.",
  },
  add_tens: {
    question: "{{t1x}} + {{t2x}} {{oOverflowStr}} =",
    options: ["{{tsumx_plus}}", "{{tsumx}}", "10"],
    answer_index: 1,
    correct_feedback: "Well done!",
    wrong_feedback: "Oops, that's not it. Let's try again.",
  },
  add_hundreds: {
    question: "{{h1x}} + {{h2x}} {{tOverflowStr}} =",
    options: ["{{hsumx_minus}}", "{{hsumx_plus}}", "{{hsumx}}"],
    answer_index: 2,
    correct_feedback: "Perfect!",
    wrong_feedback: "Incorrect. Have another go.",
  },
  add_thousands: {
    question: "{{th1x}} + {{th2x}} {{hOverflowStr}} =",
    options: ["{{thsumx_minus}}", "{{thsumx_plus}}", "{{thsumx}}"],
    answer_index: 2,
    correct_feedback: "Excellent!",
    wrong_feedback: "Not quite. Give it another try.",
  },
  add_ten_thousands: {
    question: "{{tt1x}} + {{tt2x}} {{thOverflowStr}} =",
    options: ["{{ttsumx}}", "{{ttsumx_plus}}", "{{ttsumx_minus}}"],
    answer_index: 0,
    correct_feedback: "You got it!",
    wrong_feedback: "Oops, that's not it. Let's try again.",
  },
  ones_split: {
    question:
      "We can't have {{osumx}} in the units place.<br> Which digit should we carry forward??",
    options: ["1", "{{o3}}", "{{osum}}"],
    answer_index: 0,
    correct_feedback: "Correct!",
    wrong_feedback: "That's not the one to carry. Try again.",
  },
  tens_split: {
    question:
      "We can't have {{tsumx}} in the tens place.<br> Which digit should we carry forward??",
    options: ["1", "{{t3}}", "{{tsum}}"],
    answer_index: 0,
    correct_feedback: "Great job!",
    wrong_feedback: "That's not the one to carry. Try again.",
  },
  hundreds_split: {
    question:
      "We can't have {{hsumx}} in the hundreds place.<br> Which digit should we carry forward??",
    options: ["1", "{{h3}}", "{{hsum}}"],
    answer_index: 0,
    correct_feedback: "Well done!",
    wrong_feedback: "That's not the one to carry. Try again.",
  },
  thousands_split: {
    question:
      "We can't have {{thsumx}} in the thousands place.<br> Which digit should we carry forward??",
    options: ["1", "{{th3}}", "{{thsum}}"],
    answer_index: 0,
    correct_feedback: "Perfect!",
    wrong_feedback: "That's not the one to carry. Try again.",
  },
};

const textPoolEnglish = {
  drag_the_cards: "Drag the cards to the correct position.",
  total_money_spent: "Total money spent",
  afterdnd: "Great! Now let's first calculate the total money spent.",
  first_stage_1: "Read the word problem carefully. Click Next to continue.",
  first_stage_2:
    "Great! Let's identify the important information given in the problem.",
  first_stage_3: "This is what we need to calculate.",
  first_stage_4:
    "We need to <span class='em'>add</span> to find the total money spent.",
  mcqIn: "Click on the correct option.",
  start: "We have an addition challenge. Let's solve it.",
  split_number1:
    "Split the number into its place values. Tap on the first number.",
  split_number2:
    "Split the number into its place values. Tap on the second number.",
  after_split: "We have 5 places to add. Click on 'Next' to add ones place.",
  ones_1: "Let's add the numbers in the ones column. Tap on the '+' button.",
  ones_carryover:
    "Oh! We have more than 9 in ones place. We need to do a carry over.",
  ones_carryover2:
    "Great! we have split {{osumx}} correctly. Tap to carry over.",
  ones_complete:
    "We have completed adding ones. Let's add the numbers in the tens column now.",
  tens_1: "To add the numbers in the tens column, tap on the '+' button.",
  tens_carryover:
    "Oh! we have more than 9 in the tens place. We need to do a carry over.",
  tens_carryover2:
    "Great! We have split {{tsumx}} correctly. Tap to carry over.",
  tens_complete:
    "We have completed adding tens. Let's add the numbers in the hundreds column now.",
  hundreds_1:
    "To add the numbers in the hundreds column, tap on the '+' button.",
  hundreds_carryover:
    "Uh oh! We have more than 9 in the hundreds place. Time to do a carry over.",
  hundreds_carryover2:
    "You have split {{hsumx}} correctly. Tap to carry over.",
  hundreds_complete:
    "We have completed adding hundreds. Let's move to the thousands column now.",
  thousands_1:
    "To add the numbers in the thousands column, tap on the '+' button.",
  thousands_carryover:
    "Uh oh! We have more than 9 in the thousands place. Let's do a carry over.",
  thousands_carryover2: "Perfect Split. Tap to carry over.",
  thousands_complete:
    "We have completed adding the thousands. Let's move to the last column now.",
  ten_thousands_1:
    "Finally, let's add the numbers in the ten thousands column. Tap on the '+' button.",
  ten_thousands_complete:
    "We have completed adding the numbers in all the columns.",
  final_summary:
    "You have completed the addition. Total money spent is Rp64,500.",
  move_to_subtraction:
    "Rudi spent Rp64,500. Let's now move to subtraction to find how much money is left with Rudi.",
  combine:
    "Now we need to compose the answer from results of all column additions. Tap on the highlighted part.",
  mcq_one:
    "{{osumx}} > 9,<br>We need to split {{osumx}} to do a carry over of extra 10s to the tens place. ",
  mcq_ten:
    "{{tsumx}} > 9,<br>We need to split {{tsumx}} to do a carry over of extra 100s to the hundreds place. ",
  mcq_hundred:
    "{{hsumx}} > 9,<br>We need to split {{hsumx}} to do a carry over of extra 1000s to the thousands place. ",
  mcq_thousand:
    "{{thsumx}} > 9,<br>We need to split {{thsumx}} to do a carry over of extra 10000s to the ten thousands place. ",
};

const headerArrayEnglish = ["TTh", "Th", "H", "T", "O"];

const buttonTextsEnglish = {
  next: "Next",
  start_over: "Start Over",
  carry_over: "Carry Over",
  try_new: "Try New",
};

const overlayDataEnglish = {
  heading: "Activity Complete!",
  paragraph: `If you want to try again, click on the <br> 'Start Over' button. `,
};

// --- INDONESIAN ---
// NOTE: Indonesian translations for the new first stage are placeholders.
// You can replace them with accurate translations.

const firstStageQuestionsIndonesian = [
  {
    question:
      "Rudi mempunyai uang Rp82.000,00. Ia membeli sebuah robot mainan seharga Rp45.600,00 dan sebuah gasing seharga Rp18.900,00. Berapa sisa uang Rudi?",
    numbers: [45600, 18900],
    given: [
      "Rudi mempunyai uang Rp82.000,00",
      "robot mainan seharga Rp45.600,00",
      "gasing seharga Rp18.900,00",
    ],
    givenFacts: [
      "Diketahui:",
      "Jumlah uang Rudi: Rp82.000,00",
      "Harga robot mainan: Rp45.600,00",
      "Harga gasing: Rp18.900,00",
    ],
    toFind: ["Berapa sisa uang"],
    toFindFacts: ["Ditanya:", "Sisa uang Rudi"],
    total: "82000",
    total_money_spent: "Jumlah uang yang dibelanjakan",
  },
];

const dndDataIndonesian = {
  mainTitle: "Sisa Uang",
  cards: {
    moneyAtStart: "Uang Awal",
    toyRobotCost: "Harga Robot Mainan",
    spinningTopCost: "Harga Gasing",
  },
  combinedTitle: "Jumlah uang yang dibelanjakan",
  values: {
    "money-at-start": 82000,
    "toy-robot-cost": 45600,
    "spinning-top-cost": 18900,
  },
};

const mcqDataIndonesian = {
  add_or_subtract: {
    question:
      "Apakah kamu harus menjumlahkan atau mengurangkan untuk menyelesaikan soal ini?",
    options: ["Menjumlahkan", "Mengurangkan"],
    answer_index: 0,
  },
  ones_place: {
    question: "Nilai tempat manakah yang kita jumlahkan terlebih dahulu?",
    options: ["Puluhan", "Ratusan", "Satuan", "Ribuan"],
    answer_index: 2,
    correct_feedback: "Tepat sekali! Kita menghitung dari kanan ke kiri.",
    wrong_feedback:
      "Kurang tepat. Ingat, kita selalu mulai dari nilai tempat paling kanan.",
  },
  add_ones: {
    question: "{{o1x}} + {{o2x}} =",
    options: ["10", "{{osumx_plus}}", "{{osumx}}"],
    answer_index: 2,
    correct_feedback: "Kerja bagus!",
    wrong_feedback: "Kurang tepat. Coba lagi.",
  },
  add_tens: {
    question: "{{t1x}} + {{t2x}} {{oOverflowStr}} =",
    options: ["{{tsumx_plus}}", "{{tsumx}}", "10"],
    answer_index: 1,
    correct_feedback: "Bagus sekali!",
    wrong_feedback: "Ups, bukan itu. Mari coba lagi.",
  },
  add_hundreds: {
    question: "{{h1x}} + {{h2x}} {{tOverflowStr}} =",
    options: ["{{hsumx_minus}}", "{{hsumx_plus}}", "{{hsumx}}"],
    answer_index: 2,
    correct_feedback: "Sempurna!",
    wrong_feedback: "Salah. Coba lagi.",
  },
  add_thousands: {
    question: "{{th1x}} + {{th2x}} {{hOverflowStr}} =",
    options: ["{{thsumx_minus}}", "{{thsumx_plus}}", "{{thsumx}}"],
    answer_index: 2,
    correct_feedback: "Luar biasa!",
    wrong_feedback: "Kurang tepat. Coba lagi.",
  },
  add_ten_thousands: {
    question: "{{tt1x}} + {{tt2x}} {{thOverflowStr}} =",
    options: ["{{ttsumx}}", "{{ttsumx_plus}}", "{{ttsumx_minus}}"],
    answer_index: 0,
    correct_feedback: "Kalian berhasil!",
    wrong_feedback: "Ups, bukan itu. Mari coba lagi.",
  },
  ones_split: {
    question:
      "Kita tidak bisa memiliki {{osumx}} di tempat satuan.<br> Angka mana yang harus kita simpan??",
    options: ["1", "{{o3}}", "{{osum}}"],
    answer_index: 0,
    correct_feedback: "Benar!",
    wrong_feedback: "Bukan itu yang harus disimpan. Coba lagi.",
  },
  tens_split: {
    question:
      "Kita tidak bisa memiliki {{tsumx}} di tempat puluhan.<br> Angka mana yang harus kita simpan??",
    options: ["1", "{{t3}}", "{{tsum}}"],
    answer_index: 0,
    correct_feedback: "Kerja bagus!",
    wrong_feedback: "Bukan itu yang harus disimpan. Coba lagi.",
  },
  hundreds_split: {
    question:
      "Kita tidak bisa memiliki {{hsumx}} di tempat ratusan.<br> Angka mana yang harus kita simpan??",
    options: ["1", "{{h3}}", "{{hsum}}"],
    answer_index: 0,
    correct_feedback: "Bagus sekali!",
    wrong_feedback: "Bukan itu yang harus disimpan. Coba lagi.",
  },
  thousands_split: {
    question:
      "Kita tidak bisa memiliki {{thsumx}} di tempat ribuan.<br> Angka mana yang harus kita simpan??",
    options: ["1", "{{th3}}", "{{thsum}}"],
    answer_index: 0,
    correct_feedback: "Sempurna!",
    wrong_feedback: "Bukan itu yang harus disimpan. Coba lagi.",
  },
};

const textPoolIndonesian = {
  drag_the_cards: "Geser kertas ke tempat yang tepat",
  total_money_spent: "Jumlah uang yang dibelanjakan",
  afterdnd:
    "Bagus! Sekarang, mari kita hitung dulu jumlah uang yang dibelanjakan.",
  answer_of_question: `<span>Jawaban: Jumlah total buku yang diterima: {{answer}} </span>`,
  first_stage_1:
    "Baca soal cerita dengan saksama. Ketuk Lanjut untuk meneruskan.",
  first_stage_2:
    "Bagus! Mari kita identifikasi informasi penting yang diberikan dalam soal.",
  first_stage_3: "Inilah yang perlu kita hitung.",
  first_stage_4:
    "Kita perlu <span class='em'>menjumlahkan</span> untuk menemukan total uang yang dibelanjakan.",
  mcqIn: "Ketuk pada pilihan yang benar.",
  start: "Kita punya tantangan penjumlahan. Ayo kita selesaikan.",
  split_number1:
    "Pisahkan bilangan menjadi nilai-nilai tempatnya. Ketuk bilangan pertama.",
  split_number2:
    "Pisahkan bilangan menjadi nilai-nilai tempatnya. Ketuk bilangan kedua.",
  after_split:
    "Ada 5 nilai tempat yang harus dijumlahkan. Ketuk 'Lanjut' untuk menjumlahkan nilai tempat satuan.",
  ones_1: "Mari jumlahkan angka-angka di kolom satuan. Ketuk tombol '+'.",
  ones_carryover:
    "Oh! Hasil di tempat satuan lebih dari 9. Kita perlu melakukan simpanan.",
  ones_carryover2:
    "Bagus! Kalian telah memisahkan {{osumx}} dengan benar. Ketuk 'Simpan'.",
  ones_complete:
    "Kita sudah selesai menjumlahkan satuan. Sekarang, mari jumlahkan angka-angka di kolom puluhan.",
  tens_1: "Untuk menjumlahkan angka-angka di kolom puluhan, ketuk tombol '+'.",
  tens_carryover:
    "Oh! Hasil di tempat puluhan lebih dari 9. Kita perlu melakukan simpanan.",
  tens_carryover2:
    "Bagus! Kalian telah memisahkan {{tsumx}} dengan benar. Ketuk 'Lanjut' untuk menyimpan.",
  tens_complete:
    "Kita sudah selesai menjumlahkan puluhan. Sekarang, mari jumlahkan angka-angka di kolom ratusan.",
  hundreds_1:
    "Untuk menjumlahkan angka-angka di kolom ratusan, ketuk tombol '+'.",
  hundreds_carryover:
    "Uh oh! Hasil di tempat ratusan lebih dari 9. Saatnya melakukan simpanan.",
  hundreds_carryover2:
    "Kalian telah memisahkan {{hsumx}} dengan benar. Ketuk 'Lanjut' untuk meneruskan.",
  hundreds_complete:
    "Kita sudah selesai menjumlahkan ratusan. Sekarang, mari kita pindah ke kolom ribuan.",
  thousands_1:
    "Untuk menjumlahkan angka-angka di kolom ribuan, ketuk tombol '+'.",
  thousands_carryover:
    "Uh oh! Hasil di tempat ribuan lebih dari 9. Mari kita lakukan simpanan.",
  thousands_carryover2:
    "Pemisahan yang sempurna. Ketuk 'Lanjut' untuk menyimpan.",
  thousands_complete:
    "Kita sudah selesai menjumlahkan ribuan. Sekarang, mari kita pindah ke kolom terakhir.",
  ten_thousands_1:
    "Terakhir, mari jumlahkan angka-angka di kolom puluh ribuan. Ketuk tombol '+'.",
  ten_thousands_complete:
    "Kita telah selesai menjumlahkan angka-angka di semua kolom.",
  final_summary:
    "Kalian telah menyelesaikan penjumlahan. Jumlah uang yang dibelanjakan adalah Rp64.500,00.",
  move_to_subtraction:
    "Rudi membelanjakan Rp64.500,00. Sekarang, mari kita lakukan pengurangan untuk mencari tahu sisa uang Rudi.",
  combine:
    "Sekarang kita perlu menyusun jawaban dari hasil penjumlahan semua kolom. Ketuk bagian yang disorot.",
  mcq_one:
    "{{osumx}} > 9,<br>Kita perlu memisahkan {{osumx}} untuk menyimpan kelebihan 10-an ke tempat puluhan. ",
  mcq_ten:
    "{{tsumx}} > 9,<br>Kita perlu memisahkan {{tsumx}} untuk menyimpan kelebihan 100-an ke tempat ratusan. ",
  mcq_hundred:
    "{{hsumx}} > 9,<br>Kita perlu memisahkan {{hsumx}} untuk menyimpan kelebihan 1000-an ke tempat ribuan. ",
  mcq_thousand:
    "{{thsumx}} > 9,<br>Kita perlu memisahkan {{thsumx}} untuk menyimpan kelebihan 10000-an ke tempat puluh ribuan. ",
};

const headerArrayIndonesian = ["PRi", "Ri", "R", "P", "S"];

const buttonTextsIndonesian = {
  next: "Berikutnya",
  start_over: "Mulai Lagi",
  carry_over: "Simpan",
  try_new: "Coba yang Baru",
};

const overlayDataIndonesian = {
  heading: "Aktivitas Selesai!",
  paragraph: `Jika kamu ingin mencoba lagi, klik tombol 'Mulai Lagi'.`,
};
