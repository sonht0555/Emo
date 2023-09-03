document.addEventListener("DOMContentLoaded", function () {
    const targetBoxes = document.querySelectorAll(".class");
    const opacityDivs = document.querySelectorAll(".flex-item.M1, .flex-item.M2, .flex-item.M3, .flex-item.M4, .flex-item.M5");
    const changeButton = document.getElementById("changeButton");
    const buttonClick = document.getElementById("buttonClick");
    const additionalDiv = document.getElementById("additionalDiv");

    const classes = ["O6", "O3", "OO", "O9"];
    const opacityClasses = ["M1", "M2", "M3"];
    let currentIndex = 0;

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

        buttonClick.classList.add("clicked");
        setTimeout(function () {
            buttonClick.classList.remove("clicked");
        }, 300);

        if (classes[currentIndex] === "O9") {
            additionalDiv.style.backgroundColor = "rgba(37, 37, 37, 1)";
        } else {
            additionalDiv.style.backgroundColor = `rgba(37, 37, 37, ${(80 - 20 * currentIndex) / 100})`;
        }

        currentIndex = (currentIndex + 1) % classes.length;
    });
});
function toggleSwitch() {
var switchElement = document.getElementById("switch");
switchElement.classList.toggle("on");

var contentElement = document.getElementById("gpad-ur");
contentElement.classList.toggle("joy-ud");
var contentElement = document.getElementById("gpad-dl");
contentElement.classList.toggle("joy-ud");
var contentElement = document.getElementById("gpad-ul");
contentElement.classList.toggle("joy-rl");
var contentElement = document.getElementById("gpad-dr");
contentElement.classList.toggle("joy-rl");
}