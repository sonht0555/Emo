  var dynamic = nipplejs.create({
    zone: document.getElementById("dynamic"),
    color: "#323232",
    size: "120",
  });
  document.addEventListener("DOMContentLoaded", function () {
    const targetBoxes = document.querySelectorAll(".class");
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
