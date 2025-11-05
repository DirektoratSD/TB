// data.js - Internationalization data for the Learning Applet
// Cleaned up to include only text content that's actually used in the app

const AppData = {
    // Current language setting
    currentLanguage: 'id',
    
    // Available languages
    languages: {
        en: { name: 'English', code: 'en' },
        id: { name: 'Bahasa Indonesia', code: 'id' }
    },
    
    // Text content by language
    translations: {
        en: {
            // Character messages - Used in math-applet.js
            character: {
                welcome: "Welcome to Math Learning! Choose an activity to get started."
            },
            
            // Dialog messages for different pages/contexts
            dialogs: {
                // Page 1 - Default/Demo page
                page1: {
                    dialogtext: "Let's solve this addition challenge.", // Will be made dynamic based on carry over requirement
                    dialogtext_carryover: "Let's solve this addition challenge with carry overs.",
                    instruction: "You can interact with the elements on this page to see how the grid system works.",
                    getStarted: "Ready to get started? Click anywhere to begin!"
                },
                
                // Page 2
                page2: {
                    dialogtext: "Split the numbers into their place values."
                },
                
                // Page 3
                page3: {
                    dialogtext: "Choose the correct sequence of addition"
                },
                
                // Page 4
                page4: {
                    dialogtext: "Now, it's time to add. \n\nLet's start with the ones column."
                },
                
                // Page 5
                page5: {
                    dialogtext: "Let us add the numbers at the ones place."
                },
                
                // Page 6
                page6: {
                    dialogtext: "Oh! We have more than 9 in the ones place.\n\nWe need to do a carry over."
                },
                
                // Page 7
                page7: {
                    dialogtext: "Oh! We have more than 9 in the ones place.\n\nWe need to do a carry over."
                },
                
                // Page 8
                page8: {
                    dialogtext: "We have split correctly.", // Will be made dynamic with onesdigitsum
                    splitCorrectly: "We have split {value} correctly."
                },
                
                // Page 9
                page9: {
                    dialogtext: "We have completed the carry over, now let's move to the tens column."
                },
                
                // Page 10
                page10: {
                    dialogtext: "We have completed the carry over, now let's move to the tens column."
                },
                
                // Page 11
                page11: {
                    dialogtext: "Let us add the numbers at the tens place."
                },
                
                // Page 12
                page12: {
                    dialogtext: "Uh-oh!\n\nWe have more than 90 in the tens place.\nTime to do a carry over."
                },
                
                // Page 13
                page13: {
                    dialogtext: "Uh-oh!\n\nWe have more than 90 in the tens place.\nTime to do a carry over."
                },
                
                // Page 14
                page14: {
                    dialogtext: "We have split correctly.", // Will be made dynamic with tensdigitsum
                    splitCorrectly: "We have split {value} correctly."
                },
                
                // Page 15
                page15: {
                    dialogtext: "We have completed the carry over, now let's move to the hundreds column."
                },
                
                // Page 16
                page16: {
                    dialogtext: "We have completed the carry over, now let's move to the hundreds column."
                },
                
                // Page 17
                page17: {
                    dialogtext: "Let us add the numbers at hundreds place"
                },
                
                // Page 18
                page18: {
                    dialogtext: "We have completed the carry over and added all columns."
                },
                
                // Page 19
                page19: {
                    dialogtext: "Now, we need to compose the answer from results obtained in all the columns."
                },
                
                // Page 20
                page20: {
                    dialogtext: "Good work!\n\nYou have added the numbers correctly."
                },
                
                // General dialog messages
                general: {
                    loading: "Loading...",
                    error: "Oops! Something went wrong. Please try again.",
                    success: "Great job! You're doing well!",
                    continue: "Click to continue",
                    help: "Need help? Click the help button for more information."
                },
                
                // Math-specific dialogs
                math: {
                    problemIntro: "Let's solve this math problem together!",
                    showWork: "Remember to show your work step by step.",
                    checkAnswer: "Check your answer when you're ready.",
                    correct: "Excellent! Your answer is correct!",
                    incorrect: "Not quite right. Let's try again!",
                    hint: "Here's a hint to help you solve this problem."
                },
                
                // UI Elements
                buttons: {
                    next: "Next",
                    previous: "Previous",
                    carryOver: "Carry Over",
                    tryNew: "Try New",
                    startAgain: "Start Again"
                },
                
                                // Quiz content
                        quiz: {
            whichColumnFirst: "Which column do we add first?",
            howShouldWeSplit: "To do a carry over, how should we split {value}?",
            splitForCarryOver: "{value} > {threshold}\n\nWe need to split {value} to do a carry over to {place} place.",
            splitForCarryOverTens: "{value} > 9\n\nWe need to split {value} to do a carry over to tens place.",
            splitForCarryOverHundreds: "{value} > 90\n\nWe need to split {value} to do a carry over to hundreds place.",
            notQuiteRight: "Not quite right. Think about how to split the value for carry over to hundreds place.",
            correct: "Correct!",
            incorrect: "No, that is incorrect. Try again!",
            // Column options
            hundreds: "Hundreds",
            tens: "Tens",
            ones: "Ones",
            // Place value headers
            hundredsHeader: "H",
            tensHeader: "T",
            onesHeader: "O",
            // Feedback messages
            rightDirection: "You are right - we go from right to left!",
            notRight: "No, that's not right!",
            tryAgain: "We add from right to left. Try again!",
            carryMessage: "We need to carry 10 to the tens place. So, we split {value} as 10 + {remaining}.",
            carryErrorMessage: "We need to carry 10 to the tens place, not {incorrect}. Try again!",
            splitCorrect: "We have split {value} correctly",
            absolutelyCorrect: "That's absolutely correct!",
            missedAdding: "Looks like you missed adding 10. Try again!",
            // Success message for completed questions
            completedAllQuestions: "You have completed all the challenges!"
        },
        
                // Instructions  
                instructions: {
                    tapFirstNumber: "Tap on the first number",
                    tapSecondNumber: "Tap on the second number", 
                    tapThirdNumber: "Tap on the third number",
                    tapPlusSign: "Tap on the plus sign",
                    clickTryNew: "Click on Try New for the next question.",
                    clickCarryOver: "Click on Carry Over",
                    clickNextToContinue: "Click on Next to continue."
                }
            },
                
            // App info
            appInfo: {
                title: "Learn Long Column Addition",
                titleEditor: "Learn Long Column Addition (Editor Mode)"
            },
            
            // Grid positioning system - Used in gridpositions.js
            gridPositions: {
                // Standard elements descriptions
                standardElements: {
                    header: "Main header area spanning full width",
                    footer: "Footer area at bottom of screen",
                    leftSidebar: "Left sidebar for navigation or character",
                    rightSidebar: "Right sidebar for tools or info",
                    mainContent: "Main content area in center",
                    fullContent: "Full content area (no sidebars)",
                    modalCenter: "Centered modal or popup",
                    topBanner: "Top banner below header",
                    bottomControls: "Bottom control panel",
                    buttonRowCenter: "Horizontal button group in center",
                    buttonColumnRight: "Vertical button group on right",
                    topLeft: "Top left quadrant",
                    topRight: "Top right quadrant",
                    bottomLeft: "Bottom left quadrant",
                    bottomRight: "Bottom right quadrant"
                },
                
                // Screen elements descriptions
                screenElements: {
                    characterArea: "Character display area on left side",
                    dialogBubble: "Dialog bubble next to character",
                    manualContainer: "Manual container for interactive elements",
                    activityArea: "Main activity/learning area",
                    problemDisplay: "Math problem display area",
                    answerArea: "Answer input area",
                    feedbackArea: "Feedback message area",
                    gameBoard: "Game board or activity canvas",
                    scoreDisplay: "Score or progress display",
                    menuGrid: "Grid layout for menu items",
                    titleArea: "Title or heading area"
                }
            }
        },
        
        id: {
            // Indonesian translations
            character: {
                welcome: "Selamat datang di Pembelajaran Matematika! Pilih aktivitas untuk memulai."
            },
            
            // Dialog messages for different pages/contexts
            dialogs: {
                // Page 1 - Default/Demo page
                page1: {
                    dialogtext: "Ayo kita selesaikan tantangan penjumlahan ini.",
                    dialogtext_carryover: "Ayo kita selesaikan tantangan penjumlahan ini dengan menyimpan",
                    instruction: "Anda dapat berinteraksi dengan elemen di halaman ini untuk melihat cara kerja sistem grid.",
                    getStarted: "Siap untuk memulai? Klik di mana saja untuk memulai!"
                },
                
                // Page 2
                page2: {
                    dialogtext: "Pisahkan bilangan-bilangan ke dalam nilai tempat mereka."
                },
                
                // Page 3
                page3: {
                    dialogtext: "Pilih urutan penjumlahan yang benar"
                },
                
                // Page 4
                page4: {
                    dialogtext: "Sekarang, saatnya menjumlah. \n\nMari mulai dari kolom satuan."
                },
                
                // Page 5
                page5: {
                    dialogtext: "Mari kita tambahkan bilangan di tempat satuan."
                },
                
                // Page 6
                page6: {
                    dialogtext: "Oh! Kita memiliki lebih dari 9 tempat satuan. Kita perlu melakukan penyimpanan."
                },
                
                // Page 7
                page7: {
                    dialogtext: "Oh! Kita memiliki lebih dari 9 tempat satuan. Kita perlu melakukan penyimpanan."
                },
                
                // Page 8
                page8: {
                    dialogtext: "Kita telah memisahkan dengan benar.", // Will be made dynamic with onesdigitsum
                    splitCorrectly: "Kita telah memisahkan {value} dengan benar."
                },
                
                // Page 9
                page9: {
                    dialogtext: "Kita telah selesai penyimpanan, sekarang mari beralih ke kolom puluhan."
                },
                
                // Page 10
                page10: {
                    dialogtext: "Kita telah selesai penyimpanan, sekarang mari beralih ke kolom puluhan."
                },
                
                // Page 11
                page11: {
                    dialogtext: "Mari kita tambahkan bilangan di tempat puluhan."
                },
                
                // Page 12
                page12: {
                    dialogtext: "Uh-oh!\n\nKita memiliki lebih dari 90 di tempat puluhan.\nSaatnya menyimpan!"
                },
                
                // Page 13
                page13: {
                    dialogtext: "Uh-oh!\n\nKita memiliki lebih dari 90 di tempat puluhan.\nSaatnya menyimpan!"
                },
                
                // Page 14
                page14: {
                    dialogtext: "Kita telah memisahkan dengan benar.", // Will be made dynamic with tensdigitsum
                    splitCorrectly: "Kita telah memisahkan {value} dengan benar."
                },
                
                // Page 15
                page15: {
                    dialogtext: "Kita telah selesai penyimpanan, sekarang mari beralih ke kolom ratusan."
                },
                
                // Page 16
                page16: {
                    dialogtext: "Kita telah selesai penyimpanan, sekarang mari beralih ke kolom ratusan."
                },
                
                // Page 17
                page17: {
                    dialogtext: "Mari kita tambahkan bilangan di tempat ratusan"
                },
                
                // Page 18
                page18: {
                    dialogtext: "Kita telah selesai penyimpanan dan menambahkan semua kolom."
                },
                
                // Page 19
                page19: {
                    dialogtext: "Sekarang, kita perlu menyusun jawabannya dari hasil yang diperoleh di semua kolom."
                },
                
                // Page 20
                page20: {
                    dialogtext: "Kerja bagus! Kalian telah menjumlahkan bilangan dengan benar."
                },
                
                // General dialog messages
                general: {
                    loading: "Memuat...",
                    error: "Ups! Ada yang salah. Silakan coba lagi.",
                    success: "Kerja bagus! Anda melakukannya dengan baik!",
                    continue: "Klik untuk melanjutkan",
                    help: "Butuh bantuan? Klik tombol bantuan untuk informasi lebih lanjut."
                },
                
                // Math-specific dialogs
                math: {
                    problemIntro: "Mari kita selesaikan soal matematika ini bersama!",
                    showWork: "Ingat untuk menunjukkan langkah-langkah kerjamu.",
                    checkAnswer: "Periksa jawabanmu ketika sudah siap.",
                    correct: "Luar biasa! Jawabanmu benar!",
                    incorrect: "Belum tepat. Mari coba lagi!",
                    hint: "Ini adalah petunjuk untuk membantu menyelesaikan masalah ini."
                },
                
                // UI Elements
                buttons: {
                    next: "Selanjutnya",
                    previous: "Sebelumnya",
                    carryOver: "Simpan",
                    tryNew: "Coba Baru",
                    startAgain: "Mulai Lagi"
                },
                
                // Quiz content
                quiz: {
                    whichColumnFirst: "Kolom mana yang kita tambahkan terlebih dahulu?",
                    howShouldWeSplit: "Bagaimana kita membagi {value}?",
                    splitForCarryOver: "{value} > {threshold}\n\nKita perlu membagi {value} untuk menyimpan ke tempat {place}.",
                    splitForCarryOverTens: "{value} > 9\n\nKita perlu membagi {value} untuk menyimpan ke tempat puluhan.",
                    splitForCarryOverHundreds: "{value} > 90\n\nKita perlu membagi {value} untuk menyimpan ke tempat ratusan.",
                    notQuiteRight: "Belum tepat. Pikirkan tentang cara membagi nilai untuk menyimpan ke tempat ratusan.",
                    correct: "Benar!",
                    incorrect: "Tidak, itu salah. Coba lagi!",
                    // Column options
                    hundreds: "Ratusan",
                    tens: "Puluhan",
                    ones: "Satuan",
                    // Place value headers
                    hundredsHeader: "R",
                    tensHeader: "P",
                    onesHeader: "S",
                    // Feedback messages
                    rightDirection: "Kamu benar - kita mulai dari kanan ke kiri!",
                    notRight: "Tidak, itu tidak benar!",
                    tryAgain: "Kita menambahkan dari kanan ke kiri. Coba lagi!",
                    carryMessage: "Kita perlu membawa 10 ke tempat puluhan. Jadi, kita membagi {value} sebagai 10 + {remaining}.",
                    carryErrorMessage: "Kita perlu membawa 10 ke tempat puluhan, bukan {incorrect}. Coba lagi!",
                    splitCorrect: "Kita telah memisahkan {value} dengan benar",
                    absolutelyCorrect: "Itu benar sekali!",
                    missedAdding: "Sepertinya kamu terlewat menambahkan 10. Coba lagi!",
                    // Success message for completed questions
                    completedAllQuestions: "Kalian telah menyelesaikan semua tantangan! Mulai lagi!"
                },
                
                // Instructions
                instructions: {
                    tapFirstNumber: "Ketuk bilangan pertama",
                    tapSecondNumber: "Ketuk bilangan kedua", 
                    tapThirdNumber: "Ketuk bilangan ketiga",
                    tapPlusSign: "Ketuk tanda tambah",
                    clickTryNew: "Klik Coba Baru untuk soal berikutnya",
                    clickCarryOver: "Klik Simpan",
                    clickNextToContinue: "Klik Selanjutnya untuk melanjutkan."
                }
            },
                
            // App info
            appInfo: {
                title: "Belajar Penjumlahan Bersusun Panjang",
                titleEditor: "Belajar Penjumlahan Kolom Panjang (Mode Editor)"
            },
            
            // Grid positioning system
            gridPositions: {
                // Standard elements descriptions
                standardElements: {
                    header: "Area header utama yang membentang penuh lebar",
                    footer: "Area footer di bagian bawah layar",
                    leftSidebar: "Sidebar kiri untuk navigasi atau karakter",
                    rightSidebar: "Sidebar kanan untuk alat atau info",
                    mainContent: "Area konten utama di tengah",
                    fullContent: "Area konten penuh (tanpa sidebar)",
                    modalCenter: "Modal atau popup yang dipusatkan",
                    topBanner: "Banner atas di bawah header",
                    bottomControls: "Panel kontrol bawah",
                    buttonRowCenter: "Grup tombol horizontal di tengah",
                    buttonColumnRight: "Grup tombol vertikal di kanan",
                    topLeft: "Kuadran kiri atas",
                    topRight: "Kuadran kanan atas",
                    bottomLeft: "Kuadran kiri bawah",
                    bottomRight: "Kuadran kanan bawah"
                },
                
                // Screen elements descriptions
                screenElements: {
                    characterArea: "Area tampilan karakter di sisi kiri",
                    dialogBubble: "Gelembung dialog di sebelah karakter",
                    manualContainer: "Kontainer manual untuk elemen interaktif",
                    activityArea: "Area aktivitas/pembelajaran utama",
                    problemDisplay: "Area tampilan soal matematika",
                    answerArea: "Area input jawaban",
                    feedbackArea: "Area pesan umpan balik",
                    gameBoard: "Papan permainan atau kanvas aktivitas",
                    scoreDisplay: "Tampilan skor atau kemajuan",
                    menuGrid: "Tata letak grid untuk item menu",
                    titleArea: "Area judul atau heading"
                }
            }
        }
    },
    
    config: {
        characterImagePath: "assets/character_neutral.png",
        backgroundImagePath: "assets/background.png"
    }
};

// Simple i18n utility functions
const i18n = {
    // Get current language
    getCurrentLanguage: () => AppData.currentLanguage,
    
    // Set language
    setLanguage: (langCode) => {
        if (AppData.translations[langCode]) {
            AppData.currentLanguage = langCode;
            // Save to localStorage (use consistent key with index.html)
            localStorage.setItem('appLanguage', langCode);
            console.log(`🌐 i18n: Language set to ${langCode}`);
            return true;
        }
        console.warn(`🌐 i18n: Language ${langCode} not supported`);
        return false;
    },
    
    // Initialize language from localStorage
    initLanguage: () => {
        // Check for forced language first (from APP_CONFIG if available)
        if (typeof window.APP_CONFIG !== 'undefined' && window.APP_CONFIG.FORCE_LANGUAGE) {
            if (AppData.translations[window.APP_CONFIG.FORCE_LANGUAGE]) {
                AppData.currentLanguage = window.APP_CONFIG.FORCE_LANGUAGE;
                console.log(`🌐 i18n: Using forced language: ${window.APP_CONFIG.FORCE_LANGUAGE}`);
                return;
            }
        }
        
        // Otherwise use saved language
        const savedLang = localStorage.getItem('appLanguage');
        if (savedLang && AppData.translations[savedLang]) {
            AppData.currentLanguage = savedLang;
            console.log(`🌐 i18n: Using saved language: ${savedLang}`);
        } else {
            console.log(`🌐 i18n: Using default language: ${AppData.currentLanguage}`);
        }
    },
    
    // Get translated text
    t: (key, params = {}) => {
        const lang = AppData.currentLanguage;
        const translation = AppData.translations[lang];
        
        // Navigate through nested object using dot notation
        const keys = key.split('.');
        let value = translation;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to English if translation not found
                value = AppData.translations.en;
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object' && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else {
                        return `[Missing: ${key}]`;
                    }
                }
                break;
            }
        }
        
        // Handle array values (like encouragement messages)
        if (Array.isArray(value)) {
            return value[Math.floor(Math.random() * value.length)];
        }
        
        // Replace parameters in string
        if (typeof value === 'string') {
            return value.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param] || match;
            });
        }
        
        return value || `[Missing: ${key}]`;
    },
    
    // Get available languages
    getLanguages: () => AppData.languages
};

// Note: Language initialization moved to index.html after APP_CONFIG is defined
// i18n.initLanguage(); // Commented out - now called from index.html