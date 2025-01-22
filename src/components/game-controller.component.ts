class GameController extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="wrapper">
        <div class="side-container">
          <div class="buttons-container justify-between">
            <div id="left" class="button-container">
              <button class="controller">左</button>
              <div class="button-size"></div>
            </div>
            <div id="right" class="button-container">
              <button class="controller">右</button>
              <div class="button-size"></div>
            </div>
          </div>
        </div>
        <div id="canvas-container">
          <div id="start-buttons">
            <button id="play1" class="button">1p start</button>
            <button id="multiple-play" class="button" onclick="location.href='/multiple.html'">multiple start</button>
          </div>
          <div id="canvas-frame">
            <canvas id="game-canvas"></canvas>
          </div>
        </div>
        <div class="side-container">
          <div style="position: absolute; top: 25px; right: 25px">
            <button onclick="onChangeControllerPositionClicked(event)">
              配置変更
            </button>
          </div>
          <div class="buttons-container">
            <div id="top" class="button-container">
              <button class="controller">上</button>
              <div class="button-size"></div>
            </div>
            <div id="gamer-right" class="button-container hide">
              <button class="controller">右</button>
              <div class="button-size"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-container">
        <div class="buttons-container">
          <div id="vertical-left" class="button-container">
            <button class="controller">左</button>
            <div class="button-size"></div>
          </div>
          <div id="vertical-right" class="button-container">
            <button class="controller">右</button>
            <div class="button-size"></div>
          </div>
          <div id="vertical-top" class="button-container">
            <button class="controller">上</button>
            <div class="button-size"></div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('game-controller', GameController);