export default class OnlinePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <online-game-controller></online-game-controller>
    `
  }
}
