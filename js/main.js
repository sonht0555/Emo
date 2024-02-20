/*nipplejs*/
 var dynamic = nipplejs.create({
    zone: document.getElementById("dynamic"),
    color: "#323232",
    size: "120",
  });
/*Change-position*/
  document.addEventListener("DOMContentLoaded", function () {
    const targetBoxes = document.querySelectorAll(".target-boxes");
    const opacityDivs = document.querySelectorAll(".m1, .m2, .m3");
    const changeButton = document.getElementById("changeButton");
    const classes = ["O6", "O3", "OO", "O9"];
    let currentIndex = 0;

    function updateStyles() {
      targetBoxes.forEach((box) => {
        box.className = classes[currentIndex];
      });
      opacityDivs.forEach((div, index) => {
        if (
          (classes[currentIndex] === "OO" && index < 3) ||
          (classes[currentIndex] === "O3" && index < 2) ||
          (classes[currentIndex] === "O6" && index < 1)
        ) {
          div.style.opacity = 0.4;
        } else {
          div.style.opacity = 1;
        }
      });
      changeButton.innerText = classes[currentIndex];
      localStorage.setItem("currentIndex", currentIndex.toString());
    }
    const savedIndex = localStorage.getItem("currentIndex");
    if (savedIndex !== null) {
      currentIndex = parseInt(savedIndex);
      updateStyles();
    }
    changeButton.addEventListener("click", function () {
      currentIndex = (currentIndex + 1) % classes.length;
      updateStyles();
    });
});
/*Emulator-select*/
  function handheldStorage(value) {
    localStorage.setItem('selectedConsole', value);
  }
/*--*/
  var input = document.getElementById('input-container');
  var inputText = document.getElementById('inputText');

  function translateText() {
      var apiUrl = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=' + encodeURIComponent(inputText.textContent);
      fetch(apiUrl)
          .then(response => response.json())
          .then(result => {
              var translatedText = result[0][0][0];
              inputText.textContent = translatedText;
              moveCursorToEnd(inputText);
          })
          .catch(error => console.error('Error:', error));
  }

  function moveCursorToEnd(element) {
      var range = document.createRange();
      var selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
        if (!inputText.textContent.trim()) {
          inputText.classList.add('no-content');
          inputText.textContent = '';
        } else {
            checkContent();
            translateText();
        }
    }
}

  function checkContent() {
      if (!inputText.innerHTML.trim()) {
          inputText.classList.add('no-content');
      } else {
          inputText.classList.remove('no-content');
      }
  }

  document.addEventListener('DOMContentLoaded', function() {
  input.addEventListener('touchstart', function(event) {
      var touch = event.touches[0];
      var rect = input.getBoundingClientRect();
      var quarterWidth = rect.width / 10;
      if (touch.clientX > rect.right - quarterWidth) {
          clearInput();
      }
      checkContent();
  });

  inputText.addEventListener('focus', function() {
    input.classList.add('cs22');
  });

  inputText.addEventListener('blur', function() {
    input.classList.remove('cs22');
  });

  inputText.addEventListener('input', function(event) {
      checkContent();
  });
  function clearInput() {
      inputText.textContent = '';
  }
  });
/*--*/
/*--*/