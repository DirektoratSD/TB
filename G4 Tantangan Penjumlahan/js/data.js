// data.js - Internationalized text content and configuration data

// Problem numbers
const FIRST_NUMBER = 328;
const SECOND_NUMBER = 579;

const AppData = {
    // Default language (uses configuration from index.html)
    currentLanguage: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.defaultLanguage) ? APP_CONFIG.defaultLanguage : 'en',
    
    // Internationalized text content
    text: {
        en: {
            headerTitle: "Addition : Word Based Challenges",
            welcomeMessage: "Welcome to our mathematics adventure!",
            step0Message: `Welcome! This is our math problem: ${FIRST_NUMBER} + ${SECOND_NUMBER}. Let's solve it step by step!`,
            step0BottomMessage: "Click NEXT to start learning how to solve this addition problem.",
            stepAMessage: "Looks like we have a new challenge to solve!",
            stepABottomMessage: "Click on Next to proceed.",
            stepAQuestionText: "A palm oil farmer has several plantations. Plantation A produces 328 fruits, plantation B produces 579 fruits. How many palm oil fruits are produced from plantation A and plantation B?",
            stepBMessage: "Given facts:<br> A produces 328 fruits <br>B produces 579 fruits",
            stepBBottomMessage: "Click on Next to proceed.",
            stepBQuestionText: "A palm oil farmer has several plantations. Plantation A produces 328 fruits, plantation B produces 579 fruits. How many palm oil fruits are produced from plantation A and plantation B?",
            stepCMessage: "We need to find the total produced from A and B",
            stepCBottomMessage: "Click on Next to proceed.",
            stepCQuestionText: "A palm oil farmer has several plantations. Plantation A produces 328 fruits, plantation B produces 579 fruits. How many palm oil fruits are produced from plantation A and plantation B?",

            step1Message: "We have an addition challenge! Let's solve it!",
            step1BottomMessage: "Click on Next to proceed.",
            step2Message: "We have 3 places to add. Recall that we always start adding from right to left.",
            step2BottomMessage: "Click on Next to proceed.",
            step3Message: "We always start adding from right to left.",
            step3BottomMessage: "Choose the correct answer",
            step3NextMessage: "Click on Next to proceed",
            step3CorrectFeedback: "Correct! We go from right to left.",
            step3IncorrectFeedback: "Incorrect! Try Again.",
            step4Message: "Let's add the ones place",
            step4BottomMessage: "Tap on the \"plus\" sign",
            step4BottomMessageAfterClick: `What is ${FIRST_NUMBER % 10} + ${SECOND_NUMBER % 10} = ?`,
            step4BottomMessageFinal: "Click Next to proceed",
            step4CorrectFeedback: "Exactly! You are correct!",
            step4IncorrectFeedback: "No, that's incorrect. Try again.",
            
            // Step 5 additional messages
            step5InitialMessage: "Tap on {number} in the ones place.",
            step5AnimationMessage: "Watch the carry over process...",
            
            // Step 5 - Carrying over concept
            step5Message: "Oh No! We have TWO DIGITS in the ones place!",
            step5AnimationCompleteCharacterMessage: "We have added the ones place, let's move to the tens place.",
            step5BottomMessage: "Click NEXT to continue to the next step.",
            step5AnimationCompleteMessage: "Click Next to proceed",
            
            // Step 6 - Final state showing carrying result
            step6Message: "Let's add the tens place.",
            step6BottomMessage: "Tap on the \"plus\" sign",
            step6CompletedMessage: "You have added the tens place. Now let's go to hundreds place!",
            step6CompletedBottomMessage: "Click on Next to proceed.",
            
            // Step 7 - Final state showing completed tens addition
            step7Message: "Add the numbers at the hundreds place.",
            step7BottomMessage: "Tap on the \"plus\" sign",
            step7CompletedBottomMessage: "Click Next to proceed.",
            
            // Step 8 - Final state showing completed addition
            step8Message: "Perfect! You have completed the addition problem.",
            step8BottomMessage: `The final answer is ${FIRST_NUMBER} + ${SECOND_NUMBER} = ${FIRST_NUMBER + SECOND_NUMBER}`,
            
            // Step D - Understanding Goal (replica of step C, comes after step 8)
            stepDMessage: "Perfect! You have completed the challenge",
            stepDBottomMessage: "Successfully completed",
            stepDQuestionText: "A palm oil farmer has several plantations. Plantation A produces 328 fruits, plantation B produces 579 fruits. How many palm oil fruits are produced from plantation A and plantation B?",
            stepDBoxText: `A produces 328 fruits\nB produces 579 fruits\nA and B together produce ${FIRST_NUMBER + SECOND_NUMBER} fruits`,
            
            // Step 5 - Carrying over concept
            step5Message: "Oh No! We have TWO DIGITS in the ones place!",
            step5BottomMessage: "Click on the \"plus\" sign",
            step5BottomMessageAfterClick: `What is ${FIRST_NUMBER % 10} + ${SECOND_NUMBER % 10} = ?`,
            step5BottomMessageAfterAnswer: `Click on ${FIRST_NUMBER % 10 + SECOND_NUMBER % 10} to proceed`,
            step5BottomMessageFinal: `We can't have ${FIRST_NUMBER % 10 + SECOND_NUMBER % 10} in ones place`,
            step5CarryHeader: "Which digit should we carry forward?",
            step5CorrectFeedback: "Correct! We carry over tens digit to the tens place.",
            step5IncorrectFeedback: "No, we carry over tens digit to the tens place. Try again!",
            
            // Step 6 - Tens place addition with carry
            step6Message: "Now add the numbers at the TENS place",
            step6BottomMessage: "Click on the \"plus\" sign",
            step6BottomMessageAfterClick: `What is ${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`,
            step6BottomMessageAfterAnswer: `Click on ${Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} to proceed`,
            step6BottomMessageFinal: "We don't need to carry anything from tens place",
            step6CarryHeader: "Which digit should we carry forward?",
            step6CorrectFeedback: "Correct! No carrying needed for tens place.",
            step6IncorrectFeedback: "No, we don't need to carry anything. Try again!",
            
            // Step 7A - Hundreds place addition (no carry from tens)
            step7AMessage: "Finally, add the numbers at the HUNDREDS place",
            step7ABottomMessage: "Click on the \"plus\" sign",
            step7ABottomMessageAfterClick: `What is ${Math.floor(FIRST_NUMBER / 100)} + ${Math.floor(SECOND_NUMBER / 100)} = ?`,
            step7ACompletedBottomMessage: "Click NEXT to continue",
            step7ACorrectFeedback: "Perfect! You got it right.",
            step7AIncorrectFeedback: "Not quite right. Try again!",
            
            // Step 7B - Carrying over concept (replica of step 5)
            step7BMessage: "Oh No! We have TWO DIGITS in the tens place!",
            step7BInitialMessage: "Tap on {number} in the tens place.",
            step7BAnimationMessage: "Watch the carry over process...",
            step7BAnimationCompleteCharacterMessage: "We have added the tens place, let's move to the hundreds place.",
            step7BBottomMessage: "Click NEXT to continue to the next step.",
            step7BAnimationCompleteMessage: "Click Next to proceed",
            step7BPostAnimationMessage: "We have added the tens place, let's move to the hundreds place.",
            step7BBottomMessageAfterClick: `What is ${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`,
            step7BBottomMessageAfterAnswer: `Click on ${Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} to proceed`,
            step7BBottomMessageFinal: `We can't have ${Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} in tens place`,
            step7BCarryHeader: "Which digit should we carry forward?",
            step7BCarryFullHeader: "We can't have {number} in the tens place. Which digit should we carry forward?",
            step7BCorrectFeedback: "Correct! We carry over hundreds digit to the hundreds place.",
            step7BIncorrectFeedback: "No, we carry over hundreds digit to the hundreds place. Try again!",
            step7BHundredsBottomMessage: "Click on the \"plus\" sign",
            step7BHundredsBottomMessageAfterClick: `What is ${Math.floor(FIRST_NUMBER / 100)} + ${Math.floor(SECOND_NUMBER / 100)} + ${Math.floor((Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)) / 10)} = ?`,
            step7BCompletedBottomMessage: "Click NEXT to see the final answer",
            

            
            // Additional bottom messages for steps
            step5CompletedMessage: "Great! Now click NEXT to continue.",
            step6CompletedMessage: "Great! We have added the tens place correctly.",
            step7ACompletedMessage: "Great! Now click NEXT to continue.",
            step7BCompletedMessage: "Great! Now click NEXT to continue.",
            step7PlusClickedMessage: `What is ${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`,
            step7DefaultMessage: "Click on the \"plus\" sign in the TENS column",
            
            buttons: {
                previous: "Previous",
                next: "Next",
                reset: "Reset",
                hundreds: "H",
                tens: "T",
                units: "O"
            },
            stepNames: {
                stepA: "Step A: Problem Statement",
                stepB: "Step B: Given Facts", 
                stepC: "Step C: Understanding Goal",
                step1: "Step 1: Addition Challenge",
                step2: "Step 2: Place Value Order",
                step3: "Step 3: Direction (Right to Left)",
                step4: "Step 4: Add Ones Place",
                step5: "Step 5: Carry from Ones",
                step6: "Step 6: Add Tens Place", 
                step7A: "Step 7A: Add Hundreds Place",
                step7B: "Step 7B: Carry from Tens",
                step8: "Step 8: Final Answer",
                stepD: "Step D: Understanding Goal"
            }
        },
        id: {
            headerTitle: "Penjumlahan: Tantangan Berbasis Kata",
            welcomeMessage: "Selamat datang di petualangan matematika kami!",
            step0Message: `Selamat datang! Ini adalah soal matematika kita: ${FIRST_NUMBER} + ${SECOND_NUMBER}. Mari kita selesaikan langkah demi langkah!`,
            step0BottomMessage: "Klik SELANJUTNYA untuk mulai belajar cara menyelesaikan soal penjumlahan ini.",
            stepAMessage: "Sepertinya kita memiliki tantangan baru untuk diselesaikan!",
            stepABottomMessage: "Klik SELANJUTNYA untuk melanjutkan.",
            stepAQuestionText: "Seorang petani kelapa sawit mempunyai beberapa kebun. Kebun A menghasilkan 328 buah, kebun B menghasilkan 579 buah. Berapakah jumlah kelapa sawit yang dihasilkan dari kebun A dan kebun B?",
            stepBMessage: "Diketahui: <br>A = 328 buah <br>B = 579 buah",
            stepBBottomMessage: "Klik SELANJUTNYA untuk melanjutkan.",
            stepBQuestionText: "Seorang petani kelapa sawit mempunyai beberapa kebun. Kebun A menghasilkan 328 buah, kebun B menghasilkan 579 buah. Berapakah jumlah kelapa sawit yang dihasilkan dari kebun A dan kebun B?",
            stepCMessage: "Kita perlu mencari jumlah yang dihasilkan dari A dan B",
            stepCBottomMessage: "Klik SELANJUTNYA untuk melanjutkan.",
            stepCQuestionText: "Seorang petani kelapa sawit mempunyai beberapa kebun. Kebun A menghasilkan 328 buah, kebun B menghasilkan 579 buah. Berapakah jumlah kelapa sawit yang dihasilkan dari kebun A dan kebun B?",

            step1Message: "Kita memiliki tantangan PENJUMLAHAN! Mari kita selesaikan!",
            step1BottomMessage: "Klik SELANJUTNYA untuk melanjutkan.",
            step2Message: "Ada 3 tempat pada soal. Ingat selalu mulai jumlahkan dari kanan ke kiri",
            step2BottomMessage: "Klik Selanjutnya untuk melanjutkan.",
            step3Message: "Tempat mana yang kita TAMBAHKAN PERTAMA?",
            step3BottomMessage: "Pilih jawaban yang benar",
            step3NextMessage: "Klik SELANJUTNYA untuk melanjutkan",
            step3CorrectFeedback: "Benar! Kita mulai dari kanan ke kiri.",
            step3IncorrectFeedback: "Salah! Coba lagi.",
            step4Message: "Mari kita tambahkan tempat satuan",
            step4BottomMessage: "Ketuk pada tanda \"tambah\"",
            step4BottomMessageAfterClick: `Berapa ${FIRST_NUMBER % 10} + ${SECOND_NUMBER % 10} = ?`,
            step4BottomMessageFinal: "Klik SELANJUTNYA untuk melanjutkan",
            step4CorrectFeedback: "Tepat sekali! Kamu benar!",
            step4IncorrectFeedback: "Tidak, itu salah. Coba lagi.",
            
            // Step 5 additional messages
            step5InitialMessage: "Ketuk pada {number} di tempat satuan.",
            step5AnimationMessage: "Perhatikan proses membawa ke tempat berikutnya...",
            
            // Step 5 - Carrying over concept
            step5Message: "Oh Tidak! Kita memiliki DUA DIGIT di tempat satuan!",
            step5AnimationCompleteCharacterMessage: "Kita telah menambahkan tempat satuan, mari beralih ke tempat puluhan.",
            step5BottomMessage: "Klik SELANJUTNYA untuk melanjutkan ke langkah berikutnya.",
            step5AnimationCompleteMessage: "Klik Selanjutnya untuk melanjutkan",
            
            // Step 6 - Final state showing carrying result
            step6Message: "Mari kita tambahkan tempat puluhan.",
            step6BottomMessage: "Ketuk pada tanda \"tambah\"",
            step6CompletedMessage: "Kamu telah menambahkan tempat puluhan. Sekarang mari ke tempat ratusan!",
            step6CompletedBottomMessage: "Klik Selanjutnya untuk melanjutkan.",
            
            // Step 7 - Final state showing completed tens addition
            step7Message: "Jumlahkan angka-angka di tempat ratusan.",
            step7BottomMessage: "Ketuk pada tanda \"tambah\"",
            step7CompletedBottomMessage: "Klik Selanjutnya untuk melanjutkan.",
            
            // Step 8 - Final state showing completed addition
            step8Message: "Sempurna! Kamu telah menyelesaikan soal penjumlahan.",
            step8BottomMessage: `Jawaban akhirnya adalah ${FIRST_NUMBER} + ${SECOND_NUMBER} = ${FIRST_NUMBER + SECOND_NUMBER}`,
            
            // Step D - Understanding Goal (replica of step C, comes after step 8)
            stepDMessage: "Sempurna! Kamu telah menyelesaikan tantangan ini",
            stepDBottomMessage: "Aktivitas selesai. Klik 'Mulai Lagi' untuk mencoba lagi.",
            stepDQuestionText: "Seorang petani kelapa sawit mempunyai beberapa kebun. Kebun A menghasilkan 328 buah, kebun B menghasilkan 579 buah. Berapakah jumlah kelapa sawit yang dihasilkan dari kebun A dan kebun B?",
            stepDBoxText: `A menghasilkan 328 buah\nB menghasilkan 579 buah\nA dan B bersama-sama menghasilkan ${FIRST_NUMBER + SECOND_NUMBER} buah`,
            
            // Step 5 - Carrying over concept
            step5Message: "Oh Tidak! Kita memiliki DUA DIGIT di tempat satuan!",
            step5BottomMessage: "Klik pada tanda \"Tambah\"",
            step5BottomMessageAfterClick: `Berapa ${FIRST_NUMBER % 10} + ${SECOND_NUMBER % 10} = ?`,
            step5BottomMessageAfterAnswer: `Klik pada ${FIRST_NUMBER % 10 + SECOND_NUMBER % 10} untuk melanjutkan`,
            step5BottomMessageFinal: `Kita tidak bisa memiliki ${FIRST_NUMBER % 10 + SECOND_NUMBER % 10} di tempat satuan`,
            step5CarryHeader: "Digit mana yang harus kita bawa ke depan?",
            step5CorrectFeedback: "Benar! Kita membawa digit puluhan ke tempat puluhan.",
            step5IncorrectFeedback: "Tidak, kita membawa digit puluhan ke tempat puluhan. Coba lagi!",
            
            // Step 6 - Tens place addition with carry
            step6Message: "Sekarang jumlahkan angka-angka di tempat PULUHAN",
            step6BottomMessage: "Klik pada tanda \"Tambah\"",
            step6BottomMessageAfterClick: `Berapa ${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`,
            step6BottomMessageAfterAnswer: `Klik pada ${Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} untuk melanjutkan`,
            step6BottomMessageFinal: "Kita tidak perlu membawa apa-apa dari tempat puluhan",
            step6CarryHeader: "Digit mana yang harus kita bawa ke depan?",
            step6CorrectFeedback: "Benar! Tidak perlu membawa untuk tempat puluhan.",
            step6IncorrectFeedback: "Tidak, kita tidak perlu membawa apa-apa. Coba lagi!",
            
            // Step 7A - Hundreds place addition (no carry from tens)
            step7AMessage: "Akhirnya, jumlahkan angka-angka di tempat RATUSAN",
            step7ABottomMessage: "Klik pada tanda \"Tambah\"",
            step7ABottomMessageAfterClick: `Berapa ${Math.floor(FIRST_NUMBER / 100)} + ${Math.floor(SECOND_NUMBER / 100)} = ?`,
            step7ACompletedBottomMessage: "Klik SELANJUTNYA untuk melanjutkan",
            step7ACorrectFeedback: "Sempurna! Kamu benar.",
            step7AIncorrectFeedback: "Belum tepat. Coba lagi!",
            
            // Step 7B - Carrying over concept (replica of step 5)
            step7BMessage: "Oh Tidak! Kita memiliki DUA DIGIT di tempat puluhan!",
            step7BInitialMessage: "Ketuk pada {number} di tempat puluhan.",
            step7BAnimationMessage: "Perhatikan proses membawa ke tempat berikutnya...",
            step7BAnimationCompleteCharacterMessage: "Kita telah menambahkan tempat puluhan, mari beralih ke tempat ratusan.",
            step7BBottomMessage: "Klik SELANJUTNYA untuk melanjutkan ke langkah berikutnya.",
            step7BAnimationCompleteMessage: "Klik Selanjutnya untuk melanjutkan",
            step7BPostAnimationMessage: "Kita telah menambahkan tempat puluhan, mari beralih ke tempat ratusan.",
            step7BBottomMessageAfterClick: `Berapa ${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`,
            step7BBottomMessageAfterAnswer: `Klik pada ${Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} untuk melanjutkan`,
            step7BBottomMessageFinal: `Kita tidak bisa memiliki ${Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} di tempat puluhan`,
            step7BCarryHeader: "Digit mana yang harus kita bawa ke depan?",
            step7BCarryFullHeader: "Kita tidak bisa memiliki {number} di tempat puluhan. Digit mana yang harus kita bawa ke depan?",
            step7BCorrectFeedback: "Benar! Kita membawa digit ratusan ke tempat ratusan.",
            step7BIncorrectFeedback: "Tidak, kita membawa digit ratusan ke tempat ratusan. Coba lagi!",
            step7BHundredsBottomMessage: "Klik pada tanda \"Tambah\"",
            step7BHundredsBottomMessageAfterClick: `Berapa ${Math.floor(FIRST_NUMBER / 100)} + ${Math.floor(SECOND_NUMBER / 100)} + ${Math.floor((Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)) / 10)} = ?`,
            step7BCompletedBottomMessage: "Klik SELANJUTNYA untuk melihat jawaban akhir",
            

            
            // Additional bottom messages for steps
            step5CompletedMessage: "Bagus! Sekarang klik SELANJUTNYA untuk melanjutkan.",
            step6CompletedMessage: "Bagus! Sekarang klik SELANJUTNYA untuk melanjutkan.",
            step7ACompletedMessage: "Bagus! Sekarang klik SELANJUTNYA untuk melanjutkan.",
            step7BCompletedMessage: "Bagus! Sekarang klik SELANJUTNYA untuk melanjutkan.",
            step7PlusClickedMessage: `Berapa ${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`,
            step7DefaultMessage: "Klik pada tanda \"Tambah\" di kolom PULUHAN",

            buttons: {
                previous: "Sebelumnya",
                next: "Selanjutnya", 
                reset: "Mulai Lagi",
                hundreds: "H",
                tens: "T",
                units: "O"
            },
            stepNames: {
                stepA: "Langkah A: Pernyataan Masalah",
                stepB: "Langkah B: Fakta yang Diberikan", 
                stepC: "Langkah C: Memahami Tujuan",
                step1: "Langkah 1: Tantangan Penjumlahan",
                step2: "Langkah 2: Urutan Nilai Tempat",
                step3: "Langkah 3: Arah (Kanan ke Kiri)",
                step4: "Langkah 4: Tambah Tempat Satuan",
                step5: "Langkah 5: Membawa dari Satuan",
                step6: "Langkah 6: Tambah Tempat Puluhan", 
                step7A: "Langkah 7A: Tambah Tempat Ratusan",
                step7B: "Langkah 7B: Membawa dari Puluhan",
                step8: "Langkah 8: Jawaban Akhir",
                stepD: "Langkah D: Memahami Tujuan"
            }
        }
    },

    // Highlight definitions for each message
    highlights: {
        en: {
            step0Message: [
                { phrase: `${FIRST_NUMBER} + ${SECOND_NUMBER}`, className: "highlight-addition" }
            ],
            step0BottomMessage: [
                { word: "NEXT", className: "highlight-next" }
            ],
            stepAMessage: [
                { phrase: "new challenge", className: "highlight-addition" }
            ],
            stepABottomMessage: [
                { word: "Next", className: "highlight-next" }
            ],
            stepBMessage: [
                { phrase: "Given facts", className: "highlight-addition" }
            ],
            stepBBottomMessage: [
                { word: "Next", className: "highlight-next" }
            ],
            stepCMessage: [
                { phrase: "total produced", className: "highlight-addition" }
            ],
            stepCBottomMessage: [
                { word: "Next", className: "highlight-next" }
            ],
            stepDMessage: [
                { phrase: "completed the challenge", className: "highlight-addition" }
            ],
            stepDBottomMessage: [
                { word: "Successfully", className: "highlight-addition" }
            ],

            step1Message: [
                { word: "addition", className: "highlight-addition" }
            ],
            step1BottomMessage: [
                { word: "Next", className: "highlight-next" }
            ],
            step2Message: [
                { phrase: "right to left", className: "highlight-direction" }
            ],
            step2BottomMessage: [
                { word: "Next", className: "highlight-next" }
            ],
            step3Message: [
                { phrase: "right to left", className: "highlight-direction" }
            ],
            step3BottomMessage: [
            ],
            step4Message: [
                { word: "ones", className: "highlight-units-place" }
            ],
            step4BottomMessageAfterClick: [
                { phrase: `${FIRST_NUMBER % 10} + ${SECOND_NUMBER % 10} = ?`, className: "highlight-addition" }
            ],
            step4BottomMessageFinal: [
                { word: "NEXT", className: "highlight-next" }
            ],
            step5Message: [
                { phrase: "TWO DIGITS", className: "highlight-units-place" }
            ],
            step5BottomMessage: [
                { word: "NEXT", className: "highlight-next" }
            ],
            step5AnimationCompleteMessage: [
                { word: "tens", className: "highlight-tens-place" }
            ],
            step6Message: [
                { word: "tens", className: "highlight-tens-place" }
            ],
            step6BottomMessage: [
                { word: "NEXT", className: "highlight-next" }
            ],
            step5Message: [
                { phrase: "TWO DIGITS", className: "highlight-units-place" }
            ],
            step5BottomMessageAfterClick: [
                { phrase: `${FIRST_NUMBER % 10} + ${SECOND_NUMBER % 10} = ?`, className: "highlight-addition" }
            ],
            step5BottomMessageAfterAnswer: [
                { word: `${FIRST_NUMBER % 10 + SECOND_NUMBER % 10}`, className: "highlight-units-place" }
            ],
            step6Message: [
                { word: "TENS", className: "highlight-tens-place" }
            ],
            step6BottomMessageAfterClick: [
                { phrase: `${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`, className: "highlight-addition" }
            ],
            step6BottomMessageAfterAnswer: [
                { word: `${Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)}`, className: "highlight-tens-place" }
            ],
            step7AMessage: [
                { word: "HUNDREDS", className: "highlight-hundreds-place" }
            ],
            step7ABottomMessageAfterClick: [
                { phrase: `${Math.floor(FIRST_NUMBER / 100)} + ${Math.floor(SECOND_NUMBER / 100)} = ?`, className: "highlight-addition" }
            ],
            step7ABottomMessageFinal: [
                { word: "NEXT", className: "highlight-next" }
            ],
            step7BMessage: [
                { phrase: "TWO DIGITS", className: "highlight-tens-place" }
            ],
            step7BBottomMessageAfterClick: [
                { phrase: `${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`, className: "highlight-addition" }
            ],
            step7BBottomMessageAfterAnswer: [
                { word: `${Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)}`, className: "highlight-tens-place" }
            ],
            step7BBottomMessageFinal: [
                { word: "NEXT", className: "highlight-next" }
            ],
            step5CompletedMessage: [
                { word: "NEXT", className: "highlight-next" }
            ],
            step6CompletedMessage: [
                { word: "NEXT", className: "highlight-next" }
            ],
            step7ACompletedMessage: [
                { word: "NEXT", className: "highlight-next" }
            ],
            step7BCompletedMessage: [
                { word: "NEXT", className: "highlight-next" }
            ],
            step7PlusClickedMessage: [
                { phrase: `${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`, className: "highlight-addition" }
            ]
        },
        id: {
            step0Message: [
                { phrase: `${FIRST_NUMBER} + ${SECOND_NUMBER}`, className: "highlight-addition" }
            ],
            step0BottomMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            stepAMessage: [
                { phrase: "tantangan baru", className: "highlight-addition" }
            ],
            stepABottomMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            stepBMessage: [
                { phrase: "Fakta yang diberikan", className: "highlight-addition" }
            ],
            stepBBottomMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            stepCMessage: [
                { phrase: "total yang dihasilkan", className: "highlight-addition" }
            ],
            stepCBottomMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            stepDMessage: [
                { phrase: "menyelesaikan tantangan ini", className: "highlight-addition" }
            ],
            stepDBottomMessage: [
                { word: "Berhasil", className: "highlight-addition" }
            ],

            step1Message: [
                { word: "PENJUMLAHAN", className: "highlight-addition" }
            ],
            step1BottomMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            step2Message: [
                { phrase: "kanan ke kiri", className: "highlight-direction" }
            ],
            step2BottomMessage: [
                { word: "Selanjutnya", className: "highlight-next" }
            ],
            step3Message: [
                { phrase: "kanan ke kiri", className: "highlight-direction" }
            ],
            step3BottomMessage: [
            ],
            step4Message: [
                { word: "satuan", className: "highlight-units-place" }
            ],
            step4BottomMessageAfterClick: [
                { phrase: `${FIRST_NUMBER % 10} + ${SECOND_NUMBER % 10} = ?`, className: "highlight-addition" }
            ],
            step4BottomMessageFinal: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            step5Message: [
                { phrase: "DUA DIGIT", className: "highlight-units-place" }
            ],
            step5BottomMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            step5AnimationCompleteMessage: [
                { word: "puluhan", className: "highlight-tens-place" }
            ],
            step6Message: [
                { word: "puluhan", className: "highlight-tens-place" }
            ],
            step6BottomMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            step6CompletedMessage: [
                { word: "ratusan", className: "highlight-hundreds-place" }
            ],
            step6CompletedBottomMessage: [
                { word: "Selanjutnya", className: "highlight-next" }
            ],
            step7CompletedBottomMessage: [
                { word: "Selanjutnya", className: "highlight-next" }
            ],
            step6CompletedMessage: [
                { word: "hundreds", className: "highlight-hundreds-place" }
            ],
            step6CompletedBottomMessage: [
                { word: "Next", className: "highlight-next" }
            ],
            step7CompletedBottomMessage: [
                { word: "Next", className: "highlight-next" }
            ],
            step5Message: [
                { phrase: "DUA DIGIT", className: "highlight-units-place" }
            ],
            step5BottomMessageAfterClick: [
                { phrase: `${FIRST_NUMBER % 10} + ${SECOND_NUMBER % 10} = ?`, className: "highlight-addition" }
            ],
            step5BottomMessageAfterAnswer: [
                { word: `${FIRST_NUMBER % 10 + SECOND_NUMBER % 10}`, className: "highlight-units-place" }
            ],
            step6Message: [
                { word: "PULUHAN", className: "highlight-tens-place" }
            ],
            step6BottomMessageAfterClick: [
                { phrase: `${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`, className: "highlight-addition" }
            ],
            step6BottomMessageAfterAnswer: [
                { word: `${Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)}`, className: "highlight-tens-place" }
            ],
            step7AMessage: [
                { word: "RATUSAN", className: "highlight-hundreds-place" }
            ],
            step7ABottomMessageAfterClick: [
                { phrase: `${Math.floor(FIRST_NUMBER / 100)} + ${Math.floor(SECOND_NUMBER / 100)} = ?`, className: "highlight-addition" }
            ],
            step7ABottomMessageFinal: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            step7BMessage: [
                { phrase: "DUA DIGIT", className: "highlight-tens-place" }
            ],
            step7BBottomMessageAfterClick: [
                { phrase: `${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`, className: "highlight-addition" }
            ],
            step7BBottomMessageAfterAnswer: [
                { word: `${Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)}`, className: "highlight-tens-place" }
            ],
            step7BBottomMessageFinal: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            step5CompletedMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            step6CompletedMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            step7ACompletedMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            step7BCompletedMessage: [
                { word: "SELANJUTNYA", className: "highlight-next" }
            ],
            step7PlusClickedMessage: [
                { phrase: `${Math.floor((FIRST_NUMBER % 100) / 10)} + ${Math.floor((SECOND_NUMBER % 100) / 10)} + ${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)} = ?`, className: "highlight-addition" }
            ]
        }
    },
    
    // Helper function to get text in current language
    getText: function(key) {
        const keys = key.split('.');
        let value = this.text[this.currentLanguage];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                // Fallback to English if key not found
                value = this.text.en;
                for (const k of keys) {
                    if (value && value[k] !== undefined) {
                        value = value[k];
                    } else {
                        return `[Missing: ${key}]`;
                    }
                }
                break;
            }
        }
        
        return value;
    },

    // Helper function to get highlights for a text key
    getHighlights: function(key) {
        const highlights = this.highlights[this.currentLanguage];
        if (highlights && highlights[key]) {
            return highlights[key];
        }
        
        // Fallback to English highlights if not found
        const englishHighlights = this.highlights.en;
        if (englishHighlights && englishHighlights[key]) {
            return englishHighlights[key];
        }
        
        return [];
    },
    
    // Function to change language
    setLanguage: function(langCode) {
        if (this.text[langCode]) {
            this.currentLanguage = langCode;
            return true;
        }
        return false;
    },
    
    // Interactive Choice Question data for step 3
    step3ChoiceQuestion: {
        en: {
            headerText: "Which place do we ADD FIRST?",
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: "Hundreds",
                    isCorrect: false,
                    buttonFeedback: "No, that's not right! Try again."
                },
                {
                    buttonText: "Tens",
                    isCorrect: false,
                    buttonFeedback: "No, that's not right! Try again."
                },
                {
                    buttonText: "Ones",
                    isCorrect: true,
                    buttonFeedback: "You are right, we go from right to left!"
                }
            ]
        },
        id: {
            headerText: "Tempat mana yang kita TAMBAHKAN PERTAMA?",
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: "Ratusan",
                    isCorrect: false,
                    buttonFeedback: "Tidak, itu tidak benar! Coba lagi."
                },
                {
                    buttonText: "Puluhan",
                    isCorrect: false,
                    buttonFeedback: "Tidak, itu tidak benar! Coba lagi."
                },
                {
                    buttonText: "Satuan",
                    isCorrect: true,
                    buttonFeedback: "Kamu benar, kita mulai dari kanan ke kiri!"
                }
            ]
        }
    },

    // Helper function to get step 3 choice question data
    getStep3ChoiceQuestion: function() {
        const data = this.step3ChoiceQuestion[this.currentLanguage];
        if (data) {
            return data;
        }
        // Fallback to English
        return this.step3ChoiceQuestion.en;
    },

    // Interactive Choice Question data for step 4
    step4ChoiceQuestion: {
        en: {
            headerText: `What is ${FIRST_NUMBER % 10} + ${SECOND_NUMBER % 10} = ?`,
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: `${FIRST_NUMBER % 10 + SECOND_NUMBER % 10}`,
                    isCorrect: true,
                    buttonFeedback: "Exactly! You are correct!"
                },
                {
                    buttonText: "",
                    isCorrect: false,
                    buttonFeedback: "No, that's incorrect. Try again."
                },
                {
                    buttonText: "",
                    isCorrect: false,
                    buttonFeedback: "No, that's incorrect. Try again."
                }
            ]
        },
        id: {
            headerText: `Berapa ${FIRST_NUMBER % 10} + ${SECOND_NUMBER % 10} = ?`,
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: `${FIRST_NUMBER % 10 + SECOND_NUMBER % 10}`,
                    isCorrect: true,
                    buttonFeedback: "Tepat sekali! Kamu benar!"
                },
                {
                    buttonText: "",
                    isCorrect: false,
                    buttonFeedback: "Tidak, itu salah. Coba lagi."
                },
                {
                    buttonText: "",
                    isCorrect: false,
                    buttonFeedback: "Tidak, itu salah. Coba lagi."
                }
            ]
        }
    },

    // Helper function to get step 4 choice question data with random wrong answers
    getStep4ChoiceQuestion: function() {
        const data = JSON.parse(JSON.stringify(this.step4ChoiceQuestion[this.currentLanguage] || this.step4ChoiceQuestion.en));
        
        // Calculate correct answer dynamically
        const firstDigit = parseInt(String(FIRST_NUMBER).slice(-1)); // Units digit of first number
        const secondDigit = parseInt(String(SECOND_NUMBER).slice(-1)); // Units digit of second number
        const correctAnswer = firstDigit + secondDigit; // Sum of units digits
        
        // Generate two random wrong answers between 1 and 18 (excluding correct answer and ensuring difference of at least 5)
        const wrongAnswers = [];
        let attempts = 0;
        const maxAttempts = 100; // Prevent infinite loop
        
        while (wrongAnswers.length < 2 && attempts < maxAttempts) {
            const randomAnswer = Math.floor(Math.random() * 18) + 1; // Random number 1-18
            const difference = Math.abs(randomAnswer - correctAnswer);
            
            if (randomAnswer !== correctAnswer && 
                !wrongAnswers.includes(randomAnswer) && 
                difference >= 5) {
                wrongAnswers.push(randomAnswer);
            }
            attempts++;
        }
        
        // If we couldn't find enough wrong answers with difference >= 5, fill with specific values
        if (wrongAnswers.length < 2) {
            const fallbackOptions = [1, 2, 3, 4, 18, 17, 16, 15]; // Numbers far from correct answer
            for (const option of fallbackOptions) {
                if (wrongAnswers.length >= 2) break;
                if (option !== correctAnswer && 
                    !wrongAnswers.includes(option) && 
                    Math.abs(option - correctAnswer) >= 5) {
                    wrongAnswers.push(option);
                }
            }
        }
        
        // Update button texts
        data.buttons[0].buttonText = correctAnswer.toString();
        data.buttons[1].buttonText = wrongAnswers[0].toString();
        data.buttons[2].buttonText = wrongAnswers[1].toString();
        
        return data;
    },

    // Interactive Choice Question data for step 5
    step5ChoiceQuestion: {
        en: {
            headerText: `We can't have ${FIRST_NUMBER % 10 + SECOND_NUMBER % 10} in the ones place. Which digit should we carry forward?`,
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: `${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)}`,
                    isCorrect: true,
                    buttonFeedback: "Yes, we carry over the tens digit to the tens place"
                },
                {
                    buttonText: `${(FIRST_NUMBER % 10 + SECOND_NUMBER % 10) % 10}`,
                    isCorrect: false,
                    buttonFeedback: "No, we carry over the tens digit to the tens place. Try again!"
                }
            ]
        },
        id: {
            headerText: `Kita tidak bisa memiliki ${FIRST_NUMBER % 10 + SECOND_NUMBER % 10} di tempat satuan. Digit mana yang harus kita bawa ke depan?`,
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: `${Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)}`,
                    isCorrect: true,
                    buttonFeedback: "Ya, kita membawa digit puluhan ke tempat puluhan"
                },
                {
                    buttonText: `${(FIRST_NUMBER % 10 + SECOND_NUMBER % 10) % 10}`,
                    isCorrect: false,
                    buttonFeedback: "Tidak, kita membawa digit puluhan ke tempat puluhan. Coba lagi!"
                }
            ]
        }
    },

    // Helper function to get step 5 choice question data
    getStep5ChoiceQuestion: function() {
        const data = this.step5ChoiceQuestion[this.currentLanguage];
        if (data) {
            return data;
        }
        // Fallback to English
        return this.step5ChoiceQuestion.en;
    },

    // Interactive Choice Question data for step 6
    step6ChoiceQuestion: {
        en: {
            headerText: "", // Will be dynamically set
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: true,
                    buttonFeedback: "Yes, you are correct!"
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "No! Try again."
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "No! Try again."
                }
            ]
        },
        id: {
            headerText: "", // Will be dynamically set
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: true,
                    buttonFeedback: "Ya, kamu benar!"
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "Tidak! Coba lagi."
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "Tidak! Coba lagi."
                }
            ]
        }
    },

    // Helper function to get step 6 choice question data with dynamic calculation
    getStep6ChoiceQuestion: function() {
        const data = JSON.parse(JSON.stringify(this.step6ChoiceQuestion[this.currentLanguage] || this.step6ChoiceQuestion.en));
        
        // Calculate the tens place addition: carry digit + tens digit of first number + tens digit of second number
        const firstTensDigit = Math.floor((FIRST_NUMBER % 100) / 10); // Tens digit of first number
        const secondTensDigit = Math.floor((SECOND_NUMBER % 100) / 10); // Tens digit of second number
        const carryDigit = Math.floor((parseInt(String(FIRST_NUMBER).slice(-1)) + parseInt(String(SECOND_NUMBER).slice(-1))) / 10); // Carry from units
        
        const correctAnswer = carryDigit + firstTensDigit + secondTensDigit; // Sum of tens digits plus carry
        
        // Set header text
        data.headerText = `${carryDigit} + ${firstTensDigit} + ${secondTensDigit} = ?`;
        
        // Generate two random wrong answers between 0 and 18 (excluding correct answer)
        const wrongAnswers = [];
        let attempts = 0;
        const maxAttempts = 100;
        
        while (wrongAnswers.length < 2 && attempts < maxAttempts) {
            const randomAnswer = Math.floor(Math.random() * 19); // Random number 0-18
            
            if (randomAnswer !== correctAnswer && 
                !wrongAnswers.includes(randomAnswer)) {
                wrongAnswers.push(randomAnswer);
            }
            attempts++;
        }
        
        // If we couldn't find enough wrong answers, fill with specific values
        if (wrongAnswers.length < 2) {
            const fallbackOptions = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];
            for (const option of fallbackOptions) {
                if (wrongAnswers.length >= 2) break;
                if (option !== correctAnswer && !wrongAnswers.includes(option)) {
                    wrongAnswers.push(option);
                }
            }
        }
        
        // Update button texts
        data.buttons[0].buttonText = correctAnswer.toString();
        data.buttons[1].buttonText = wrongAnswers[0].toString();
        data.buttons[2].buttonText = wrongAnswers[1].toString();
        
        return data;
    },

    // Interactive Choice Question data for step 7A
    step7AChoiceQuestion: {
        en: {
            headerText: "", // Will be dynamically set
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: true,
                    buttonFeedback: "Yes! you are correct!"
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "No! Try again."
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "No! Try again."
                }
            ]
        },
        id: {
            headerText: "", // Will be dynamically set
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: true,
                    buttonFeedback: "Ya! kamu benar!"
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "Tidak! Coba lagi."
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "Tidak! Coba lagi."
                }
            ]
        }
    },

    // Interactive Choice Question data for step 7B (replica of step 5)
    step7BChoiceQuestion: {
        en: {
            headerText: "", // Will be dynamically set
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: true,
                    buttonFeedback: "Yes, we carry over the hundreds digit to the hundreds place"
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "No, we carry over the hundreds digit to the hundreds place. Try again!"
                }
            ]
        },
        id: {
            headerText: "", // Will be dynamically set
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: true,
                    buttonFeedback: "Ya, kita membawa digit ratusan ke tempat ratusan"
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "Tidak, kita membawa digit ratusan ke tempat ratusan. Coba lagi!"
                }
            ]
        }
    },

    // Helper function to get step 7A choice question data with dynamic calculation
    getStep7AChoiceQuestion: function() {
        const data = JSON.parse(JSON.stringify(this.step7AChoiceQuestion[this.currentLanguage] || this.step7AChoiceQuestion.en));
        
        // Calculate the hundreds place addition: hundreds digit of first number + hundreds digit of second number + carry digit (if any)
        const firstHundredsDigit = Math.floor(FIRST_NUMBER / 100); // Hundreds digit of first number
        const secondHundredsDigit = Math.floor(SECOND_NUMBER / 100); // Hundreds digit of second number
        const carryFromTens = Math.floor((Math.floor((FIRST_NUMBER % 100) / 10) + Math.floor((SECOND_NUMBER % 100) / 10) + Math.floor((FIRST_NUMBER % 10 + SECOND_NUMBER % 10) / 10)) / 10); // Carry from tens calculation
        
        const correctAnswer = firstHundredsDigit + secondHundredsDigit + carryFromTens; // Sum of hundreds digits plus carry
        
        // Set header text
        if (carryFromTens > 0) {
            data.headerText = `${firstHundredsDigit} + ${secondHundredsDigit} + ${carryFromTens} = ?`;
        } else {
            data.headerText = `${firstHundredsDigit} + ${secondHundredsDigit} = ?`;
        }
        
        // Generate two random wrong answers between 1 and 18 (excluding correct answer)
        const wrongAnswers = [];
        let attempts = 0;
        const maxAttempts = 100;
        
        while (wrongAnswers.length < 2 && attempts < maxAttempts) {
            const randomAnswer = Math.floor(Math.random() * 18) + 1; // Random number 1-18
            
            if (randomAnswer !== correctAnswer && 
                !wrongAnswers.includes(randomAnswer)) {
                wrongAnswers.push(randomAnswer);
            }
            attempts++;
        }
        
        // If we couldn't find enough wrong answers, fill with specific values
        if (wrongAnswers.length < 2) {
            const fallbackOptions = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18];
            for (const option of fallbackOptions) {
                if (wrongAnswers.length >= 2) break;
                if (option !== correctAnswer && !wrongAnswers.includes(option)) {
                    wrongAnswers.push(option);
                }
            }
        }
        
        // Update button texts
        data.buttons[0].buttonText = correctAnswer.toString();
        data.buttons[1].buttonText = wrongAnswers[0].toString();
        data.buttons[2].buttonText = wrongAnswers[1].toString();
        
        return data;
    },

    // Helper function to get step 7B choice question data with dynamic calculation (replica of step 5)
    getStep7BChoiceQuestion: function() {
        const data = JSON.parse(JSON.stringify(this.step7BChoiceQuestion[this.currentLanguage] || this.step7BChoiceQuestion.en));
        
        // Calculate the tens place sum for step 7B carrying logic
        const firstTensDigit = Math.floor((FIRST_NUMBER % 100) / 10); // Tens digit of first number
        const secondTensDigit = Math.floor((SECOND_NUMBER % 100) / 10); // Tens digit of second number
        const carryFromUnits = Math.floor((parseInt(String(FIRST_NUMBER).slice(-1)) + parseInt(String(SECOND_NUMBER).slice(-1))) / 10); // Carry from units
        const tensSum = firstTensDigit + secondTensDigit + carryFromUnits; // Sum of tens digits plus carry
        
        // Set header text using internationalized text
        const headerTemplate = this.getText('step7BCarryFullHeader');
        data.headerText = headerTemplate.replace('{number}', tensSum.toString());
        
        // For step 7B, we have two digits in tens place, so we set up the carry choice
        const carryDigit = Math.floor(tensSum / 10); // Digit to carry to hundreds
        const remainingDigit = tensSum % 10; // Digit to keep in tens
        
        // Update button texts - carry digit is correct, remaining digit is wrong
        data.buttons[0].buttonText = carryDigit.toString();
        data.buttons[1].buttonText = remainingDigit.toString();
        
        return data;
    },

    // Interactive Choice Question data for step 7B hundreds calculation
    step7BHundredsChoiceQuestion: {
        en: {
            headerText: "", // Will be dynamically set
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: true,
                    buttonFeedback: "Yes! you are correct!"
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "No! Try again."
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "No! Try again."
                }
            ]
        },
        id: {
            headerText: "", // Will be dynamically set
            isTryAgainActive: false,
            buttonOrder: "stack",
            componentBackgroundColor: "transparent",
            componentBackgroundOpacity: 1.0,
            defaultButtonColor: "#000000",
            defaultButtonOpacity: 0.7,
            buttons: [
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: true,
                    buttonFeedback: "Ya! kamu benar!"
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "Tidak! Coba lagi."
                },
                {
                    buttonText: "", // Will be dynamically set
                    isCorrect: false,
                    buttonFeedback: "Tidak! Coba lagi."
                }
            ]
        }
    },

    // Helper function to get step 7B hundreds choice question data with dynamic calculation
    getStep7BHundredsChoiceQuestion: function() {
        const data = JSON.parse(JSON.stringify(this.step7BHundredsChoiceQuestion[this.currentLanguage] || this.step7BHundredsChoiceQuestion.en));
        
        // Calculate the hundreds place addition: hundreds digit of first number + hundreds digit of second number + carry digit from tens
        const firstHundredsDigit = Math.floor(FIRST_NUMBER / 100); // Hundreds digit of first number
        const secondHundredsDigit = Math.floor(SECOND_NUMBER / 100); // Hundreds digit of second number
        
        // Calculate carry from tens place
        const firstTensDigit = Math.floor((FIRST_NUMBER % 100) / 10);
        const secondTensDigit = Math.floor((SECOND_NUMBER % 100) / 10);
        const carryFromUnits = Math.floor((parseInt(String(FIRST_NUMBER).slice(-1)) + parseInt(String(SECOND_NUMBER).slice(-1))) / 10);
        const tensSum = firstTensDigit + secondTensDigit + carryFromUnits;
        const carryFromTens = Math.floor(tensSum / 10); // Carry from tens to hundreds
        
        const correctAnswer = firstHundredsDigit + secondHundredsDigit + carryFromTens; // Sum of hundreds digits plus carry
        
        // Set header text
        data.headerText = `${firstHundredsDigit} + ${secondHundredsDigit} + ${carryFromTens} = ?`;
        
        // Generate two random wrong answers between 1 and 18 (excluding correct answer)
        const wrongAnswers = [];
        let attempts = 0;
        const maxAttempts = 100;
        
        while (wrongAnswers.length < 2 && attempts < maxAttempts) {
            const randomAnswer = Math.floor(Math.random() * 18) + 1; // Random number 1-18
            
            if (randomAnswer !== correctAnswer && 
                !wrongAnswers.includes(randomAnswer)) {
                wrongAnswers.push(randomAnswer);
            }
            attempts++;
        }
        
        // If we couldn't find enough wrong answers, fill with specific values
        if (wrongAnswers.length < 2) {
            const fallbackOptions = [1, 2, 3, 4, 5, 8, 10, 11, 12, 14, 15, 16, 17, 18];
            for (const option of fallbackOptions) {
                if (wrongAnswers.length >= 2) break;
                if (option !== correctAnswer && !wrongAnswers.includes(option)) {
                    wrongAnswers.push(option);
                }
            }
        }
        
        // Update button texts
        data.buttons[0].buttonText = correctAnswer.toString();
        data.buttons[1].buttonText = wrongAnswers[0].toString();
        data.buttons[2].buttonText = wrongAnswers[1].toString();
        
        return data;
    },

    // Helper function to get the initial step based on visibility settings
    getInitialStep: function() {
        // Check if STEP_VISIBILITY is available (from constants.js)
        if (typeof STEP_VISIBILITY !== 'undefined') {
            if (STEP_VISIBILITY.SHOW_INTRODUCTION_STEPS) {
                if (STEP_VISIBILITY.SHOW_STEP_A) return 'A';
                if (STEP_VISIBILITY.SHOW_STEP_B) return 'B';
                if (STEP_VISIBILITY.SHOW_STEP_C) return 'C';
            }
        }
        // Default to step 1 if no intro steps are shown or STEP_VISIBILITY is not available
        return 1;
    },

    config: {
        characterImagePath: "assets/character_neutral.png",
        backgroundImagePath: "assets/background.png",
        totalSteps: 13, // Total number of steps in the learning module (steps A, B, C, 1-6, 7A, 7B, 8, D)
        get currentStep() {
            // Use the helper function to determine initial step dynamically
            return AppData.getInitialStep();
        }
    }
};