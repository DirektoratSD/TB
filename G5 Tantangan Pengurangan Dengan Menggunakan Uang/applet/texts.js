//LANGUAGE CHANGE

const flag = "INDONESIAN"; // <-- change this flag to"ENGLISH" or "INDONESIAN"
localStorage.setItem("flag", flag);
//--------------------------------------//
const firstStageQuestions =
  flag === "ENGLISH"
    ? firstStageQuestionsEnglish
    : firstStageQuestionsIndonesian;
const dndData = flag === "ENGLISH" ? dndDataEnglish : dndDataIndonesian;
const textPool = flag === "ENGLISH" ? textPoolEnglish : textPoolIndonesian;
const overlayData =
  flag === "ENGLISH" ? overlayDataEnglish : overlayDataIndonesian;

const buttonText =
  flag === "ENGLISH" ? buttonTextsEnglish : buttonTextsIndonesian;

const mcqData = flag === "ENGLISH" ? mcqDataEnglish : mcqDataIndonesian;
const headerArray =
  flag === "ENGLISH" ? headerArrayEnglish : headerArrayIndonesian;
