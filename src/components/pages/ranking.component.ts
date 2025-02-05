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
    const sheet = new CSSStyleSheet()
    document.adoptedStyleSheets = [sheet]
    sheet.replaceSync(`
    #wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
    }
      body {
        overflow: scroll;
      }
    `)
    this.innerHTML = `
      <div id="wrapper">
        <div style="padding: 16px">
        <div style="margin-bottom: 48px">
          <h2>All</h2>
            ${allGameResult.gameResults
              .sort(
                (a, b) =>
                  b.lastTimestamp -
                  b.startTimestamp -
                  (a.lastTimestamp - a.startTimestamp),
              )
              .map((result) => {
                return `
                <div style="padding-bottom: 8px">
                  <h3>${result.id}</h3>
                  <h4>${result.name}</h4>
                  <h5><date>${this.formatTimestampToDateTime(result.createdAt)}</date></h5>
                  <time>${(result.lastTimestamp - result.startTimestamp) / 1000}秒</time>
                </div>
              `
              })
              .join(' ')}
        </div>
          <h2>Mine</h2>
          ${myGameResult.gameResults
            .sort(
              (a, b) =>
                b.lastTimestamp -
                b.startTimestamp -
                (a.lastTimestamp - a.startTimestamp),
            )
            .map((result) => {
              return `
              <div style="padding-bottom: 8px">
                <h3>${result.id}</h3>
                <h5><date>${this.formatTimestampToDateTime(result.createdAt)}</date></h5>
                <time>${(result.lastTimestamp - result.startTimestamp) / 1000}秒</time>
              </div>
            `
            })
            .join(' ')}
        </div>
      </div>
    `
  }
  private getGameResults(): Promise<[GameResults, GameResults]> {
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

    // 日本時間が24時を超えた場合の調整
    const adjustedDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)
    const finalMonth = adjustedDate.getUTCMonth() + 1
    const finalDay = adjustedDate.getUTCDate()
    const finalHours = adjustedDate.getUTCHours()
    const finalMinutes = adjustedDate.getUTCMinutes()

    return `${finalMonth}月${finalDay}日 ${finalHours}時${finalMinutes}分`
  }
}
