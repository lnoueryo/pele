import * as firebaseui from 'firebaseui'
import auth from './firebase-auth'
const ui = new firebaseui.auth.AuthUI(auth)
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: `${location.origin}/multi.html`,
  signInOptions: ['google.com'],
  tosUrl: '/terms-of-service',
  privacyPolicyUrl: '/privacy-policy',
}
ui.start('#firebaseui-auth-container', uiConfig)
export default ui
