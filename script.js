// script.js
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM cargado correctamente.");

  // Referencias a elementos del DOM
  const registrationDiv = document.getElementById('registration');
  const introDiv = document.getElementById('intro');
  const gameDiv = document.getElementById('game');
  const downloadSection = document.getElementById('downloadSection');

  const startBtn = document.getElementById('startBtn');
  const introBtn = document.getElementById('introBtn');
  const nextBtn = document.getElementById('nextBtn');

  const contentDiv = document.getElementById('content');
  const feedbackDiv = document.getElementById('feedback'); // Ya no se usará para mostrar feedback
  const introTextDiv = document.getElementById('introText');
  const agentNameSpan = document.getElementById('agentName');

  // Sonidos generales
  const bgMusic = document.getElementById('bgMusic');
  const correctSound = document.getElementById('correctSound');
  const wrongSound = document.getElementById('wrongSound');
  const clickSound = document.getElementById('clickSound');

  // Datos del jugador y puntuación
  let player = {};
  let currentQuestionIndex = 0;
  let currentLevel = 1;
  let isShowingNarrative = false;

  // Variables para la puntuación: cada respuesta correcta suma según el nivel
  let totalScore = 0;
  // Ya no mostramos puntaje por nivel en la pantalla final,
  // por lo que dejamos de actualizar un objeto por nivel.
  // Si lo necesitas internamente, lo puedes seguir usando, pero la pantalla final mostrará solo el total.
  
  // Variable para llevar cuenta de los intentos en la pregunta actual.
  let attemptsForCurrentQuestion = 0;

  // Texto de introducción general
  const generalIntro = `
¡Hola, valiente explorador/a! 🌟 Hoy has sido elegido/a para una misión muy especial: convertirte en un agente de la Brigada Protectora. Nuestra tarea es reconocer situaciones de violencia y proteger a todos los niños y niñas del mundo.

Para completar la misión, debes responder correctamente cada pregunta. Si lo logras, ¡te unirás a la Brigada Protectora y serás un verdadero héroe o heroína! 🦸‍♂️🦸‍♀️

¡Ponte tu lupa 🔍, prepárate y que comience la aventura! 🚀`;

  // Narrativas “Antes de empezar” por nivel, con texto, audio e imagen
  const levelNarratives = {
    1: {
      text: `🔹 Nivel 1: ¿Qué son las violencias basadas en género?
📖 Antes de empezar...
Las violencias basadas en género ocurren cuando alguien trata mal a otra persona solo por ser niño o niña. Esto puede hacer que alguien se sienta triste o piense que no puede hacer ciertas cosas. Todos tenemos los mismos derechos y podemos elegir lo que nos gusta sin miedo.`,
      audio: "audio/level1_narration.mp3",
      image: "images/level1_intro.webp"
    },
    2: {
      text: `🔹 Nivel 2: ¿Cómo saber si algo no está bien?
📖 Antes de empezar...
A veces, algo nos hace sentir mal, pero no sabemos si es correcto. Algunas señales son:
– Que te toquen de una forma que no te gusta.
– Que te obliguen a hacer algo que no quieres.
– Que te digan palabras hirientes.
– Que te traten diferente por tu apariencia.`,
      audio: "audio/level2_narration.mp3",
      image: "images/level2_intro.webp"
    },
    3: {
      text: `🔹 Nivel 3: ¿Qué puedes hacer si esto te pasa a ti o a alguien que conoces?
📖 Antes de empezar...
Si sientes que alguien te trata mal o ves que alguien más lo sufre, recuerda:
– Habla con una persona de confianza (papá, mamá, profesor, etc.).
– No es tu culpa.
– Anima a quien lo sufra a pedir ayuda.`,
      audio: "audio/level3_narration.mp3",
      image: "images/level3_intro.webp"
    }
  };

  // Array de preguntas (cada una con imagen y audio de narración)
  const questions = [
    // Nivel 1
    {
      level: 1,
      question: `📌 Situación 1:
Mariana quiere jugar fútbol en el recreo, pero unos niños le dicen que el fútbol es "solo para niños" y no la dejan jugar.
¿Crees que hay violencia? (Sí / No)`,
      correct: "Sí",
      feedback: `Decirle a alguien que no puede hacer algo por su género es discriminatorio.`,
      image: "images/nivel1_situacion1.webp",
      audio: "audio/nivel1_situacion1.mp3"
    },
    {
      level: 1,
      question: `📌 Situación 2:
Pedro quiere aprender a bailar, pero sus amigos le dicen que "bailar es cosa de niñas" y se burlan de él.
¿Crees que hay violencia? (Sí / No)`,
      correct: "Sí",
      feedback: `Burlarse por tus gustos es una forma de violencia.`,
      image: "images/nivel1_situacion2.webp",
      audio: "audio/nivel1_situacion2.mp3"
    },
    {
      level: 1,
      question: `📌 Situación 3:
En la escuela se organizan equipos de ciencias y todos pueden participar.
¿Crees que hay violencia? (Sí / No)`,
      correct: "No",
      feedback: `¡Correcto! Es una situación justa para todos.`,
      image: "images/nivel1_situacion3.webp",
      audio: "audio/nivel1_situacion3.mp3"
    },
    // Nivel 2
    {
      level: 2,
      question: `📌 Situación 1:
A Juan le dicen "cuatro ojos" en la escuela por usar gafas, y eso lo hace sentir mal.
¿Crees que hay violencia? (Sí / No)`,
      correct: "Sí",
      feedback: `Burlarse por la apariencia es violencia.`,
      image: "images/nivel2_situacion1.webp",
      audio: "audio/nivel2_situacion1.mp3"
    },
    {
      level: 2,
      question: `📌 Situación 2:
Sara no quiere abrazar a un familiar, pero su mamá la obliga.
¿Crees que hay violencia? (Sí / No)`,
      correct: "Sí",
      feedback: `Nadie debe obligarte a hacer algo que no deseas.`,
      image: "images/nivel2_situacion2.webp",
      audio: "audio/nivel2_situacion2.mp3"
    },
    {
      level: 2,
      question: `📌 Situación 3:
David es nuevo en la escuela y todos lo incluyen en sus juegos.
¿Crees que hay violencia? (Sí / No)`,
      correct: "No",
      feedback: `¡Correcto! La inclusión es importante.`,
      image: "images/nivel2_situacion3.webp",
      audio: "audio/nivel2_situacion3.mp3"
    },
    // Nivel 3
    {
      level: 3,
      question: `📌 Situación 1:
Lucía ve que su amiga está triste porque la molestan.
¿Crees que debería ayudarla? (Sí / No)`,
      correct: "Sí",
      feedback: `¡Exacto! Ayudar es un acto de valentía.`,
      image: "images/nivel3_situacion1.webp",
      audio: "audio/nivel3_situacion1.mp3"
    },
    {
      level: 3,
      question: `📌 Situación 2:
Carlos escucha que un niño advierte a otro que "si cuenta algo, tendrá problemas".
¿Crees que debe hablar con un adulto? (Sí / No)`,
      correct: "Sí",
      feedback: `¡Muy bien! Un adulto puede ayudar.`,
      image: "images/nivel3_situacion2.webp",
      audio: "audio/nivel3_situacion2.mp3"
    },
    {
      level: 3,
      question: `📌 Situación 3:
Emilia decide no contar un problema porque piensa que nadie le creerá.
¿Crees que debería buscar ayuda? (Sí / No)`,
      correct: "Sí",
      feedback: `¡Correcto! Siempre hay alguien dispuesto a ayudar.`,
      image: "images/nivel3_situacion3.webp",
      audio: "audio/nivel3_situacion3.mp3"
    }
  ];

  // Función que muestra texto letra por letra (efecto typewriter)
  function typeWriterEffect(element, text, speed = 30, callback) {
    element.innerHTML = "";
    let i = 0;
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        if (callback) callback();
      }
    }
    type();
  }

  // Función para formatear el texto de feedback en varias líneas (separa cada 40 caracteres aprox.)
  function formatFeedbackText(text, maxLineLength = 40) {
    let words = text.split(' ');
    let formatted = '';
    let line = '';
    words.forEach(word => {
      if (line.length + word.length + 1 > maxLineLength) {
        formatted += line.trim() + '<br>';
        line = word + ' ';
      } else {
        line += word + ' ';
      }
    });
    formatted += line.trim();
    return formatted;
  }

  // Función para mostrar una alerta lateral de score (3 segundos)
  function showScoreAlert(points) {
    let alertDiv = document.createElement('div');
    alertDiv.className = "score-alert";
    alertDiv.textContent = `¡Felicidades, ganaste ${points} pts!`;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  // Función para mostrar una alerta lateral de feedback (5 segundos)
  function showFeedbackAlert(message) {
    let feedbackAlertDiv = document.createElement('div');
    feedbackAlertDiv.className = "feedback-alert";
    // Formateamos el mensaje para que se distribuya en varias líneas
    const formattedMessage = formatFeedbackText(message, 40);
    feedbackAlertDiv.innerHTML = formattedMessage;
    document.body.appendChild(feedbackAlertDiv);
    setTimeout(() => {
      feedbackAlertDiv.remove();
    }, 5000);
  }

  // Inicia el juego y la música de fondo cuando se registra el participante
  startBtn.addEventListener('click', function() {
    console.log("Botón 'Iniciar Misión' presionado.");
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    if (name === "" || age === "") {
      alert("Por favor, ingresa todos los datos.");
      return;
    }
    // Guardamos los datos del jugador y la fecha actual
    player.name = name;
    player.age = age;
    player.date = new Date().toLocaleString();
    console.log("Registro del jugador:", player);

    // Ajustar volumen de la música de fondo y reproducirla
    bgMusic.currentTime = 0;
    bgMusic.volume = 0.5;
    bgMusic.play();

    // Reproducir audio de la intro junto al texto
    let introAudio = new Audio("audio/intro.mp3");
    introAudio.currentTime = 0;
    introAudio.play();

    // Ocultamos el registro y mostramos la introducción
    registrationDiv.classList.add('hidden');
    introDiv.classList.remove('hidden');
    // Mostramos la narrativa general con efecto typewriter
    typeWriterEffect(introTextDiv, generalIntro, 40, function() {
      console.log("Narrativa general completada.");
      introBtn.classList.remove('hidden');
    });
  });

  // Al hacer clic en "Comenzar Misión" de la introducción
  introBtn.addEventListener('click', function() {
    console.log("Botón 'Comenzar Misión' presionado.");
    introDiv.classList.add('hidden');
    startLevelNarrative(currentLevel);
  });

  // Función para mostrar la narrativa de inicio de nivel (texto + imagen + audio)
  function startLevelNarrative(level) {
    console.log(`Iniciando narrativa del Nivel ${level}.`);
    // Aseguramos que el contenedor de juego sea visible
    gameDiv.classList.remove('hidden');
    isShowingNarrative = true;
    contentDiv.innerHTML = "";
    feedbackDiv.innerHTML = "";
    
    // Reiniciamos los intentos para la pregunta actual
    attemptsForCurrentQuestion = 0;

    // Reproducir audio de narración para el nivel
    let narrationAudio = new Audio(levelNarratives[level].audio);
    narrationAudio.currentTime = 0;
    narrationAudio.play();

    // Mostrar imagen y luego el texto con efecto typewriter
    contentDiv.innerHTML = `<img src="${levelNarratives[level].image}" alt="Nivel ${level} Imagen" class="level-img"><p></p>`;
    const p = contentDiv.querySelector("p");
    typeWriterEffect(p, levelNarratives[level].text, 40, function() {
      nextBtn.textContent = "Continuar";
      nextBtn.classList.remove('hidden');
      nextBtn.onclick = function() {
        console.log("Continuar después de la narrativa del nivel.");
        nextBtn.classList.add('hidden');
        isShowingNarrative = false;
        showQuestion();
      };
    });
  }

  // Función para mostrar cada pregunta (con audio para la situación)
  function showQuestion() {
    // Reiniciamos los intentos para la pregunta actual
    attemptsForCurrentQuestion = 0;
    if (currentQuestionIndex < questions.length) {
      const q = questions[currentQuestionIndex];

      // Si se pasa a un nuevo nivel, se muestra la transición
      if (q.level > currentLevel) {
        contentDiv.innerHTML = `<h2>¡Felicidades! Has completado el Nivel ${currentLevel}. Sigamos adelante. 🚀</h2>`;
        nextBtn.textContent = "Continuar al siguiente nivel";
        nextBtn.classList.remove('hidden');
        nextBtn.onclick = function() {
          console.log("Transición al siguiente nivel.");
          nextBtn.classList.add('hidden');
          currentLevel = q.level;
          startLevelNarrative(currentLevel);
        };
        return;
      }

      // Reproducir el audio narrativo de la situación
      if (q.audio) {
        let questionAudio = new Audio(q.audio);
        questionAudio.currentTime = 0;
        questionAudio.play();
      }

      // Mostrar imagen de la pregunta y luego el texto con efecto typewriter
      contentDiv.innerHTML = `<img src="${q.image}" alt="Pregunta" class="question-img"><p></p>`;
      const p = contentDiv.querySelector("p");
      typeWriterEffect(p, q.question, 40, function() {
        // Al terminar de escribir la pregunta, se muestran los botones de respuesta
        const btnYes = document.createElement("button");
        btnYes.textContent = "Sí";
        btnYes.onclick = function() {
          checkAnswer("Sí");
        };
        const btnNo = document.createElement("button");
        btnNo.textContent = "No";
        btnNo.onclick = function() {
          checkAnswer("No");
        };
        contentDiv.appendChild(btnYes);
        contentDiv.appendChild(btnNo);
      });
    } else {
      // Fin de todas las preguntas: se muestra la sección final con el score
      console.log("No quedan más preguntas.");
      gameDiv.classList.add('hidden');

      // Contenido final: mostrar sólo el puntaje final en verde
      downloadSection.innerHTML = `<img src="images/final_screen.webp" alt="Pantalla Final" class="final-img">
<h2>Misión cumplida</h2>
<p>Felicidades, Agente ${player.name}.</p>
<p class="final-score">Score Final: ${totalScore} pts</p>
<p>¡Gracias por jugar!</p>`;
      downloadSection.classList.remove('hidden');

      // Reproducir audio final
      let finalAudio = new Audio("audio/final.mp3");
      finalAudio.currentTime = 0;
      finalAudio.play();

      // Enviar resultado al backend en formato JSON
      sendResultToBackend();
    }
  }

  // Función para verificar la respuesta y actualizar la puntuación
  function checkAnswer(answer) {
    const q = questions[currentQuestionIndex];
    if (answer === q.correct) {
      console.log("Respuesta correcta.");
      correctSound.currentTime = 0;
      correctSound.play();

      // Definir puntos según el nivel: 5, 10 o 15
      let basePoints = currentLevel === 1 ? 5 : (currentLevel === 2 ? 10 : 15);
      // Si hubo al menos un fallo en esta pregunta, se otorga un 30% menos
      let pointsAwarded = attemptsForCurrentQuestion > 0 ? Math.round(basePoints * 0.7) : basePoints;
      totalScore += pointsAwarded;

      // Mostrar alerta lateral con la ganancia y el feedback (sólo en la alerta)
      showScoreAlert(pointsAwarded);
      showFeedbackAlert(`✅ ${q.feedback}`);

      nextBtn.textContent = "Siguiente";
      nextBtn.classList.remove('hidden');
      nextBtn.onclick = function() {
        console.log("Siguiente pregunta.");
        nextBtn.classList.add('hidden');
        currentQuestionIndex++;
        showQuestion();
      };
    } else {
      console.log("Respuesta incorrecta.");
      wrongSound.currentTime = 0;
      wrongSound.play();
      // Incrementamos el contador de intentos para esta pregunta
      attemptsForCurrentQuestion++;
      showFeedbackAlert(`❌ Respuesta incorrecta. Intenta de nuevo.`);
    }
  }

  // Función para enviar (guardar) los resultados en el backend en formato JSON
  function sendResultToBackend() {
    const data = {
      nombre: player.name,
      edad: player.age,
      fecha: player.date,
      scoreFinal: totalScore
    };
    fetch('/guardar_resultado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(data => console.log("Resultado guardado en el backend: ", data))
    .catch(error => console.error("Error al guardar el resultado: ", error));
  }

  // EVENTO GLOBAL: Reproduce sonido de click en cada botón
  document.addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'button') {
      clickSound.currentTime = 0;
      clickSound.play();
    }
  });
});
