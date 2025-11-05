const texts = {
  en: {
    welcome_title: "Welcome!",
    start_speech:
      "Let's use fractions to estimate how much of the beaker is filled.",
    start_btn: "Start",
    screen2_speech:
      "This is a container where you can fill.<br>Consider this container as one whole.<br>Click Next to continue.",
    next_btn: "Next",
    screen3_speech:
      "This container has a slider.<br>Slide up or down to change the water level in the container.<br>Give it a try, then click 'Next'.",
    question_speech:
      "Let us pour the right amount into the beaker using the slider.<br>Adjust the slider to change the water level, then click 'Check' when you are ready.",
    q1_text:
      "Estimate <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>",
    q2_text:
      "Pour Less than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>",
    q3_text:
      "Pour Greater than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>",
    q4_text:
      "Estimate <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span>",
    q5_text:
      "Pour Less than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span>",
    q6_text:
      "Estimate <span class='fraction'><span class='numerator'>2</span><span class='denominator'>3</span></span>",
    q7_text:
      "Pour between <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span> and <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>",
    q8_text:
      "Pour between <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span> and <span class='fraction'><span class='numerator'>2</span><span class='denominator'>3</span></span>",
    check_btn: "Check",
    try_again_btn: "Try Again",
    feedback_greater:
      "That's more. Look at the level again and try filling it a bit less.",
    feedback_greater_q1:
      "That's more than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>. Look at the level again and try filling it a bit less.",
    feedback_less:
      "That's too less. Look at the level again and try filling it a bit more.",
    feedback_correct:
      "Well done! You filled {numerator} out of {denominator} equal parts. That's {fraction}. Click next to continue.",
    feedback_less_correct_q2:
      "Well done! You filled less than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>.",
    feedback_less_correct_q5:
      "Well done! You filled less than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span>.",
    feedback_greater_correct:
      "Well done! You filled more than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>.",
    feedback_equal:
      "That's exactly on the mark. The question asks for a value less or greater than the mark.",
    feedback_q7_wrong:
      "First, adjust the slider to fill one third of the beaker, then try filling half.",
    feedback_q7_correct:
      "Nice work! The beaker is filled just right— more than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span> but less than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>.",
    feedback_q8_wrong:
      "Check your fill!<br>It should be more than one-third and less than two-thirds of the beaker.",
    feedback_q8_correct:
      "Nice work! The beaker is filled just right— more than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span> but less than <span class='fraction'><span class='numerator'>2</span><span class='denominator'>3</span></span>.",
    feedback_greater_q5:
      "That's more than <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span>. Look at the level and try filling a little less.",
    end_speech:
      "Well done!<br>You are now a master at estimation of fractions. This will help us when we compare fractions later on.",
    start_again_btn: "Start Over",
  },
  id: {
    welcome_title: "Selamat Datang!",
    start_speech:
      "Kalian telah belajar cara membuat sebuah pecahan!  Sekarang, coba perkirakan pecahan dari banyaknya bagian gelas kimia yang terisi!",
    start_btn: "Mulai",
    screen2_speech:
      "Ini adalah gelas kimia yang bisa Kalian isi.<br>Anggap gelas kimia ini sebagai satu kesatuan.<br>Klik Berikutnya untuk melanjutkan.",
    next_btn: "Berikutnya",
    screen3_speech:
      "Gelas kimia ini memiliki penggeser.<br>Geser ke atas atau ke bawah untuk mengubah level air di dalam gelas kimia.<br>Cobalah, lalu klik 'Berikutnya'.",
    question_speech:
      "Mari kita tuangkan jumlah yang tepat ke dalam gelas kimia menggunakan penggeser.<br>Sesuaikan penggeser untuk mengubah level air, lalu klik 'Periksa' jika sudah siap.",
    q1_text:
      "Perkirakan <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>",
    q2_text:
      "Tuang Kurang dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>",
    q3_text:
      "Tuang Lebih dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>",
    q4_text:
      "Perkirakan <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span>",
    q5_text:
      "Tuang Kurang dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span>",
    q6_text:
      "Perkirakan <span class='fraction'><span class='numerator'>2</span><span class='denominator'>3</span></span>",
    q7_text:
      "Tuang di antara <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span> dan <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>",
    q8_text:
      "Tuang di antara <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span> dan <span class='fraction'><span class='numerator'>2</span><span class='denominator'>3</span></span>",
    check_btn: "Periksa",
    try_again_btn: "Coba Lagi",
    feedback_greater:
      "Itu lebih. Lihat lagi levelnya dan coba isi sedikit lebih sedikit.",
    feedback_greater_q1:
      "Itu lebih dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>. Lihat lagi levelnya dan coba isi sedikit lebih sedikit.",
    feedback_less:
      "Itu terlalu sedikit. Lihat lagi levelnya dan coba isi sedikit lagi.",
    feedback_correct:
      "Bagus sekali! Kalian mengisi {numerator} dari {denominator} bagian yang sama. Itu adalah {fraction}. Klik berikutnya untuk melanjutkan.",
    feedback_less_correct_q2:
      "Bagus sekali! Kalian mengisi kurang dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>.",
    feedback_less_correct_q5:
      "Bagus sekali! Kalian mengisi kurang dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span>.",
    feedback_greater_correct:
      "Bagus sekali! Kalian mengisi lebih dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>.",
    feedback_equal:
      "Itu tepat pada sasaran. Pertanyaannya meminta nilai yang lebih kecil atau lebih besar dari tanda.",
    feedback_q7_wrong:
      "Pertama, sesuaikan penggeser untuk mengisi sepertiga gelas kimia, lalu coba isi setengahnya.",
    feedback_q7_correct:
      "Kerja bagus! Gelas kimia terisi pas— lebih dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span> tapi kurang dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>2</span></span>.",
    feedback_q8_wrong:
      "Periksa isian Kalian!<br>Seharusnya lebih dari sepertiga dan kurang dari dua pertiga gelas kimia.",
    feedback_q8_correct:
      "Kerja bagus! Gelas kimia terisi pas— lebih dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span> tapi kurang dari <span class='fraction'><span class='numerator'>2</span><span class='denominator'>3</span></span>.",
    feedback_greater_q5:
      "Itu lebih dari <span class='fraction'><span class='numerator'>1</span><span class='denominator'>3</span></span>. Lihat lagi levelnya dan coba isi sedikit lebih sedikit.",
    end_speech:
      "Bagus sekali!<br>Kalian sekarang ahli dalam memperkirakan pecahan. Ini akan membantu kita saat membandingkan pecahan nanti.",
    start_again_btn: "Mulai Ulang",
  },
};
