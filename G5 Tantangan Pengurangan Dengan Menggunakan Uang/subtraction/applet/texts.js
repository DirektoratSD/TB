
//LANGUAGE CHANGE

const flag = localStorage.getItem("flag"); 

//--------------------------------------//
const firstStageQuestions = flag === "ENGLISH" ? firstStageQuestionsEnglish : firstStageQuestionsIndonesian;
const textPool = flag === "ENGLISH" ? textPoolEnglish : textPoolIndonesian;
const overlayData = flag === "ENGLISH" ? overlayDataEnglish : overlayDataIndonesian;

const buttonText = flag === "ENGLISH" ? buttonTextsEnglish : buttonTextsIndonesian;

const mcqData = flag === "ENGLISH" ? mcqDataEnglish : mcqDataIndonesian;
const headerArray = flag === "ENGLISH" ? headerArrayEnglish : headerArrayIndonesian;