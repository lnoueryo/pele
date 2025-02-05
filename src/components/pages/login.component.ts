export default class LoginPage extends HTMLElement {
  connectedCallback() {
    const sheet = new CSSStyleSheet()
    document.adoptedStyleSheets = [sheet]
    sheet.replaceSync(`
    #wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 100vh;
    }
    `)
    this.innerHTML = `
      <div id="wrapper">
        <div id="firebaseui-auth-container"></div>
      </div>
    `
  }
}
