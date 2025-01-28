type ConfigEnv = {
  httpApiOrigin: string
  websocketApiOrigin: string
}
type STAGE = 'development' | 'production' | 'staging'

const configEnvs: { [K in STAGE]: ConfigEnv } = {
  development: {
    httpApiOrigin: 'http://localhost:3001',
    websocketApiOrigin: 'ws://localhost:3001',
  },
  staging: {
    httpApiOrigin: 'https://pele-server-stg-821127682746.asia-northeast1.run.app',
    websocketApiOrigin: 'wss://pele-server-stg-821127682746.asia-northeast1.run.app',
  },
  production: {
    httpApiOrigin: 'https://pele-server.jounetsism.biz',
    websocketApiOrigin: 'wss://pele-server.jounetsism.biz',
  }
}
const env = (process.env.NODE_ENV || 'development') as STAGE
const envList = ['development', 'production', , 'staging']
if (!envList.includes(env)) {
  throw new Error('invalid STAGE')
}
async function loadObjectSetting() {
  const response = await fetch(`${configEnvs[env].httpApiOrigin}/objects`)
  if (!response.ok) {
    throw new Error('Failed to fetch player settings')
  }
  return await response.json()
}
const response: {
  playerSetting: {
    x: number
    y: number
    width: number
    height: number
    vg: number
    jumpStrength: number
    speed: number
  },
  boxSetting: {
    moveYProbability: number
    yMoveScale: number
    startPosition: number
    speedSalt: number
    minSpeed: number
    maxSpeed: number
  }
} = await loadObjectSetting()

const config = {
  playerSetting: response.playerSetting,
  boxSetting: response.boxSetting,
}
const configEnv = configEnvs[env]
const output = {
  ...config,
  ...configEnv,
  env,
}
export default output