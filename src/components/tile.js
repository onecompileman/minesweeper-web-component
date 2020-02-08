const componentStyle = `
    <style>
        .tile {
            background: #6BBBFD;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: 0.2s linear;
        }

        .tile-opened {
          background-color: #f0f0f0;
        }

        .tile:hover {
          opacity: 0.8;
        }
    </style>
`;

export class Tile extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      value: '1',
      isRevealed: false
    };
    this.updateDOM();
  }

  set revealed(revealed) {
    this.prop.isRevealed = revealed;
    this.updateDOM();
  }

  get revealed() {
    return this.prop.isRevealed;
  }

  set value(value) {
    this.prop.value = value;
    this.updateDOM();
  }

  get value() {
    return this.prop.value;
  }

  updateDOM() {
    this.root.innerHTML = `
    ${componentStyle}
    <div class="tile ${this.prop.isRevealed ? 'tile-opened' : ''}">
      ${this.prop.isRevealed ? this.tileValue() : ''}
    </div>
    `;
  }

  tileValue() {
    const value = this.prop.value;
    const numberColors = [
      '#18E54C',
      '#1FA363',
      '#4A8AF4',
      '#18B1E5',
      '#FFCD42',
      '#FF8F6B',
      '#E0683D',
      '#DD5347'
    ];
    if (value === '*') {
      return `<img src="./assets/images/bomb.png" height="20">`;
    } else if (+value > 0) {
      return `<span style="color: ${numberColors[+value - 1]};">${value}<span>`;
    }

    return '';
  }

  static get observedAttributes() {
    return ['value', 'revealed'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'value':
        this.value = newValue;
        break;
      case 'revealed':
        this.revelead = newValue;
        break;
    }
  }
}

customElements.define('tile-mine', Tile);
