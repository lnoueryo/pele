import { BaseComponent } from '../common/base.component'

const sheet = new CSSStyleSheet()
sheet.replaceSync(`
.button-size {
  padding-top: 50%;
}

.controller {
  -webkit-user-select: none; /* Chrome, Safari, Opera */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none; /* Standard syntax */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
`)

export default class ControllerButton extends BaseComponent {
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
    <tempalte>
      <button class="controller">
        <slot />
      </button>
      <div class="button-size"></div>
    </tempalte>
    `
  }
}
