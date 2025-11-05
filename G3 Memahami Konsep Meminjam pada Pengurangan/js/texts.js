const flag = "INDONESIAN"; // Change this to "INDONESIAN" to use the translated text

// --- English Text Data ---
const textsEnglish = {
  buttons: {
    start: "Start",
    next: "Next",
    borrow: "Borrow From Tens",
    take_away_ones: "Take Away Ones",
    take_away_tens: "Take Away Tens",
    collect_ones: "Collect Remaining Ones",
    collect_tens: "Collect Remaining Tens",
    start_task: "Next",
    okay: "Okay",
    start_over: "Start Over",
  },
  headings: {
    tens: "Tens",
    ones: "Ones",
  },
  ftue: {
    hand_cursor: "assets/tap.png",
    pose_normal: "assets/JAXnormal.png",
    pose_thinking: "assets/JAXthinking.png",
    pose_happy: "assets/JAX_happy.png",
    pose_superHappy: "assets/JAXhappy.png",
  },
  context_data: {
    step0_a:
      "Let's learn subtraction with borrowing!<br><br>These are our TENS and ONES containers.<br><br>Click '<b>Next</b>' to continue.",
    step0_b: "Use the '+' and '-' buttons to place blocks.<br><br>Click '<b>Next</b>' to continue.",
    step0_c: "The number cards show the value of the blocks.<br><br>Click '<b>Next</b>' to continue.",
    step1_tens:
      "Let's subtract 15 from 32. First, make the number 32.<br><br>Tap the '<b>+</b>' on the TENS box 3 times.",
    step1_ones: "Great! Now set the ones. Tap the '<b>+</b>' on the ONES box 2 times.",
    step1_complete: "Awesome! You have represented the number 32.<br><br>Click '<b>Next</b>' to continue.",
    step2_tens:
      "Now, let's show the number to be subtracted, 15.<br><br>Tap the '<b>+</b>' on the TENS box in the second row 1 time.",
    step2_ones: "Perfect! That's 1 ten. Now for the ones. Tap the '<b>+</b>' 5 times.",
    step2_complete: "We have set up the problem: 32 - 15.<br><br>Click '<b>Next</b>' to continue.",
    step_borrow_intro:
      "Look at the ones place. We cannot take 5 away from 2. We need to borrow!<br><br>Click the <b>Borrow</b> button.",
    borrow_title: "Well Done! You've completed your first borrow.",
    step_borrow_complete: "Whenever the bottom number is larger than the top number, we can’t subtract. In that case, we borrow one rod and split it as 10 cubes at ones place.",
    take_away_ones: "First, let's take away the ones.",
    take_away_tens: "Now, let's take away the tens.",
    collect_ones: "Great! Let's collect the remaining ones to find the answer.",
    collect_tens: "Finally, let's collect the remaining tens.",
    collect_done: "You have found the answer!<br><br>Click '<b>Next</b>' to see the final result.",
    final_result:
      "We see that 32 minus 15 is 17.<br><br><strong style=\"text-align: center; width: 100%; display: block; font-size: 1.5rem;\">32 - 15 = 17</strong>",
    overlay_title: "Activity Complete!",
    overlay_message: "If you want to try again, click on the 'Start Over' button.",
  },
};

// --- Indonesian Text Data ---
const textsIndonesian = {
  buttons: {
    start: "Mulai",
    next: "Lanjut",
    borrow: "Pinjam Puluhan",
    take_away_ones: "Ambil Satuan",
    take_away_tens: "Ambil Puluhan",
    collect_ones: "Kumpulkan Satuan",
    collect_tens: "Kumpulkan Puluhan",
    start_task: "Lanjut",
    okay: "Baiklah",
    start_over:"Mulai Lagi"
  },
  headings: {
    tens: "Puluhan",
    ones: "Satuan",
  },
  ftue: textsEnglish.ftue, // Reuse image paths
  context_data: {
    step0_a:
      "Mari belajar pengurangan dengan meminjam!<br><br>Ini adalah wadah PULUHAN dan SATUAN kita.<br><br>Ketuk '<b>Lanjut</b>' untuk melanjutkan.",
    step0_b: "Gunakan tombol '+' dan '-' untuk menempatkan balok.<br><br>Ketuk '<b>Lanjut</b>' untuk melanjutkan.",
    step0_c: "Kartu bilangan menunjukkan nilai dari balok-balok tersebut.<br><br>Ketuk '<b>Lanjut</b>' untuk melanjutkan.",
    step1_tens:
      "Mari kita kurangi 15 dari 32. Pertama, buat bilangan 32.<br><br>Ketuk tombol '<b>+</b>' pada kotak PULUHAN 3 kali.",
    step1_ones:
      "Bagus! Sekarang atur satuannya. Ketuk tombol '<b>+</b>' pada kotak SATUAN 2 kali.",
    step1_complete: "Luar biasa! Kalian telah membuat bilangan 32.<br><br>Ketuk '<b>Lanjut</b>' untuk melanjutkan.",
    step2_tens:
      "Sekarang, mari kita tunjukkan bilangan yang akan dikurangi, yaitu 15.<br><br>Ketuk tombol '<b>+</b>' pada kotak PULUHAN di baris kedua 1 kali.",
    step2_ones:
      "Sempurna! Itu 1 puluhan. Sekarang untuk satuannya.<br><br>Ketuk '<b>+</b>' 5 kali.",
    step2_complete: "Kita telah menyiapkan soal: 32 - 15.<br><br>Ketuk '<b>Lanjut</b>' untuk melanjutkan.",
    step_borrow_intro:
      "Lihatlah tempat satuan. Kita tidak bisa mengambil 5 dari 2.<br><br>Kita perlu meminjam! Ketuk tombol <b>Pinjam</b>.",
    step_borrow_complete:
      "Setiap kali angka di bawah lebih besar angka di atas, kita tidak dapat menguranginya. Maka dari itu, kita harus meminjam satu batang puluhan dan mengubahnya menjadi 10 kotak satuan di tempat satuan.",
    borrow_title: "Kerja bagus! Kalian telah menyelesaikan peminjaman pertama kalian.",
    take_away_ones: "Pertama, mari kita ambil satuannya.",
    take_away_tens: "Sekarang, mari kita ambil puluhannya.",
    collect_ones: "Bagus! Mari kumpulkan sisa satuan untuk menemukan jawabannya.",
    collect_tens: "Terakhir, mari kumpulkan sisa puluhannya.",
    collect_done: "Kamu telah menemukan jawabannya!<br><br>Ketuk '<b>Lanjut</b>' untuk melihat hasil akhirnya.",
    final_result:
      "Kita lihat bahwa 32 dikurangi 15 adalah 17.<br><br><strong style=\"text-align: center; width: 100%; display: block; font-size: 1.5rem;\">32 - 15 = 17</strong>",
    overlay_title: "Aktivitas Selesai!",
    overlay_message: "Jika kalian ingin mencoba lagi, ketuk tombol 'Mulai lagi'.",
  },
};

// --- Language Selection ---
const texts = flag === "INDONESIAN" ? textsIndonesian : textsEnglish;