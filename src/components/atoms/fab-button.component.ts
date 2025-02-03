import { createEvent } from '../../utils'
import { BaseComponent } from '../common/base.component'

export default class BaseCanvasComponent extends BaseComponent {
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
    <button href="#" class="float">
      <slot />
    </button>
    `
  }
  setEvent(eventName: string) {
    const button = this.shadow.getElementById('button') as HTMLButtonElement
    createEvent<Event>(button, 'click', (e: Event) => {
      this.dispatchEvent(new CustomEvent<Event>(eventName, { detail: e}))
    })
  }
}

const sheet = new CSSStyleSheet()
sheet.replaceSync(`
  .float {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    text-align: center;
  }
`)