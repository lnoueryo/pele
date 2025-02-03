export default class MultiPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <multi-game-controller></multi-game-controller>
    `
  }
}
