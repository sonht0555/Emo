import MgbaMenu from "./menu.js";
import * as FileLoader from "./fileloader.js";

export default class MgbaStorage extends HTMLElement {
  connectedCallback() {
    gamepad.classList.add("display-none");
    const storage = document.createElement("div");
    storage.classList.add("storage");
    this.appendChild(storage);

    const uploadButton = document.createElement("div");
    uploadButton.classList.add("upload-file", "bc");
    storage.appendChild(uploadButton);
    uploadButton.onclick = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.click();
      fileInput.onchange = async () => {
        const file = fileInput.files[0];
        const split = file.name.split(".");
        if (split.length < 2) {
          window.alert("unrecognized file extension: " + file.name);
          return;
        }
        const extension = split[split.length - 1].toLowerCase();
        let dir = null;
        if (extension === "gba") {
          dir = "/data/games/";
        } else if (extension == "sav") {
          dir = "/data/saves/";
        } else if (extension.startsWith("ss")) {
          dir = "/data/states/";
        } else {
          window.alert("unrecognized file extension: " + extension);
          return;
        }

        const filepath = dir + file.name;
        await FileLoader.saveFile(filepath, file);
        this.refreshFiles();
      };
    };

    const home = document.createElement("div");
    home.classList.add("home", "bc");
    storage.appendChild(home);
    home.onclick = () => {
      this.remove();
      gamepad.classList.remove("display-none");
      welcome.classList.remove("display-none");
    };

    const divAll = document.createElement("div");
    divAll.classList.add("column","flex-disable","mgba-storage");
    divAll.id = 'mgba-storage';
    this.appendChild(divAll);
    function updateMaxHeight() {
    const screenHeight = window.innerHeight;
    const maxHeight = screenHeight - 88;
    const mgbaStorage = document.getElementById('mgba-storage');
    mgbaStorage.style.maxHeight = `${maxHeight}px`;
    mgbaStorage.style.overflow = 'auto';
    }
    window.addEventListener('load', updateMaxHeight);
    window.addEventListener('resize', updateMaxHeight);

    const gamesTitle = document.createElement("div");
    gamesTitle.classList.add("flex-1", "rom-item");
    gamesTitle.textContent = "ROM File.";
    divAll.appendChild(gamesTitle);
    this.gamesContainer = document.createElement("div");
    this.gamesContainer.classList.add("column");
    divAll.appendChild(this.gamesContainer);

    const savesTitle = document.createElement("div");
    savesTitle.classList.add("flex-1", "rom-item");
    savesTitle.textContent = "SAVE File.";
    divAll.appendChild(savesTitle);
    this.savesContainer = document.createElement("div");
    this.savesContainer.classList.add("column");
    divAll.appendChild(this.savesContainer);

    const statesTitle = document.createElement("div");
    statesTitle.classList.add("flex-1", "rom-item");
    statesTitle.textContent = "STATE File.";
    divAll.appendChild(statesTitle);
    this.statesContainer = document.createElement("div");
    this.statesContainer.classList.add("column");
    divAll.appendChild(this.statesContainer);

    this.refreshFiles();
  }

  refreshFiles() {
    removeAllChildren(this.gamesContainer);
    const games = FileLoader.readdirWithoutDotDirs("/data/games");
    for (const gameName of games) {
      this.appendFileButton(gameName, this.gamesContainer, `/data/games/${gameName}`);
    }

    removeAllChildren(this.savesContainer);
    const saves = FileLoader.readdirWithoutDotDirs("/data/saves");
    for (const saveName of saves) {
      this.appendFileButton(saveName, this.savesContainer, `/data/saves/${saveName}`);
    }

    removeAllChildren(this.statesContainer);
    const states = FileLoader.readdirWithoutDotDirs("/data/states");
    for (const stateName of states) {
      this.appendFileButton(stateName, this.statesContainer, `/data/states/${stateName}`);
    }
  }

  appendFileButton(filename, parent, filepath) {
    const container = document.createElement("div");
    container.classList.add("flex-1", "rom-item", "rom");
    parent.appendChild(container);

    const button = document.createElement("span");
    button.classList.add("flex-1");
    container.appendChild(button);
    button.href = "#";
    button.textContent = filename;
    button.onclick = () => {
      const dialog = document.createElement("dialog");

      dialog.onclose = () => dialog.remove();
      divAll.appendChild(dialog);

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

      const fileName = document.createElement("div");
      fileName.classList.add("flex-1", "rom-item", "hw", "cw");
      fileName.textContent = filename;
      dialog.appendChild(fileName);

      const actionDiv = document.createElement("div");
      actionDiv.classList.add("actionDiv", "hw", "cw");
      dialog.appendChild(actionDiv);

      const downloadButton = document.createElement("div");
      downloadButton.classList.add("download", "bc");
      actionDiv.appendChild(downloadButton);
      downloadButton.onclick = () => {
        FileLoader.downloadFile(filepath, filename);
      };

      const deleteButton = document.createElement("div");
      deleteButton.classList.add("delete", "bc");
      actionDiv.appendChild(deleteButton);
      deleteButton.onclick = async () => {
        if (window.confirm("Delete this file? " + filename)) {
          window.Module.FS.unlink(filepath);
          await FileLoader.writefs();
          dialog.close();
          dialog.remove();
          this.refreshFiles();
        }
      };

      const renameButton = document.createElement("div");
      renameButton.classList.add("rename", "bc");
      actionDiv.appendChild(renameButton);
      renameButton.onclick = async () => {
        const newFilename = window.prompt("Enter new filename for " + filename);
        if (newFilename) {
          window.Module.FS.rename(filepath, filepath.replace(filename, newFilename));
          await FileLoader.writefs();
          dialog.close();
          dialog.remove();
          this.refreshFiles();
        }
      };

      dialog.showModal();
    };

    const filesize = document.createElement("span");
    filesize.classList.add("mib");
    filesize.textContent = FileLoader.humanFileSize(window.Module.FS.stat(filepath).size) + " ";
    container.appendChild(filesize);
  }
}

function removeAllChildren(node) {
  while (node.firstChild) {
    node.lastChild.remove();
  }
}

customElements.define("mgba-storage", MgbaStorage);
