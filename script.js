document.addEventListener('DOMContentLoaded', function() {
      const textDisplay = document.getElementById('textDisplay');
      const typingInput = document.getElementById('typingInput');
      const startBtn = document.getElementById('startBtn');
      const resetBtn = document.getElementById('resetBtn');
      const timerElement = document.getElementById('timer');
      const wpmElement = document.getElementById('wpm');
      const accuracyElement = document.getElementById('accuracy');
      const progressBar = document.getElementById('progress');
      const results = document.getElementById('results');
      const resultWpm = document.getElementById('resultWpm');
      const resultAccuracy = document.getElementById('resultAccuracy');
      const resultWords = document.getElementById('resultWords');
      const resultChars = document.getElementById('resultChars');
      const keyboardKeys = document.querySelectorAll('kbd');
      
      let timer;
      let timeLeft = 60;
      let isPlaying = false;
      let words = [];
      let currentWordIndex = 0;
      let correctChars = 0;
      totalChars = 0;
      let startTime, endTime;
      
      // Sample quotes for typing test
      const quotes = [
        "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the alphabet.",
        "Programming is the art of telling another human being what one wants the computer to do.",
        "The best way to predict the future is to invent it. Computer scientists are the architects of the future.",
        "Coding is not just code, that is a language that creates a product and brings ideas to life.",
        "Typing speed is important for programmers because we spend most of our time writing code, not compiling it.",
        "Practice makes perfect. The more you type, the faster and more accurate you will become over time.",
        "Web development is the work involved in developing a web site for the Internet or an intranet.",
        "JavaScript is a programming language that conforms to the ECMAScript specification."
      ];
      
      // Initialize the test
      function initTest() {
        const quoteIndex = Math.floor(Math.random() * quotes.length);
        words = quotes[quoteIndex].split(' ');
        currentWordIndex = 0;
        correctChars = 0;
        totalChars = 0;
        
        // Display the text with formatting
        textDisplay.innerHTML = words.map((word, index) => {
          return index === 0 ? `<span class="current-word">${word}</span>` : ` ${word}`;
        }).join('');
        
        // Reset UI elements
        wpmElement.textContent = '0';
        accuracyElement.textContent = '100%';
        timerElement.textContent = '60s';
        progressBar.style.width = '0%';
        results.style.display = 'none';
        
        // Focus on input
        typingInput.value = '';
        typingInput.disabled = false;
        typingInput.focus();
      }
      
      // Start the test
      function startTest() {
        if (isPlaying) return;
        
        isPlaying = true;
        timeLeft = 60;
        startTime = new Date();
        
        initTest();
        
        // Start timer
        timer = setInterval(updateTimer, 1000);
        
        // Update button states
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Testing...';
        startBtn.style.opacity = '0.7';
      }
      
      // Update timer
      function updateTimer() {
        timeLeft--;
        timerElement.textContent = `${timeLeft}s`;
        progressBar.style.width = `${((60 - timeLeft) / 60) * 100}%`;
        
        if (timeLeft <= 0) {
          endTest();
        }
      }
      
      // End the test
      function endTest() {
        clearInterval(timer);
        isPlaying = false;
        endTime = new Date();
        
        // Calculate results
        const timeTaken = (60 - timeLeft) / 60; // in minutes
        const wpm = Math.round((correctChars / 5) / timeTaken);
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
        
        // Display results
        resultWpm.textContent = wpm;
        resultAccuracy.textContent = `${accuracy}%`;
        resultWords.textContent = currentWordIndex;
        resultChars.textContent = totalChars;
        results.style.display = 'block';
        
        // Update button states
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Test';
        startBtn.style.opacity = '1';
        
        // Disable input
        typingInput.disabled = true;
      }
      
      // Reset the test
      function resetTest() {
        clearInterval(timer);
        isPlaying = false;
        timeLeft = 60;
        
        // Reset UI elements
        textDisplay.innerHTML = 'Click Start Test to begin the typing test. You will have 60 seconds to type as much as possible.';
        typingInput.value = '';
        typingInput.disabled = true;
        wpmElement.textContent = '0';
        accuracyElement.textContent = '100%';
        timerElement.textContent = '60s';
        progressBar.style.width = '0%';
        results.style.display = 'none';
        
        // Update button states
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Test';
        startBtn.style.opacity = '1';
      }
      
      // Handle input event
      function handleInput() {
        const inputValue = typingInput.value;
        const currentWord = words[currentWordIndex];
        
        // Check if space was pressed (word completed)
        if (inputValue.endsWith(' ')) {
          // Move to next word
          typingInput.value = '';
          currentWordIndex++;
          
          // Update displayed text
          textDisplay.innerHTML = words.map((word, index) => {
            if (index < currentWordIndex) {
              return ` <span class="correct">${word}</span>`;
            } else if (index === currentWordIndex) {
              return ` <span class="current-word">${word}</span>`;
            } else {
              return ` ${word}`;
            }
          }).join('');
          
          // If all words are completed, get a new quote
          if (currentWordIndex >= words.length) {
            const quoteIndex = Math.floor(Math.random() * quotes.length);
            words = quotes[quoteIndex].split(' ');
            currentWordIndex = 0;
            
            textDisplay.innerHTML = words.map((word, index) => {
              return index === 0 ? `<span class="current-word">${word}</span>` : ` ${word}`;
            }).join('');
          }
          
          return;
        }
        
        // Update current word highlighting
        textDisplay.innerHTML = words.map((word, index) => {
          if (index < currentWordIndex) {
            return ` <span class="correct">${word}</span>`;
          } else if (index === currentWordIndex) {
            let wordHTML = '';
            for (let i = 0; i < word.length; i++) {
              if (i < inputValue.length) {
                if (word[i] === inputValue[i]) {
                  wordHTML += `<span class="correct">${word[i]}</span>`;
                } else {
                  wordHTML += `<span class="incorrect">${word[i]}</span>`;
                }
              } else {
                wordHTML += word[i];
              }
            }
            return ` <span class="current-word">${wordHTML}</span>`;
          } else {
            return ` ${word}`;
          }
        }).join('');
        
        // Update stats
        totalChars = currentWordIndex * 1 + inputValue.length;
        
        let correct = 0;
        for (let i = 0; i < inputValue.length; i++) {
          if (inputValue[i] === currentWord[i]) {
            correct++;
          }
        }
        
        correctChars = currentWordIndex * 1 + correct;
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
        
        // Calculate WPM
        const timeTaken = (60 - timeLeft) / 60; // in minutes
        const wpm = Math.round((correctChars / 5) / (timeTaken || 1));
        
        // Update UI
        wpmElement.textContent = wpm;
        accuracyElement.textContent = `${accuracy}%`;
      }
      
      // Highlight pressed key on virtual keyboard
      function highlightKey(key) {
        const keyElement = Array.from(keyboardKeys).find(kbd => {
          return kbd.textContent.toLowerCase() === key.toLowerCase();
        });
        
        if (keyElement) {
          keyElement.classList.add('active-key');
          setTimeout(() => {
            keyElement.classList.remove('active-key');
          }, 100);
        }
      }
      
      // Event listeners
      startBtn.addEventListener('click', startTest);
      resetBtn.addEventListener('click', resetTest);
      typingInput.addEventListener('input', handleInput);
      
      typingInput.addEventListener('keydown', (e) => {
        if (e.key.length === 1) {
          highlightKey(e.key);
        }
      });
      
      // Initialize
      resetTest();
    });