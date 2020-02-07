import Swal from 'sweetalert2';

const componentStyle = `
    <style>
    .game-manager {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 700px;
        height: 100%;
        align-items: center;
        padding: 10px;
    }

    .play-button,
    .pause-button {
        background-color: #4A8AF4;
        color: #ffffff;
        cursor: pointer;
        font-size: 16px;
        padding: 8px 10px;
        width: 100px;
        text-align: center;
    }

    .pause-button {
      background-color: #DD5347;
      display: none;
    }

    .game-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .time-text {
        font-size: 24px;
        color: #ffffff;
    }

    .time {
        display: flex;
        align-items: center;
    }

    .tile-container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    tile-mine {
      margin: 3px;
    }
    </style>
`;

export class GameManager extends HTMLElement {
  constructor() {
    super();
    this.init();
    this.updateDOM();
    setTimeout(() => {
      this.initButtons();
      this.initGame();
    });
    Swal.fire('Welcome', 'Created by Stephen Vinuya', 'success');
  }

  init() {
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      time: 0,
      timeInterval: null,
      isPlaying: false,
      tilesEl: []
    };
  }

  generateTilesContentAndBombs() {
    const tiles = Array(16)
      .fill(0)
      .map(arr => [...Array(16).fill(0)]);

    return this.countTilesBomb(this.addBombToTiles(tiles));
  }

  countTilesBomb(tiles) {
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        if (tiles[r][c] === 0) {
          let bombCount = 0;
          const minR = r === 0 ? 0 : r - 1;
          const maxR = r === 15 ? 15 : r + 1;
          const minC = c === 0 ? 0 : c - 1;
          const maxC = c === 15 ? 15 : c + 1;
          for (let ir = minR; ir <= maxR; ir++) {
            for (let ic = minC; ic <= maxC; ic++) {
              bombCount += +(tiles[ir][ic] === '*');
            }
          }
          tiles[r][c] = bombCount;
        }
      }
    }
    return tiles;
  }

  addBombToTiles(tiles) {
    const takenCells = [];
    const numberOfBombs = 40;

    for (let i = 0; i < numberOfBombs; i++) {
      let r;
      let c;
      do {
        r = Math.floor(Math.random() * 16);
        c = Math.floor(Math.random() * 16);
      } while (takenCells.includes(`${r}-${c}`));
      takenCells.push(`${r}-${c}`);
      tiles[r][c] = '*';
    }
    return tiles;
  }

  initTiles() {
    const tileMargin = 3;
    const tileValues = this.generateTilesContentAndBombs();
    this.tileContainerEl = this.root.querySelector('.tile-container');
    this.tileContainerEl.innerHTML = '';
    this.prop.tilesEl = [];
    const tileW = this.tileContainerEl.offsetWidth / 16;
    const tileH = this.tileContainerEl.offsetHeight / 16;
    for (let r = 0; r < 16; r++) {
      const tilesRow = [];
      for (let c = 0; c < 16; c++) {
        const tileEl = document.createElement('tile-mine');
        tileEl.style.width = `${tileW - tileMargin * 2}px`;
        tileEl.style.height = `${tileH - tileMargin * 2}px`;
        tileEl.value = tileValues[r][c];
        tileEl.addEventListener('click', () => {
          if (this.prop.isPlaying) {
            this.openTile(r, c);
          }
        });
        tilesRow.push(tileEl);
        this.tileContainerEl.appendChild(tileEl);
      }
      this.prop.tilesEl.push(tilesRow);
    }
  }

  initButtons() {
    this.playBtnEl = this.root.querySelector('#playButton');
    this.pauseBtnEl = this.root.querySelector('#pauseButton');

    this.playBtnEl.addEventListener('click', () => {
      this.play();
    });

    this.pauseBtnEl.addEventListener('click', () => {
      this.pause();
    });
  }

  pause() {
    this.prop.isPlaying = false;
    this.playBtnEl.style.display = 'block';
    this.pauseBtnEl.style.display = 'none';
  }

  play() {
    this.prop.isPlaying = true;
    this.playBtnEl.style.display = 'none';
    this.pauseBtnEl.style.display = 'block';
  }

  openTile(r, c) {
    const tile = this.prop.tilesEl[r][c];
    if (tile.value === '*') {
      tile.revealed = true;
      setTimeout(() => {
        this.gameOver();
      }, 1000);
    } else {
      this.recursiveOpenTiles(r, c);
      this.checkWin();
    }
  }

  gameOver() {
    Swal.fire('Game over', 'Restart the game', 'error');
    this.resetGame();
  }

  resetGame() {
    this.prop.isPlaying = false;
    this.prop.time = 0;
    this.root.querySelector('#timeText').innerHTML = this.prop.time;
    this.initGame();
  }

  checkWin() {
    const tilesWithoutBomb = this.prop.tilesEl
      .reduce((acc, tilesRow) => [...acc, ...tilesRow], [])
      .filter(tile => tile.value !== '*');

    const isAllTilesOpen = tilesWithoutBomb.every(tiles => tiles.revealed);
    if (isAllTilesOpen) {
      Swal('Game over', 'You win the game!', 'success');
      this.resetGame();
    }
  }

  recursiveOpenTiles(r, c) {
    const tile = this.prop.tilesEl[r][c];
    if (tile.revealed) {
      return;
    }
    if (tile.value !== 0 && tile.value !== '*') {
      tile.revealed = true;
      return;
    }
    tile.revealed = true;
    // up
    if (r > 0) this.recursiveOpenTiles(r - 1, c);
    // Down
    if (r < 15) this.recursiveOpenTiles(r + 1, c);
    // left
    if (c > 0) this.recursiveOpenTiles(r, c - 1);
    // Down
    if (c < 15) this.recursiveOpenTiles(r, c + 1);
  }

  initGame() {
    this.initTimeInterval();
    this.initTiles();
    this.pause();
  }

  initTimeInterval() {
    clearInterval(this.prop.timeInterval);
    this.prop.timeInterval = setInterval(() => {
      if (this.prop.isPlaying) {
        this.prop.time++;
        this.root.querySelector('#timeText').innerHTML = this.prop.time;
      }
    }, 1000);
  }

  updateDOM() {
    this.root.innerHTML = `
        ${componentStyle}
        <div class="game-manager">
            <div class="game-header">
                <div class="time">
                    <img src="/assets/images/time.png" height="40">
                    <span id="timeText" class="time-text"></span>
                </div>
                <div class="time">
                    <img src="/assets/images/bomb.png" height="40">
                    <span class="time-text">40</span>
                </div>
                <div id="playButton" class="play-button">Play</div>
                <div id="pauseButton" class="pause-button">Pause</div>
            </div>
            <div class="tile-container">
              
            </div>
        </div>
      `;
  }
}

customElements.define('game-manager', GameManager);
