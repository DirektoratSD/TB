// texts.js


// texts.js
//LANGUAGE CHANGE

const flag = "INDONESIAN"; // <-- change this flag to"ENGLISH" or "INDONESIAN"


//--------------------------------------//

const texts = flag === "ENGLISH" ? textsEnglish : textsIndonesian

const numberToText = flag === "ENGLISH" ? numberToTextEnglish : numberToTextIndonesian
const mcqData = flag === "ENGLISH" ? mcqDataEnglish : mcqDataIndonesian

const numberForm = flag === "ENGLISH" ? numberFormEnglish : numberFormIndonesian

const tags = flag === "ENGLISH" ? tagsEnglish : tagsIndonesian
