const firstStageQuestionsEnglish = [
  {
    question: "",
    numbers: [82000, 64500],
    given: ["91,000 kg of rice", "57,500 kg remained"],
    givenFacts: [
      "Given:",
      "Total money Rudi had: 82,000",
      "Total money spent: 64,500",
    ],
    toFind: ["How much rice was distributed"],
    toFindFacts: ["To find:", "Money left with Rudi"],
  },
  {
    question:
      "A book stall had 84,500 books in stock. They sold 29,300 books during the fair. How many books were left?",
    numbers: [84500, 29300],
    given: ["84,500 books in stock", "sold 29,300 books"],
    givenFacts: ["Given:", "Books in stock: 84,500", "Books sold: 29,300"],
    toFind: ["How many books were left"],
    toFindFacts: ["To find:", "The number of books left"],
  },
];

const mcqDataEnglish = {
  ones_place: {
    question: "Which place do we subtract first?",
    options: ["Tens", "Hundreds", "Ones", "Thousands"],
    answer_index: 2,
    correct_feedback: "Absolutely correct! We go from right to left.",
    wrong_feedback: "No, that's not right. We go from right to left.",
  },
  ones_borrow: {
    question: "What should we do ?",
    options: [
      "Write 0 and move on",
      "Borrow from the tens place",
      "Subtract {{o1}} from {{o2}} instead",
    ],
    answer_index: 1,
    correct_feedback: "That's correct.",
    wrong_feedback: "That's not right. Try again.",
  },
  num_at_ones: {
    question:
      "After borrowing from the tens place, the number at ones place becomes:",
    options: ["{{oFinal}}", "{{oFinal_minus}}", "{{oFinal_plus}}"],
    answer_index: 0,
    correct_feedback: "Well done.",
    wrong_feedback: "That's not right. Try again.",
  },
  final_add_ones: {
    question: "{{oFinal}} - {{o2}} =",
    options: ["{{o3x}}", "{{o3x_plus}}", "10"],
    answer_index: 0,
    correct_feedback: "That's right.",
    wrong_feedback: "That's not right. Try again.",
  },
  tens_borrow: {
    question: "What should we do?",
    options: [
      "Borrow from the hundreds place",
      "Subtract {{t1}} from {{t2}}",
      "Ignore and move on",
    ],
    answer_index: 0,
    correct_feedback: "That's correct.",
    wrong_feedback: "That's not right. Try again.",
  },
  num_at_tens: {
    question:
      "After borrowing from the hundreds place, the number at tens place becomes:",
    options: ["{{tFinal_minus}}", "{{tFinal}}", "{{tFinal_plus}}"],
    answer_index: 1,
    correct_feedback: "Excellent!",
    wrong_feedback: "That's not right. Try again.",
  },
  final_add_tens: {
    question: "{{tFinal}} - {{t2}} =",
    options: ["{{t3x_plus}}", "10", "{{t3x}}"],
    answer_index: 2,
    correct_feedback: "That's right.",
    wrong_feedback: "That's not right. Try again.",
  },
  hundreds_borrow: {
    question: "What should we do?",
    options: [
      "Borrow from the thousands place",
      "Subtract {{h1}} from {{h2}}",
      "It's impossible",
    ],
    answer_index: 0,
    correct_feedback: "You got it!",
    wrong_feedback: "That's not right. Try again.",
  },
  num_at_hundreds: {
    question:
      "After borrowing from the thousands place, the number at hundreds place becomes:",
    options: ["{{hFinal}}", "{{hFinal_minus}}", "{{hFinal_plus}}"],
    answer_index: 0,
    correct_feedback: "Perfect!",
    wrong_feedback: "That's not right. Try again.",
  },
  final_add_hundreds: {
    question: "{{hFinal}} - {{h2}} =",
    options: ["{{h3x}}", "{{h3x_plus}}", "{{h3x_minus}}"],
    answer_index: 0,
    correct_feedback: "That's right.",
    wrong_feedback: "That's not right. Try again.",
  },
  thousands_borrow: {
    question: "What should we do?",
    options: [
      "Borrow from the ten thousands place",
      "Swap {{th1}} and {{th2}}",
      "Ignore and move on",
    ],
    answer_index: 0,
    correct_feedback: "Correct!",
    wrong_feedback: "That's not right. Try again.",
  },
  num_at_thousands: {
    question:
      "After borrowing from the ten thousands place, the number at thousands place becomes:",
    options: ["{{thFinal_plus}}", "{{thFinal}}", "{{thFinal_minus}}"],
    answer_index: 1,
    correct_feedback: "Amazing!",
    wrong_feedback: "That's not right. Try again.",
  },
  final_add_thousands: {
    question: "{{thFinal}} - {{th2}} =",
    options: ["{{th3x_minus}}", "{{th3x}}", "{{th3x_plus}}"],
    answer_index: 1,
    correct_feedback: "That's right.",
    wrong_feedback: "That's not right. Try again.",
  },
  final_add_ten_thousands: {
    question: "{{ttFinal}} - {{tt2}} =",
    options: ["{{tt3x}}", "{{tt3x_minus}}", "{{tt3x_plus}}"],
    answer_index: 0,
    correct_feedback: "That's right.",
    wrong_feedback: "That's not right. Try again.",
  },
};
const textPoolEnglish = {
  total_money_spent: "Total money spent",
  first_stage_1: "Read the word problem carefully. Click Next to continue.",
  first_stage_2:
    "Great! Let's identify the important information given in the problem.",
  first_stage_3: "Good job. Now, let's figure out what we need to find.",
  first_stage_4: "We need to subtract to find the money left.",
  mcqIn: "Click on the correct option.",
  start: "Let's solve this subtraction challenge. Click 'Next' to start.",
  split_number1:
    "Split the number into its place values. Tap on the first number.",
  split_number2:
    "Split the number into its place values. Tap on the second number.",
  after_split:
    "We have 5 places to subtract. Recall that we go from right to left.",
  ones_1: "Recall we subtract by place values. Let's subtract numbers in the ones column.",
  topLesser_one:
    "{{o1x}} is lesser than {{o2x}}. We can't subtract {{o2x}} from {{o1x}}.",
  split_ones: "Click {{t1}} to split it.",
  splitted_for_ones: "{{t1}} is split into {{tCorrect}} + 1.",
  enough_ones: "Now we have enough to subtract. Tap '-' button now.",
  subtracted_ones:
    "We have subtracted the ones. Click 'Next' to continue.",
  ones_mcq1: "We can't subtract {{o2x}} from {{o1x}}.",
  ones_mcq2: "We have {{o1}} at ones place and borrowed 1 from tens place.",
  tens_1: "Now let's subtract numbers in the tens column. Tap '-' button.",
  topLesser_ten:
    "{{tCorrect}} is lesser than {{t2x}}. We can't subtract {{t2x}} from {{tCorrect}}.",
  split_tens: "Click {{h1}} to split it.",
  splitted_for_tens: "{{h1}} is split into {{hCorrect}} + 1.",
  enough_tens: "Now we have enough to subtract. Tap '-' button now.",
  subtracted_tens:
    "We have subtracted the tens. Click 'Next' to continue.",
  tens_mcq1: "We can't subtract {{t2x}} from {{tCorrect}}.",
  tens_mcq2:
    "We have {{tCorrect}} at tens place and borrowed 1 from hundreds place.",
  hundreds_1: "Now let's subtract numbers in the hundreds column. Tap '-' button.",
  topLesser_hundred:
    "{{hCorrect}} is lesser than {{h2x}}. We can't subtract {{h2x}} from {{hCorrect}}.",
  split_hundreds: "Click {{th1}} to split it.",
  splitted_for_hundreds: "{{th1}} is split into {{thCorrect}} + 1.",
  enough_hundreds: "Now we have enough to subtract. Tap '-' button now.",
  subtracted_hundreds:
    "We have subtracted the hundreds. Click 'Next' to continue.",
  hundreds_mcq1: "We can't subtract {{h2x}} from {{hCorrect}}.",
  hundreds_mcq2:
    "We have {{hCorrect}} at hundreds place and borrowed 1 from thousands place.",
  thousands_1: "Now let's subtract numbers in the thousands column. Tap '-' button.",
  topLesser_thousand:
    "{{thCorrect}} is lesser than {{th2x}}. We can't subtract {{th2x}} from {{thCorrect}}.",
  split_thousands: "Click {{tt1}} to split it.",
  splitted_for_thousands: "{{tt1}} is split into {{ttCorrect}} + 1.",
  enough_thousands: "Now we have enough to subtract. Tap '-' button now.",
  subtracted_thousands:
    "We have subtracted the thousands. Click 'Next' to continue.",
  thousands_mcq1: "We can't subtract {{th2x}} from {{thCorrect}}.",
  thousands_mcq2:
    "We have {{thCorrect}} at thousands place and borrowed 1 from ten thousands place.",
  ten_thousands_1:
    "Finally, let's subtract numbers in the ten thousands column. Tap '-' button.",
  subtracted_ten_thousands:
    "We have subtracted the ten thousands. Click 'Next' to see the final answer.",
  final_summary:
    "Good work! You have completed the subtraction. The answer is {{answer}}.",
  conclude: "Rudi is left with Rp{{answer}}.",
  combine:
    "Now we need to compose the answer from results of all column subtractions. Tap on the highlighted part.",
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
const firstStageQuestionsIndonesian = [
  {
    question: "",
    numbers: [82000, 64500],
    given: ["91.000 kg beras", "tersisa 57.500 kg"],
    givenFacts: [
      "Diketahui:",
      "Jumlah uang Rudi: 82.000",
      "Jumlah uang yang dibelanjakan: 64.500",
    ],
    toFind: ["Berapa banyak beras yang dibagikan"],
    toFindFacts: ["Ditanya:", "Sisa uang Rudi"],
  },
  {
    question:
      "Sebuah kios buku memiliki stok 84.500 buku. Mereka menjual 29.300 buku selama pameran. Berapa banyak buku yang tersisa?",
    numbers: [84500, 29300],
    given: ["Stok 84.500 buku", "terjual 29.300 buku"],
    givenFacts: ["Diketahui:", "Stok buku: 84.500", "Buku terjual: 29.300"],
    toFind: ["Berapa banyak buku yang tersisa"],
    toFindFacts: ["Ditanya:", "Jumlah buku yang tersisa"],
  },
];
const mcqDataIndonesian = {
  ones_place: {
    question: "Nilai tempat mana yang kita kurangkan terlebih dahulu?",
    options: ["Puluhan", "Ratusan", "Satuan", "Ribuan"],
    answer_index: 2,
    correct_feedback: "Tepat sekali! Kita menghitung dari kanan ke kiri.",
    wrong_feedback:
      "Bukan, itu tidak benar. Kita menghitung dari kanan ke kiri.",
  },
  ones_borrow: {
    question: "Apa yang harus kita lakukan?",
    options: [
      "Tulis 0 dan lanjutkan",
      "Meminjam dari nilai tempat puluhan",
      "Kurangkan {{o1}} dari {{o2}} saja",
    ],
    answer_index: 1,
    correct_feedback: "Itu benar.",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  num_at_ones: {
    question:
      "Setelah meminjam dari nilai tempat puluhan, angka di nilai tempat satuan menjadi:",
    options: ["{{oFinal}}", "{{oFinal_minus}}", "{{oFinal_plus}}"],
    answer_index: 0,
    correct_feedback: "Bagus sekali.",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  final_add_ones: {
    question: "{{oFinal}} - {{o2}} =",
    options: ["{{o3x}}", "{{o3x_plus}}", "10"],
    answer_index: 0,
    correct_feedback: "Itu benar.",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  tens_borrow: {
    question: "Apa yang harus kita lakukan?",
    options: [
      "Meminjam dari nilai tempat ratusan",
      "Kurangkan {{t1}} dari {{t2}}",
      "Abaikan dan lanjutkan",
    ],
    answer_index: 0,
    correct_feedback: "Itu benar.",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  num_at_tens: {
    question:
      "Setelah meminjam dari nilai tempat ratusan, angka di nilai tempat puluhan menjadi:",
    options: ["{{tFinal_minus}}", "{{tFinal}}", "{{tFinal_plus}}"],
    answer_index: 1,
    correct_feedback: "Luar biasa!",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  final_add_tens: {
    question: "{{tFinal}} - {{t2}} =",
    options: ["{{t3x_plus}}", "10", "{{t3x}}"],
    answer_index: 2,
    correct_feedback: "Itu benar.",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  hundreds_borrow: {
    question: "Apa yang harus kita lakukan?",
    options: [
      "Meminjam dari nilai tempat ribuan",
      "Kurangkan {{h1}} dari {{h2}}",
      "Tidak mungkin",
    ],
    answer_index: 0,
    correct_feedback: "Kalian berhasil!",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  num_at_hundreds: {
    question:
      "Setelah meminjam dari nilai tempat ribuan, angka di nilai tempat ratusan menjadi:",
    options: ["{{hFinal}}", "{{hFinal_minus}}", "{{hFinal_plus}}"],
    answer_index: 0,
    correct_feedback: "Sempurna!",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  final_add_hundreds: {
    question: "{{hFinal}} - {{h2}} =",
    options: ["{{h3x}}", "{{h3x_plus}}", "{{h3x_minus}}"],
    answer_index: 0,
    correct_feedback: "Itu benar.",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  thousands_borrow: {
    question: "Apa yang harus kita lakukan?",
    options: [
      "Meminjam dari nilai tempat puluh ribuan",
      "Tukar {{th1}} dan {{th2}}",
      "Abaikan dan lanjutkan",
    ],
    answer_index: 0,
    correct_feedback: "Benar!",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  num_at_thousands: {
    question:
      "Setelah meminjam dari nilai tempat puluh ribuan, angka di nilai tempat ribuan menjadi:",
    options: ["{{thFinal_plus}}", "{{thFinal}}", "{{thFinal_minus}}"],
    answer_index: 1,
    correct_feedback: "Luar biasa!",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  final_add_thousands: {
    question: "{{thFinal}} - {{th2}} =",
    options: ["{{th3x_minus}}", "{{th3x}}", "{{th3x_plus}}"],
    answer_index: 1,
    correct_feedback: "Itu benar.",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
  final_add_ten_thousands: {
    question: "{{ttFinal}} - {{tt2}} =",
    options: ["{{tt3x}}", "{{tt3x_minus}}", "{{tt3x_plus}}"],
    answer_index: 0,
    correct_feedback: "Itu benar.",
    wrong_feedback: "Itu tidak benar. Coba lagi.",
  },
};

const textPoolIndonesian = {
  total_money_spent: "Jumlah uang yang dibelanjakan",
  first_stage_1:
    "Baca soal cerita dengan saksama. Ketuk Lanjut untuk meneruskan.",
  first_stage_2:
    "Bagus! Mari kita identifikasi informasi penting yang diberikan dalam soal.",
  first_stage_3:
    "Kerja bagus. Sekarang, mari kita cari tahu apa yang perlu kita temukan.",
  first_stage_4: "Kita perlu mengurangkan untuk menemukan sisa uang.",
  mcqIn: "Ketuk pada pilihan yang benar.",
  start:
    "Mari belajar pengurangan dengan meminjam. Ketuk 'Lanjut' untuk memulai.",
  split_number1:
    "Pisahkan bilangan menjadi nilai-nilai tempatnya. Ketuk bilangan pertama.",
  split_number2:
    "Pisahkan bilangan menjadi nilai-nilai tempatnya. Ketuk bilangan kedua.",
  after_split:
    "Ada 5 nilai tempat yang harus dikurangkan. Ingatlah bahwa kita menghitung dari kanan ke kiri.",
  ones_1:
    "Ingat kita mengurangkan berdasarkan nilai tempat. Mari kita kurangkan angka-angka di tempat satuan.",
  topLesser_one:
    "{{o1x}} lebih kecil dari {{o2x}}. Kita tidak bisa mengurangkan {{o2x}} dari {{o1x}}.",
  split_ones: "Ketuk {{t1}} untuk memisahkannya.",
  splitted_for_ones: "{{t1}} dipisahkan menjadi {{tCorrect}} + 1.",
  enough_ones:
    "Sekarang kita punya cukup untuk mengurangkan. Ketuk tombol '-' sekarang.",
  subtracted_ones:
    "Kita telah mengurangkan satuan. Ketuk 'Lanjut' untuk meneruskan.",
  ones_mcq1: "Kita tidak bisa mengurangkan {{o2x}} dari {{o1x}}.",
  ones_mcq2:
    "Kita punya {{o1}} di nilai tempat satuan dan meminjam 1 dari nilai tempat puluhan.",
  tens_1: "Sekarang, mari kita kurangkan angka-angka di tempat puluhan. Ketuk tombol '-'.",
  topLesser_ten:
    "{{tCorrect}} lebih kecil dari {{t2x}}. Kita tidak bisa mengurangkan {{t2x}} dari {{tCorrect}}.",
  split_tens: "Ketuk {{h1}} untuk memisahkannya.",
  splitted_for_tens: "{{h1}} dipisahkan menjadi {{hCorrect}} + 1.",
  enough_tens:
    "Sekarang kita punya cukup untuk mengurangkan. Ketuk tombol '-' sekarang.",
  subtracted_tens:
    "Kita telah mengurangkan puluhan. Ketuk 'Lanjut' untuk meneruskan.",
  tens_mcq1: "Kita tidak bisa mengurangkan {{t2x}} dari {{tCorrect}}.",
  tens_mcq2:
    "Kita punya {{tCorrect}} di nilai tempat puluhan dan meminjam 1 dari nilai tempat ratusan.",
  hundreds_1: "Sekarang, mari kita kurangkan angka-angka di tempat ratusan. Ketuk tombol '-'.",
  topLesser_hundred:
    "{{hCorrect}} lebih kecil dari {{h2x}}. Kita tidak bisa mengurangkan {{h2x}} dari {{hCorrect}}.",
  split_hundreds: "Ketuk {{th1}} untuk memisahkannya.",
  splitted_for_hundreds: "{{th1}} dipisahkan menjadi {{thCorrect}} + 1.",
  enough_hundreds:
    "Sekarang kita punya cukup untuk mengurangkan. Ketuk tombol '-' sekarang.",
  subtracted_hundreds:
    "Kita telah mengurangkan ratusan. Ketuk 'Lanjut' untuk meneruskan.",
  hundreds_mcq1: "Kita tidak bisa mengurangkan {{h2x}} dari {{hCorrect}}.",
  hundreds_mcq2:
    "Kita punya {{hCorrect}} di nilai tempat ratusan dan meminjam 1 dari nilai tempat ribuan.",
  thousands_1: "Sekarang, mari kita kurangkan angka-angka di tempat ribuan. Ketuk tombol '-'.",
  topLesser_thousand:
    "{{thCorrect}} lebih kecil dari {{th2x}}. Kita tidak bisa mengurangkan {{th2x}} dari {{thCorrect}}.",
  split_thousands: "Ketuk {{tt1}} untuk memisahkannya.",
  splitted_for_thousands: "{{tt1}} dipisahkan menjadi {{ttCorrect}} + 1.",
  enough_thousands:
    "Sekarang kita punya cukup untuk mengurangkan. Ketuk tombol '-' sekarang.",
  subtracted_thousands:
    "Kita telah mengurangkan ribuan. Ketuk 'Lanjut' untuk meneruskan.",
  thousands_mcq1: "Kita tidak bisa mengurangkan {{th2x}} dari {{thCorrect}}.",
  thousands_mcq2:
    "Kita punya {{thCorrect}} di nilai tempat ribuan dan meminjam 1 dari nilai tempat puluh ribuan.",
  ten_thousands_1:
    "Terakhir, mari kita kurangkan angka-angka di tempat puluh ribuan. Ketuk tombol '-'.",
  subtracted_ten_thousands:
    "Kita telah mengurangkan puluh ribuan. Ketuk 'Lanjut' untuk melihat jawaban akhir.",
  final_summary:
    "Kerja bagus! Kalian telah menyelesaikan pengurangan. Jawabannya adalah {{answer}}.",
  conclude: "Sisa uang Rudi adalah Rp17.500,00.",
  combine:
    "Sekarang kita perlu menyusun jawaban dari hasil pengurangan semua kolom. Ketuk bagian yang disorot.",
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
