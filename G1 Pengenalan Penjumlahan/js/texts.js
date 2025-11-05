// js/texts.js
// ==================================================================
// === LANGUAGE SELECTOR - ONLY EDIT THE VALUE IN THIS LINE ===
// ==================================================================
// Change this value to 'id' for Indonesian Bahasa or 'en' for English.
const CURRENT_LANGUAGE = "id";
// ==================================================================

// Contains all text data for all supported languages.
const ALL_TEXTS = {
  // English Text Data
  en: {
    pageTitle: "Counting Clouds",
    titleBar: {
      heading: "Counting Fun",
      subheading: "Count the items on the clouds.",
    },
    buttons: {
      next: "Next",
      previous: "Previous",
      start_over: "Start Over",
      join: "Join", // MODIFIED: Added join button text
      start: "Start",
    },
    welcome: {
      description:
        "It's time to learn addition by bringing objects together! Are you ready?",
    },
    characters: {
      normal: "assets/Normal.png",
      happy: "assets/Happy.png",
      sad: "assets/Sad.png",
      thinking: "assets/Thinking.png",
    },
    assets: {
      balloon: "assets/balloon.png",
      star: "assets/toffee.png",
      logo: "assets/logo.png",
    },
    audio: {
      correct: "assets/sfx/correct.mp3",
      wrong: "assets/sfx/wrong.mp3",
      click: "assets/sfx/click.mp3",
      confetti: "assets/sfx/confetti.mp3",
    },
    misc: {
      and: "and",
      make: "make",
    },
    questions: [
      {
        id: 1,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 3,
        rightCloudCount: 2,
        prompt: {
          initial:
            "How many balloons are on the <span style='color:rgb(118, 205, 255);'>blue</span> cloud?",
          rightCloudQuestion:
            "And how many are on the <span style='color:rgb(253, 119, 29);'>orange</span> cloud?",
          mergedCloudQuestion: "How many balloons are there in total?",
          correct: "That's right!",
          incorrect: "Not quite, try again!",
          contextPrompts: {
            left: "First, let's count the balloons on the blue cloud.",
            right: "Great! Now, let's count the balloons on the orange cloud.",
            merging: "Now click <b>Join</b> to bring them together!", // MODIFIED
            merged: "What is the total number of balloons now?",
            done: "Fantastic counting! Let's summarise it.",
          },
        },
      },
      {
        id: 2,
        objectType: "star",
        svgPath:
          "M441.064 0.580417C455.979 -2.55372 470 8.82723 470 24.0677V257.019C470 268.371 462.045 278.172 450.936 280.506L403.441 290.487C401.818 290.828 400.164 291 398.506 291H71.0127C69.3424 291 67.6761 290.826 66.042 290.48L19.0303 280.529C7.93673 278.18 -2.45202e-06 268.388 0 257.048V24.1117C0.000286695 8.85709 14.0458 -2.52661 28.9697 0.632175L66.042 8.47983C67.6761 8.82574 69.3424 9.00034 71.0127 9.00034H398.506C400.164 9.00031 401.818 8.82772 403.441 8.48667L441.064 0.580417ZM31.6465 18.9915C23.7383 15.6704 15 21.4786 15 30.056V240C15 253.255 25.7452 264 39 264H40V22.5003L31.6465 18.9915ZM455 30.056C455 21.4786 446.262 15.6704 438.354 18.9915L430 22.5003V264H431C444.255 264 455 253.255 455 240V30.056Z",
        gradLeft: ["#ff76bb", "#CE4f85"],
        gradRight: ["#D01DFD", "#9024AC"],
        gradMerged: ["#D43A4A", "#FD1D7A"],
        leftCloudCount: 4,
        rightCloudCount: 3,
        prompt: {
          initial:
            "How many toffees are on the <span style='color:rgb(255, 118, 187);'>pink</span> tray?",
          rightCloudQuestion:
            "And how many are on the <span style='color:rgb(208, 29, 253);'>purple</span> tray?",
          mergedCloudQuestion: "How many toffees are there in total?",
          correct: "You got it!",
          incorrect: "Oops, let's try that again.",
          contextPrompts: {
            left: "Let's count the toffees on the first tray.",
            right: "Excellent! How about the second tray?",
            merging:
              "Here they come... Now click <b>Join</b> to bring them together!", // MODIFIED
            merged: "All together now! How many toffees are there?",
            done: "Superb work! Let's summarise it.",
          },
        },
      },
      {
        id: 3,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 2,
        rightCloudCount: 2,
        prompt: {
          initial:
            "How many balloons are on the <span style='color:rgb(118, 205, 255);'>blue</span> cloud?",
          rightCloudQuestion:
            "And how many are on the <span style='color:rgb(253, 119, 29);'>orange</span> cloud?",
          mergedCloudQuestion: "How many balloons are there in total?",
          correct: "That's right!",
          incorrect: "Not quite, try again!",
          contextPrompts: {
            left: "First, let's count the balloons on the blue cloud.",
            right: "Great! Now, let's count the balloons on the orange cloud.",
            merging: "Now click <b>Join</b> to bring them together!", // MODIFIED
            merged: "What is the total number of balloons now?",
            done: "Fantastic counting! Let's summarise it.",
          },
        },
      },
      {
        id: 4,
        objectType: "star",
        svgPath:
          "M441.064 0.580417C455.979 -2.55372 470 8.82723 470 24.0677V257.019C470 268.371 462.045 278.172 450.936 280.506L403.441 290.487C401.818 290.828 400.164 291 398.506 291H71.0127C69.3424 291 67.6761 290.826 66.042 290.48L19.0303 280.529C7.93673 278.18 -2.45202e-06 268.388 0 257.048V24.1117C0.000286695 8.85709 14.0458 -2.52661 28.9697 0.632175L66.042 8.47983C67.6761 8.82574 69.3424 9.00034 71.0127 9.00034H398.506C400.164 9.00031 401.818 8.82772 403.441 8.48667L441.064 0.580417ZM31.6465 18.9915C23.7383 15.6704 15 21.4786 15 30.056V240C15 253.255 25.7452 264 39 264H40V22.5003L31.6465 18.9915ZM455 30.056C455 21.4786 446.262 15.6704 438.354 18.9915L430 22.5003V264H431C444.255 264 455 253.255 455 240V30.056Z",
        gradLeft: ["#ff76bb", "#CE4f85"],
        gradRight: ["#D01DFD", "#9024AC"],
        gradMerged: ["#D43A4A", "#FD1D7A"],
        leftCloudCount: 5,
        rightCloudCount: 1,
        prompt: {
          initial:
            "How many toffees are on the <span style='color:rgb(255, 118, 187);'>pink</span> tray?",
          rightCloudQuestion:
            "And how many are on the <span style='color:rgb(208, 29, 253);'>purple</span> tray?",
          mergedCloudQuestion: "How many toffees are there in total?",
          correct: "You got it!",
          incorrect: "Oops, let's try that again.",
          contextPrompts: {
            left: "Let's count the toffees on the first tray.",
            right: "Excellent! How about the second tray?",
            merging:
              "Here they come... Now click <b>Join</b> to bring them together!", // MODIFIED
            merged: "All together now! How many toffees are there?",
            done: "Superb work! Let's summarise it.",
          },
        },
      },
      {
        id: 5,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 1,
        rightCloudCount: 4,
        prompt: {
          initial:
            "How many balloons are on the <span style='color:rgb(118, 205, 255);'>blue</span> cloud?",
          rightCloudQuestion:
            "And how many are on the <span style='color:rgb(253, 119, 29);'>orange</span> cloud?",
          mergedCloudQuestion: "How many balloons are there in total?",
          correct: "That's right!",
          incorrect: "Not quite, try again!",
          contextPrompts: {
            left: "First, let's count the balloons on the blue cloud.",
            right: "Great! Now, let's count the balloons on the orange cloud.",
            merging: "Now click <b>Join</b> to bring them together!", // MODIFIED
            merged: "What is the total number of balloons now?",
            done: "Fantastic counting! Let's summarise it.",
          },
        },
      },
      {
        id: 6,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 3,
        rightCloudCount: 3,
        prompt: {
          initial:
            "How many balloons are on the <span style='color:rgb(118, 205, 255);'>blue</span> cloud?",
          rightCloudQuestion:
            "And how many are on the <span style='color:rgb(253, 119, 29);'>orange</span> cloud?",
          mergedCloudQuestion: "How many balloons are there in total?",
          correct: "That's right!",
          incorrect: "Not quite, try again!",
          contextPrompts: {
            left: "First, let's count the balloons on the blue cloud.",
            right: "Great! Now, let's count the balloons on the orange cloud.",
            merging: "Now click <b>Join</b> to bring them together!", // MODIFIED
            merged: "What is the total number of balloons now?",
            done: "Fantastic counting! Let's summarise it.",
          },
        },
      },
      {
        id: 7,
        objectType: "star",
        svgPath:
          "M441.064 0.580417C455.979 -2.55372 470 8.82723 470 24.0677V257.019C470 268.371 462.045 278.172 450.936 280.506L403.441 290.487C401.818 290.828 400.164 291 398.506 291H71.0127C69.3424 291 67.6761 290.826 66.042 290.48L19.0303 280.529C7.93673 278.18 -2.45202e-06 268.388 0 257.048V24.1117C0.000286695 8.85709 14.0458 -2.52661 28.9697 0.632175L66.042 8.47983C67.6761 8.82574 69.3424 9.00034 71.0127 9.00034H398.506C400.164 9.00031 401.818 8.82772 403.441 8.48667L441.064 0.580417ZM31.6465 18.9915C23.7383 15.6704 15 21.4786 15 30.056V240C15 253.255 25.7452 264 39 264H40V22.5003L31.6465 18.9915ZM455 30.056C455 21.4786 446.262 15.6704 438.354 18.9915L430 22.5003V264H431C444.255 264 455 253.255 455 240V30.056Z",
        gradLeft: ["#ff76bb", "#CE4f85"],
        gradRight: ["#D01DFD", "#9024AC"],
        gradMerged: ["#D43A4A", "#FD1D7A"],
        leftCloudCount: 4,
        rightCloudCount: 2,
        prompt: {
          initial:
            "How many toffees are on the <span style='color:rgb(255, 118, 187);'>pink</span> tray?",
          rightCloudQuestion:
            "And how many are on the <span style='color:rgb(208, 29, 253);'>purple</span> tray?",
          mergedCloudQuestion: "How many toffees are there in total?",
          correct: "You got it!",
          incorrect: "Oops, let's try that again.",
          contextPrompts: {
            left: "Let's count the toffees on the first tray.",
            right: "Excellent! How about the second tray?",
            merging:
              "Here they come... Now click <b>Join</b> to bring them together!", // MODIFIED
            merged: "All together now! How many toffees are there?",
            done: "Superb work! Let's summarise it.",
          },
        },
      },
      {
        id: 8,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 2,
        rightCloudCount: 5,
        prompt: {
          initial:
            "How many balloons are on the <span style='color:rgb(118, 205, 255);'>blue</span> cloud?",
          rightCloudQuestion:
            "And how many are on the <span style='color:rgb(253, 119, 29);'>orange</span> cloud?",
          mergedCloudQuestion: "How many balloons are there in total?",
          correct: "That's right!",
          incorrect: "Not quite, try again!",
          contextPrompts: {
            left: "First, let's count the balloons on the blue cloud.",
            right: "Great! Now, let's count the balloons on the orange cloud.",
            merging: "Now click <b>Join</b> to bring them together!", // MODIFIED
            merged: "What is the total number of balloons now?",
            done: "Fantastic counting! Let's summarise it.",
          },
        },
      },
      {
        id: 9,
        objectType: "star",
        svgPath:
          "M441.064 0.580417C455.979 -2.55372 470 8.82723 470 24.0677V257.019C470 268.371 462.045 278.172 450.936 280.506L403.441 290.487C401.818 290.828 400.164 291 398.506 291H71.0127C69.3424 291 67.6761 290.826 66.042 290.48L19.0303 280.529C7.93673 278.18 -2.45202e-06 268.388 0 257.048V24.1117C0.000286695 8.85709 14.0458 -2.52661 28.9697 0.632175L66.042 8.47983C67.6761 8.82574 69.3424 9.00034 71.0127 9.00034H398.506C400.164 9.00031 401.818 8.82772 403.441 8.48667L441.064 0.580417ZM31.6465 18.9915C23.7383 15.6704 15 21.4786 15 30.056V240C15 253.255 25.7452 264 39 264H40V22.5003L31.6465 18.9915ZM455 30.056C455 21.4786 446.262 15.6704 438.354 18.9915L430 22.5003V264H431C444.255 264 455 253.255 455 240V30.056Z",
        gradLeft: ["#ff76bb", "#CE4f85"],
        gradRight: ["#D01DFD", "#9024AC"],
        gradMerged: ["#D43A4A", "#FD1D7A"],
        leftCloudCount: 5,
        rightCloudCount: 3,
        prompt: {
          initial:
            "How many toffees are on the <span style='color:rgb(255, 118, 187);'>pink</span> tray?",
          rightCloudQuestion:
            "And how many are on the <span style='color:rgb(208, 29, 253);'>purple</span> tray?",
          mergedCloudQuestion: "How many toffees are there in total?",
          correct: "You got it!",
          incorrect: "Oops, let's try that again.",
          contextPrompts: {
            left: "Let's count the toffees on the first tray.",
            right: "Excellent! How about the second tray?",
            merging:
              "Here they come... Now click <b>Join</b> to bring them together!", // MODIFIED
            merged: "All together now! How many toffees are there?",
            done: "Superb work! Let's summarise it.",
          },
        },
      },
      {
        id: 10,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 1,
        rightCloudCount: 5,
        prompt: {
          initial:
            "How many balloons are on the <span style='color:rgb(118, 205, 255);'>blue</span> cloud?",
          rightCloudQuestion:
            "And how many are on the <span style='color:rgb(253, 119, 29);'>orange</span> cloud?",
          mergedCloudQuestion: "How many balloons are there in total?",
          correct: "That's right!",
          incorrect: "Not quite, try again!",
          contextPrompts: {
            left: "First, let's count the balloons on the blue cloud.",
            right: "Great! Now, let's count the balloons on the orange cloud.",
            merging: "Now click <b>Join</b> to bring them together!", // MODIFIED
            merged: "What is the total number of balloons now?",
            done: "Fantastic counting! Let's summarise it.",
          },
        },
      },
    ],
    finalMessage: {
      heading: "Great Counting!",
      content: "You're getting really good at this! ✨",
    },
  },

  // Indonesian (Bahasa) Text Data
  id: {
    pageTitle: "Menghitung Awan",
    titleBar: {
      heading: "Asyiknya Menghitung",
      subheading: "Hitung benda di awan.",
    },
    buttons: {
      next: "Berikutnya",
      previous: "Sebelumnya",
      start_over: "Mulai Lagi",
      join: "Gabung", // MODIFIED: Added join button text
      start: "Mulai",
    },
    welcome: {
      description:
        "Waktunya belajar penjumlahan dengan menggabungkan benda-benda! Apa kalian sudah siap?",
    },
    characters: {
      normal: "assets/Normal.png",
      happy: "assets/Happy.png",
      sad: "assets/Sad.png",
      thinking: "assets/Thinking.png",
    },
    assets: {
      balloon: "assets/balloon.png",
      star: "assets/toffee.png",
      logo: "assets/logo.png",
    },
    audio: {
      correct: "assets/sfx/correct.mp3",
      wrong: "assets/sfx/wrong.mp3",
      click: "assets/sfx/click.mp3",
      confetti: "assets/sfx/confetti.mp3",
    },
    misc: {
      and: "dan",
      make: "menjadi",
    },
    questions: [
      {
        id: 1,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 3,
        rightCloudCount: 2,
        prompt: {
          initial:
            "Berapa banyak balon di awan <span style='color:rgb(118, 205, 255);'>biru</span>?",
          rightCloudQuestion:
            "Dan berapa banyak di awan <span style='color:rgb(253, 119, 29);'>oranye</span>?",
          mergedCloudQuestion: "Berapa jumlah total balon?",
          correct: "Itu benar!",
          incorrect: "Kurang tepat, coba lagi!",
          contextPrompts: {
            left: "Pertama, mari kita hitung balon di awan biru.",
            right: "Bagus! Sekarang, mari kita hitung balon di awan oranye.",
            merging: "Sekarang klik <b>Gabung</b> untuk menyatukannya!", // MODIFIED
            merged: "Berapa jumlah total balon sekarang?",
            done: "Hebat sekali menghitungnya!",
          },
        },
      },
      {
        id: 2,
        objectType: "star",
        svgPath:
          "M441.064 0.580417C455.979 -2.55372 470 8.82723 470 24.0677V257.019C470 268.371 462.045 278.172 450.936 280.506L403.441 290.487C401.818 290.828 400.164 291 398.506 291H71.0127C69.3424 291 67.6761 290.826 66.042 290.48L19.0303 280.529C7.93673 278.18 -2.45202e-06 268.388 0 257.048V24.1117C0.000286695 8.85709 14.0458 -2.52661 28.9697 0.632175L66.042 8.47983C67.6761 8.82574 69.3424 9.00034 71.0127 9.00034H398.506C400.164 9.00031 401.818 8.82772 403.441 8.48667L441.064 0.580417ZM31.6465 18.9915C23.7383 15.6704 15 21.4786 15 30.056V240C15 253.255 25.7452 264 39 264H40V22.5003L31.6465 18.9915ZM455 30.056C455 21.4786 446.262 15.6704 438.354 18.9915L430 22.5003V264H431C444.255 264 455 253.255 455 240V30.056Z",
        gradLeft: ["#ff76bb", "#CE4f85"],
        gradRight: ["#D01DFD", "#9024AC"],
        gradMerged: ["#D43A4A", "#FD1D7A"],
        leftCloudCount: 4,
        rightCloudCount: 3,
        prompt: {
          initial:
            "Berapa banyak permen di nampan <span style='color:rgb(255, 118, 187);'>merah muda</span>?",
          rightCloudQuestion:
            "Dan berapa banyak di nampan <span style='color:rgb(208, 29, 253);'>ungu</span>?",
          mergedCloudQuestion: "Berapa jumlah total permen?",
          correct: "Kamu berhasil!",
          incorrect: "Ups, mari coba lagi.",
          contextPrompts: {
            left: "Mari kita hitung permen di nampan pertama.",
            right: "Bagus sekali! Bagaimana dengan nampan kedua?",
            merging: "Sekarang klik <b>Gabung</b> untuk menyatukannya!", // MODIFIED
            merged: "Sekarang semuanya jadi satu! Ada berapa permen?",
            done: "Kerja yang luar biasa!",
          },
        },
      },
      {
        id: 3,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 2,
        rightCloudCount: 2,
        prompt: {
          initial:
            "Berapa banyak balon di awan <span style='color:rgb(118, 205, 255);'>biru</span>?",
          rightCloudQuestion:
            "Dan berapa banyak di awan <span style='color:rgb(253, 119, 29);'>oranye</span>?",
          mergedCloudQuestion: "Berapa jumlah total balon?",
          correct: "Itu benar!",
          incorrect: "Kurang tepat, coba lagi!",
          contextPrompts: {
            left: "Pertama, mari kita hitung balon di awan biru.",
            right: "Bagus! Sekarang, mari kita hitung balon di awan oranye.",
            merging: "Sekarang klik <b>Gabung</b> untuk menyatukannya!", // MODIFIED
            merged: "Berapa jumlah total balon sekarang?",
            done: "Hebat sekali menghitungnya!",
          },
        },
      },
      {
        id: 4,
        objectType: "star",
        svgPath:
          "M441.064 0.580417C455.979 -2.55372 470 8.82723 470 24.0677V257.019C470 268.371 462.045 278.172 450.936 280.506L403.441 290.487C401.818 290.828 400.164 291 398.506 291H71.0127C69.3424 291 67.6761 290.826 66.042 290.48L19.0303 280.529C7.93673 278.18 -2.45202e-06 268.388 0 257.048V24.1117C0.000286695 8.85709 14.0458 -2.52661 28.9697 0.632175L66.042 8.47983C67.6761 8.82574 69.3424 9.00034 71.0127 9.00034H398.506C400.164 9.00031 401.818 8.82772 403.441 8.48667L441.064 0.580417ZM31.6465 18.9915C23.7383 15.6704 15 21.4786 15 30.056V240C15 253.255 25.7452 264 39 264H40V22.5003L31.6465 18.9915ZM455 30.056C455 21.4786 446.262 15.6704 438.354 18.9915L430 22.5003V264H431C444.255 264 455 253.255 455 240V30.056Z",
        gradLeft: ["#ff76bb", "#CE4f85"],
        gradRight: ["#D01DFD", "#9024AC"],
        gradMerged: ["#D43A4A", "#FD1D7A"],
        leftCloudCount: 5,
        rightCloudCount: 1,
        prompt: {
          initial:
            "Berapa banyak permen di nampan <span style='color:rgb(255, 118, 187);'>merah muda</span>?",
          rightCloudQuestion:
            "Dan berapa banyak di nampan <span style='color:rgb(208, 29, 253);'>ungu</span>?",
          mergedCloudQuestion: "Berapa jumlah total permen?",
          correct: "Kamu berhasil!",
          incorrect: "Ups, mari coba lagi.",
          contextPrompts: {
            left: "Mari kita hitung permen di nampan pertama.",
            right: "Bagus sekali! Bagaimana dengan nampan kedua?",
            merging: "Sekarang klik <b>Gabung</b> untuk menyatukannya!", // MODIFIED
            merged: "Sekarang semuanya jadi satu! Ada berapa permen?",
            done: "Kerja yang luar biasa!",
          },
        },
      },
      {
        id: 5,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 1,
        rightCloudCount: 4,
        prompt: {
          initial:
            "Berapa banyak balon di awan <span style='color:rgb(118, 205, 255);'>biru</span>?",
          rightCloudQuestion:
            "Dan berapa banyak di awan <span style='color:rgb(253, 119, 29);'>oranye</span>?",
          mergedCloudQuestion: "Berapa jumlah total balon?",
          correct: "Itu benar!",
          incorrect: "Kurang tepat, coba lagi!",
          contextPrompts: {
            left: "Pertama, mari kita hitung balon di awan biru.",
            right: "Bagus! Sekarang, mari kita hitung balon di awan oranye.",
            merging: "Sekarang klik <b>Gabung</b> untuk menyatukannya!", // MODIFIED
            merged: "Berapa jumlah total balon sekarang?",
            done: "Hebat sekali menghitungnya!",
          },
        },
      },
      {
        id: 1,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 3,
        rightCloudCount: 3,
        prompt: {
          initial:
            "Berapa banyak balon di awan <span style='color:rgb(118, 205, 255);'>biru</span>?",
          rightCloudQuestion:
            "Dan berapa banyak di awan <span style='color:rgb(253, 119, 29);'>oranye</span>?",
          mergedCloudQuestion: "Berapa jumlah total balon?",
          correct: "Itu benar!",
          incorrect: "Kurang tepat, coba lagi!",
          contextPrompts: {
            left: "Pertama, mari kita hitung balon di awan biru.",
            right: "Bagus! Sekarang, mari kita hitung balon di awan oranye.",
            merging: "Sekarang klik <b>Gabung</b> untuk menyatukannya!", // MODIFIED
            merged: "Berapa jumlah total balon sekarang?",
            done: "Hebat sekali menghitungnya!",
          },
        },
      },
      {
        id: 2,
        objectType: "star",
        svgPath:
          "M441.064 0.580417C455.979 -2.55372 470 8.82723 470 24.0677V257.019C470 268.371 462.045 278.172 450.936 280.506L403.441 290.487C401.818 290.828 400.164 291 398.506 291H71.0127C69.3424 291 67.6761 290.826 66.042 290.48L19.0303 280.529C7.93673 278.18 -2.45202e-06 268.388 0 257.048V24.1117C0.000286695 8.85709 14.0458 -2.52661 28.9697 0.632175L66.042 8.47983C67.6761 8.82574 69.3424 9.00034 71.0127 9.00034H398.506C400.164 9.00031 401.818 8.82772 403.441 8.48667L441.064 0.580417ZM31.6465 18.9915C23.7383 15.6704 15 21.4786 15 30.056V240C15 253.255 25.7452 264 39 264H40V22.5003L31.6465 18.9915ZM455 30.056C455 21.4786 446.262 15.6704 438.354 18.9915L430 22.5003V264H431C444.255 264 455 253.255 455 240V30.056Z",
        gradLeft: ["#ff76bb", "#CE4f85"],
        gradRight: ["#D01DFD", "#9024AC"],
        gradMerged: ["#D43A4A", "#FD1D7A"],
        leftCloudCount: 4,
        rightCloudCount: 2,
        prompt: {
          initial:
            "Berapa banyak permen di nampan <span style='color:rgb(255, 118, 187);'>merah muda</span>?",
          rightCloudQuestion:
            "Dan berapa banyak di nampan <span style='color:rgb(208, 29, 253);'>ungu</span>?",
          mergedCloudQuestion: "Berapa jumlah total permen?",
          correct: "Kamu berhasil!",
          incorrect: "Ups, mari coba lagi.",
          contextPrompts: {
            left: "Mari kita hitung permen di nampan pertama.",
            right: "Bagus sekali! Bagaimana dengan nampan kedua?",
            merging: "Sekarang klik <b>Gabung</b> untuk menyatukannya!", // MODIFIED
            merged: "Sekarang semuanya jadi satu! Ada berapa permen?",
            done: "Kerja yang luar biasa!",
          },
        },
      },
      {
        id: 3,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 2,
        rightCloudCount: 5,
        prompt: {
          initial:
            "Berapa banyak balon di awan <span style='color:rgb(118, 205, 255);'>biru</span>?",
          rightCloudQuestion:
            "Dan berapa banyak di awan <span style='color:rgb(253, 119, 29);'>oranye</span>?",
          mergedCloudQuestion: "Berapa jumlah total balon?",
          correct: "Itu benar!",
          incorrect: "Kurang tepat, coba lagi!",
          contextPrompts: {
            left: "Pertama, mari kita hitung balon di awan biru.",
            right: "Bagus! Sekarang, mari kita hitung balon di awan oranye.",
            merging: "Sekarang klik <b>Gabung</b> untuk menyatukannya!", // MODIFIED
            merged: "Berapa jumlah total balon sekarang?",
            done: "Hebat sekali menghitungnya!",
          },
        },
      },
      {
        id: 4,
        objectType: "star",
        svgPath:
          "M441.064 0.580417C455.979 -2.55372 470 8.82723 470 24.0677V257.019C470 268.371 462.045 278.172 450.936 280.506L403.441 290.487C401.818 290.828 400.164 291 398.506 291H71.0127C69.3424 291 67.6761 290.826 66.042 290.48L19.0303 280.529C7.93673 278.18 -2.45202e-06 268.388 0 257.048V24.1117C0.000286695 8.85709 14.0458 -2.52661 28.9697 0.632175L66.042 8.47983C67.6761 8.82574 69.3424 9.00034 71.0127 9.00034H398.506C400.164 9.00031 401.818 8.82772 403.441 8.48667L441.064 0.580417ZM31.6465 18.9915C23.7383 15.6704 15 21.4786 15 30.056V240C15 253.255 25.7452 264 39 264H40V22.5003L31.6465 18.9915ZM455 30.056C455 21.4786 446.262 15.6704 438.354 18.9915L430 22.5003V264H431C444.255 264 455 253.255 455 240V30.056Z",
        gradLeft: ["#ff76bb", "#CE4f85"],
        gradRight: ["#D01DFD", "#9024AC"],
        gradMerged: ["#D43A4A", "#FD1D7A"],
        leftCloudCount: 5,
        rightCloudCount: 3,
        prompt: {
          initial:
            "Berapa banyak permen di nampan <span style='color:rgb(255, 118, 187);'>merah muda</span>?",
          rightCloudQuestion:
            "Dan berapa banyak di nampan <span style='color:rgb(208, 29, 253);'>ungu</span>?",
          mergedCloudQuestion: "Berapa jumlah total permen?",
          correct: "Kamu berhasil!",
          incorrect: "Ups, mari coba lagi.",
          contextPrompts: {
            left: "Mari kita hitung permen di nampan pertama.",
            right: "Bagus sekali! Bagaimana dengan nampan kedua?",
            merging: "Sekarang klik <b>Gabung</b> untuk menyatukannya!", // MODIFIED
            merged: "Sekarang semuanya jadi satu! Ada berapa permen?",
            done: "Kerja yang luar biasa!",
          },
        },
      },
      {
        id: 5,
        objectType: "balloon",
        svgPath:
          "M500 203.063C500.001 183.991 493.602 165.471 481.829 150.468C470.055 135.465 453.587 124.846 435.062 120.313C434.297 90.0093 421.724 61.2038 400.026 40.0365C378.327 18.8693 349.219 7.0148 318.906 7.00003C301.333 6.9874 283.986 10.97 268.178 18.6468C252.369 26.3235 238.513 37.4936 227.656 51.3125C218.821 39.9649 206.487 31.8507 192.569 28.2293C178.65 24.6079 163.926 25.6818 150.68 31.2842C137.434 36.8866 126.408 46.7044 119.313 59.2139C112.217 71.7234 109.449 86.2252 111.437 100.469C101 100.469 98.5 100.469 89.4038 102.102C76.0104 105.643 63.558 112.083 52.9262 120.965C42.2945 129.847 33.7427 140.955 27.8751 153.505C22.0075 166.055 18.9671 179.74 18.9688 193.594C18.977 218.685 28.9438 242.747 46.68 260.495C66.5 275 69.8124 282 94.5625 288.25C119.313 294.5 166.5 292.5 177 288.25C180.5 299 221.822 314.761 257 314C292.178 313.239 318.906 308 335.5 288.25C351 295 395 299.75 415.5 294.5C436 289.25 459.174 279.202 475.104 263.231C491.035 247.26 500.008 225.62 500 203.063Z",
        gradLeft: ["#2F5B91", "#00D4FF"],
        gradRight: ["#FD1D1D", "#FC7645"],
        gradMerged: ["#D934B8", "#BB00FF"],
        leftCloudCount: 1,
        rightCloudCount: 5,
        prompt: {
          initial:
            "Berapa banyak balon di awan <span style='color:rgb(118, 205, 255);'>biru</span>?",
          rightCloudQuestion:
            "Dan berapa banyak di awan <span style='color:rgb(253, 119, 29);'>oranye</span>?",
          mergedCloudQuestion: "Berapa jumlah total balon?",
          correct: "Itu benar!",
          incorrect: "Kurang tepat, coba lagi!",
          contextPrompts: {
            left: "Pertama, mari kita hitung balon di awan biru.",
            right: "Bagus! Sekarang, mari kita hitung balon di awan oranye.",
            merging: "Sekarang klik <b>Gabung</b> untuk menyatukannya!", // MODIFIED
            merged: "Berapa jumlah total balon sekarang?",
            done: "Hebat sekali menghitungnya!",
          },
        },
      },
    ],
    finalMessage: {
      heading: "Hebat!",
      content: "Kamu semakin mahir dalam menghitung! ✨",
    },
  },
};

// --- DO NOT EDIT BELOW THIS LINE ---
// This script selects the correct language based on the flag and makes it available to the app.
try {
  const selectedLang = ALL_TEXTS[CURRENT_LANGUAGE] || ALL_TEXTS["en"]; // Default to English if flag is invalid
  window.APP_TEXTS = selectedLang;
} catch (error) {
  console.error(
    "Error setting up language texts. Please check the ALL_TEXTS structure in texts.js.",
    error
  );
  // Fallback to English to prevent the app from crashing.
  window.APP_TEXTS = ALL_TEXTS.en;
}
