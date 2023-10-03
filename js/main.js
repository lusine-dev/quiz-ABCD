const startGame = document.querySelector(".start-game");
const { ALPHABET: alphabet } = config;
let duration = +JSON.stringify(config.DURATION);
let timerSec = +JSON.stringify(config.TIMER);
let i = 0;
let currentRightAnswer = null;

startGame.addEventListener("click", onStartGameClick);

function onStartGameClick() {
  buildInitialLevel();
  generateQuestion();
}

function buildInitialLevel() {
  const section = document.querySelector(`section`);
  section.innerHTML = "";
  buildTimer(section);
  buildLevelBar(section);
  buildBoard(section);
  const board = document.querySelector(`.board`);

  buildQuestionBox(board);
  buildBoxes(board);
}

function buildTimer(section) {
  const timer = document.createElement("h1");
  timer.className = "timer";
  section.appendChild(timer);
  displayTime(duration);
  countDown();
}

function buildLevelBar(section) {
  const level = document.createElement("p");
  level.className = "lvl";
  level.innerHTML = `${config.LEVELS[i].label}`;
  section.appendChild(level);
}

function buildBoard(section) {
  const board = document.createElement("div");
  board.className = "board";
  section.appendChild(board);
}

function buildBoxes(board) {
  boxConfig.forEach((boxClasses) => {
    const box = document.createElement("div");
    box.className = boxClasses;
    board.appendChild(box);
  });
}

function buildQuestionBox(board) {
  const questionBox = document.createElement("div");
  questionBox.className = "question-box";
  board.appendChild(questionBox);
}

function displayTime(second) {
  const timer = document.querySelector(".timer");
  const min = Math.floor(second / 60);
  const sec = Math.floor(second % 60);

  const timerValue = `${min < 10 ? `0` : ``}${min}:${
    sec < 10 ? `0` : ``
  }${sec}`;
  changeTimerInnerHtml(timer, timerValue);
}

function countDown() {
  const interval = setInterval(() => {
    duration--;
    displayTime(duration);
    if (duration <= 0) {
      const timer = document.querySelector(".timer");
      changeTimerInnerHtml(timer, `00:00`);
      clearInterval(interval);
      showLoseText();
    }
  }, 1000);
}

function changeTimerInnerHtml(timer, value) {
  timer.innerHTML = value;
}

function showLoseText() {
  const section = document.querySelector(`section`);
  section.innerHTML = "";
  section.innerHTML = `<p class="score">Your Current High Score Is ${i}</p>
  `;
}

function generateQuestion() {
  const letter = getLetter(alphabet);
  const range = getRange();

  const answers = generateAnswers(letter, range);
  setOptionsInBoxes(answers);
  setQuestion(letter, range);
}

function setOptionsInBoxes(answers) {
  const answerBoxes = document.querySelectorAll(".box");

  answerBoxes.forEach((b, i) => {
    b.innerHTML = "";
    const block = document.createElement("div");
    const answerText = document.createElement("p");
    answerText.className = "answer-text";
    answerText.innerHTML = answers[i];
    b.canBeClicked = true;
    b.value = answers[i];
    block.appendChild(answerText);
    b.appendChild(block);

    block.addEventListener("click", onBoxClick.bind(null, b));
  });
}

function onBoxClick(box) {
  if (box.canBeClicked) {
    const answerBoxes = document.querySelectorAll(".box");
    answerBoxes.forEach((b) => (b.canBeClicked = false));
    checkAnswer(box.value);
  }
}

function checkAnswer(chosenAnswer) {
  if (chosenAnswer === currentRightAnswer) {
    rightAnswerActions();
  } else {
    wrongAnswerActions();
  }
}

function rightAnswerActions() {
  let currentLevel = document.querySelector(".lvl");
  i++;
  currentLevel.innerHTML = `${config.LEVELS[i].label}`;
  generateQuestion();
  getRange();
  duration = duration + timerSec;
}

function wrongAnswerActions() {
  generateQuestion();
  duration = duration - timerSec;
}

function setQuestion(letter, range) {
  const questionBox = document.querySelector(".question-box");
  questionBox.innerHTML = "";
  const question = document.createElement("p");
  question.className = "question";
  question.innerHTML = `${letter}+${range}`;

  questionBox.appendChild(question);
}

function getLetter(alphabet) {
  const n = alphabet.length;
  const index = Math.floor(Math.random() * n);
  const letter = alphabet[index];

  return letter;
}

function getRange() {
  const range = config.LEVELS[i].range;
  const min = range[0];
  const max = range[1];
  const n = Math.floor(Math.random() * (max + 1 - min) + min);

  return n;
}

function generateAnswers(letter, range) {
  const rightAnswer = getRightAnswer(letter, range);
  currentRightAnswer = rightAnswer;
  const wrongAnswers = getWrongAnswers(rightAnswer);
  const answers = [rightAnswer, ...wrongAnswers];

  for (let i = answers.length - 1; i > 0; i -= 1) {
    const min = 0;
    const max = Math.floor(i);
    const j = Math.floor(Math.random() * (max - min + 1)) + min;

    const temp = answers[i];
    answers[i] = answers[j];
    answers[j] = temp;
  }

  return answers;
}

function getRightAnswer(letter, range) {
  const index = alphabet.indexOf(letter);
  const rightAnswerIndex = (index + range) % alphabet.length;
  const rightAnswer = alphabet[rightAnswerIndex];

  return rightAnswer;
}

function getWrongAnswers(rightAnswer) {
  const wrongAnswersArr = [];
  for (let i = 0; i < 3; i++) {
    let wrongAnswer = getWrongLetter(rightAnswer, wrongAnswersArr);

    wrongAnswersArr.push(wrongAnswer);
  }

  return wrongAnswersArr;
}

function getWrongLetter(rightAnswer, wrongAnswersArr) {
  const n = alphabet.length;
  const index = Math.floor(Math.random() * n);
  let wrongLetter = alphabet[index];

  if (wrongLetter === rightAnswer) {
    wrongLetter = getWrongLetter(rightAnswer, wrongAnswersArr);
  }

  if (wrongAnswersArr.length !== 0) {
    wrongAnswersArr.forEach((a) => {
      if (a === wrongLetter) {
        wrongLetter = getWrongLetter(rightAnswer, wrongAnswersArr);
      }
    });
  }
  return wrongLetter;
}
