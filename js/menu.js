import MgbaGame from './game.js';
import * as FileLoader from './fileloader.js';
import MgbaStorage from './storage.js';

export default class MgbaMenu extends HTMLElement {
  async connectedCallback() {
   
  const sd3Div = document.getElementById("rom-input");
  sd3Div.onclick = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.click();
  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (file && /\.(gba|gbc|gb)$/i.test(file.name)) {
      const filepath = `/data/games/${file.name}`;
      await FileLoader.saveFile(filepath, file);

      this.remove();
      welcome.classList.add("display-none");
      const game = document.createElement('mgba-game');
      game.name = file.name;
      document.body.appendChild(game);
    } else {
      alert('Please select a .GBA .GBC or .GB file');
    }
  };
};

    const games = FileLoader.readdirWithoutDotDirs('/data/games');

    if (games.length) {
    
    }
    const romlist = document.getElementById("rom-list");

    for (const gameName of games) {
      const div = document.createElement('div');
      div.className = 'flex-1';
      div.textContent = gameName;
      romlist.appendChild(div);
    
      div.onclick = () => {
        romlist.remove();
        welcome.classList.add("display-none");
        const mgbaGame = document.createElement('mgba-game');
        mgbaGame.name = gameName;
        document.body.appendChild(mgbaGame);
      };
    }
    const storageButton = document.getElementById('logo');
    storageButton.onclick = () => {
      this.remove();
      welcome.classList.add("display-none");
      document.body.appendChild(document.createElement('mgba-storage'));
    };
  }
};

customElements.define('mgba-menu', MgbaMenu);
