export default class OfflinePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <offline-game-controller></offline-game-controller>
    `
  }
}
