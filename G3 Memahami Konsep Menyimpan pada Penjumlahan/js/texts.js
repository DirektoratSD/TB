const flag = "INDONESIAN"; // Change this to "INDONESIAN" to use the translated text

// --- English Text Data ---
const textsEnglish = {
  buttons: {
    start: "Start",
    next: "Next",
    borrow: "Borrow",
    take_away_ones: "Take Away Ones",
    take_away_tens: "Take Away Tens",
    collect_ones: "Collect Ones",
    collect_tens: "Collect Tens",
    start_task: "Next",
    add_unit: "Add Ones Place",
    add_ten: "Add Tens Place",
    unit_overflow: "Carry Over to Tens",
    okay: "Okay",
    start_over: "Start Over",
    lanjut: "Continue",
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
      "Let's learn addition with carry over!<br><br>These are our TENS and ONES containers.<br><br>Click 'Next' to continue.",
    step0_b:
      "Use the '+' and '-' buttons to place blocks inside the containers. <br><br>Click 'Next' to continue.",
    step0_c:
      "The number cards show the value of the blocks. <br><br>Click 'Next' to continue.",
    step1_tens:
      "Let's add 27 with 15.<br><br> First, make the number 27.<br><br>Tap the '+' on the TENS box 2 times.",
    step1_ones:
      "Great! Now set the ones.<br><br> Tap the '+' on the ONES box 7 times.",
    step1_complete: "Awesome! <br><br>You have represented the number 27.",
    step2_tens:
      "Now, let's show the other number, 15.<br><br>Tap the '+' on the TENS box in the second row 1 time.",
    step2_ones:
      "Perfect!<br><br> That's 1 ten.<br><br> Now for the ones. Tap the '+' 5 times.",
    step2_complete: "We have set up the problem: 27 + 15.",
    add_units1:
      "Now bring the cubes at ones place together.<br><br> Click on 'Next'.",
    unit_overflow:
      "Units place can not hold more than 9 cubes. <br><br>Carry 10 cubes over to tens place.",
    after_overflow: "Great job!<br><br>Now lets bring the rods together.",
    done: "Great! You have found the answer!",
    final_result:
      'We see that 27 plus 15 is 42.<br><br><strong style="text-align: center; width: 100%; display: block; font-size: 1.5rem;">27 + 15 = 42</strong>',
    overlay_carry_heading:
      "Well done! You have completed your first carry over.",
    overlay_carry_message:
      "Whenever ones place has more than 9 cubes,<br> we <b>combine</b> them to form one rod and <b>carry</b> them over to the tens place.",
    overlay_final_heading: "Activity Complete! ",
    overlay_final_message: `If you want to try again, click on the "Start Over" button.`,
  },
};
const tagsEnglish = {
  ones: "Ones",
  tens: "Tens",
  o: "O",
  t: "T",
};
const tagsIndonesian = {
  ones: "Satuan",
  tens: "Puluhan",
  o: "S",
  t: "P",
};
// --- Indonesian Text Data ---
const textsIndonesian = {
  buttons: {
    start: "Mulai",
    next: "Berikutnya",
    borrow: "Pinjam",
    take_away_ones: "Kurangi Satuan",
    take_away_tens: "Kurangi Puluhan",
    collect_ones: "Kumpulkan Satuan",
    collect_tens: "Kumpulkan Puluhan",
    start_task: "Berikutnya",
    add_unit: "Tambahkan Satuan",
    add_ten: "Tambahkan Puluhan",
    unit_overflow: "Bawa ke Puluhan",
    okay: "Oke",
    start_over: "Mulai Lagi",
    lanjut: "Lanjut",
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
      "Ayo belajar penjumlahan dengan menyimpan!<br><br>Ini adalah wadah PULUHAN dan SATUAN kita.<br><br>Ketuk 'Berikutnya' untuk melanjutkan.",
    step0_b:
      "Gunakan tombol '+' dan '-' untuk menempatkan balok ke dalam wadah.<br><br>Ketuk 'Berikutnya' untuk melanjutkan.",
    step0_c:
      "Kartu bilangan menunjukkan nilai dari balok.<br><br>Ketuk 'Berikutnya' untuk melanjutkan.",
    step1_tens:
      "Mari tambahkan 27 dengan 15.<br><br> Pertama, buat bilangan 27.<br><br>Ketuk tombol '+' pada kotak PULUHAN sebanyak 2 kali.",
    step1_ones:
      "Bagus! Sekarang atur satuannya.<br><br> Ketuk tombol '+' pada kotak SATUAN sebanyak 7 kali.",
    step1_complete: "Luar biasa!<br><br>Kamu telah merepresentasikan bilangan 27.",
    step_number_37: "Luar biasa! Kalian telah membuat bilangan 37.<br><br>Ketuk 'Lanjut' untuk melanjutkan.",
    step2_tens:
      "Sekarang, mari tampilkan bilangan lainnya, yaitu 15.<br><br>Ketuk tombol '+' pada kotak PULUHAN di baris kedua sebanyak 1 kali.",
    step2_ones:
      "Sempurna!<br><br> Itu 1 puluhan.<br><br> Sekarang untuk satuannya. Ketuk tombol '+' sebanyak 5 kali.",
    step2_complete: "Kita sudah menyiapkan soal: 27 + 15.",
    add_units1:
      "Sekarang gabungkan kotak di tempat satuan.<br><br>Ketuk 'Berikutnya'.",
    unit_overflow:
      "Tempat satuan tidak bisa menampung lebih dari 9 kotak.<br><br>Bawa 10 kotak ke tempat puluhan.",
    after_overflow:
      "Kerja bagus!<br><br>Sekarang mari kita gabungkan batangnya.",
    done: "Bagus! Kamu telah menemukan jawabannya!",
    final_result:
      'Kita lihat bahwa 27 ditambah 15 adalah 42.<br><br><strong style="text-align: center; width: 100%; display: block; font-size: 1.5rem;">27 + 15 = 42</strong>',
    overlay_carry_heading:
      "Kerja Bagus! Kalian telah menyelesaikan penyimpanan pertama kalian.",
    overlay_carry_message:
      "Setiap kali tempat satuan memiliki lebih dari 9 kotak, kita menggabungkannya menjadi 1 batang dan membawanya ke tempat puluhan.",
    overlay_final_heading: "Aktivitas selesai!",
    overlay_final_message: `Jika kalian ingin mencoba lagi, ketuk tombol "Mulai Lagi".`,
  },
};

// --- Language Selection ---
const texts = flag === "INDONESIAN" ? textsIndonesian : textsEnglish;
const tags = flag === "INDONESIAN" ? tagsIndonesian : tagsEnglish;
