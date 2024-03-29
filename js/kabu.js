import mGBA from "./mgba.js";
var messageTimeout;
let turboState = 1;
let stateAdj = 1;
let clickState = 0;
let opacity = parseFloat(localStorage.getItem("opacity")) || 0.1;
var timeoutId;
const storage = document.getElementById("storage");
const intro = document.getElementById("intro");
const ingame = document.getElementById("in-game");
const upLoadFile = document.getElementById("upLoadFile");
const input = document.getElementById("input-container");
const inputText = document.getElementById("inputText");
const romlist = document.getElementById("rom-list");
const menuPad = document.getElementById("menu-pad");
const listPad = document.getElementById("menu-list-pad");
const shader = document.getElementById("shader");
const imgshader = document.getElementById("img-shader");
const savedValue = localStorage.getItem("selectedShader");
const increaseButton = document.getElementById("plus-shader");
const decreaseButton = document.getElementById("minus-shader");
const loadStateButton = document.getElementById("loadStateButton");
const saveStateButton = document.getElementById("saveStateButton");
const statePageButton = document.getElementById("statePageButton");
const romInput = document.getElementById("fileInput");
const turbo = document.getElementById("turbo");
const savedTurboState = localStorage.getItem("turboState");
const ids = ['minus-shader', 'loadStateButton', 'input-container', 'saveStateButton', 'statePageButton', 'menu-pad', 'turbo', 'set-volume-range', 'minus-shader', 'shader', 'plus-shader', 'restart-game', 'slot-state', 'localStorages', 'state00', 'state01', 'state02', 'state03', 'dynamic', 'switch', 'cheatsTextArea', 'cleanCheat', 'saveCheat'];
const setAdjustment = document.getElementById("setAdjustment");
const savedStateAdj = localStorage.getItem("stateAdj");
const restart = document.getElementById('restart-game');
const backToHome = document.getElementById("backToHome");
const openLocalStorage = document.getElementById("openLocalStorage");
const savesFile = document.getElementById("savesFile");
const romsFile = document.getElementById("romsFile");
const statesFile = document.getElementById("statesFile");
const saveCheatsButton = document.getElementById("saveCheat");
const Module = {
    canvas: document.getElementById("canvas")
};
/*----------------BackEnd----------------*/
startGBA(Module);
setTimeout(romList, 500);
setTimeout(localStorageFile, 500);
document.getElementById('in-game').ontouchstart = (e) => {
    e.preventDefault();
};
ids.forEach(function(id) {
    var element = document.getElementById(id);
    if (element) {
        element.setAttribute("ontouchstart", "event.stopPropagation()");
    }
});


/*Start GBA*/
function startGBA(Module) {
    mGBA(Module).then(function(Module) {
        const mGBAVersion = Module.version.projectName + " " + Module.version.projectVersion;
        console.log(mGBAVersion);
        Module.FSInit();
    });
}
/*Load Game ROM*/
function loadGame(InputFile) {
    const gameName = InputFile.files[0].name;
    const stateName = gameName.replace(/\.(gba|gbc|gb)$/, ".ss0");
    const statesList = Module.listStates();
    localStorage.setItem("gameName", gameName);
    if (gameName.endsWith(".gbc") || gameName.endsWith(".gb")) {
        canvas.classList.add("gbc");
    }
    if (statesList.includes(stateName)) {
        Module.loadGame(`/data/games/${gameName}`);
        intro.classList.add("disable");
        ingame.classList.remove("disable");
        setTimeout(() => {
            if (confirm("Do you want to load save state?")) {
                loadState(0);
                localStorage.setItem("gameName", gameName);
                if (savedTurboState !== null) {
                    turboState = parseInt(savedTurboState);
                    turboF(turboState);
                }
                setTimeout(() => {
                    Module.SDL2(), 500
                });
            }
        }, 100);
        setTimeout(saveStatePeriodically, 500);
    } else {
        uploadRom(romInput);
        intro.classList.add("disable");
        ingame.classList.remove("disable");
        setTimeout(() => {
            Module.loadGame(`/data/games/${gameName}`);
        }, 500);
        setTimeout(saveStatePeriodically, 1000);
    }
}
/*Save State*/
function saveState(slot) {
    Module.saveState(slot);
    setTimeout(() => {
        Module.FSSync()
    }, 500);
}
/*Load State*/
function loadState(slot) {
    Module.loadState(slot);
}
/*Auto Save Game Every 10s */
function saveStatePeriodically() {
    let count = 0;
    const intervalId = setInterval(() => {
        if (parseInt(localStorage.getItem("slotStateSaved"))===1) {
            document.getElementById("led01").style.fill = "rgba(255, 255, 245, 0.2)";
            document.getElementById("led02").style.fill = "rgba(255, 255, 245, 0.2)";
            document.getElementById("led03").style.fill = "rgba(255, 255, 245, 0.2)";
            setTimeout(() => {
                document.getElementById("led01").style.fill = "#78C850";
                }, 1000);
        } else if(parseInt(localStorage.getItem("slotStateSaved"))===2) {
            document.getElementById("led02").style.fill = "rgba(255, 255, 245, 0.2)";  
            document.getElementById("led02").style.fill = "rgba(255, 255, 245, 0.2)";
            document.getElementById("led03").style.fill = "rgba(255, 255, 245, 0.2)";
            setTimeout(() => {
                document.getElementById("led02").style.fill = "#78C850";
                }, 1000);
        } else {
            document.getElementById("led03").style.fill = "rgba(255, 255, 245, 0.2)";  
            document.getElementById("led02").style.fill = "rgba(255, 255, 245, 0.2)";
            document.getElementById("led03").style.fill = "rgba(255, 255, 245, 0.2)";
            setTimeout(() => {
                document.getElementById("led03").style.fill = "#78C850";
                }, 1000);
        }
        saveState(0);
        screenShot(0);
        console.log(`saveState(0) was called ${++count} time(s).`);
    }, 10000);
    return intervalId;
}
/*Save Rom in LocalStorage*/
function uploadRom(romFile) {
    const file = romFile.files[0];
    Module.uploadRom(file, () => {
        console.log("ROM uploaded successfully:", file.name);
        localStorageFile();
        Module.FSSync();
    });
}
/*Save .Sav and .ss0,1,2 in LocalStorage*/
function uploadSavSta(SavStaFile) {
    const file = SavStaFile.files[0];
    Module.uploadSaveOrSaveState(file, () => {
        console.log("Save/State uploaded successfully:", file.name);
        localStorageFile();
        Module.FSSync();
    });
}
/*Save Cheat in LocalStorage*/
function uploadCheat(cheatFile) {
    const file = cheatFile.files[0];
    Module.uploadCheats(file, () => {
        console.log("Cheat uploaded successfully:", file.name);
        localStorageFile();
        Module.FSSync();
    });
}
/*Download File*/
function downloadFile(filepath, filename) {
    const save = Module.downloadFile(filepath);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.download = filename;
    const blob = new Blob([save], {
        type: "application/octet-stream",
    });
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(blob);
    a.remove();
}
/*Notification Message*/
function notiMessage(messageContent, second) {
    var message = document.getElementById("noti-mess");

    if (message.style.opacity === "1") {
      clearTimeout(timeoutId);
      message.style.opacity = "0";
    }
    message.textContent = messageContent;
    message.style.opacity = "1";
    timeoutId = setTimeout(function() {
      message.textContent = localStorage.getItem("gameName");
    }, second);
}
/*Virtual GamePad*/
function buttonPress(buttonName, isPress) {
    if (buttonName.includes("-")) {
        const [primaryButton, secondaryButton] = buttonName.toLowerCase().split("-");
        isPress ? Module.buttonPress(primaryButton) : Module.buttonUnpress(primaryButton);
        isPress ? Module.buttonPress(secondaryButton) : Module.buttonUnpress(secondaryButton);
    } else {
        isPress ? Module.buttonPress(buttonName.toLowerCase()) : Module.buttonUnpress(buttonName.toLowerCase());
    }
}
["A", "B", "Start", "Select", "L", "R", "Up", "Down", "Left", "Right", "Up-left", "Up-right", "Down-left", "Down-right","loadStateButton","saveStateButton","minus-shader","plus-shader","restart-game" ].forEach((buttonId) => {
    const element = document.getElementById(buttonId);
    let currentButton = null;
    ["mousedown", "touchstart"].forEach((startEventName) => {
        element.addEventListener(startEventName, () => {
            currentButton = element;
            buttonPress(buttonId, true);
            element.classList.add('touched');
        });
    });
    ["mouseup", "touchend", "touchcancel"].forEach((endEventName) => {
        element.addEventListener(endEventName, () => {
            if (currentButton) {
                buttonPress(buttonId, false);
                currentButton = null;
                element.classList.remove('touched');
            }
        });
    });
    element.addEventListener("touchmove", (event) => {
        const touch = event.touches[0];
        const newButton = document.elementFromPoint(touch.clientX, touch.clientY);
        if (newButton !== currentButton && event.touches.length === 1) {
            if (currentButton) {
                const touchendEvent = new Event("touchend");
                currentButton.dispatchEvent(touchendEvent);
            }
            if (newButton) {
                const touchstartEvent = new Event("touchstart");
                newButton.dispatchEvent(touchstartEvent);
            }
            currentButton = newButton;
        }
    });
    document.addEventListener("touchend", (event) => {
        if (event.touches.length === 0) {
            if (currentButton) {
                const touchendEvent = new Event("touchend");
                currentButton.dispatchEvent(touchendEvent);
                currentButton = null;
            }
        }
    });
    // Joystick
    let currentDirection = '';
    const updateButtonState = (direction, isPressed) => {
        const directions = direction.split('-');
        directions.forEach(dir => {
            if (isPressed) {
                Module.buttonPress(dir);
            } else {
                Module.buttonUnpress(dir);
            }
        });
    };
    dynamic.on('move', (evt, data) => {
        const angle = data.angle.degree;
        let dpadDirection = '';
        if (angle >= 337.5 || angle < 22.5) {
            dpadDirection = 'Right';
        } else if (angle >= 22.5 && angle < 67.5) {
            dpadDirection = 'Up-right';
        } else if (angle >= 67.5 && angle < 112.5) {
            dpadDirection = 'Up';
        } else if (angle >= 112.5 && angle < 157.5) {
            dpadDirection = 'Up-left';
        } else if (angle >= 157.5 && angle < 202.5) {
            dpadDirection = 'Left';
        } else if (angle >= 202.5 && angle < 247.5) {
            dpadDirection = 'Down-left';
        } else if (angle >= 247.5 && angle < 292.5) {
            dpadDirection = 'Down';
        } else if (angle >= 292.5 && angle < 337.5) {
            dpadDirection = 'Down-right';
        }
        if (dpadDirection !== currentDirection) {
            updateButtonState(currentDirection, false);
            updateButtonState(dpadDirection, true);
            currentDirection = dpadDirection;
        }
      //  console.log('DPAD Direction: ' + dpadDirection);
    });
    dynamic.on('end', () => {
        updateButtonState(currentDirection, false);
        currentDirection = '';
    });
    // Joystick
});
/*Turbo*/
function turboF(turboState) {
    if (turboState === 1) {
        notiMessage("Normal Speed", 2000);
        turbo.classList.remove("turbo-medium");
        turbo.classList.remove("turbo-fast");
        Module.setMainLoopTiming(0, 16);
    } else if (turboState === 2) {
        notiMessage("Medium Speed", 2000);
        turbo.classList.add("turbo-medium");
        turbo.classList.remove("turbo-fast");
        Module.setMainLoopTiming(0, 8);
    } else if (turboState === 3) {
        notiMessage("Fast Speed", 2000);
        turbo.classList.remove("turbo-medium");
        turbo.classList.add("turbo-fast");
        Module.setMainLoopTiming(0, 1);
    }
}
//Position Adjustment
function positionAdjustment(stateAdj) {
    const states = [{
            marginTop: "0px",
            rectOpacity: [1, 1, 1],
            GOpacity: [0, 0, 0, 1]
        },
        {
            marginTop: "40px",
            rectOpacity: [0.4, 1, 1],
            GOpacity: [0, 0, 1, 0]
        },
        {
            marginTop: "80px",
            rectOpacity: [0.4, 0.4, 1],
            GOpacity: [0, 1, 0, 0]
        },
        {
            marginTop: "120px",
            rectOpacity: [0.4, 0.4, 0.4],
            GOpacity: [1, 0, 0, 0]
        }
    ];
    if (stateAdj >= 1 && stateAdj <= 4) {
        const state = states[stateAdj - 1];
        document.querySelectorAll(".target-boxes").forEach(function(element, index) {
            element.style.setProperty("margin-top", state.marginTop);
        });
        document.getElementById("rect1").style.setProperty("opacity", state.rectOpacity[0]);
        document.getElementById("rect2").style.setProperty("opacity", state.rectOpacity[1]);
        document.getElementById("rect3").style.setProperty("opacity", state.rectOpacity[2]);
        for (let i = 0; i < 4; i++) {
            document.getElementById(`G${i}`).style.setProperty("opacity", state.GOpacity[i]);
        }
    }
}
//File Size
function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1e3 : 1024;
    const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(dp) + ' ' + units[u];
}
//Element Storage
function createElementStorage(parent, fileName, filePart) {
    const Name = document.createElement("div");
    Name.classList.add("flex-1", "rom-item", "rom");
    parent.appendChild(Name);
    const span = document.createElement("span");
    span.textContent = fileName;
    span.classList.add("flex-1");
    Name.appendChild(span);
    span.onclick = () => {
        const dialog = document.createElement("dialog");
        dialog.onclose = () => dialog.remove();
        parent.appendChild(dialog);
        const back = document.createElement("div");
        back.classList.add("storage");
        dialog.appendChild(back);
        const closeButton = document.createElement("div");
        closeButton.classList.add("home", "bc");
        back.appendChild(closeButton);
        closeButton.onclick = () => {
            dialog.close();
            dialog.remove();
        };
        const Name = document.createElement("div");
        Name.classList.add("flex-1", "rom-item", "hw", "cw");
        Name.textContent = fileName;
        dialog.appendChild(Name);
        const actionDiv = document.createElement("div");
        actionDiv.classList.add("actionDiv", "hw", "cw");
        dialog.appendChild(actionDiv);
        const downloadButton = document.createElement("div");
        downloadButton.classList.add("download", "bc");
        actionDiv.appendChild(downloadButton);
        downloadButton.onclick = () => {
            downloadFile(filePart, fileName);
        };
        const deleteButton = document.createElement("div");
        deleteButton.classList.add("delete", "bc");
        actionDiv.appendChild(deleteButton);
        deleteButton.onclick = async () => {
            if (window.confirm("Delete this file? " + fileName)) {
                Module.deleteFile(filePart)
                setTimeout(Module.FSSync(), 500);
                localStorageFile();
                dialog.close();
                dialog.remove();
            }
        };
        const renameButton = document.createElement("div");
        renameButton.classList.add("rename", "bc");
        actionDiv.appendChild(renameButton);
        renameButton.onclick = async () => {
            const newFilename = window.prompt("Edit filename for " + fileName, fileName);
            if (newFilename !== null) {
                Module.editFileName(filePart, fileName, newFilename);
                setTimeout(Module.FSSync(), 500);
                localStorageFile();
                dialog.close();
                dialog.remove();
            }
        };
        dialog.showModal();
    }
    const mib = document.createElement("span");
    mib.textContent = humanFileSize(Module.fileSize(filePart));
    mib.classList.add("mib");
    Name.appendChild(mib);
}
//local Storage File
function localStorageFile() {
    const listRoms = Module.listRoms().filter((file) => file !== "." && file !== "..");
    const listSaves = Module.listSaves().filter((file) => file !== "." && file !== "..");
    const listStates = Module.listStates().filter((file) => file !== "." && file !== "..");
    const listCheats = Module.listCheats().filter((file) => file !== "." && file !== "..");
    const refreshList = [romsFile, savesFile, statesFile, cheatsFile];
    for (const refresh of refreshList) {
        while (refresh.firstChild) {
            refresh.lastChild.remove();
        }
    }
    for (const romsName of listRoms) {
        createElementStorage(romsFile, romsName, `/data/games/${romsName}`);
    }
    for (const statesName of listStates) {
        createElementStorage(statesFile, statesName, `/data/states/${statesName}`);
    }
    for (const savesName of listSaves) {
        createElementStorage(savesFile, savesName, `/data/saves/${savesName}`)
    }
    for (const cheatsName of listCheats) {
        createElementStorage(cheatsFile, cheatsName, `/data/cheats/${cheatsName}`)
    }
}
//Load states in page
function LoadstateInPage(saveSlot, divs, dateState) {
    const imageStateDiv = document.getElementById(divs);
    imageStateDiv.onclick = () => {
        const stateList = document.getElementById("stateList");
        stateList.classList.toggle("disable");
        statePageButton.classList.toggle("active");
        led(saveSlot);
        notiMessage("Loaded State...0" + saveSlot, 2000);
        setTimeout(() => {
            loadState(saveSlot);
            localStorage.setItem("slotStateSaved", saveSlot)
        }, 100);
    };
    while (imageStateDiv.firstChild) {
        imageStateDiv.removeChild(imageStateDiv.firstChild);
    }
    const getNameRom = localStorage.getItem("gameName");
    if (!getNameRom) {
        console.error("No game name identified.");
        return;
    }
    const data = localStorage.getItem(`${getNameRom}_imageState${saveSlot}`) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMjUyNTI1Ii8+CjxwYXRoIG9wYWNpdHk9IjAuNCIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02NyAyOEg1M1Y0Mkg2N1YyOFpNNjUgMjlINjZWMzBWMzFWMzJWMzNWMzRWMzVWMzZWMzdWMzhWMzlWNDBWNDFINTRWNDBINTVWMzlINTZWMzhINTdWMzdINThWMzZINTlWMzVINjBWMzRINjFWMzNINjJWMzJINjNWMzFINjRWMzBINjVWMjlaIiBmaWxsPSIjRkZGRkY1Ii8+Cjwvc3ZnPgo=';
    const date = localStorage.getItem(`${getNameRom}_dateState${saveSlot}`);
    let image = new Image();
    image.src = data;
    imageStateDiv.appendChild(image);
    document.getElementById(dateState).textContent = date;
}
//Capture screenshot
function screenShot(saveSlot) {
    Module.screenShot(() => {
        var resizedCanvas = document.createElement('canvas');
        var resizedContext = resizedCanvas.getContext('2d');
        var screen = document.getElementById('canvas');
        resizedCanvas.height = screen.clientHeight;
        resizedCanvas.width = screen.clientWidth;
        resizedContext.drawImage(screen, 0, 0, resizedCanvas.width, resizedCanvas.height);
        let data = resizedCanvas.toDataURL();
        const currentTime = Date.now();
        const date = formatDateTime(currentTime);
        const getNameRom = localStorage.getItem("gameName");
        if (!getNameRom) {
            console.error("No game name identified.");
            return;
        }
        localStorage.setItem(`${getNameRom}_dateState${saveSlot}`, date);
        localStorage.setItem(`${getNameRom}_imageState${saveSlot}`, data);
    });
}
//LocalStorage size
function calculateLocalStorageSize() {
    var totalLength = 0;
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        totalLength += key.length + value.length;
    }
    // Convert to KB
    var totalSizeKB = totalLength / 1024;
    console.log("Dung lượng của localStorage", totalSizeKB.toFixed(2), "Kib/10Mib");
}
/*Translate Function*/
function translateText() {
    var apiUrl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=" + encodeURIComponent(inputText.textContent);
    fetch(apiUrl).then((response) => response.json()).then((result) => {
        var translatedText = result[0][0][0];
        inputText.textContent = translatedText;
        moveCursorToEnd(inputText);
    }).catch((error) => console.error("Error:", error));
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
            clearInput();
        } else {
            checkContent();
            translateText();
        }
    }
}
inputText.onkeyup = (event) => {
    handleKeyPress(event);
};
function clearInput() {
    inputText.textContent = "";
    inputText.classList.add("no-content");
}
function checkContent() {
    if (!inputText.innerHTML.trim()) {
        inputText.classList.add("no-content");
    } else {
        inputText.classList.remove("no-content");
    }
}
document.addEventListener("DOMContentLoaded", function() {
    checkContent();
    input.addEventListener("touchstart", function(event) {
        var touch = event.touches[0];
        var rect = input.getBoundingClientRect();
        var quarterWidth = rect.width / 8;
        if (touch.clientX > rect.right - quarterWidth) {
            clearInput();
        }
    });
    inputText.addEventListener("focus", function() {
        input.classList.add("cs22");
        moveCursorToEnd(inputText);
    });
    inputText.addEventListener("blur", function() {
        input.classList.remove("cs22");
    });
    inputText.addEventListener("input", function(event) {
        checkContent();
    });
    led(parseInt(localStorage.getItem("slotStateSaved")))
});
function led(slotStateNumbers) {
    if (slotStateNumbers===1) {
        document.getElementById("led01").style.fill = "#78C850";
        document.getElementById("led02").style.fill = "rgba(255, 255, 245, 0.2)";
        document.getElementById("led03").style.fill = "rgba(255, 255, 245, 0.2)";
    } else if(slotStateNumbers===2) {
        document.getElementById("led02").style.fill = "#78C850";
        document.getElementById("led03").style.fill = "rgba(255, 255, 245, 0.2)";
        document.getElementById("led01").style.fill = "rgba(255, 255, 245, 0.2)";
    } else {
        document.getElementById("led03").style.fill = "#78C850";
        document.getElementById("led02").style.fill = "rgba(255, 255, 245, 0.2)";
        document.getElementById("led01").style.fill = "rgba(255, 255, 245, 0.2)";
    }
};
/*----------------FrontEnd----------------*/
/*Buton Upload-File*/
upLoadFile.accept = ".gba,.gbc,.gb,.sav,.ss0,.ss1,.ss2,.ss3,.cheats";
upLoadFile.addEventListener("change", () => {
    const fileName = upLoadFile.files[0].name;
    if (fileName.endsWith(".cheats")) {
        uploadCheat(upLoadFile);
    } else if (fileName.endsWith(".gba") || fileName.endsWith(".gbc") || fileName.endsWith(".bc")) {
        uploadRom(upLoadFile);
    } else {
        uploadSavSta(upLoadFile);
    }
});
/*Rom List*/
function romList() {
    const listRoms = Module.listRoms().filter(
        (file) => file !== "." && file !== "..");
    for (const gameName of listRoms) {
        const div = document.createElement("div");
        div.className = "flex-1";
        div.textContent = gameName;
        romlist.appendChild(div);
        div.onclick = () => {
            intro.classList.add("disable");
            ingame.classList.remove("disable");
            Module.loadGame(`/data/games/${gameName}`);
            notiMessage();
            localStorage.setItem("gameName", gameName);
            if (gameName.endsWith(".gbc") || gameName.endsWith(".gb")) {
                canvas.classList.add("gbc");
            }
            setTimeout(() => {
                if (confirm("Do you want to load save state?")) {
                    loadState(0);
                    if (savedTurboState !== null) {
                        turboState = parseInt(savedTurboState);
                        turboF(turboState);
                    }
                    setTimeout(() => {
                        Module.SDL2(), 500
                    });
                }
            }, 100);
            setTimeout(saveStatePeriodically(), 500);
        };
    }
}
/*Buton Menu in GamePad*/
listPad.classList.add("inactive");
menuPad.addEventListener("click", function() {
    menuPad.classList.toggle("active");
    listPad.classList.toggle("active");
    if (listPad.classList.contains("active")) {
        listPad.classList.remove("inactive");
    } else {
        listPad.classList.add("inactive");
    }
});
/*Button Load State*/
loadStateButton.addEventListener("touchstart", function() {
    clickState++;
    if (clickState === 2) {
        const slotStateNumbers = localStorage.getItem("slotStateSaved") || 1;
        loadState(slotStateNumbers);
        notiMessage("Load...o" + slotStateNumbers, 1500);
    }
    setTimeout(() => {
        clickState = 0
    }, 300);
});
/*Button Save State*/
saveStateButton.addEventListener("touchstart", function() {
    clickState++;
    if (clickState === 2) {
        if (parseInt(localStorage.getItem("autoStateCheck") || 1) === 1) {
            const slotStateNumbers = parseInt((localStorage.getItem("slotStateSaved") % 3) + 1) || 1;
            screenShot(slotStateNumbers);
            saveState(slotStateNumbers);
            led(slotStateNumbers);
            notiMessage("Saved...o" + slotStateNumbers, 1500);
            console.log("slotStateNumbers",slotStateNumbers);
            setTimeout(() => {
                localStorage.setItem("slotStateSaved", slotStateNumbers)
            }, 100);
        } else {
            const slotStateNumbers = parseInt(localStorage.getItem("slotStateSaved")) || 1;
            screenShot(slotStateNumbers);
            saveState(slotStateNumbers);
            led(slotStateNumbers);
            notiMessage("Saved...o" + slotStateNumbers, 1500);
            setTimeout(() => {
                localStorage.setItem("slotStateSaved", slotStateNumbers)
            }, 100);
        }
    }
    setTimeout(() => {
        clickState = 0
    }, 300);
});
//Format Date Time
function formatDateTime(milliseconds) {
    const date = new Date(milliseconds);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
    return `${hours}:${minutes} - ${day}.${month}`;
}
/*Button Rom Input*/
romInput.accept = ".gba,.gbc,.gb";
romInput.addEventListener("change", function() {
    notiMessage();
    loadGame(romInput);
});
/*Enable global audio*/
document.body.addEventListener("click", function() {
    Module.SDL2();
});
/*Button Turbo*/
turbo.addEventListener("click", function() {
    turboState = (turboState % 3) + 1;
    turboF(turboState);
    localStorage.setItem("turboState", turboState);
});
/*Button Reset*/
restart.addEventListener('click', function() {
    window.location.href = window.location.href;
});
/*Dropdown Shader in Setting*/
if (savedValue) {
    shader.value = savedValue;
    applyShaderClass(savedValue);
}
shader.addEventListener("change", function() {
    const selectedValue = shader.value;
    localStorage.setItem("selectedShader", selectedValue);
    applyShaderClass(selectedValue);
});
function applyShaderClass(selectedValue) {
    imgshader.classList.remove("sd-1", "sd-2", "sd-3", "sd-4", "sd-5");
    if (selectedValue === "option1") {
        imgshader.classList.add("sd-1");
    } else if (selectedValue === "option2") {
        imgshader.classList.add("sd-2");
    } else if (selectedValue === "option3") {
        imgshader.classList.add("sd-3");
    } else if (selectedValue === "option4") {
        imgshader.classList.add("sd-4");
    } else if (selectedValue === "option5") {
        imgshader.classList.add("sd-5");
    }
}
/*Button Setting Shader Opacity in Setting*/
imgshader.style.opacity = opacity;
increaseButton.addEventListener("click", function() {
    if (opacity < 1) {
        opacity += 0.05;
        localStorage.setItem("opacity", opacity);
    }
    imgshader.style.opacity = opacity;
    if (messageTimeout) {
        clearTimeout(messageTimeout);
    }
    notiMessage("Opacity " + opacity.toFixed(2), 1500);
});
decreaseButton.addEventListener("click", function() {
    if (opacity > 0.1) {
        opacity -= 0.05;
        localStorage.setItem("opacity", opacity);
    }
    imgshader.style.opacity = opacity;
    if (messageTimeout) {
        clearTimeout(messageTimeout);
    }
    notiMessage("Opacity " + opacity.toFixed(2), 1500);
});
//Button change Adjustment
if (savedStateAdj !== null) {
    stateAdj = parseInt(savedStateAdj);
    positionAdjustment(stateAdj);
}
setAdjustment.addEventListener("click", function() {
    stateAdj = (stateAdj % 4) + 1;
    positionAdjustment(stateAdj);
    localStorage.setItem("stateAdj", stateAdj);
});
//Buton back LocalStorage
backToHome.onclick = () => {
    storage.classList.add("disable");
    intro.classList.remove("disable");
    ingame.classList.add("disable");
};
//Buton open LocalStorage
openLocalStorage.onclick = () => {
    storage.classList.remove("disable");
    intro.classList.add("disable");
    ingame.classList.add("disable");
};
//Buton open SaveStates page
statePageButton.onclick = () => {
    LoadstateInPage(0, "state00", "dateState00")
    LoadstateInPage(1, "state01", "dateState01")
    LoadstateInPage(2, "state02", "dateState02")
    LoadstateInPage(3, "state03", "dateState03")
    const stateList = document.getElementById("stateList");
    stateList.classList.toggle("disable");
    statePageButton.classList.toggle("active");
};
calculateLocalStorageSize();
//Auto save states in page
if (parseInt(localStorage.getItem("autoStateCheck") | 1) === 1) {
    document.getElementById("autoStateCheck").checked = true;
}
document.getElementById("autoStateCheck").addEventListener('change', function() {
    if (this.checked) {
        const autoStateCheck = 1
        localStorage.setItem("autoStateCheck", autoStateCheck)
        notiMessage("Auto Switches Slots", 2000);

    } else {
        const autoStateCheck = 0
        localStorage.setItem("autoStateCheck", autoStateCheck)
        notiMessage("Manual Switches Slots", 2000);
    }
});
//Buton cheats
saveCheatsButton.addEventListener("click", () => {
    const gameName = localStorage.getItem("gameName");
    const cheatName = gameName.replace(".gba", ".cheats");
    const defaultCheatContent = "cheats = 1\n";
    let cheatEnable = false;
    let cheatsContent = defaultCheatContent;
    const newCheatCode = window.prompt("Edit cheat code", localStorage.getItem(`${gameName}_savedCheats`) || 'xxxx xx');
    if (newCheatCode !== null) {
        const enableCheat = confirm("CANCEL is disable a cheat / OK is enable a cheat");
        cheatEnable = enableCheat;
        cheatsContent += `cheat0_enable = ${cheatEnable}\ncheat0_code = "${newCheatCode}"`;
        const blob = new Blob([cheatsContent], {
            type: "text/plain"
        });
        const file = new File([blob], cheatName);
        Module.uploadCheats(file, () => {
            Module.autoLoadCheats();
            setTimeout(() => {
                Module.FSSync();
            }, 500);
            if (cheatEnable) {
                localStorage.setItem(`${gameName}_savedCheats`, newCheatCode);
                notiMessage("Cheat enabled!", 1500);
            }
        });
    }
});

