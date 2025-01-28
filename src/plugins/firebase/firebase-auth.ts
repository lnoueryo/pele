import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCNTnTFJ4sLBKZpHZM0-0VnAHYOQA92u5E',
  authDomain: 'pele-5be0c.firebaseapp.com',
  projectId: 'pele-5be0c',
  storageBucket: 'pele-5be0c.firebasestorage.app',
  messagingSenderId: '968732430109',
  appId: '1:968732430109:web:80fb353dc4566ba6621bf4',
  measurementId: 'G-2MH5C26WT7',
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default auth
