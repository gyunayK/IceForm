import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const config = useRuntimeConfig()

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId
}

const app = initializeApp(firebaseConfig)

export const firestoreDB = getFirestore(app)
