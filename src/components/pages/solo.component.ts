export default class SoloPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <game-controller></game-controller>
    `
  }
}
