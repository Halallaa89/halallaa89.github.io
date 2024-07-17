document.addEventListener("DOMContentLoaded", () => {
  let currentQuestion = 0;
  const userResponses = [];

  function fetchQuestions() {
    fetch("js/questions.json")
      .then((response) => response.json())
      .then((data) => displayQuestion(data.questions))
      .catch((error) => console.error("Error loading the questions:", error));
  }

  function displayQuestion(questions) {
    const questionContainer = document.querySelector(".question");
    clearContainer(questionContainer);

    if (currentQuestion < questions.length) {
      const questionData = questions[currentQuestion];
      const questionTitle = createQuestionTitle(questionData.question);
      const answersContainer = createAnswersContainer();

      questionContainer.appendChild(questionTitle);
      questionContainer.appendChild(answersContainer);

      transitionIn(questionTitle, answersContainer);

      questionData.answers.forEach((answer) => {
        const answerItem = createAnswerItem(answer, questions);
        answersContainer.appendChild(answerItem);
      });
    } else {
      console.log("Quiz completed!");
    }
  }

  function createQuestionTitle(text) {
    const questionTitle = document.createElement("h1");
    questionTitle.id = "question-title";
    questionTitle.textContent = text;
    questionTitle.style.transition = "opacity 0.5s";
    questionTitle.style.opacity = 0;
    return questionTitle;
  }

  function createAnswersContainer() {
    const answersContainer = document.createElement("div");
    answersContainer.id = "answers";
    answersContainer.style.transition = "opacity 0.5s";
    answersContainer.style.opacity = 0;
    return answersContainer;
  }

  function transitionIn(...elements) {
    setTimeout(() => {
      elements.forEach((element) => (element.style.opacity = 1));
    }, 300);
  }

  function transitionOut(container, callback) {
    container.style.opacity = 0;
    container.style.transition = "opacity 0.5s";

    setTimeout(() => {
      clearContainer(container); // Очищаем контент после завершения анимации
      callback();
    }, 300);
  }

  function createAnswerItem(answer, questions) {
    const label = document.createElement("label");
    label.style.display = "block"; // Используем блочный тип для лейблов

    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.className = "option-input radio"; // Класс для кастомизации радио-кнопок
    radioInput.name = "answer"; // Одинаковое имя для всех радио-кнопок в вопросе
    radioInput.value = answer;

    label.appendChild(radioInput);
    label.appendChild(document.createTextNode(answer));

    radioInput.onclick = () => handleAnswer(answer, questions);

    return label;
  }

  function showLoading(callback) {
    const questionContainer = document.querySelector(".question");
    const loader = document.createElement("div");
    loader.innerHTML =
      '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    loader.style.position = "absolute";
    loader.style.left = "50%";
    loader.style.top = "50%";
    loader.style.transform = "translate(-50%, -50%)";
    loader.style.zIndex = "1000";

    questionContainer.appendChild(loader);

    setTimeout(() => {
      questionContainer.removeChild(loader);
      callback();
    }, 1000); // Спиннер показывается на 1 секунду
  }

  function handleAnswer(answer, questions) {
    userResponses.push(answer);
    currentQuestion++;

    const questionContainer = document.querySelector(".question");
    updateProgressAndPayout(questions.length, currentQuestion);

    setTimeout(() => {
      transitionOut(questionContainer, () => {
        if (currentQuestion < questions.length) {
          showLoading(() => {
            displayQuestion(questions);
          });
        } else {
          showLoading(() => {
            console.log("Quiz completed!");
            displayCompletion(); // Функция для отображения результатов или сообщения
          });
        }
      });
    }, 300);
  }

  function displayCompletion() {
    const quizSection = document.getElementById("quiz");
    const endingSection = document.getElementById("ending");

    // Плавное исчезновение секции квиза
    quizSection.classList.add("hidden");
    quizSection.classList.remove("visible");

    // Подождем пока квиз полностью исчезнет, затем покажем секцию завершения
    setTimeout(() => {
      quizSection.style.display = "none";
      endingSection.style.display = "block"; // Делаем секцию завершения видимой
      setTimeout(() => {
        endingSection.classList.add("visible");
        endingSection.classList.remove("hidden");
      }, 10); // Небольшая задержка для гарантии перерендера
    }, 500); // Задержка равна времени анимации исчезновения
  }

  function updateProgressAndPayout(totalQuestions, currentQuestion) {
    const progressPercent = (currentQuestion / totalQuestions) * 100;
    const payoutAmount = currentQuestion * 20; // +20€ за каждый ответ

    const progressCounter = document.getElementById("progress-counter");
    const payoutDisplay = document.getElementById("payout");
    const progressBar = document.querySelector(".progress-bar");

    progressCounter.textContent = Math.round(progressPercent);
    payoutDisplay.textContent = `+${payoutAmount}$`;
    progressBar.style.width = `${progressPercent}%`;
    progressBar.setAttribute("aria-valuenow", progressPercent);

    // Изменение цвета полосы прогресса на зеленый после последнего ответа
    if (currentQuestion === totalQuestions) {
      progressBar.style.backgroundColor = "#28a745"; // Bootstrap зеленый
    }
  }

  function clearContainer(container) {
    container.innerHTML = "";
    container.style.opacity = 1; // Сброс прозрачности для нового содержимого
  }

  fetchQuestions();
});

function startQuiz() {
  var firstScreen = document.getElementById("firstScreen");
  var quizScreen = document.getElementById("quiz");

  // Сначала скрываем firstScreen
  firstScreen.classList.add("hidden");

  // Ожидаем окончания анимации исчезновения, затем показываем quiz
  setTimeout(() => {
    firstScreen.style.display = "none"; // Полностью скрываем первый экран
    quizScreen.style.display = "block"; // Делаем второй экран блочным элементом
    setTimeout(() => {
      quizScreen.classList.add("visible"); // Добавляем видимость с анимацией
    }, 10); // Минимальная задержка для гарантии перерендера
  }, 500); // Задержка равна времени анимации
}
