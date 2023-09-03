const iframe = document.getElementById('myIframe');
        const changeButton = document.getElementById('d-pad-switch');
        function handleClick() {
            changeButton.classList.toggle("on");
        }
        changeButton.addEventListener("click", handleClick);
   
        changeButton.addEventListener('click', function() {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

            const contentElements = [
                "gpad-ur",
                "gpad-dl"
            ];
            const contentElements1 = [
                "gpad-ul",
                "gpad-dr"
            ];
            contentElements.forEach(elementId => {
                const contentElement = iframeDocument.getElementById(elementId);
                contentElement.classList.toggle("joy-ud");
            });
            contentElements1.forEach(elementId => {
                const contentElement = iframeDocument.getElementById(elementId);
                contentElement.classList.toggle("joy-rl");
            });
        });

        const expandingIcon = document.getElementById("expandingIcon");
        
        expandingIcon.addEventListener("click", function() {
            expandingIcon.classList.toggle("active");
        });

        document.addEventListener("DOMContentLoaded", function () {
            const targetBoxes = document.querySelectorAll(".class");
            const opacityDivs = document.querySelectorAll(".m1, .m2, .m3");
            const changeButton = document.getElementById("button-up");

            const classes = ["O6", "O3", "OO", "O9"];
            const opacityClasses = ["m1", "m2", "m3"];
            let currentIndex = 0;

            changeButton.addEventListener("click", function () {
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
                    changeButton.style.backgroundColor = "rgba(15, 15, 15, 1)";
                } else {
                    changeButton.style.backgroundColor = `rgba(15, 15, 15, ${(80 - 20 * currentIndex) / 100})`;
                }

                currentIndex = (currentIndex + 1) % classes.length;
            });
        });
        const invis = document.querySelectorAll(".invi");

        // Đăng ký sự kiện click cho icon chính
        expandingIcon.addEventListener("click", () => {
            invis.forEach(invi => {
                invi.classList.toggle("expa");
            });
        });

        // JavaScript để mở và đóng popup
        function openPopup() {
            document.getElementById('dialog').style.display = 'block';
        }

        function closePopup() {
            document.getElementById('dialog').style.display = 'none';
        }
