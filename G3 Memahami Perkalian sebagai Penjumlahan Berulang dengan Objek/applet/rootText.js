const questionsEnglish = [
  {
    col: 2,
    row: 6,
    item: "cup",
    item_plural: "cups",
    group_name: "tray",
    group_name_plural: "trays",
  },
  {
    col: 3,
    row: 4,
    item: "dumpling",
    item_plural: "dumplings",
    group_name: "bowl",
    group_name_plural: "bowls",
  },
];
const leftInstructionsEnglish = {
  shortData: {
    leftBadge: `<div class="top-badge">Repeated Addition</div>`,
    rightBadge: `<div class="top-badge">Multiplication</div>`,
  },
  question:
    "How many {{item_plural}} will be in {{row_count}} {{group_name_plural}} like in the image shown?",
  h1Text:
    "What is the result of {{col_count}} taken {{row_count}} times?<br><br>{{repeated_addition_string}} = ?",
  cornerText: "{{row_count}} times",
  start:
    "Let's see how we can visualize multiplication. Click on 'Start' and get ready to see how many {{item_plural}} will be there in {{row_count}} {{group_name_plural}} like in the image shown.",
  set_horizontal:
    "First, how many {{item_plural}} will be in 1 {{group_name}}?<br><br> Use the slider at the bottom and tap the button to set the count of {{item_plural}} in one {{group_name}}.",
  wrong_feedback_x:
    "Oops… that is not the count of {{item_plural}} in the image shown to us in the question… Try again…<br><br>Use the slider and tap the button to set the count of {{item_plural}} in 1 tray…",
  wrong_feedback_y:
    "Oops… that is not the count of {{group_name_plural}}. Try again…<br><br>Use the slider and tap the button to set the count of {{group_name_plural}}.",
  set_vertical:
    "Good job!<br> Now, as per the question, how many {{group_name_plural}} do we need?<br><br>Use the slider on the right and tap the button to set the count of {{group_name_plural}}.",
  complete_setting:
    "Good Job!<br>What we see here is a count of {{ans}} {{item_plural}} in {{row_count}} {{group_name_plural}}.<br>Let’s understand this better… Tap Next…",
  before_question:
    "What we see here is the multiplication grid.<br><br> Tap 'Next' to explore this further.",
  column_question:
    "How many columns are here in this multiplication grid? Tap the correct answer.",
  row_question:
    "{{col_count}} Columns! Good Job! How many rows are here in this multiplication grid? Tap the correct answer.",
  completed_questions:
    "{{col_count}} columns in {{row_count}} rows! Well done. <br><br>Let’s visualize this multiplication.<br><br>Tap 'Next'.",
  animation_1:
    "Each row is increasing by {{col_count}}… <br>{{row_count}} rows of {{col_count}}…",
  animation_end:
    "Each row is increasing by {{col_count}}… <br>{{row_count}} rows of {{col_count}}…That’s {{row_count}} × {{col_count}} = {{ans}}.<br> Tap Replay at the left, or Next at the right…",
  completion:
    "{{row_count}} rows of {{col_count}} is {{ans}}, <br>or {{row_count}} × {{col_count}} = {{ans}}, the top right number in the grid!<br> That was fun and easy! Activity completed! Tap 'Summary'.",
  bottom_text: `{{row_count}} groups of {{col_count}} ... <br><span class="yellow-highlight">{{repeated_addition_string}}</span> = <span class="yellow-highlight">{{row_count}} × {{col_count}}</span> = <span class="yellow-highlight">{{ans}}</span>`,
  summary: `<span class="yellow-highlight">Multiplication</span> is repeated addition.<br><br>It can be thought of as counting in a simple grid:<br> <span class="yellow-highlight">number of rows</span> times <span class="yellow-highlight">number in each row</span>.<br><br>The answer is at the top right of the grid:<br><span class="yellow-highlight">number of rows</span> × <span class="yellow-highlight">number of columns</span>!`,
};
const questionsIndonesian = [
  {
    col: 2,
    row: 6,
    item: "mangkuk",
    item_plural: "mangkuk",
    group_name: "nampan",
    group_name_plural: "nampan",
  },
  {
    col: 3,
    row: 4,
    item: "bakpao",
    item_plural: "bakpao",
    group_name: "mangkuk",
    group_name_plural: "mangkuk",
  },
];

const leftInstructionsIndonesian = {
  shortData: {
    leftBadge: `<div class="top-badge">Penjumlahan Berulang</div>`,
    rightBadge: `<div class="top-badge">Perkalian</div>`,
  },
  question:
    "Berapa banyak {{item_plural}} yang akan ada di {{row_count}} {{group_name_plural}} seperti pada gambar yang ditampilkan?",
  h1Text:
    "Berapa hasil dari {{col_count}} diambil {{row_count}} kali?<br><br>{{repeated_addition_string}} = ?",
  cornerText: "{{row_count}} kali",
  start:
    "Mari kita belajar bagaimana membayangkan perkalian dengan contoh gambar. Ketuk 'Mulai' dan bersiaplah untuk melihat berapa banyak {{item_plural}} yang ada dalam {{row_count}} {{group_name_plural}} seperti pada gambar yang ditampilkan!",
  set_horizontal:
    "Pertama, berapa banyak {{item_plural}} yang akan ada di 1 {{group_name}}?<br><br> Gunakan penggeser di bagian bawah dan ketuk tombol untuk mengatur jumlah {{item_plural}} dalam satu {{group_name}}.",
  wrong_feedback_x:
    "Ups… itu bukan jumlah {{item_plural}} pada gambar yang ditunjukkan dalam soal… Coba lagi…<br><br>Gunakan penggeser dan ketuk tombol untuk mengatur jumlah {{item_plural}} dalam 1 nampan…",
  wrong_feedback_y:
    "Ups… itu bukan jumlah {{group_name_plural}}. Coba lagi…<br><br>Gunakan penggeser dan ketuk tombol untuk mengatur jumlah {{group_name_plural}}.",
  set_vertical:
    "Kerja bagus!<br> Sekarang, sesuai pertanyaan, berapa banyak {{group_name_plural}} yang kita butuhkan?<br><br>Gunakan penggeser di sebelah kanan dan ketuk tombol untuk mengatur jumlah {{group_name_plural}}.",
  complete_setting:
    "Kerja bagus!<br>Yang kita lihat di sini adalah hitungan {{ans}} {{item_plural}} dalam {{row_count}} {{group_name_plural}}.<br>Ayo pahami ini lebih baik… Ketuk Berikutnya…",
  before_question:
    "Yang kita lihat di sini adalah petak perkalian.<br><br> Ketuk 'Berikutnya' untuk menjelajahinya lebih jauh.",
  column_question:
    "Ada berapa kolom di petak perkalian ini? Ketuk jawaban yang benar.",
  row_question:
    "{{col_count}} Kolom! Kerja bagus! Ada berapa baris di petak perkalian ini? Ketuk jawaban yang benar.",
  completed_questions:
    "{{col_count}} kolom dalam {{row_count}} baris! Bagus sekali. <br><br>Ayo kita visualisasikan perkalian ini.<br><br>Ketuk 'Berikutnya'.",
  animation_1:
    "Setiap baris bertambah {{col_count}}… <br>{{row_count}} baris dari {{col_count}}…",
  animation_end:
    "Setiap baris bertambah {{col_count}}… <br>{{row_count}} baris dari {{col_count}}…Itu adalah {{row_count}} × {{col_count}} = {{ans}}.<br> Ketuk Putar Ulang di kiri, atau Berikutnya di kanan…",
  completion:
    "{{row_count}} baris dari {{col_count}} adalah {{ans}}, <br>atau {{row_count}} × {{col_count}} = {{ans}}, angka kanan atas di petak!<br> Itu menyenangkan dan mudah! Aktivitas selesai! Ketuk 'Ringkasan'.",
  bottom_text: `{{row_count}} kelompok dari {{col_count}} ... <br><span class="yellow-highlight">{{repeated_addition_string}}</span> = <span class="yellow-highlight">{{row_count}} × {{col_count}}</span> = <span class="yellow-highlight">{{ans}}</span>`,
  summary: `<span class="yellow-highlight">Perkalian</span> adalah penjumlahan berulang.<br><br>Ini bisa dianggap sebagai menghitung dalam petak sederhana:<br> <span class="yellow-highlight">jumlah baris</span> dikali <span class="yellow-highlight">jumlah di setiap baris</span>.<br><br>Jawabannya ada di kanan atas petak:<br><span class="yellow-highlight">jumlah baris</span> × <span class="yellow-highlight">jumlah kolom</span>!`,
};

const buttonTextsEnglish = {
  next: "Next",
  start_over: "Start Over",
  previous: "Previous",
  replay: "Replay",
  submit: "Submit",
  proceed: "Proceed",
  hint: "Hint",
  check: "Check",
  set: "Set",
  start: "Start",
  summary: "Summary",
  next_question: "Next Question",
};

const buttonTextsIndonesian = {
  next: "Berikutnya",
  start_over: "Mulai Lagi",
  previous: "Sebelumnya",
  replay: "Putar Ulang",
  submit: "Kirim",
  proceed: "Lanjutkan",
  hint: "Petunjuk",
  check: "Periksa",
  set: "Atur",
  start: "Mulai",
  summary: "Ringkasan",
  next_question: "Pertanyaan Berikutnya",
};
const overlayDataIndonesian = {
  heading: "Aktivitas Selesai!",
  paragraph: `Jika kamu ingin mencoba lagi, klik tombol 'Mulai Lagi'.`,
};

const overlayDataEnglish = {
  heading: "Activity Complete!",
  paragraph: `If you want to try again, click on the 'Start Over' button. `,
};
