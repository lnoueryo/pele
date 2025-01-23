export default class CommonHead extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>P.L.Revolution</title>
      <meta name="description" content="オンラインゲーム。" />
      <link rel="icon" href="./favicon.ico" sizes="any" />
    `
  }
}
