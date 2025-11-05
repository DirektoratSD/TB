const textsEnglish = {
  button_texts: {
    prev: "Previous",
    next: "Next",
    add_jar: "Add Another Jar", // Text for the button when on the last shape
    start_over: "Start Over", // Text for the button on the summary page
    submit: "Submit",
  },
  welcome_text: {
    description:
      "Let's see how to represent place values for 3-digit numbers. Are you ready?",
    button_text: "Start",
  },
  overlay_text:
    "Hello! Ever wondered how numbers are made?<br><br> Let’s have some fun and find out together!",
  top_question: `Adjust each place value with '+' and '-' to match <span class="numberInQuestion">157</span> .`,
  overlay_heading: "Activity Complete!",
  overlay_final:
    "Great job! If you want to try again, click the 'Start Over' button",
  comments: {
    correct: "Congratulations! You have matched the number correctly.",
    wrong: "That's not the correct answer. Try again.",
  },
  left_panel: {
    questionText: `Adjust each place value with '+' or '-' to match &nbsp;<span id="numberInQuestion">157</span> .`,
  },
};
const tagsArrayEnglish = ["Ones", "Tens", "Hundreds"];

const tagsEnglish = {
  one: " One",
  ten: " Ten",
  hundred: " Hundred",
  ones: " Ones",
  tens: " Tens",
  hundreds: " Hundreds",
};
const tagsIndonesian = {
  one: " Satu",
  ten: " Sepuluh",
  hundred: " Seratus",
  ones: " Satuan",
  tens: " Puluhan",
  hundreds: " Ratusan",
};

const textsIndonesian = {
  button_texts: {
    prev: "Sebelumnya",
    next: "Berikutnya",
    add_jar: "Tambahkan Toples Lagi", // Tombol ketika di bentuk terakhir
    start_over: "Mulai Lagi", // Tombol di halaman ringkasan
    submit: "Kirim",
  },
  welcome_text: {
    description:
      "Mari belajar cara menentukan nilai tempat untuk bilangan 3 angka. Apa kalian siap?",
    button_text: "Mulai",
  },
  overlay_text:
    "Halo! Pernah bertanya-tanya bagaimana angka dibuat?<br><br> Ayo kita bersenang-senang dan cari tahu bersama!",
  top_question: `Sesuaikan nilai tempat dengan ketuk tombol '+' atau '-' agar membuat bilangan <span class="numberInQuestion">157</span> .`,
  overlay_heading: "Aktivitas selesai!",
  overlay_final:
    "Jika kalian ingin mencoba lagi, ketuk tombol 'Mulai lagi'",

  comments: {
    correct: "Hebat! Kalian telah mencocokan bilangan dan nilai tempatnya dengan benar.",
    wrong: "Itu bukan jawaban yang benar. Coba lagi.",
  },
  left_panel: {
    questionText: `Sesuaikan nilai tempat dengan ketuk tombol '+' atau '-' agar membuat bilangan &nbsp;<span id="numberInQuestion">157</span> .`,
  },
};

const tagsArrayIndonesian = ["Satuan", "Puluhan", "Ratusan"];

const unitWidget = document.getElementById("unit-widget");
const tenWidget = document.getElementById("ten-widget");

const [hMinus, hPlus, tensMinus, tensPlus, unitsMinus, unitsPlus] =
  document.querySelectorAll(".control-btn");
const [hNumberTab, tenNumberTab, unitNumberTab] =
  document.querySelectorAll(".number-tab");
const [hSquaresContainer, tenSquaresContainer, unitSquaresContainer] =
  document.querySelectorAll(".squares-container");
const [hTextDisplay, tenTextDisplay, unitTextDisplay] =
  document.querySelectorAll(".text-display");
const [hLeftDir, tenLeftDir, unitLeftDir] =
  document.querySelectorAll(".left-dir");

const commentElement = document.querySelector(".comment");
const numberText = document.querySelector("#numberText");
