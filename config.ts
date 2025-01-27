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
const configEnv = configEnvs[env]
const output = {
  ...configEnv,
  env,
}
export default output