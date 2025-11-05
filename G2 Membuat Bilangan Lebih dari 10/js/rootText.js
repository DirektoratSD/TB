const textsEnglish = {
  html_title: "Addition Sentence",
  subtitle_text: "Write the addition sentence and find the sum",
  button_texts: {
    prev: "Previous",
    next: "Next",
    add_jar: "Add another Jar", // Text for the button when on the last shape
    start_over: "Start Over", // Text for the button on the summary page
  },
  overlay_text:
    "Hello! Let's have fun and continue to create bigger numbers together!",
  left_panel: {
    instruction_general: {
      instruction_title: "Hello!",
      instruction_text:
        "Let's have fun and continue to create bigger numbers together!",
    },
    next: {
      instruction_title: "",
      instruction_text: "Click the 'Next' button to continue.",
    },
    reminder: {
      instruction_title: "Reminder",
      instruction_text:
        "Just a reminder - this pink jar shows the Ones place.<br><br> Each click adds one cube!",
    },
    plus: {
      instruction_title: "Add Boxes",
      instruction_text:
        "Just Click on the "+" button once to see what happens!",
    },
    minus: {
      instruction_title: "Remove boxes",
      instruction_text:
        "Now just for fun, Click on the "-" button.<br><br> See what happens to the boxes above and below",
    },

    keep_adding: {
      instruction_title: "Add more boxes",
      instruction_text:
        " Wasn't that fun? <br><br>Now let's keep adding cubes to the box to see how many we can fill up.",
    },
    pink_unlike: {
      instruction_title: "Observe",
      instruction_text:
        "The Pink Jar Does not like having more than one Digit!",
    },
    mcq: {
      instruction_title: "",
      instruction_text:
        "I really want to continue counting higher, how can we resolve this?<br><br> help me by clicking the right answer",
    },
    increase: {
      instruction_title: "",
      instruction_text:
        "Use the '+' button to increase the number of cubes in the ones place.",
    },
    move_left: {
      instruction_title: "",
      instruction_text: "Click on the arrow to see the magic happen",
    },
    move_right: {
      instruction_title: "",
      instruction_text:
        "Just for fun, click on the arrow to move the rod back into the pink jar and observe what happens",
    },
    move_left_again: {
      instruction_title: "",
      instruction_text: "Click the arrow to get back the rod. Isn't it magic!",
    },
    number_ten: {
      instruction_title: "And we have Created the number 10 !!!",
      instruction_text: "",
    },
    one_more_rod: {
      instruction_title: "",
      instruction_text:
        "The Pink Jar won't like this...<br><br> but just for the sake of math learning, let's try putting one more rod in.<br><br> Click to continue!",
    },
    finally: {
      instruction_title: "Finally!",
      instruction_text: " All is fine now! We have created Twenty!",
    },
    one_more_click: {
      instruction_title: "",
      instruction_text: "One more click and the pink jar is all happy!",
    },
  },

  comments: {
    number_disappeared:
      "Opps! the number disappeared! Looks like this number display box can't show the count of that many cubes.",
    add_jar: "The Way to resolve this is by adding another Jar!",
    rod: "Ten cubes came together to form one rod!",
    rod_split:
      "one rod split to form ten cubes! As the pink jar can hold only nine symbols, move the cubes to the blue Jar",
    wrong1:
      "Hmm... If we leave all 10 in the ones place, we can't keep counting. Let's see what happens when we move them to the tens place instead!",
    wrong3:
      "Oh no! We worked hard to count to 10 - we don't need to erase. Let's try a better idea: move them to the tens place!",
    correct:
      "Yes! 10 ones make 1 ten. Let's merge them and move it to the tens place!",
    you_expert:
      "You are an expert now, you know what to do! Go ahead and click on the arrow to move ten ones to make one ten",
    twenty_ones:
      "Aha! We now have Twenty ones - that's the same as Two tens! But the Pink Jar is not built for so many. Let's regroup and make it happy again.",
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


const numberFormEnglish = [
  "",
  "One ten and One One makes Eleven",
  "One ten and Two Ones makes Twelve",
  "One ten and Three Ones makes Thirteen",
  "One ten and Four Ones makes Fourteen",
  "One ten and Five Ones makes Fifteen",
  "One ten and Six Ones makes Sixteen",
  "One ten and Seven Ones makes Seventeen",
  "One ten and Eight Ones makes Eighteen",
  "One ten and Nine Ones makes Nineteen",
  "Two tens makes Twenty!",
];
const mcqDataEnglish = {
  options: [
    "Leave the 10 cubes in the ones place.",
    "Move all 10 cubes to the tens place as 1 ten.",
    "Erase all the cubes and start over.",
  ],
  feedback: ["wrong1", "correct", "wrong3"],
  answer: 1,
  question: "",
};

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

const textsIndonesian = {
  html_title: "Kalimat Penjumlahan",
  subtitle_text: "Tulis kalimat penjumlahan dan temukan hasilnya",
  button_texts: {
    prev: "Sebelumnya",
    next: "Berikutnya",
    add_jar: "Tambah Toples Lagi", // Teks untuk tombol saat di bentuk terakhir
    start_over: "Mulai Lagi", // Teks untuk tombol di halaman ringkasan
  },
  overlay_text:
    "Halo! Ayo bermain bersama dan buat bilangan yang lebih besar!",
  left_panel: {
    instruction_general: {
      instruction_title: "Halo!",
      instruction_text:
        "Ayo ketuk panah untuk memindahkan batang kembali ke toples merah muda, dan lihat apa yang terjadi.",
    },
    next: {
      instruction_title: "",
      instruction_text: "Klik tombol 'Berikutnya' untuk melanjutkan.",
    },
    reminder: {
      instruction_title: "Pengingat",
      instruction_text:
        "Toples merah muda menunjukkan tempat Satuan.<br><br> Setiap ketuk tanda '+' menambahkan satu kotak.",
    },
    plus: {
      instruction_title: "Tambah Kotak",
      instruction_text:
        "Cukup ketuk tombol '+'', dan lihat apa yang terjadi!",
    },
    minus: {
      instruction_title: "Hapus Kotak",
      instruction_text:
        "Sekarang untuk bersenang-senang, klik tombol "-".<br><br> Lihat apa yang terjadi pada kotak di atas dan bawah",
    },
    keep_adding: {
      instruction_title: "Tambahkan lebih banyak kotak",
      instruction_text:
        "Seru, kan? <br><br>Sekarang mari terus tambahkan kubus ke dalam kotak dan lihat berapa banyak yang bisa kita isi.",
    },
    pink_unlike: {
      instruction_title: "Amati",
      instruction_text:
        "Toples Merah Muda tidak suka memiliki lebih dari satu angka!",
    },
    mcq: {
      instruction_title: "",
      instruction_text:
        "Aku ingin terus menghitung, jadi bagaimana kita mengatasinya?<br><br>Bantu aku memilih jawaban yang benar.",
    },
    increase: {
      instruction_title: "",
      instruction_text:
        "Gunakan tombol '+' untuk menambah jumlah kotak di tempat satuan.",
    },
    move_left: {
      instruction_title: "",
      instruction_text: "Klik panah untuk melihat keajaiban terjadi",
    },
    move_right: {
      instruction_title: "",
      instruction_text:
        "Untuk bersenang-senang, klik panah untuk memindahkan batang kembali ke toples merah muda dan amati apa yang terjadi",
    },
    move_left_again: {
      instruction_title: "",
      instruction_text:
        "Klik panah untuk mengambil kembali batangnya. Ajaib, bukan!",
    },
    number_ten: {
      instruction_title: "Dan kita telah Membuat angka 10!!!",
      instruction_text: "",
    },
    one_more_rod: {
      instruction_title: "",
      instruction_text:
        "Toples Merah Muda tidak akan menyukainya...<br><br> tetapi demi pembelajaran matematika, mari coba masukkan satu batang lagi.<br><br>Klik untuk melanjutkan!",
    },
    finally: {
      instruction_title: "Akhirnya!",
      instruction_text:
        "Semuanya baik-baik saja sekarang! Kita telah membuat Dua Puluh!",
    },
    one_more_click: {
      instruction_title: "",
      instruction_text: "Ketuk sekali lagi dan toples merah muda akan bahagia!",
    },
  },

  comments: {
    number_disappeared:
      "Ups! Angkanya menghilang! Sepertinya kotak tampilan angka ini tidak bisa menunjukkan jumlah kubus sebanyak itu.",
    add_jar: "Cara mengatasinya adalah dengan menambahkan toples lagi!",
    rod: "Sepuluh kotak bergabung membentuk satu batang!",
    rod_split:
      "Satu batang terpecah menjadi sepuluh kubus! Karena toples merah muda hanya bisa menampung sembilan simbol, pindahkan kubus ke Toples Biru.",
    wrong1:
      "Hmm... Jika kita membiarkan semua 10 di tempat satuan, kita tidak bisa terus menghitung. Mari lihat apa yang terjadi jika kita pindahkan ke tempat puluhan!",
    wrong3:
      "Oh tidak! Kita sudah bekerja keras menghitung sampai 10 - kita tidak perlu menghapusnya. Mari coba ide yang lebih baik: pindahkan ke tempat puluhan!",
    correct:
      "Ya! 10 satuan menjadi 1 puluhan. Mari kita gabungkan dan pindahkan ke tempat puluhan!",
    you_expert:
      "Kalian sudah paham sekarang dan tahu harus lakukan apa! Ayo ketuk panah untuk memindahkan sepuluh satuan menjadi satu puluhan.",
    twenty_ones:
      "Aha! Sekarang kita punya Dua Puluh satuan - itu sama dengan Dua puluhan! Tapi Toples Merah Muda tidak dirancang untuk sebanyak itu. Mari kita kelompokkan ulang dan buat dia bahagia lagi.",
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

const numberFormIndonesian = [
  "",
  "Satu puluhan dan Satu satuan menjadi Sebelas",
  "Satu puluhan dan Dua satuan menjadi Dua Belas",
  "Satu puluhan dan Tiga satuan menjadi Tiga Belas",
  "Satu puluhan dan Empat satuan menjadi Empat Belas",
  "Satu puluhan dan Lima satuan menjadi Lima Belas",
  "Satu puluhan dan Enam satuan menjadi Enam Belas",
  "Satu puluhan dan Tujuh satuan menjadi Tujuh Belas",
  "Satu puluhan dan Delapan satuan menjadi Delapan Belas",
  "Satu puluhan dan Sembilan satuan menjadi Sembilan Belas",
  "Dua puluhan menjadi Dua Puluh!",
];
  

const mcqDataIndonesian = {
  options: [
    "Biarkan 10 kotak di tempat satuan.",
    "Pindahkan semua 10 kotak ke tempat puluhan sebagai 1 puluhan.",
    "Hapus semua kotak dan mulai dari awal.",
  ],
  feedback: ["wrong1", "correct", "wrong3"],
  answer: 1,
  question: "",
};
  