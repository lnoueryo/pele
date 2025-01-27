import { BaseComponent } from '../common/base.component'

const sheet = new CSSStyleSheet()
sheet.replaceSync(`
.button-wrapper {
  padding: 4px;
}

.controller {
  -webkit-user-select: none; /* Chrome, Safari, Opera */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none; /* Standard syntax */
  box-sizing: border-box;
  width: 100%;
  height: 80px;
}
`)

export default class ControllerButton extends BaseComponent {
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
    <tempalte>
      <div class="button-wrapper">
        <button class="controller">
          <slot />
        </button>
      </div>
    </tempalte>
    `
  }
}
