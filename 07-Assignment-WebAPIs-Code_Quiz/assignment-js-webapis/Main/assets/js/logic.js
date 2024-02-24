// add variables that keep track of the quiz "state"
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;

// add variables to reference DOM elements
// example is below
let questionsEl = document.getElementById('questions');
let choicesEl = document.getElementById('choices');
let startScreenEl = document.getElementById('start-screen');
let endScreenEl = document.getElementById('end-screen');
let finalScoreEl = document.getElementById('final-score');
let initialsEl = document.getElementById('initials');
let feedbackEl = document.getElementById('feedback');
let timeEl = document.getElementById('time');
let startBtn = document.getElementById('start');
let submitBtn = document.getElementById('submit');

// reference the sound effects
let sfxRight = new Audio('assets/sfx/correct.wav');
let sfxWrong = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  // hide start screen
  startScreenEl.classList.add('hide');

  // un-hide questions section
  questionsEl.classList.remove('hide');

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timeEl.textContent = time;

  // call a function to show the next question
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  let currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  document.getElementById('question-title').textContent = currentQuestion.title;

  // clear out any old question choices
  choicesEl.innerHTML = '';

  // loop over the choices for each question
  for (let i = 0; i < currentQuestion.choices.length; i++) {
    // create a new button for each choice, setting the label and value for the button
    let choiceBtn = document.createElement('button');
    choiceBtn.textContent = currentQuestion.choices[i];
    choiceBtn.setAttribute('value', i);

    // display the choice button on the page
    choicesEl.appendChild(choiceBtn);
  }
}

function questionClick(event) {
  // identify the targeted button that was clicked on
  let clickedBtn = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!clickedBtn.matches('button')) {
    return;
  }

  // check if user guessed wrong
  if (parseInt(clickedBtn.value) !== questions[currentQuestionIndex].answerIndex) {
    // if they got the answer wrong, penalize time by subtracting 15 seconds from the timer
    time -= 15;

    // if they run out of time, set time to zero so we can end quiz
    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timeEl.textContent = time;

    // play "wrong" sound effect
    sfxWrong.play();

    // display "wrong" feedback on page
    feedbackEl.textContent = 'Wrong!';
  } else {
    // play "right" sound effect
    sfxRight.play();

    // display "right" feedback on page by displaying the text "Correct!" in the feedback element
    feedbackEl.textContent = 'Correct!';
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.classList.remove('hide');

  // after one second, remove the "feedback" class from the feedback element
  setTimeout(() => {
    feedbackEl.classList.add('hide');
  }, 1000);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (time <= 0 || currentQuestionIndex === questions.length) {
    // if the time is less than zero and we have reached the end of the questions array,
    // call a function that ends the quiz (quizEnd function)
    quizEnd();
  } else {
    // else get the next question
    getQuestion();
  }
}

// define the steps of the QuizEnd function...when the quiz ends...
function quizEnd() {
  // stop the timer
  clearInterval(timerId);

  // show end screen
  questionsEl.classList.add('hide');
  endScreenEl.classList.remove('hide');

  // show final score
  finalScoreEl.textContent = time;

  // hide the "questions" section
}

// add the code in this function to update the time, it should be called every second
function clockTick() {
  // right here - update time
  time--;

  // update the element to display the new time value
  timeEl.textContent = time;

  // check if user ran out of time; if so, call the quizEnd() function
  if (time <= 0) {
    quizEnd();
  }
}

// complete the steps to save the high score
function saveHighScore() {
  // get the value of the initials input box
  let initials = initialsEl.value.trim();

  // make sure the value of the initials input box wasn't empty
  if (initials !== '') {
    // check and see if there is a value of high scores in local storage
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // add the new initials and high score to the array
    highScores.push({ initials, score: time });

    // convert the array to a piece of text
    let highScoresText = JSON.stringify(highScores);

    // store the high score in local storage
    localStorage.setItem('highScores', highScoresText);

    // redirect the user to the high scores page.
    window.location.href = 'highscores.html';
  }
}

// use this function when the user presses the "enter" key when submitting high score initials
function checkForEnter(event) {
  // if the user presses the enter key, then call the saveHighscore function
  if (event.key === 'Enter') {
    saveHighScore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighScore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on an element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
