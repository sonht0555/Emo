  var dynamic = nipplejs.create({
    zone: document.getElementById("dynamic"),
    color: "#323232",
    size: "120",
  });
  document.addEventListener("DOMContentLoaded", function () {
    const targetBoxes = document.querySelectorAll(".class");
    const opacityDivs = document.querySelectorAll(".m1, .m2, .m3");
    const changeButton = document.getElementById("changeButton");
    const additionalDiv = document.getElementById("additionalDiv");
  
    const classes = ["O6", "O3", "OO", "O9"];
    const opacityClasses = ["m1", "m2", "m3"];
    let currentIndex = 0;
  
    const savedIndex = localStorage.getItem("currentIndex");
    if (savedIndex !== null) {
      currentIndex = parseInt(savedIndex);
      changeButton.innerText = classes[currentIndex];
      targetBoxes.forEach((box) => {
        box.className = classes[currentIndex];
      });
  
      opacityDivs.forEach((div, index) => {
        if (classes[currentIndex] === "OO" && index < 3) {
          div.style.opacity = 0.4;
        } else if (classes[currentIndex] === "O3" && index < 2) {
          div.style.opacity = 0.4;
        } else if (classes[currentIndex] === "O6" && index < 1) {
          div.style.opacity = 0.4;
        } else {
          div.style.opacity = 1;
        }
      });
  
      if (classes[currentIndex] === "O9") {
        additionalDiv.style.backgroundColor = "rgba(37, 37, 37, 1)";
      } else {
        additionalDiv.style.backgroundColor = `rgba(37, 37, 37, ${(80 - 20 * currentIndex) / 100})`;
      }
    }
  
    changeButton.addEventListener("click", function () {
      targetBoxes.forEach((box) => {
        box.className = classes[currentIndex];
      });
      changeButton.innerText = classes[currentIndex];
  
      opacityDivs.forEach((div, index) => {
        if (classes[currentIndex] === "OO" && index < 3) {
          div.style.opacity = 0.4;
        } else if (classes[currentIndex] === "O3" && index < 2) {
          div.style.opacity = 0.4;
        } else if (classes[currentIndex] === "O6" && index < 1) {
          div.style.opacity = 0.4;
        } else {
          div.style.opacity = 1;
        }
      });
      currentIndex = (currentIndex + 1) % classes.length;
    });
  });
  