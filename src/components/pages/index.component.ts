import BaseCanvas from '../atoms/base-canvas.component'
export default class IndexPage extends HTMLElement {
  connectedCallback() {
    const sheet = new CSSStyleSheet()
    document.adoptedStyleSheets = [sheet]
    sheet.replaceSync(`
    #wrapper {
      position: relative;
      display: flex;
      justify-content: space-around;
      width: 100%;
    }
    `)
    this.innerHTML = `
      <div id="wrapper">
        <base-canvas></base-canvas>
      </div>
    `
    const baseCanvas = document.querySelector('base-canvas') as BaseCanvas
    this.fillPlayer(baseCanvas)
    window.addEventListener('resize', () => {
      this.fillPlayer.bind(this)(baseCanvas)
    })
  }
  fillPlayer(baseCanvas: BaseCanvas) {
    const canvas = baseCanvas.canvas
    canvas.ctx.strokeStyle = 'blue'
    canvas.ctx.strokeRect(0, 0, canvas.width, canvas.height)
    canvas.ctx.fillStyle = 'black'
    canvas.ctx.fillRect(0, 0, canvas.width, canvas.height + 100)
    canvas.ctx.fillStyle = 'red'
    const eyeWidth = canvas.width / 6 // 目の幅
    const eyeHeight = canvas.height / 6 // 目の高さ
    const eyeOffsetX = canvas.width / 5 // プレイヤーの左端から目までのオフセット
    const eyeOffsetY = canvas.height / 4 // プレイヤーの上端から目までのオフセット
    canvas
    canvas.ctx.fillRect(
      eyeOffsetX,
      eyeOffsetY,
      eyeWidth,
      eyeHeight
    )

    canvas.ctx.fillRect(
      canvas.width - eyeOffsetX - eyeWidth,
      eyeOffsetY,
      eyeWidth,
      eyeHeight
    )

    const mouthWidth = canvas.width / 2 // 口の幅
    const mouthHeight = canvas.height / 8 // 口の高さ
    const mouthOffsetX = canvas.width / 5 // プレイヤーの中央に口を配置するためのオフセット
    const mouthOffsetY = canvas.height / 1.5 // プレイヤーの上端から口までのオフセット

    canvas.ctx.fillRect(
      mouthOffsetX,
      mouthOffsetY,
      mouthWidth,
      mouthHeight
    )

    const existingSolo = document.getElementById('solo')
    if (existingSolo) {
      existingSolo.remove()
    }
    const soloButton = document.createElement('button')
    soloButton.id = 'solo'
    soloButton.onclick = ()  => { location.href = '/solo.html'}
    soloButton.textContent = 'Solo'
    soloButton.style.position = 'absolute'
    soloButton.style.left = `${canvas.offsetLeft + eyeOffsetX}px`
    soloButton.style.top = `${canvas.offsetTop + eyeOffsetY}px`
    soloButton.style.width = `${eyeWidth}px`
    soloButton.style.height = `${eyeHeight}px`
    soloButton.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'
    document.body.appendChild(soloButton)

    const existingMulti = document.getElementById('multi')
    if (existingMulti) {
      existingMulti.remove()
    }
    const multiButton = document.createElement('button')
    multiButton.id = 'multi'
    multiButton.onclick = ()  => { location.href = '/multi.html'}
    multiButton.textContent = 'Multi'
    multiButton.style.position = 'absolute'
    multiButton.style.left = `${canvas.offsetLeft + canvas.width - eyeOffsetX - eyeWidth}px`
    multiButton.style.top = `${canvas.offsetTop + eyeOffsetY}px`
    multiButton.style.width = `${eyeWidth}px`
    multiButton.style.height = `${eyeHeight}px`
    multiButton.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'
    document.body.appendChild(multiButton)
  }
}
