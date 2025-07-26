// DOM ELEMENTS 
const startScreen = document.getElementById("start-screen")
const quizScreen = document.getElementById("quiz-screen")
const resultScreen = document.getElementById("result-screen")
const startButton = document.getElementById("start-btn")
const questionText = document.getElementById("question-text")
const answersContainer = document.getElementById("answers-container")
const currentQuestionSpan = document.getElementById("current-question")
const totalQuestionsSpan = document.getElementById("total-questions")
const scoreSpan = document.getElementById("score")
const finalScoreSpan = document.getElementById("final-score")
const maxScoreSpan = document.getElementById("max-score")
const resultMessage = document.getElementById("result-message")
const restartButton = document.getElementById("restart-btn")
const progressBar = document.getElementById("progress")
const answerDescription = document.getElementById("answer-description")

// const quizQuestions = [
//     {
//         question: "What is the capital of France?",
//         answers: [
//             { text: "London", correct: false },
//             { text: "Berlin", correct: false },
//             { text: "Paris", correct: true },
//             { text: "Madrid", correct: false },
//         ],
//         description : "Paris is the capital of France"
//     },
//     {
//         question: "Which planet is known as the Red Planet?",
//         answers: [
//             { text: "Venus", correct: false },
//             { text: "Mars", correct: true },
//             { text: "Jupiter", correct: false },
//             { text: "Saturn", correct: false },
//         ],
//         description: "Mars is known as the Red Planet"
//     },
//     {
//         question: "What is the largest ocean on Earth?",
//         answers: [
//             { text: "Atlantic Ocean", correct: false },
//             { text: "Indian Ocean", correct: false },
//             { text: "Arctic Ocean", correct: false },
//             { text: "Pacific Ocean", correct: true },
//         ],
//         description: "Pacific Ocean is the largest ocean on Earth"
//     },
//     {
//         question: "Which of these is NOT a programming language?",
//         answers: [
//             { text: "Java", correct: false },
//             { text: "Python", correct: false },
//             { text: "Banana", correct: true },
//             { text: "JavaScript", correct: false },
//         ],
//         description: "Banana is a fruit, not a programming language"
//     },
//     {
//         question: "What is the chemical symbol for gold?",
//         answers: [
//             { text: "Go", correct: false },
//             { text: "Gd", correct: false },
//             { text: "Au", correct: true },
//             { text: "Ag", correct: false },
//         ],
//         description: "Au is the chemical symbol for gold"
//     },
// ];


// Quiz state variables

let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let countDownInterval;
let quizQuestions;

fetch('https://opentdb.com/api.php?amount=5&type=multiple')
.then(response => response.json())

.then(data => {
    console.log(data.results);
    quizQuestions = data.results

    // Setup initial values
    totalQuestionsSpan.textContent = quizQuestions.length;
    maxScoreSpan.textContent = quizQuestions.length;

    startButton.addEventListener("click", startQuiz)
    restartButton.addEventListener("click", restartQuiz)

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        scoreSpan.textContent = 0;

        startScreen.classList.remove("active");
        quizScreen.classList.add("active");

        showQuestion();
    }

    function showQuestion() {

        answersDisabled = false;
        const currentQuestion = quizQuestions[currentQuestionIndex];

        countDown("count-down");

        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
        progressBar.style.width = progressPercent + "%";

        questionText.textContent = currentQuestion.question;
        answersContainer.innerHTML = "";

        const data_answers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers]
        const answers = data_answers.sort(() => Math.random() - 0.5)

        answers.forEach(answer => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.classList.add("answer-btn");
            if (answer === currentQuestion.correct_answer){
                button.dataset.correct = true;
            } else {
                button.dataset.correct = false;
            }
            button.dataset.description = currentQuestion.description;
            button.addEventListener("click", function (event) {
                selectAnswer(event);
            });
            answersContainer.appendChild(button);
        });
    }

    function countDown(elementId) {
        let time = 10;
        const elId = document.getElementById(elementId);

        clearInterval(countDownInterval);
        countDownInterval = setInterval(() => {
            elId.innerHTML = time;
            time--;

            if (time < 0) {
                clearInterval(countDownInterval);
                elId.innerHTML = "Time out";
                showAnswer();
            }
        }, 1000);
    }

    function stopCountDown() {
        clearInterval(countDownInterval);
    }

    function selectAnswer(event) {
        if (answersDisabled) return;
        answersDisabled = true;
        stopCountDown();

        const selectedButton = event.target;
        const isCorrect = selectedButton.dataset.correct === "true";

        if (isCorrect) {
            score++;
            scoreSpan.textContent = score;
            showDescription(true, selectedButton);
        } else {
            showDescription(false, selectedButton);
        }

        showAnswer();
    }

    function showDescription(correct) {
        const answerGrade = document.createElement("h3");

        if (correct) {
            answerGrade.innerHTML = "Correct";
            answerGrade.classList.add("correct-answer");
        } else {
            answerGrade.innerHTML = "Incorrect";
            answerGrade.classList.add("incorrect-answer");
        }

        answerDescription.appendChild(answerGrade);

        setTimeout(() => {
            answerDescription.removeChild(answerGrade);
        }, 3000);
    }

    function showAnswer() {
        Array.from(answersContainer.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            } else {
                button.classList.add("incorrect");
            }
        });

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizQuestions.length) {
                showQuestion();
            } else {
                showResults();
            }
        }, 3000);
    }

    function showResults() {
        quizScreen.classList.remove("active");
        resultScreen.classList.add("active");
        finalScoreSpan.textContent = score;

        const percentage = (score / quizQuestions.length) * 100;

        if (percentage === 100) {
            resultMessage.textContent = "Perfect! You're a genius!";
        } else if (percentage >= 80) {
            resultMessage.textContent = "Great job! You know your stuff!";
        } else if (percentage >= 60) {
            resultMessage.textContent = "Good effort! Keep learning!";
        } else if (percentage >= 40) {
            resultMessage.textContent = "Not bad! Try again to improve!";
        } else {
            resultMessage.textContent = "Keep studying! You'll get better!";
        }
    }

    function restartQuiz() {
        resultScreen.classList.remove("active");
        startQuiz();
    }

});