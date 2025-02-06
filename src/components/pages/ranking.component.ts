import { getAuth, onAuthStateChanged } from 'firebase/auth'
import config from '../../../config'

type GameResult = {
  id: string
  userId: string
  name: string
  startTimestamp: number
  lastTimestamp: number
  createdAt: string
}

type GameResults = {
  gameResults: GameResult[]
}

export default class RankingPage extends HTMLElement {

  async connectedCallback() {
    const [allGameResult, myGameResult] = await this.getGameResults()

    // スタイルを適用
    const sheet = new CSSStyleSheet()
    document.adoptedStyleSheets = [sheet]
    sheet.replaceSync(`
      /* ベーススタイル */
      body {
        overflow: auto;
        font-family: 'Noto Sans JP', sans-serif;
        background-color: #f7f7f7;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
      }

      /* ランキングページのコンテナ */
      #wrapper {
        width: 100%;
        max-width: 600px;
        padding: 24px;
        background: white;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        text-align: center;
      }

      /* タブボタン */
      .tab-buttons {
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid #ddd;
        margin-bottom: 16px;
      }

      .tab-button {
        flex: 1;
        padding: 12px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        transition: all 0.3s;
      }

      .tab-button.active {
        border-bottom: 2px solid #007bff;
        color: #007bff;
      }

      /* ランキングアイテム */
      .ranking-item {
        background: #fff;
        padding: 12px;
        margin-bottom: 12px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .ranking-item h3 {
        font-size: 18px;
        margin: 0;
        color: #007bff;
      }

      .ranking-item h4 {
        font-size: 16px;
        margin: 4px 0;
        color: #555;
      }

      .ranking-item h5,
      .ranking-item time {
        font-size: 14px;
        color: #777;
      }

      /* タブコンテンツの表示・非表示 */
      .tab-content {
        display: none;
      }
      .tab-content.active {
        display: block;
      }
      .d-flex {
        display: flex;
      }
      .justify-end {
        justify-content: end;
      }
    `)

    // HTML を適用
    this.innerHTML = `
      <div id="wrapper">
        <div>
          <div style="text-align: right"><a href="/" class="tab-button">戻る</a></div>
        </div>
        <!-- タブボタン -->
        <div class="tab-buttons">
          <button class="tab-button active" data-tab="all">全体のランキング</button>
          <button class="tab-button" data-tab="mine">自分のランキング</button>
        </div>

        <!-- 全体のランキング -->
        <div id="all-tab" class="tab-content active">
          <h2>All</h2>
          ${allGameResult.gameResults
            .sort(
              (a, b) =>
                b.lastTimestamp -
                b.startTimestamp -
                (a.lastTimestamp - a.startTimestamp),
            )
            .filter((_, i) => i < 5)
            .map((result, i) => {
              return `
              <div class="ranking-item">
                <h3>${i + 1}位 ${result.id}</h3>
                <h4>${result.name}</h4>
                <h5><date>${this.formatTimestampToDateTime(result.createdAt)}</date></h5>
                <time>${(result.lastTimestamp - result.startTimestamp) / 1000}秒</time>
              </div>
            `
            })
            .join('')}
        </div>

        <!-- 自分のランキング -->
        <div id="mine-tab" class="tab-content">
          <h2>Mine</h2>
          ${myGameResult.gameResults
            .sort(
              (a, b) =>
                b.lastTimestamp -
                b.startTimestamp -
                (a.lastTimestamp - a.startTimestamp),
            )
            .map((result, i) => {
              return `
              <div class="ranking-item">
                <h3>${i + 1}位 ${result.id}</h3>
                <h5><date>${this.formatTimestampToDateTime(result.createdAt)}</date></h5>
                <time>${(result.lastTimestamp - result.startTimestamp) / 1000}秒</time>
              </div>
            `
            })
            .join('')}
        </div>
      </div>
    `

    this.addEventListeners()
  }

  private addEventListeners() {
    const tabButtons = this.querySelectorAll('.tab-button')
    const tabContents = this.querySelectorAll('.tab-content')

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab')

        tabButtons.forEach((btn) => btn.classList.remove('active'))
        button.classList.add('active')

        tabContents.forEach((content) => {
          if (content.id === `${tab}-tab`) {
            content.classList.add('active')
          } else {
            content.classList.remove('active')
          }
        })
      })
    })
  }

  private async getGameResults(): Promise<[GameResults, GameResults]> {
    const auth = getAuth()
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const token = await user.getIdToken(true)
            const origins = [
              `${config.httpApiOrigin}/game-results`,
              `${config.httpApiOrigin}/game-results/user`,
            ]
            const gameResultPromise = origins.map((origin) => {
              return fetch(origin, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
            })
            const [allResult, myResult] = await Promise.all(gameResultPromise)
            const data = await Promise.all([allResult.json(), myResult.json()])
            resolve(data)
          } catch (error) {
            location.href = '/login.html'
            reject(error)
          }
        } else {
          location.href = '/login.html'
          reject(new Error('User not signed in'))
        }
      })
    })
  }

  private formatTimestampToDateTime(isoString: string): string {
    const date = new Date(isoString)
    const adjustedDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)
    const finalMonth = adjustedDate.getUTCMonth() + 1
    const finalDay = adjustedDate.getUTCDate()
    const finalHours = adjustedDate.getUTCHours()
    const finalMinutes = adjustedDate.getUTCMinutes()

    return `${finalMonth}月${finalDay}日 ${finalHours}時${finalMinutes}分`
  }
}