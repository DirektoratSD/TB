const textsEnglish = {
  html_title: "Addition Sentence",
  subtitle_text: "Write the addition sentence and find the sum",
  button_texts: {
    prev: "Previous",
    next: "Next",
    add_jar: "Add another Jar", // Text for the button when on the last shape
    start_over: "Start Over", // Text for the button on the summary page
    submit:"Submit"
  },
  bubble_data: [
    {
      left: "Great job Till now!<br><br>Now, let’s try something new with the Tens Jar!",
      right: "Only use the blue jar this time!",
    },
    {
      left: "Great job on Level 1!<br><br>Now, let’s try something new with the Tens Jar!",
      right: "Only use the blue jar this time!",
    },
    {
      left: "Wow! You’re getting good at this.<br><br>Now it’s time to use both jars together!",
      right: "Let’s build bigger numbers!",
    },
  ],

  comments: {
    number_disappeared:
      "Opps! the number disappeared! Looks like this number display box can’t show the count of that many squares.",
    add_jar: "The Way to resolve this is by adding another Jar!",
    rod: "Ten squares came together to form one rod!",
    rod_split:
      "one rod split to form ten squares! As the pink jar can hold only nine symbols, move the squares to the blue Jar",
    wrong1:
      "Hmm… If we leave all 10 in the ones place, we can’t keep counting. Let’s see what happens when we move them to the tens place instead!",
    wrong3:
      "Oh no! We worked hard to count to 10 - we don’t need to erase. Let’s try a better idea: move them to the tens place!",
    correct:
      "Yes! 10 ones make 1 ten. Let’s merge them and move it to the tens place!",
    you_expert:
      "You are an expert now, you know what to do! Go ahead and click on the arrow to move ten ones to make one ten",
    twenty_ones:
      "Aha! We now have Twenty ones - that’s the same as Two tens! But the Pink Jar is not built for so many. Let’s regroup and make it happy again.",
  },
};

const numberToTextEnglish = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
  "Twenty",
];

const questionsEnglish = [
  {
    text: "Click on the ones box only to add digits and make the number seven",
    number: 7,
    feedback: {
      correctAnswer: "Yes! You made Seven—0 ten and 7 ones. Nice work!",
      nothingAdded:
        "Give it a try! Start adding cubes and rods to make the number.",
      tooManyOnes:
        "Oops! The Pink Jar has too many! Remember—it likes just one digit. Try moving 10 ones to the tens place.",

      tensWrong: "To make a single digit number, you don’t need a tens place",
      tensCorrectOnesWrong:
        "Try again, you need to add seven squares to the jar to get this right.",
    },
  },
  {
    text: "Click on the ones box only to add digits and make the number thirteen",
    number: 13,
    feedback: {
      correctAnswer: "Yes! You made thirteen—1 ten and 3 ones. Nice work!",
      randomTotalWrong:
        "Hmm… That number’s different. Check both tens and ones and try again!",
      onesCorrectTensWrong:
        "You got the ones right—3 ones! But check the tens again.",
      tensCorrectOnesWrong:
        "Your tens are spot on—1 ten! But your ones don’t match yet.",
      tooManyOnes:
        "Oops! The Pink Jar has too many! Remember—it likes just one digit. Try moving 10 ones to the tens place.",
      nothingAdded:
        "Give it a try! Start adding cubes and rods to make the number.",
    },
  },
  {
    text: "Click on the Tens box only to add digits and make the number thirty.",
    number: 30,
    feedback: {
      correctAnswer: "Yes! You made thirty—3 ten and 0 ones. Nice work!",
      randomTotalWrong:
        "Hmm… That number’s different. Check both tens and ones and try again!",
      onesWrong: "Observe the number, it has zero ones.",
      nothingAdded:
        "Give it a try! Start adding cubes and rods to make the number.",
      onesCorrectTensWrong:
        "You got the ones right—0 ones! But check the tens again.",
    },
  },
  {
    text: "Click on the tens box only to add digits and make the number eighteen.",
    number: 18,
    feedback: {
      correctAnswer: "Yes! You made eighteen—1 ten and 8 ones. Nice work!",
      randomTotalWrong:
        "Hmm… That number’s different. Check both tens and ones and try again!",
      onesCorrectTensWrong:
        "You got the ones right—3 ones! But check the tens again.",
      tensCorrectOnesWrong:
        "Your tens are spot on—1 ten! But your ones don’t match yet.",
      tooManyOnes:
        "Oops! The Pink Jar has too many! Remember—it likes just one digit. Try moving 10 ones to the tens place.",
      nothingAdded:
        "Give it a try! Start adding cubes and rods to make the number.",
    },
  },
  {
    text: "Click on the Tens box only to add digits and make the number twenty five",
    number: 25,
    feedback: {
      correctAnswer: "Yes! You made twenty five - 2 ten and 5 ones. Nice work!",
      randomTotalWrong:
        "Hmm… That number’s different. Check both tens and ones and try again!",
      onesCorrectTensWrong:
        "You got the ones right - 5 ones! But check the tens again.",
      tensCorrectOnesWrong:
        "Your tens are spot on - 2 ten! But your ones don’t match yet.",
      tooManyOnes:
        "Oops! The Pink Jar has too many! Remember - it likes just one digit. Try moving 10 ones to the tens place.",
      nothingAdded:
        "Give it a try! Start adding cubes and rods to make the number.",
    },
  },
  {
    text: "Click on the Tens box only to add digits and make the number sixteen",
    number: 16,
    feedback: {
      correctAnswer: "Yes! You made sixteen- 1 ten and 6 ones. Nice work!",
      randomTotalWrong:
        "Hmm… That number’s different. Check both tens and ones and try again!",
      onesCorrectTensWrong:
        "You got the ones right - 6 ones! But check the tens again.",
      tensCorrectOnesWrong:
        "Your tens are spot on - 1 ten! But your ones don’t match yet.",
      tooManyOnes:
        "Oops! The Pink Jar has too many! Remember - it likes just one digit. Try moving 10 ones to the tens place.",
      nothingAdded:
        "Give it a try! Start adding cubes and rods to make the number.",
    },
  },
  {
    text: "Click on the Tens box only to add digits and make the number forty",
    number: 40,
    feedback: {
      correctAnswer: "Yes! You made forty- 4 ten and 0 ones. Nice work!",
      randomTotalWrong:
        "Hmm… That number’s different. Check both tens and ones and try again!",
      onesCorrectTensWrong:
        "You got the ones right - 0 ones! But check the tens again.",
      tensCorrectOnesWrong:
        "Your tens are spot on - 4 ten! But your ones don’t match yet.",
      tooManyOnes:
        "Oops! The Pink Jar has too many! Remember - it likes just one digit. Try moving 10 ones to the tens place.",
      nothingAdded:
        "Give it a try! Start adding cubes and rods to make the number.",
    },
  },
];

const tagsEnglish = {
  one: " One",
  ten: " Ten",
  ones: " Ones",
  tens: " Tens",
};
const tagsIndonesian = {
  one: " Satu",
  ten: " Sepuluh",
  ones: " Satuan",
  tens: " Puluhan",
};
const questionsIndonesian = [
  {
    text: "Ketuk Kotak Satuan untuk menambahkan bilangan dan membuat bilangan 7",
    number: 7,
    feedback: {
      correctAnswer:
        "Ya! Kamu membuat angka Tujuh—0 puluhan dan 7 satuan. Kerja bagus!",
      nothingAdded:
        "Coba dulu! Mulailah menambahkan kotak dan batang untuk membentuk angka.",
      tooManyOnes:
        "Ups! Toples Merah Muda terlalu penuh! Ingat, dia hanya suka satu angka. Coba pindahkan 10 satuan ke tempat puluhan.",

      tensWrong:
        "Untuk membuat angka satu digit, kamu tidak perlu tempat puluhan.",
      tensCorrectOnesWrong:
        "Coba lagi, kamu perlu menambahkan tujuh kotak ke dalam toples satuan untuk menjawab dengan benar.",
    },
  },
  {
    text: "Ketuk hanya pada kotak satuan untuk menambahkan bilangan dan membuat bilangan tiga belas",
    number: 13,
    feedback: {
      correctAnswer:
        "Ya! Kamu membuat Tiga Belas—1 puluhan dan 3 satuan. Kerja bagus!",
      randomTotalWrong:
        "Hmm.. belum tepat. Periksa kembali tempat puluhan dan satuan, ayo coba lagi!",
      onesCorrectTensWrong:
        "Satuan kamu benar—3 satuan! Tapi coba periksa lagi tempat puluhan.",
      tensCorrectOnesWrong:
        "Puluhan kamu sudah tepat—1 puluhan! Tapi satuannya belum cocok.",
      tooManyOnes:
        "Ups! Toples Merah Muda terlalu penuh! Ingat, dia hanya suka satu angka. Coba pindahkan 10 satuan ke tempat puluhan.",
      nothingAdded:
        "Coba dulu! Mulailah menambahkan kotak dan batang untuk membentuk angka.",
    },
  },
  {
    text: "Ketuk Kotak Puluhan untuk menambahkan bilangan dan membuat bilangan 30",
    number: 30,
    feedback: {
      correctAnswer:
        "Ya! Kamu membuat Tiga Puluh—3 puluhan dan 0 satuan. Kerja bagus!",
      randomTotalWrong:
        "Hmm.. belum tepat. Periksa kembali tempat puluhan dan satuan, ayo coba lagi!",
      onesWrong: "Perhatikan angkanya, itu memiliki nol satuan.",
      nothingAdded:
        "Coba dulu! Mulailah menambahkan kotak dan batang untuk membentuk angka.",
      onesCorrectTensWrong:
        "Satuan kamu sudah benar—0 satuan! Tapi periksa lagi tempat puluhan.",
    },
  },
  {
    text: "Klik hanya pada kotak puluhan untuk menambahkan angka dan membuat angka delapan belas.",
    number: 18,
    feedback: {
      correctAnswer:
        "Ya! Kamu membuat Delapan Belas—1 puluhan dan 8 satuan. Kerja bagus!",
      randomTotalWrong:
        "Hmm.. belum tepat. Periksa kembali tempat puluhan dan satuan, ayo coba lagi!",
      onesCorrectTensWrong:
        "Satuan kamu benar—3 satuan! Tapi periksa tempat puluhan lagi.",
      tensCorrectOnesWrong:
        "Puluhan kamu sudah tepat—1 puluhan! Tapi satuannya belum cocok.",
      tooManyOnes:
        "Ups! Toples Merah Muda terlalu penuh! Ingat, dia hanya suka satu angka. Coba pindahkan 10 satuan ke tempat puluhan.",
      nothingAdded:
        "Coba dulu! Mulailah menambahkan kotak dan batang untuk membentuk angka.",
    },
  },
  {
    text: "Ketuk Kotak Puluhan untuk menambahkan puluhan dan ketuk Kotak Satuan untuk menambahkan satuan untuk membuat bilangan 25!",
    number: 25,
    feedback: {
      correctAnswer:
        "Ya! Kamu membuat Dua Puluh Lima - 2 puluhan dan 5 satuan. Kerja bagus!",
      randomTotalWrong:
        "Hmm.. belum tepat. Periksa kembali tempat puluhan dan satuan, ayo coba lagi!",
      onesCorrectTensWrong:
        "Satuan kamu benar - 5 satuan! Tapi periksa tempat puluhan lagi.",
      tensCorrectOnesWrong:
        "Puluhan kamu sudah tepat - 2 puluhan! Tapi satuannya belum cocok.",
      tooManyOnes:
        "Ups! Toples Merah Muda terlalu penuh! Ingat, dia hanya suka satu angka. Coba pindahkan 10 satuan ke tempat puluhan.",
      nothingAdded:
        "Coba dulu! Mulailah menambahkan kotak dan batang untuk membentuk angka.",
    },
  },
  {
    text: "Klik hanya pada kotak puluhan untuk menambahkan angka dan membuat enam belas",
    number: 16,
    feedback: {
      correctAnswer:
        "Ya! Kamu membuat Enam Belas - 1 puluhan dan 6 satuan. Kerja bagus!",
      randomTotalWrong:
        "Hmm.. belum tepat. Periksa kembali tempat puluhan dan satuan, ayo coba lagi!",
      onesCorrectTensWrong:
        "Satuan kamu benar - 6 satuan! Tapi periksa tempat puluhan lagi.",
      tensCorrectOnesWrong:
        "Puluhan kamu sudah tepat - 1 puluhan! Tapi satuannya belum cocok.",
      tooManyOnes:
        "Ups! Toples Merah Muda terlalu penuh! Ingat, dia hanya suka satu angka. Coba pindahkan 10 satuan ke tempat puluhan.",
      nothingAdded:
        "Coba dulu! Mulailah menambahkan kotak dan batang untuk membentuk angka.",
    },
  },
  {
    text: "Klik hanya pada kotak puluhan untuk menambahkan angka dan membuat angka empat puluh",
    number: 40,
    feedback: {
      correctAnswer:
        "Ya! Kamu membuat Empat Puluh - 4 puluhan dan 0 satuan. Kerja bagus!",
      randomTotalWrong:
        "Hmm.. belum tepat. Periksa kembali tempat puluhan dan satuan, ayo coba lagi!",
      onesCorrectTensWrong:
        "Satuan kamu benar - 0 satuan! Tapi periksa tempat puluhan lagi.",
      tensCorrectOnesWrong:
        "Puluhan kamu sudah tepat - 4 puluhan! Tapi satuannya belum cocok.",
      tooManyOnes:
        "Ups! Toples Merah Muda terlalu penuh! Ingat, dia hanya suka satu angka. Coba pindahkan 10 satuan ke tempat puluhan.",
      nothingAdded:
        "Coba dulu! Mulailah menambahkan kotak dan batang untuk membentuk angka.",
    },
  },
];
const textsIndonesian = {
  html_title: "Kalimat Penjumlahan",
  subtitle_text: "Tulis kalimat penjumlahan dan temukan hasilnya",
  button_texts: {
    prev: "Sebelumnya",
    next: "Berikutnya",
    add_jar: "Tambahkan Toples Lagi",
    start_over: "Mulai Lagi",
    submit: "Kirim",
  },
  bubble_data: [
    {
      left: "Kerja bagus sejauh ini!<br><br>Sekarang, ayo coba sesuatu yang baru dengan Toples Puluhan!",
      right: "Gunakan hanya toples biru kali ini!",
    },
    {
      left: "Kerja bagus di Level 1!<br><br>Sekarang, ayo coba sesuatu yang baru dengan Toples Puluhan!",
      right: "Gunakan hanya toples biru kali ini!",
    },
    {
      left: "Wow! Kamu semakin mahir.<br><br>Sekarang saatnya menggunakan kedua toples bersama-sama!",
      right: "Ayo buat angka yang lebih besar!",
    },
  ],

  comments: {
    number_disappeared:
      "Ups! Angkanya menghilang! Sepertinya kotak tampilan angka ini tidak bisa menampilkan begitu banyak kotak.",
    add_jar: "Cara untuk mengatasinya adalah dengan menambahkan toples lagi!",
    rod: "Sepuluh kotak bergabung membentuk satu batang!",
    rod_split:
      "Satu batang dipecah menjadi sepuluh kotak! Karena toples merah muda hanya bisa menampung sembilan simbol, pindahkan kotaknya ke toples biru",
    wrong1:
      "Hmm… Jika kita meninggalkan semua 10 di tempat satuan, kita tidak bisa terus menghitung. Mari lihat apa yang terjadi saat kita memindahkannya ke tempat puluhan!",
    wrong3:
      "Oh tidak! Kita sudah susah payah menghitung sampai 10 - tidak perlu menghapus. Ayo coba ide yang lebih baik: pindahkan ke tempat puluhan!",
    correct:
      "Ya! 10 satuan menjadi 1 puluhan. Mari gabungkan dan pindahkan ke tempat puluhan!",
    you_expert:
      "Kamu sudah ahli sekarang, kamu tahu apa yang harus dilakukan! Silakan klik panah untuk memindahkan sepuluh satuan menjadi satu puluhan",
    twenty_ones:
      "Aha! Sekarang kita punya Dua Puluh satuan - itu sama dengan Dua puluhan! Tapi Toples Merah Muda tidak dirancang untuk sebanyak itu. Mari regroup agar dia senang kembali.",
  },
};

const numberToTextIndonesian = [
  "Nol",
  "Satu",
  "Dua",
  "Tiga",
  "Empat",
  "Lima",
  "Enam",
  "Tujuh",
  "Delapan",
  "Sembilan",
  "Sepuluh",
  "Sebelas",
  "Dua Belas",
  "Tiga Belas",
  "Empat Belas",
  "Lima Belas",
  "Enam Belas",
  "Tujuh Belas",
  "Delapan Belas",
  "Sembilan Belas",
  "Dua Puluh",
];
